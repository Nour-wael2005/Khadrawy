
# =====================================================
# KHADRWY - RAG RETRIEVER
# =====================================================

import re
import string
import torch
import faiss

from sentence_transformers import SentenceTransformer

from .knowledge_base import get_documents
from .research_loader import get_research_documents


# =====================================================
# PERFORMANCE SETTINGS
# =====================================================

EMBEDDING_MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"

EMBEDDING_BATCH_SIZE = 8
CPU_THREADS = 2

SEARCH_MULTIPLIER = 12
MIN_SEARCH_RESULTS = 30

torch.set_num_threads(CPU_THREADS)


# =====================================================
# ARABIC NORMALIZATION
# =====================================================

ARABIC_DIACRITICS = re.compile(
    r"[\u0617-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]"
)


def normalize_arabic(text):
    if not text:
        return ""

    text = str(text)
    text = ARABIC_DIACRITICS.sub("", text)

    text = re.sub(r"[إأآٱ]", "ا", text)
    text = text.replace("ى", "ي")
    text = text.replace("ة", "ه")

    return text


# =====================================================
# GENERAL TEXT NORMALIZATION
# =====================================================

def normalize_text(text):
    if not text:
        return ""

    text = normalize_arabic(text).lower()

    text = text.replace("_", " ")
    text = text.replace("-", " ")

    punctuation = string.punctuation + "،؛؟«»…"

    text = text.translate(
        str.maketrans("", "", punctuation)
    )

    text = re.sub(r"\s+", " ", text)

    return text.strip()


# =====================================================
# SENTENCE SPLITTER
# =====================================================

def split_sentences(text):
    if not text:
        return []

    text = str(text).strip()

    sentences = re.split(
        r"(?<=[.!؟?])\s+",
        text
    )

    return [
        sentence.strip()
        for sentence in sentences
        if sentence.strip()
    ]


# =====================================================
# DOCUMENT CHUNKING
# =====================================================

def chunk_document(document, sentences_per_chunk=3):
    content = document.get("content", "")

    if not isinstance(content, str) or not content.strip():
        return []

    sentences = split_sentences(content)

    if not sentences:
        return []

    chunks = []

    for i in range(0, len(sentences), sentences_per_chunk):
        chunk_sentences = sentences[
            i:i + sentences_per_chunk
        ]

        chunk_text = " ".join(chunk_sentences).strip()

        if not chunk_text:
            continue

        chunk = dict(document)
        chunk["content"] = chunk_text

        chunks.append(chunk)

    return chunks


# =====================================================
# LOAD DOCUMENTS
# =====================================================

def load_all_documents():
    documents = []

    loaders = [
        ("Knowledge base", get_documents),
        ("Research", get_research_documents),
    ]

    for source_name, loader in loaders:
        try:
            loaded_documents = loader() or []

            documents.extend(loaded_documents)

            print(
                f"[RAG] {source_name} documents loaded: "
                f"{len(loaded_documents)}"
            )

        except Exception as e:
            print(
                f"[RAG] {source_name} loading error: {e}"
            )

    print(
        f"[RAG] Total source documents: {len(documents)}"
    )

    return documents


# =====================================================
# EMBEDDING MODEL
# =====================================================

print("[RAG] Loading embedding model...")

embedding_model = SentenceTransformer(
    EMBEDDING_MODEL_NAME,
    device="cpu"
)

print("[RAG] Embedding model loaded.")


# =====================================================
# BUILD EMBEDDING TEXT
# =====================================================

def build_embedding_text(chunk):
    title = chunk.get("title", "")
    plant = chunk.get("plant", "")
    condition = chunk.get("condition", "")
    category = chunk.get("category", "")
    content = chunk.get("content", "")

    return (
        f"Title: {title}. "
        f"Plant: {plant}. "
        f"Condition: {condition}. "
        f"Category: {category}. "
        f"{content}"
    ).strip()


# =====================================================
# LOAD DOCUMENTS AND BUILD CHUNKS
# =====================================================

print("[RAG] Loading agricultural documents...")

documents = load_all_documents()

print("[RAG] Building document chunks...")

all_chunks = []

for document in documents:
    all_chunks.extend(
        chunk_document(document)
    )

# Keep only chunks that have usable embedding text.
chunks = []
embedding_texts = []

for chunk in all_chunks:
    text = build_embedding_text(chunk)

    if text:
        chunks.append(chunk)
        embedding_texts.append(text)

print(f"[RAG] Chunks created: {len(chunks)}")


# =====================================================
# CREATE EMBEDDINGS AND FAISS INDEX
# =====================================================

index = None
embeddings = None

