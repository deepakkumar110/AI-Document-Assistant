from langchain.tools import tool
from app.services.rag_service import ask_document


CURRENT_DOCUMENT_ID = None


def set_document(document_id: str):
    global CURRENT_DOCUMENT_ID
    CURRENT_DOCUMENT_ID = document_id


@tool
def pdf_qa(question: str):
    """Answer questions from uploaded PDF."""
    return ask_document(CURRENT_DOCUMENT_ID, question)


@tool
def pdf_summary():
    """Generate summary."""
    return ask_document(
        CURRENT_DOCUMENT_ID,
        "Give a complete summary of this PDF."
    )


@tool
def pdf_mcq():
    """Generate MCQs."""
    return ask_document(
        CURRENT_DOCUMENT_ID,
        "Generate 10 MCQs with answers."
    )


@tool
def pdf_keypoints():
    """Generate key points."""
    return ask_document(
        CURRENT_DOCUMENT_ID,
        "Give important key points."
    )