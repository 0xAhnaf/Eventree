import React from "react";
import "./EmptyEventCard.css";

const EmptyEventCard = ({ onCreateEvent }) => {
  return (
    <article className="empty-event-card" onClick={onCreateEvent}>
      <div className="empty-event-image">
        <span>＋</span>
      </div>

      <div className="empty-event-content">
        <span className="empty-event-icon">▣</span>

        <h3>Start a New Draft</h3>

        <p>Begin planning your next spectacular event.</p>

        <button type="button">Create Empty Event →</button>
      </div>
    </article>
  );
};

export default EmptyEventCard;
