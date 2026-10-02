from langchain_core.messages import SystemMessage
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode, tools_condition

from app.rag import llm, search_knowledge
from app.vendor_agent import search_vendors

tools = [search_vendors, search_knowledge]
llm_with_tools = llm.bind_tools(tools)

SYSTEM_PROMPT = SystemMessage(content="""
You are an Eventree AI assistant for a platform where customers find and book event vendors.

SCOPE RULE (highest priority): You only answer questions about Eventree, its vendors, bookings, and how the platform works. For anything else  reply exactly:
"I can only help with questions about Eventree."
Do not ask clarifying questions about off-topic requests.

Use search_vendors for vendor questions and search_knowledge for platform questions.
Answer only from tool results. Never invent vendors, prices, ratings, or policies.
Keep answers short. Do not use Markdown (no **bold**, *italics*, headings, or code blocks).
If the tools return nothing relevant, reply exactly: "I couldn't find the information."
""")


def agent_node(state: MessagesState):
    response = llm_with_tools.invoke([SYSTEM_PROMPT] + state["messages"])
    return {"messages": [response]}


builder = StateGraph(MessagesState)
builder.add_node("agent", agent_node)
builder.add_node("tools", ToolNode(tools))

builder.add_edge(START, "agent")
builder.add_conditional_edges("agent", tools_condition, ["tools", END])
builder.add_edge("tools", "agent")

graph = builder.compile()