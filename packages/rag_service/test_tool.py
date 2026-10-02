from app.agent import graph
from langchain_core.messages import HumanMessage


question = "I want a vendor with a minimum rating of 4"

result = graph.invoke({
    "messages": [
        HumanMessage(content=question)
    ]
})

print("\n--- FINAL ANSWER ---")
print(result["messages"][-1].content)