const EVENT_FILTERS = ["All Events", "Planning", "Confirmed", "Past"];

export default function EventStatusFilters({
  activeFilter,
  onFilterChange,
}) {
  return (
    <div className="me-tabs" role="group" aria-label="Filter events">
      {EVENT_FILTERS.map((filter) => (
        <button
          type="button"
          key={filter}
          aria-pressed={activeFilter === filter}
          className={
            activeFilter === filter ? "me-tab me-tab-active" : "me-tab"
          }
          onClick={() => onFilterChange(filter)}
        >
          {filter === "Past" ? "Completed" : filter}
        </button>
      ))}
    </div>
  );
}
