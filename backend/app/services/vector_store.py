import os
import re

import chromadb

from app.services.embedding_service import generate_embeddings


# =========================
# CHROMADB CONFIGURATION
# =========================

CHROMA_DIR = os.path.join("app", "chroma_db")

os.makedirs(CHROMA_DIR, exist_ok=True)

client = chromadb.PersistentClient(
    path=CHROMA_DIR
)


# =========================
# COLLECTION NAME
# =========================

def get_collection_name(document_id: str) -> str:
    safe_id = re.sub(
        r"[^a-zA-Z0-9_-]",
        "_",
        document_id.replace(".pdf", "")
    )

    return f"doc_{safe_id}"


# =========================
# STORE DOCUMENT CHUNKS
# =========================

def store_chunks(chunks: list[str], document_id: str):
    if not chunks:
        raise ValueError("Cannot store empty document chunks.")

    collection_name = get_collection_name(document_id)

    collection = client.get_or_create_collection(
        name=collection_name,
        metadata={"hnsw:space": "cosine"}
    )

    embeddings = generate_embeddings(chunks)

    # Chunks ke IDs unique rakho
    ids = [
        f"chunk_{i}"
        for i in range(len(chunks))
    ]

    collection.upsert(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=[
            {"document_id": document_id}
            for _ in chunks
        ]
    )

    print(
        f"Stored {len(chunks)} chunks in ChromaDB "
        f"for {document_id}"
    )

    return collection


# =========================
# SEARCH RELEVANT CHUNKS
# =========================

def search_chunks(
    document_id: str,
    query: str,
    k: int = 3
) -> list[str]:

    collection_name = get_collection_name(document_id)

    try:
        collection = client.get_collection(
            name=collection_name
        )
    except Exception:
        return []

    query_embedding = generate_embeddings([query])[0]

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(k, collection.count()),
        include=["documents"]
    )

    documents = results.get("documents", [[]])

    if not documents or not documents[0]:
        return []

    return documents[0]


# =========================
# DELETE DOCUMENT VECTORS
# =========================

def delete_document_vectors(document_id: str):
    collection_name = get_collection_name(document_id)

    try:
        client.delete_collection(
            name=collection_name
        )
        return True
    except Exception:
        return False