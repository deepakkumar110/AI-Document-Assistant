import os
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.prebuilt import create_react_agent

from app.services.langgraph_tools import (
    pdf_qa,
    pdf_summary,
    pdf_mcq,
    pdf_keypoints,
    set_document,
)

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.2,
)

tools = [
    pdf_qa,
    pdf_summary,
    pdf_mcq,
    pdf_keypoints,
]

agent = create_react_agent(
    model=llm,
    tools=tools,
)


def ask_agent(document_id: str, question: str):
    """
    Run LangGraph Agent.
    """

    set_document(document_id)

    result = agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": question
                }
            ]
        }
    )

    return result["messages"][-1].content