from app.rag import answer_question

answer = answer_question(
    "How does RAG work?"
)

print("\n--- ANSWER ---")
print(answer)