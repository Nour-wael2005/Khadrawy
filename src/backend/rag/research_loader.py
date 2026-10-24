
# =====================================================
# KHADRWY - RESEARCH KNOWLEDGE LOADER
# =====================================================

import json
from pathlib import Path


RAG_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = RAG_DIR.parents[2]

RESEARCH_DIR = RAG_DIR / "sources" / "research"
MANIFEST_PATH = RESEARCH_DIR / "extra_manifest.json"


def get_research_documents():
    """
    Load research papers that have been explicitly approved
    for use in Khadrwy's agricultural RAG system.
    """

    if not MANIFEST_PATH.exists():
        print("[RAG] Research manifest not found.")
        return []

    try:
        records = json.loads(
            MANIFEST_PATH.read_text(encoding="utf-8")
        )
    except (OSError, json.JSONDecodeError) as exc:
        print(f"[RAG] Cannot read research manifest: {exc}")
        return []

    if not isinstance(records, list):
        print("[RAG] Invalid research manifest format.")
        return []

    documents = []
    seen_dois = set()

    for record in records:
        if not isinstance(record, dict):
            continue

        # Require explicit human review.
        if record.get("review_status") != "approved":
            continue

        doi = str(record.get("doi", "")).strip()

        if doi and doi in seen_dois:
            continue

        relative_text_path = record.get("text_path")

        if not relative_text_path:
            continue

        # Manifest paths are relative to the project root.
        text_path = PROJECT_ROOT / relative_text_path

        try:
            resolved_path = text_path.resolve()
            resolved_path.relative_to(RESEARCH_DIR.resolve())
        except (OSError, ValueError):
            print("[RAG] Rejected text path outside research directory.")
            continue

        if not resolved_path.is_file():
            continue

        try:
            content = resolved_path.read_text(encoding="utf-8").strip()
        except (OSError, UnicodeDecodeError) as exc:
            print(f"[RAG] Cannot read {resolved_path.name}: {exc}")
            continue

        if len(content) < 1000:
            print(f"[RAG] Skipping short research text: {resolved_path.name}")
            continue

        title = str(record.get("title", "")).strip()

        if not title:
            continue

        if doi:
            seen_dois.add(doi)

        documents.append({
            "title": title,
            "plant": "General",
            "condition": "General",
            "category": record.get("category", "research"),
            "source_type": record.get("source_type", "research"),
            "source_name": record.get("source_name", "Research paper"),
            "source_url": record.get("source_url", ""),
            "year": record.get("year"),
            "doi": doi,
            "license": record.get("license", ""),
            "review_status": "approved",
            "evidence_type": "research_preprint",
            "content": content,
        })

    print(f"[RAG] Approved research documents loaded: {len(documents)}")
    return documents
