
import json
from pathlib import Path

RAG_DIR = Path(__file__).resolve().parent
RESEARCH_DIR = RAG_DIR / "sources" / "research"
MANIFEST_PATH = RESEARCH_DIR / "extra_manifest.json"


def main():
    if not MANIFEST_PATH.exists():
        print("Research manifest not found.")
        return

    records = json.loads(
        MANIFEST_PATH.read_text(encoding="utf-8")
    )

    if not isinstance(records, list):
        print("Invalid manifest format.")
        return

    print(f"\nTotal research records: {len(records)}")
    print("=" * 80)

    for i, record in enumerate(records, start=1):
        if not isinstance(record, dict):
            continue

        print(f"\n[{i}] {record.get('title', 'Untitled')}")
        print(f"Year: {record.get('year', 'Unknown')}")
        print(f"Source: {record.get('source_name', 'Unknown')}")
        print(f"DOI: {record.get('doi', 'N/A')}")
        print(f"Status: {record.get('status', 'Unknown')}")
        print(
            "Review status:",
            record.get("review_status", "not reviewed")
        )
        print(f"Text length: {record.get('content_length', 0)}")
        print(f"Text file: {record.get('text_path', 'N/A')}")
        print("-" * 80)


if __name__ == "__main__":
    main()
