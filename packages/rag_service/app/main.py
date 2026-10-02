from typing import Literal

from fastapi import FastAPI
from langchain_core.messages import AIMessage, HumanMessage
from pydantic import BaseModel

from app.agent import graph

app = FastAPI(title="Eventree RAG Agent")

MESSAGE_TYPES = {"user": HumanMessage, "assistant": AIMessage}


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    question: str
    history: list[Message] = []


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat")
def chat(request: ChatRequest):
    messages = [MESSAGE_TYPES[m.role](content=m.content) for m in request.history]
    messages.append(HumanMessage(content=request.question))

    result = graph.invoke({"messages": messages})
    return {"answer": result["messages"][-1].content.replace("**", "").replace("$", "BDT")}