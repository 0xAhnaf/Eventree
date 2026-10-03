import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle, MessageCircle, Search, Send } from "lucide-react";
import {
  fetchVendorConversation,
  fetchVendorConversations,
  sendVendorMessage,
} from "../../../../services/messageApi.js";
import "./VendorMessages.css";

const formatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();

  return sameDay
    ? date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    : date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
};

const VendorMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeCustomerId, setActiveCustomerId] = useState(null);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  /*
   * IMPORTANT:
   * This ref points directly to the chat messages container.
   *
   * We use container.scrollTop instead of scrollIntoView().
   * scrollIntoView() can cause the ENTIRE Vendor Landing page
   * to move down.
   */
  const messagesContainerRef = useRef(null);

  /*
   * Load the vendor's conversation list.
   */
  const loadConversations = useCallback(async () => {
    try {
      const data = await fetchVendorConversations();

      setConversations((current) => {
        // Avoid unnecessary re-render if the conversation list
        // has not actually changed.
        const currentString = JSON.stringify(current);
        const newString = JSON.stringify(data);

        return currentString === newString ? current : data;
      });

      setActiveCustomer((current) => {
        if (!current) return current;

        return (
          data.find((item) => item.customerId === current.customerId) || current
        );
      });

      setActiveCustomerId((current) => {
        if (current && data.some((item) => item.customerId === current)) {
          return current;
        }

        return data[0]?.customerId ?? null;
      });
    } catch (requestError) {
      setError(requestError.message || "Could not load your messages.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  /*
   * Load the currently selected conversation.
   *
   * IMPORTANT:
   * We only update the messages state when the server actually
   * returns different messages. This prevents polling from
   * constantly re-rendering the textarea while the vendor types.
   */
  const loadConversation = useCallback(async () => {
    if (!activeCustomerId) {
      setMessages((current) => (current.length === 0 ? current : []));
      return;
    }

    try {
      const data = await fetchVendorConversation(activeCustomerId);
      const incomingMessages = data.messages || [];

      setMessages((currentMessages) => {
        /*
         * Compare the existing conversation with the new one.
         *
         * If nothing changed, return the existing state object.
         * React can then avoid an unnecessary state update.
         */
        if (currentMessages.length === incomingMessages.length) {
          const currentLastId = currentMessages[currentMessages.length - 1]?.id;

          const incomingLastId =
            incomingMessages[incomingMessages.length - 1]?.id;

          const currentFirstId = currentMessages[0]?.id;

          const incomingFirstId = incomingMessages[0]?.id;

          if (
            currentLastId === incomingLastId &&
            currentFirstId === incomingFirstId
          ) {
            return currentMessages;
          }
        }

        return incomingMessages;
      });

      setActiveCustomer((current) => ({
        ...(current || {}),
        customerId: activeCustomerId,
        customerName:
          data.customer?.name || current?.customerName || "Customer",
        customerEmail: data.customer?.email || current?.customerEmail || "",
      }));

      setError("");
    } catch (requestError) {
      setError(requestError.message || "Could not load this conversation.");
    } finally {
      setLoadingChat(false);
    }
  }, [activeCustomerId]);

  /*
   * Load conversations initially and refresh every 7 seconds.
   */
  useEffect(() => {
    setLoadingList(true);
    loadConversations();

    const interval = window.setInterval(loadConversations, 7000);

    return () => window.clearInterval(interval);
  }, [loadConversations]);

  /*
   * Load active conversation initially and refresh every 5 seconds.
   */
  useEffect(() => {
    if (!activeCustomerId) return undefined;

    setLoadingChat(true);
    loadConversation();

    const interval = window.setInterval(loadConversation, 5000);

    return () => window.clearInterval(interval);
  }, [activeCustomerId, loadConversation]);

  /*
   * Scroll ONLY the chat messages container.
   *
   * DO NOT use scrollIntoView() here.
   *
   * scrollIntoView() can scroll the entire Vendor Landing page.
   * By changing scrollTop on the chat container, only the
   * conversation area moves.
   */
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [messages.length]);

  /*
   * Select a conversation.
   */
  const handleSelect = (conversation) => {
    setActiveCustomerId(conversation.customerId);
    setActiveCustomer(conversation);
    setMessages([]);
    setError("");
  };

  /*
   * Send a message.
   */
  const handleSend = async (event) => {
    event.preventDefault();

    const body = text.trim();

    if (!body || !activeCustomerId || sending) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const data = await sendVendorMessage(activeCustomerId, body);

      /*
       * Add the newly sent message immediately.
       */
      setMessages((current) => [...current, data.message]);

      setText("");

      /*
       * Refresh the conversation list so the latest message
       * appears immediately on the left.
       */
      loadConversations();
    } catch (requestError) {
      setError(requestError.message || "Could not send the message.");
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((conversation) =>
    `${conversation.customerName} ${conversation.customerEmail}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  return (
    <section className="vendor-messages">
      <div className="vendor-messages-shell">
        {/* Conversation list */}
        <aside className="vendor-conversation-list">
          <div className="vendor-messages-list-header">
            <div>
              <h2>Messages</h2>
              <p>Conversations with your customers</p>
            </div>

            <div className="vendor-message-count">{conversations.length}</div>
          </div>

          <label className="vendor-message-search">
            <Search size={16} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customers"
            />
          </label>

          <div className="vendor-conversation-scroll">
            {loadingList ? (
              <div className="vendor-message-list-state">
                <LoaderCircle size={18} className="vendor-message-spinner" />
                Loading messages...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="vendor-message-list-state vendor-message-empty-list">
                <MessageCircle size={26} />

                <strong>No conversations yet</strong>

                <span>
                  When a customer messages you, the conversation will appear
                  here.
                </span>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  type="button"
                  key={conversation.customerId}
                  className={`vendor-conversation-item ${
                    activeCustomerId === conversation.customerId
                      ? "is-active"
                      : ""
                  }`}
                  onClick={() => handleSelect(conversation)}
                >
                  <div className="vendor-conversation-avatar">
                    {conversation.customerName?.charAt(0)?.toUpperCase() || "C"}
                  </div>

                  <div className="vendor-conversation-copy">
                    <div className="vendor-conversation-topline">
                      <strong>{conversation.customerName}</strong>

                      <span>{formatTime(conversation.lastMessageAt)}</span>
                    </div>

                    <p>{conversation.lastMessage}</p>
                  </div>

                  {conversation.unreadCount > 0 && (
                    <span className="vendor-unread-badge">
                      {conversation.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Chat panel */}
        <div className="vendor-chat-panel">
          {activeCustomerId ? (
            <>
              <header className="vendor-chat-panel-header">
                <div className="vendor-conversation-avatar large">
                  {activeCustomer?.customerName?.charAt(0)?.toUpperCase() ||
                    "C"}
                </div>

                <div>
                  <h3>{activeCustomer?.customerName || "Customer"}</h3>

                  <p>
                    {activeCustomer?.customerEmail || "Customer conversation"}
                  </p>
                </div>
              </header>

              {/* 
                IMPORTANT:
                The ref is attached to THIS container.

                Therefore only this element scrolls when a new
                message arrives.
              */}
              <div className="vendor-chat-messages" ref={messagesContainerRef}>
                {loadingChat && messages.length === 0 ? (
                  <div className="vendor-message-list-state">
                    <LoaderCircle
                      size={18}
                      className="vendor-message-spinner"
                    />
                    Loading conversation...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="vendor-message-list-state">
                    <MessageCircle size={26} />
                    No messages in this conversation yet.
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`vendor-chat-row ${
                        message.isMine ? "is-mine" : ""
                      }`}
                    >
                      <div className="vendor-chat-bubble">
                        <p>{message.body}</p>

                        <span>{formatTime(message.createdAt)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {error && <p className="vendor-message-error">{error}</p>}

              <form className="vendor-chat-composer" onSubmit={handleSend}>
                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder={`Reply to ${
                    activeCustomer?.customerName || "customer"
                  }...`}
                  rows={2}
                  maxLength={2000}
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
                    <LoaderCircle
                      size={18}
                      className="vendor-message-spinner"
                    />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="vendor-no-chat-selected">
              <div className="vendor-no-chat-icon">
                <MessageCircle size={30} />
              </div>

              <h3>Select a conversation</h3>

              <p>Choose a customer from the left to view messages and reply.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VendorMessages;
