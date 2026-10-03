import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, LoaderCircle, MessageCircle, X } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext.jsx";
import {
  fetchCustomerConversation,
  sendCustomerMessage,
} from "../../../../services/messageApi.js";
import "./ChatManager.css";

const formatTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

const ChatManager = ({ vendor = {}, open = false, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const loadConversation = useCallback(async () => {
    if (!open || !user || user.role !== "customer" || !vendor?.id) return;

    try {
      setError("");
      const data = await fetchCustomerConversation(vendor.id);
      setMessages(data.messages || []);
    } catch (requestError) {
      setError(requestError.message || "Could not load the conversation.");
    }
  }, [open, user, vendor?.id]);

  useEffect(() => {
    if (!open || !user || user.role !== "customer") return undefined;

    setLoading(true);
    loadConversation().finally(() => setLoading(false));

    const interval = window.setInterval(loadConversation, 5000);
    return () => window.clearInterval(interval);
  }, [open, user, loadConversation]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = async (event) => {
    event.preventDefault();
    const body = text.trim();
    if (!body || sending || !user || user.role !== "customer") return;

    setSending(true);
    setError("");

    try {
      const data = await sendCustomerMessage(vendor.id, body);
      setMessages((current) => [...current, data.message]);
      setText("");
    } catch (requestError) {
      setError(requestError.message || "Could not send your message.");
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  const isGuest = !user;
  const isWrongRole = user && user.role !== "customer";

  return (
    <div className="chat-modal-backdrop" onMouseDown={onClose}>
      <section
        className="chat-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Message ${vendor.name || "vendor"}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="chat-modal-header">
          <div className="chat-modal-title-wrap">
            <div className="chat-modal-avatar">
              {vendor?.name?.charAt(0)?.toUpperCase() || "V"}
            </div>
            <div>
              <p className="chat-modal-eyebrow">Direct message</p>
              <h2>{vendor.name || "Vendor"}</h2>
              <span>{vendor.managerName || "Vendor team"}</span>
            </div>
          </div>
          <button
            type="button"
            className="chat-close-btn"
            onClick={onClose}
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </header>

        {isGuest || isWrongRole ? (
          <div className="chat-access-state">
            <div className="chat-access-icon">
              <MessageCircle size={28} />
            </div>
            <h3>
              {isGuest
                ? "Sign in to message this vendor"
                : "Customer accounts can message vendors"}
            </h3>
            <p>
              {isGuest
                ? "Create an account or sign in to start a private conversation with this vendor."
                : "Switch to a customer account to start a vendor conversation."}
            </p>
          </div>
        ) : (
          <>
            <div className="chat-messages" aria-live="polite">
              {loading ? (
                <div className="chat-loading">
                  <LoaderCircle size={18} className="chat-spinner" /> Loading
                  conversation...
                </div>
              ) : messages.length === 0 ? (
                <div className="chat-empty-state">
                  <MessageCircle size={24} />
                  <strong>Start the conversation</strong>
                  <span>
                    Ask about availability, packages, pricing, or your event.
                  </span>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`chat-message-row ${message.isMine ? "is-mine" : ""}`}
                  >
                    <div className="chat-message-bubble">
                      <p>{message.body}</p>
                      <span>{formatTime(message.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {error && <p className="chat-error">{error}</p>}

            <form className="chat-composer" onSubmit={handleSend}>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Write a message..."
                maxLength={2000}
                rows={2}
                disabled={sending}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
              />
              <button
                type="submit"
                disabled={!text.trim() || sending}
                aria-label="Send message"
              >
                {sending ? (
                  <LoaderCircle size={18} className="chat-spinner" />
                ) : (
                  <ArrowUp size={19} />
                )}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
};

export default ChatManager;