print("[RAG] Creating embeddings...")

if embedding_texts:
    embeddings = embedding_model.encode(
        embedding_texts,
        batch_size=EMBEDDING_BATCH_SIZE,
        show_progress_bar=True,
        normalize_embeddings=True,
        convert_to_numpy=True
    ).astype("float32")

    embedding_dimension = embeddings.shape[1]

    index = faiss.IndexFlatIP(
        embedding_dimension
    )

    index.add(embeddings)

    print(
        f"[RAG] FAISS index ready: {index.ntotal} vectors"
    )

else:
    print(
        "[RAG] No valid chunks found. "
        "Search will return empty results."
    )


# =====================================================
# DOMAIN KEYWORDS
# =====================================================

DOMAIN_KEYWORDS = {

    "irrigation": [
        "irrigation", "watering", "water",
        "overwatering", "underwatering",
        "water stress", "soil moisture",
        "dry soil", "wet soil",
        "ري", "الري", "مياه", "المياه",
        "الري الزائد", "زيادة الري", "افراط الري",
        "الري الناقص", "نقص الري", "نقص المياه",
        "قلة المياه", "عطش النبات", "عطشان",
        "مشكلة الري", "رطوبة التربة", "رطوبة التربه",
        "التربة رطبة", "التربة جافة",
        "تربة رطبة", "تربة جافة",
        "رطبة", "رطبه", "جافة", "جافه",
    ],

    "soil": [
        "soil", "soil condition", "soil quality",
        "soil moisture", "soil drainage",
        "soil compaction", "soil structure",
        "تربة", "التربة", "جودة التربة",
        "حالة التربة", "صرف التربة",
        "انضغاط التربة", "رطوبة التربة",
        "رطوبة التربه", "التربة رطبة",
        "التربة جافة", "تربة رطبة", "تربة جافة",
        "رطبة", "رطبه", "جافة", "جافه",
    ],

    "roots": [
        "root", "roots", "root problem",
        "root problems", "root damage",
        "root health", "root condition", "root rot",
        "جذر", "جذور", "الجذر", "الجذور",
        "مشكلة في الجذور", "مشاكل الجذور",
        "مشكلة الجذر", "صحة الجذور",
        "تلف الجذور", "تعفن الجذور", "عفن الجذور",
    ],

    "nutrition": [
        "nutrition", "plant nutrition",
        "nutrient", "nutrients",
        "nutrient deficiency", "deficiency",
        "fertilizer", "fertilization",
        "nitrogen", "phosphorus", "potassium",
        "iron", "magnesium",
        "تغذية النبات", "تغذية",
        "العناصر الغذائية", "العناصر",
        "نقص العناصر", "نقص عنصر",
        "نقص المغذيات", "سماد", "التسميد",
        "نيتروجين", "فوسفور", "بوتاسيوم",
        "حديد", "ماغنسيوم", "مغنيسيوم",
    ],

    "yellowing": [
        "yellow leaves", "yellowing", "leaf yellowing",
        "اصفرار", "اصفرار الأوراق", "اصفرار الورق",
        "الأوراق الصفراء", "ورق اصفر",
        "ورقة صفراء", "اوراق صفراء",
        "الورق بيصفر", "النبات بيصفر",
        "بتصفر", "بيصفر",
    ],

    "wilting": [
        "wilting", "wilt", "wilted", "plant wilt",
        "ذبول", "يذبل", "النبات بيذبل",
        "النبات ذابل", "الأوراق ذابلة", "ورق ذابل",
    ],

    "disease": [
        "disease", "plant disease", "infection",
        "fungal", "bacterial", "virus", "pathogen",
        "مرض", "أمراض", "مرض نباتي",
        "عدوى", "فطري", "فطر", "بكتيري", "فيروس",
    ],

    "pests": [
        "pest", "pests", "aphid", "whitefly",
        "thrips", "spider mite", "insect",
        "آفة", "آفات", "حشرة", "حشرات",
        "الذبابة البيضاء", "تربس", "العنكبوت الأحمر",
    ],

    "temperature": [
        "temperature", "heat", "cold",
        "heat stress", "cold stress",
        "حرارة", "درجة الحرارة", "الحر", "برد",
        "إجهاد حراري", "اجهاد حراري", "إجهاد البرد",
    ],

    "humidity": [
        "humidity", "air humidity", "relative humidity",
        "رطوبة الهواء", "الرطوبة",
        "رطوبه الهواء", "رطوبة الجو",
    ],

    "light": [
        "light", "lighting", "light intensity", "sunlight",
        "ضوء", "إضاءة", "شدة الضوء", "ضوء الشمس",
    ],

    "monitoring": [
        "monitoring", "monitor", "trend", "patterns",
        "sensor", "sensor data", "early warning",
        "مراقبة", "متابعة", "نمط", "أنماط",
        "بيانات", "حساس", "حساسات",
        "بيانات الحساسات", "إنذار مبكر",
    ],

    "greenhouse": [
        "greenhouse", "protected cultivation", "ventilation",
        "صوبة", "الصوبة", "بيت محمي",
        "الزراعة المحمية", "تهوية",
    ],

    "leaves": [
        "leaf", "leaves", "leaf problem", "leaf symptoms",
        "ورقة", "ورق", "أوراق",
        "مشاكل الأوراق", "أعراض الأوراق",
    ],
}


