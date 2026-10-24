
# =====================================================
# KHADRWY - FAO SOURCE LOADER
# =====================================================

from pathlib import Path
import re

from pypdf import PdfReader


# =====================================================
# FAO DIRECTORY
# =====================================================

FAO_DIRECTORY = (
    Path(__file__).resolve().parent
    / "sources"
    / "fao"
)


# =====================================================
# FAO SOURCE INFORMATION
# =====================================================

FAO_SOURCE_NAME = "Food and Agriculture Organization (FAO)"
FAO_SOURCE_URL = "https://www.fao.org/"
FAO_YEAR = 2023

# A PDF must contain enough extractable text to be useful.
MIN_EXTRACTED_CHARACTERS = 200


# =====================================================
# FAO DOCUMENT METADATA
# =====================================================

FAO_DOCUMENT_METADATA = {
    "cc7839en.pdf": {
        "title": "Introduction and advantages of protected cultivation systems",
        "category": "greenhouse",
        "topics": [
            "protected cultivation",
            "greenhouse",
            "climate",
            "plant management",
        ],
    },
    "cc7846en.pdf": {
        "title": "Covering materials for protected cultivation systems",
        "category": "greenhouse",
        "topics": [
            "greenhouse",
            "protected cultivation",
            "covering materials",
        ],
    },
    "cc7848en.pdf": {
        "title": "Vegetable seedling production in trays",
        "category": "cultivation",
        "topics": [
            "seedlings",
            "vegetable cultivation",
            "seedling production",
            "trays",
        ],
    },
    "cc7850en.pdf": {
        "title": "Sampling and monitoring pests and diseases",
        "category": "prevention",
        "topics": [
            "pests",
            "diseases",
            "monitoring",
            "sampling",
            "prevention",
        ],
    },
    "cc7851en.pdf": {
        "title": "Water and irrigation management",
        "category": "irrigation",
        "topics": [
            "water",
            "irrigation",
            "soil moisture",
            "water management",
        ],
    },
}


# =====================================================
# EXTRACT TEXT FROM PDF
# =====================================================

def extract_pdf_text(file_path: Path) -> str:
    """
    Extract selectable text from a PDF.

    This function does not perform OCR.
    Image-only or scanned PDFs may return empty text.
    """

    try:
        reader = PdfReader(str(file_path))

        pages = []

        for page in reader.pages:
            text = page.extract_text() or ""

            if text.strip():
                pages.append(text.strip())

        extracted_text = "\n\n".join(pages)

        # Normalize whitespace without removing paragraph breaks.
        extracted_text = re.sub(
            r"[ \t]+",
            " ",
            extracted_text,
        )

        extracted_text = re.sub(
            r"\n{3,}",
            "\n\n",
            extracted_text,
        )

        return extracted_text.strip()

    except Exception as exc:
        print(
            f"[FAO] Failed to read {file_path.name}: {exc}"
        )
        return ""


# =====================================================
# GET FAO SOURCE FILES
# =====================================================

def get_fao_source_files():
    """Return configured FAO PDF files that exist."""

    return [
        FAO_DIRECTORY / filename
        for filename in FAO_DOCUMENT_METADATA
        if (FAO_DIRECTORY / filename).is_file()
    ]


# =====================================================
# GET FAO DOCUMENTS
# =====================================================

def get_fao_documents():
    """
    Return FAO documents only when usable text was extracted.

    Metadata-only and empty-text records are not returned,
    because they cannot provide evidence to the RAG system.
    OCR is intentionally not performed here.
    """

    documents = []

    for filename, metadata in FAO_DOCUMENT_METADATA.items():
        file_path = FAO_DIRECTORY / filename

        if not file_path.is_file():
            continue

        content = extract_pdf_text(file_path)

        if len(content) < MIN_EXTRACTED_CHARACTERS:
            print(
                f"[FAO] Skipping {filename}: "
                f"insufficient extractable text "
                f"({len(content)} characters). "
                "OCR may be required."
            )
            continue

        documents.append({
            "title": metadata["title"],
            "plant": "General",
            "condition": "General",
            "category": metadata["category"],
            "source_type": "official_fao",
            "source_name": FAO_SOURCE_NAME,
            "source_url": FAO_SOURCE_URL,
            "year": FAO_YEAR,
            "file_name": filename,
            "file_path": str(file_path),
            "topics": metadata["topics"],
            "content": content,
        })

        print(
            f"[FAO] Loaded {filename}: "
            f"{len(content)} characters"
        )

    return documents


# =====================================================
# TEST
# =====================================================

if __name__ == "__main__":
    print("=" * 60)
    print("KHADRWY - FAO SOURCE CHECK")
    print("=" * 60)

    print(f"\nFAO directory:\n{FAO_DIRECTORY}")

    files = get_fao_source_files()
    print(f"\nExisting configured PDF files: {len(files)}")

    documents = get_fao_documents()
    print(f"\nUsable FAO documents: {len(documents)}")

    for document in documents:
        print("\n" + "-" * 60)
        print(f"File: {document['file_name']}")
        print(f"Title: {document['title']}")
        print(f"Category: {document['category']}")
        print(f"Characters: {len(document['content'])}")
        print(f"Preview: {document['content'][:300]}")

    print("\n" + "=" * 60)
    print("FAO loader check completed.")
    print("Only documents with extracted text are returned.")
    print("No OCR was performed.")
    print("=" * 60)
