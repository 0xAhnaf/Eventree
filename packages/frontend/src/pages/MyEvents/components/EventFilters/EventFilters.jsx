import React from "react";
import "./EventFilters.css";

const filters = ["All Events", "Planning", "Confirmed", "Past"];

const EventFilters = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="event-filters">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          className={
            activeFilter === filter ? "event-filter active" : "event-filter"
          }
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default EventFilters;