# =====================================================
# TOPIC GROUPS
# =====================================================

TOPIC_GROUPS = {
    "irrigation": "water",
    "soil": "soil",
    "roots": "roots",
    "nutrition": "nutrition",
    "yellowing": "symptoms",
    "wilting": "symptoms",
    "disease": "disease",
    "pests": "pests",
    "temperature": "environment",
    "humidity": "environment",
    "light": "environment",
    "monitoring": "monitoring",
    "greenhouse": "greenhouse",
    "leaves": "symptoms",
}

SYMPTOM_TOPICS = {
    "yellowing", "wilting", "roots", "leaves"
}

DIAGNOSIS_TOPICS = {
    "irrigation", "soil", "roots", "nutrition",
    "yellowing", "wilting", "disease", "pests"
}

SOIL_TOPICS = {
    "soil", "irrigation", "roots"
}


# =====================================================
# PLANT KEYWORDS
# =====================================================

PLANT_KEYWORDS = {
    "tomato": ["tomato", "tomatoes", "طماطم"],
    "apple": ["apple", "تفاح"],
    "corn": ["corn", "maize", "ذرة", "الذرة"],
    "potato": ["potato", "بطاطس", "البطاطس"],
    "pepper": ["pepper", "فلفل"],
    "cucumber": ["cucumber", "خيار"],
    "lettuce": ["lettuce", "خس"],
    "onion": ["onion", "بصل"],
    "wheat": ["wheat", "قمح"],
}


# =====================================================
# DISEASE KEYWORDS
# =====================================================

DISEASE_KEYWORDS = {
    "early blight": [
        "early blight", "اللفحة المبكرة", "الندوة المبكرة"
    ],
    "late blight": [
        "late blight", "اللفحة المتأخرة", "الندوة المتأخرة"
    ],
    "leaf spot": [
        "leaf spot", "بقع الأوراق", "تبقع الأوراق"
    ],
    "root rot": [
        "root rot", "تعفن الجذور", "عفن الجذور"
    ],
    "powdery mildew": [
        "powdery mildew", "البياض الدقيقي"
    ],
    "rust": [
        "rust", "الصدأ"
    ],
}


# =====================================================
# DETECT TOPICS
# =====================================================

def detect_topics(query):
    normalized_query = normalize_text(query)
    detected = set()

    for topic, keywords in DOMAIN_KEYWORDS.items():
        for keyword in keywords:
            normalized_keyword = normalize_text(keyword)

            if normalized_keyword and normalized_keyword in normalized_query:
                detected.add(topic)
                break

    return detected


# =====================================================
# DETECT PLANT
# =====================================================

def detect_plant(query):
    normalized_query = normalize_text(query)
    detected = set()

    for plant, keywords in PLANT_KEYWORDS.items():
        for keyword in keywords:
            normalized_keyword = normalize_text(keyword)

            if normalized_keyword and normalized_keyword in normalized_query:
                detected.add(plant)
                break

    return detected


# =====================================================
# DETECT DISEASE
# =====================================================

def detect_disease(query):
    normalized_query = normalize_text(query)
    detected = set()

    for disease, keywords in DISEASE_KEYWORDS.items():
        for keyword in keywords:
            normalized_keyword = normalize_text(keyword)

            if normalized_keyword and normalized_keyword in normalized_query:
                detected.add(disease)
                break

    return detected


# =====================================================
# TOPIC KEYWORD MATCH
# =====================================================

def contains_topic_keyword(text, topic):
    normalized = normalize_text(text)

    for keyword in DOMAIN_KEYWORDS.get(topic, []):
        normalized_keyword = normalize_text(keyword)

        if normalized_keyword and normalized_keyword in normalized:
            return True

    return False


def title_matches_topic(title, topic):
    return contains_topic_keyword(title, topic)


# =====================================================
# COMPLEX QUERY DETECTION
# =====================================================

