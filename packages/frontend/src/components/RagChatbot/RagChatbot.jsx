import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx"; // adjust to "./context/AuthContext.jsx" if RagChatbot.jsx is directly in src/
import "./RagChatbot.css";

const getToken = () => localStorage.getItem("eventree_token");

const canUseChat = (user) => ["customer", "vendor"].includes(user?.role);

const API_URL = "/api/agent/chat";

const ChatIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {/* antenna */}
        <path d="M12 6.5V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="3" r="1.2" fill="currentColor" />
        {/* head */}
        <rect x="4.5" y="6.5" width="15" height="12" rx="4.5" stroke="currentColor" strokeWidth="1.8" />
        {/* ears */}
        <path d="M2.5 11.5v3M21.5 11.5v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        {/* eyes */}
        <circle cx="9" cy="12" r="1.3" fill="currentColor" />
        <circle cx="15" cy="12" r="1.3" fill="currentColor" />
        {/* smile */}
        <path d="M9.5 15.5c1.4 1 3.6 1 5 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

const CloseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const SendIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function RagChatbot() {
    const { user } = useAuth();

    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);

    const endRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to newest message
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading, open]);

    // Focus input on open, close on Escape
    useEffect(() => {
        if (!open) return;
        inputRef.current?.focus();
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    // Only logged-in, non-admin users can see the chatbot
    if (!canUseChat(user)) return null;

    const sendMessage = async () => {
        const currentQuestion = question.trim();
        if (!currentQuestion || loading) return;

        const history = messages
            .filter((m) => !m.error && typeof m.content === "string" && m.content.trim() !== "")
            .map(({ role, content }) => ({ role, content }))
            .slice(-8);

        setMessages((prev) => [...prev, { role: "user", content: currentQuestion }]);
        setQuestion("");
        setLoading(true);

        try {
            const token = getToken();
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ question: currentQuestion, history }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong.");
            }

            setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    error: true,
                    content: error.message || "Could not reach the assistant. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="rag-widget">
            {open && (
                <section className="rag-chatbot" role="dialog" aria-label="Eventree assistant">
                    <header className="rag-chatbot-header">
                        <div className="rag-chatbot-title">
                            <span className="rag-chatbot-avatar">
                                <ChatIcon />
                            </span>
                            <div>
                                <h3>Eventree Assistant</h3>
                                <p>Ask about vendors and the platform</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="rag-icon-btn"
                            onClick={() => setOpen(false)}
                            aria-label="Close chat"
                        >
                            <CloseIcon />
                        </button>
                    </header>

                    <div className="rag-chatbot-messages">
                        {messages.length === 0 && (
                            <div className="rag-chatbot-empty">
                                <p>How can I help?</p>
                                <span>
                                    Try “Show vendors rated above 4” or “How does booking work?”
                                </span>
                            </div>
                        )}

                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`rag-message ${message.role}${message.error ? " error" : ""}`}
                            >
                                {message.content}
                            </div>
                        ))}

                        {loading && (
                            <div className="rag-message assistant rag-typing" aria-label="Assistant is typing">
                                <span />
                                <span />
                                <span />
                            </div>
                        )}

                        <div ref={endRef} />
                    </div>

                    <div className="rag-chatbot-input">
                        <textarea
                            ref={inputRef}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your question..."
                            rows={1}
                        />
                        <button
                            type="button"
                            className="rag-send-btn"
                            onClick={sendMessage}
                            disabled={loading || !question.trim()}
                            aria-label="Send message"
                        >
                            <SendIcon />
                        </button>
                    </div>
                </section>
            )}

            {!open && (
                <button
                    type="button"
                    className="rag-launcher"
                    onClick={() => setOpen(true)}
                    aria-label="Open chat assistant"
                >
                    <ChatIcon />
                    <span>Ask</span>
                </button>
            )}
        </div>
    );
}