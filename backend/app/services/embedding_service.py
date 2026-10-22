from sentence_transformers import SentenceTransformer

# Load the embedding model
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

embedding_model = SentenceTransformer(MODEL_NAME)


def get_embedding_model():
    return embedding_model


def generate_embeddings(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []

    embeddings = embedding_model.encode(
        texts,
        normalize_embeddings=True
    )

    return embeddings.tolist()