def is_complex_query(query):
    normalized = normalize_text(query)
    detected_topics = detect_topics(normalized)

    comparison_words = [
        "فرق", "افرق", "مقارنة", "قارن", "بين", "ولا", "او",
        "versus", "vs", "difference", "compare", "between",
        "whether",
    ]

    symptom_words = [
        "اعراض", "علامات", "symptoms", "signs",
        "yellow", "yellowing", "اصفرار", "ذبول", "يذبل",
    ]

    detected_comparison = any(
        normalize_text(word) in normalized
        for word in comparison_words
    )

    detected_symptom = any(
        normalize_text(word) in normalized
        for word in symptom_words
    )

    if len(detected_topics) >= 2:
        return True

    if detected_comparison and detected_symptom:
        return True

    if len(normalized.split()) >= 25:
        return True

    return False


# =====================================================
# SHORT QUERY DETECTION
# =====================================================

def is_short_query(query):
    return len(normalize_text(query).split()) <= 5


# =====================================================
# SEARCH
# =====================================================

def semantic_search(query, top_k=5):
    if not isinstance(query, str) or not query.strip():
        return []

    if index is None or not chunks:
        return []

    normalized_query = normalize_text(query)

    if not normalized_query:
        return []

    query_embedding = embedding_model.encode(
        [normalized_query],
        normalize_embeddings=True,
        convert_to_numpy=True
    ).astype("float32")

    search_k = max(
        top_k * SEARCH_MULTIPLIER,
        MIN_SEARCH_RESULTS
    )

    search_k = min(search_k, len(chunks))

    if search_k <= 0:
        return []

    distances, indices = index.search(
        query_embedding,
        search_k
    )

    detected_topics = detect_topics(normalized_query)
    detected_plants = detect_plant(normalized_query)
    detected_diseases = detect_disease(normalized_query)

    complex_query = is_complex_query(normalized_query)

    candidates = []

    for rank, (distance, idx) in enumerate(
        zip(distances[0], indices[0])
    ):
        if idx < 0 or idx >= len(chunks):
            continue

        chunk = chunks[idx]

        title = chunk.get("title", "")
        content = chunk.get("content", "")

        plant = normalize_text(chunk.get("plant", ""))
        condition = normalize_text(chunk.get("condition", ""))
        category = normalize_text(chunk.get("category", ""))

        title_normalized = normalize_text(title)
        content_normalized = normalize_text(content)

        semantic_score = float(distance)
        score = semantic_score

        # Topic boosts
        for topic in detected_topics:
            if title_matches_topic(title_normalized, topic):
                score += 0.28

            if contains_topic_keyword(content_normalized, topic):
                score += 0.07

      
        # =================================================
        # PLANT MATCHING
        # =================================================

        candidate_plants = detect_plant(
            title + " " + content
        )

        if detected_plants:
            if detected_plants.intersection(candidate_plants):
                score += 0.30

            elif candidate_plants:
                # Penalize documents about a different crop.
                # Keep them as possible secondary evidence.
                score -= 0.25


        # Disease boosts
        for disease in detected_diseases:
            if (
                disease in condition
                or disease in title_normalized
                or disease in content_normalized
            ):
                score += 0.25

        # Category boost
        for topic in detected_topics:
            if topic in category:
                score += 0.12

        # Exact query in title
        if normalized_query in title_normalized:
            score += 0.35

        # Topic coverage for complex queries
        topic_coverage = sum(
            1
            for topic in detected_topics
            if (
                contains_topic_keyword(title_normalized, topic)
                or contains_topic_keyword(content_normalized, topic)
            )
        )

        if complex_query:
            score += min(topic_coverage, 5) * 0.08

        # Symptom boosts
        symptom_topics = detected_topics.intersection(SYMPTOM_TOPICS)

        for topic in symptom_topics:
            if title_matches_topic(title_normalized, topic):
                score += 0.20

        # Diagnosis coverage
        diagnosis_topics = detected_topics.intersection(DIAGNOSIS_TOPICS)

        if diagnosis_topics:
            matched_diagnosis_topics = sum(
                1
                for topic in diagnosis_topics
                if (
                    contains_topic_keyword(title_normalized, topic)
                    or contains_topic_keyword(content_normalized, topic)
                )
            )

            score += min(matched_diagnosis_topics, 4) * 0.06

        # Soil / root / irrigation relationship
        matched_soil_topics = detected_topics.intersection(SOIL_TOPICS)

        if (
            "roots" in matched_soil_topics
            and (
                "soil" in matched_soil_topics
                or "irrigation" in matched_soil_topics
            )
        ):
            soil_terms = [
                "root", "جذر", "soil", "ترب", "irrigation", "ري"
            ]

            if any(term in title_normalized for term in soil_terms):
                score += 0.18

        candidates.append({
            "score": score,
            "semantic_score": semantic_score,
            "rank": rank,
            "index": idx,

            "title": title,
            "content": content,
            "plant": chunk.get("plant", ""),
            "condition": chunk.get("condition", ""),
            "category": chunk.get("category", ""),

            "source_type": chunk.get("source_type", ""),
            "source_name": chunk.get("source_name", ""),
            "source_url": chunk.get("source_url", ""),
            "year": chunk.get("year"),

            # Preserve scientific source metadata.
            "doi": chunk.get("doi", ""),
            "license": chunk.get("license", ""),
            "review_status": chunk.get(
                "review_status",
                "unreviewed"
            ),
            "evidence_type": chunk.get(
                "evidence_type",
                "khadrwy_knowledge"
            ),
        })

    candidates.sort(
        key=lambda item: item["score"],
        reverse=True
    )

    # =================================================
    # RESULT DIVERSITY
    # =================================================

    selected = []
    seen_titles = set()
    seen_topic_groups = set()

    for candidate in candidates:
        title = candidate["title"]

        if title in seen_titles:
            continue

        candidate_topics = detect_topics(
            candidate["title"] + " " + candidate["content"]
        )

        candidate_groups = {
            TOPIC_GROUPS.get(topic, topic)
            for topic in candidate_topics
        }

        topic_group = (
            sorted(candidate_groups)[0]
            if candidate_groups
            else None
        )

        if complex_query and topic_group in seen_topic_groups:
            if selected:
                best_score = max(
                    item["score"]
                    for item in selected
                )

                if candidate["score"] < best_score - 0.15:
                    continue

        selected.append(candidate)
        seen_titles.add(title)

        if topic_group:
            seen_topic_groups.add(topic_group)

        if len(selected) >= top_k:
            break

    # =================================================
    # FINAL RELEVANCE FILTER
    # =================================================

    final_results = []

    for candidate in selected:
        semantic_score = candidate["semantic_score"]

        candidate_text = (
            candidate["title"] + " " + candidate["content"]
        )

        candidate_topics = detect_topics(candidate_text)

        topic_match_count = len(
            detected_topics.intersection(candidate_topics)
        )

        if complex_query:
            valid = (
                semantic_score >= 0.20
                or topic_match_count >= 2
                or (
                    topic_match_count >= 1
                    and candidate["score"] >= 0.80
                )
            )
        else:
            valid = (
                semantic_score >= 0.18
                or topic_match_count >= 1
                or candidate["score"] >= 0.70
            )

        if valid:
            final_results.append(candidate)

    return final_results[:top_k]


