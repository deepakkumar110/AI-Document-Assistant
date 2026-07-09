from app.services.vector_store import load_vector_store
from app.services.llm_service import generate_answer


def get_relevant_chunks(document_id, query, k=3):
    print("Loading Vector Store...")

    vector_store = load_vector_store(f"app/vector_db/{document_id}")

    print("Searching...")

    docs = vector_store.similarity_search(query, k=k)

    print("Chunks Found:", len(docs))

    return [doc.page_content for doc in docs]


def ask_document(document_id, question):
    print("STEP 1")

    chunks = get_relevant_chunks(document_id, question)

    print("STEP 2:", len(chunks))

    context = "\n\n".join(chunks)

    print("STEP 3")

    answer = generate_answer(context, question)

    print("STEP 4:", answer)

    return answer