import React, { useState } from "react";
import "./ChatManager.css";

const ChatManager = ({ vendor = {} }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="chat-box">
          <div className="chat-header">
            <div>
              <h3>Direct Message</h3>

              <p>{vendor.name || "Vendor"}</p>
            </div>

            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="manager-info">
            <div className="manager-avatar">
              {vendor.managerName?.charAt(0)?.toUpperCase() || "V"}
            </div>

            <div>
              <strong>{vendor.managerName || "Vendor manager"}</strong>

              <span>🟢 Online Now</span>
            </div>
          </div>

          <textarea placeholder="Ask Manager a question..." />

          <button className="start-chat-btn">Start Chat</button>
        </div>
      )}

      <button
        className="chat-floating-btn"

        onClick={() => setOpen(true)}
      >
        💬
      </button>
    </>
  );
};

export default ChatManager;