# =====================================================
# GET CONTEXT
# =====================================================

def get_context(query, top_k=5, plant=None, condition=None):
    results = semantic_search(
        query=query,
        top_k=top_k
    )

    if not results:
        return "", []

    # =================================================
    # OPTIONAL DIAGNOSIS CONTEXT
    # =================================================

    if plant or condition:
        adjusted_results = []

        for result in results:
            result = dict(result)
            score = float(result.get("score", 0))

            result_plant = normalize_text(
                result.get("plant", "")
            )

            result_condition = normalize_text(
                result.get("condition", "")
            )

            if plant:
                plant_text = normalize_text(plant)

                if plant_text and plant_text in result_plant:
                    score += 0.15

            if condition:
                condition_text = normalize_text(condition)

                if condition_text and condition_text in result_condition:
                    score += 0.15

            result["score"] = score
            adjusted_results.append(result)

        adjusted_results.sort(
            key=lambda item: item.get("score", 0),
            reverse=True
        )

        results = adjusted_results[:top_k]

    # =================================================
    # BUILD CONTEXT WITH SOURCE METADATA
    # =================================================

    context_parts = []

    for i, result in enumerate(results, start=1):
        context_parts.append(
            f"""
SOURCE {i}
Title: {result.get("title", "")}
Plant: {result.get("plant", "")}
Condition: {result.get("condition", "")}
Category: {result.get("category", "")}
Source Name: {result.get("source_name", "")}
Source Type: {result.get("source_type", "")}
Source URL: {result.get("source_url", "")}
DOI: {result.get("doi", "")}
Year: {result.get("year", "")}
License: {result.get("license", "")}
Evidence Type: {result.get("evidence_type", "")}
Review Status: {result.get("review_status", "unreviewed")}
Content:
{result.get("content", "")}
""".strip()
        )

    context = "\n\n".join(context_parts)

    return context, results
