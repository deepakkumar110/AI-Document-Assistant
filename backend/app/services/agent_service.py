from langchain_core.messages import HumanMessage

from app.services.langgraph_agent import agent
from app.services.langgraph_tools import set_document


def run_agent(document_id: str, user_query: str):
    """
    Run LangGraph AI Agent
    """

    # Current uploaded PDF set karo
    set_document(document_id)

    # Agent ko user ka message do
    response = agent.invoke(
        {
            "messages": [
                HumanMessage(content=user_query)
            ]
        }
    )

    # Last AI response return karo
    return response["messages"][-1].content