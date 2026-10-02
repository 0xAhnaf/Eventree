import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.tools import tool
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
PDF_PATH = BASE_DIR / "data" / "knowledge.pdf"
CHROMA_DIR = BASE_DIR / "chroma_db"
COLLECTION_NAME = "eventree_pdf"

llm = ChatOpenAI(
    model=os.getenv("OPENROUTER_MODEL"),
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
    temperature=0.2,
    max_tokens=1000,
)

embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")


@lru_cache
def get_vectorstore():
    if CHROMA_DIR.exists():
        return Chroma(
            collection_name=COLLECTION_NAME,
            embedding_function=embeddings,
            persist_directory=str(CHROMA_DIR),
        )

    documents = PyPDFLoader(str(PDF_PATH)).load()
    chunks = RecursiveCharacterTextSplitter(
        chunk_size=800, chunk_overlap=150
    ).split_documents(documents)

    return Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name=COLLECTION_NAME,
        persist_directory=str(CHROMA_DIR),
    )


@tool
def search_knowledge(question: str):
    """
    Search Eventree's PDF knowledge base for static platform
    information (how Eventree works, bookings, policies).
    """
    documents = get_vectorstore().similarity_search(question, k=3)
    return "\n\n".join(doc.page_content for doc in documents)