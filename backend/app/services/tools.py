from app.services.rag_service import ask_document


def rag_tool(document_id: str, question: str):
    """
    Answer normal questions from uploaded PDF.
    """
    return ask_document(document_id, question)


def summary_tool(document_id: str, question: str):
    """
    Generate summary based on user request.
    """
    return ask_document(document_id, question)


def quiz_tool(document_id: str, question: str):
    """
    Generate quiz exactly as requested by the user.
    Example:
    - Generate 5 MCQs
    - Generate 20 MCQs
    - Generate interview MCQs
    """
    return ask_document(document_id, question)


def keypoints_tool(document_id: str, question: str):
    """
    Extract key points based on user request.
    """
    return ask_document(document_id, question)