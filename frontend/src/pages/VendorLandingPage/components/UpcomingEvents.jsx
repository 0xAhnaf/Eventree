import "./UpcomingEvents.css";

const defaultEvents = [
  { id: 1, month: "OCT", day: "12", title: "Silver Wedding Gala", place: "Grand Ballroom", time: "6:00 PM" },
  { id: 2, month: "OCT", day: "15", title: "Corporate Launch", place: "Sky Terrace", time: "11:30 AM" },
  { id: 3, month: "OCT", day: "21", title: "Secret Garden Mixer", place: "Central Park", time: "2:00 PM" },
];

function UpcomingEvents({ events = defaultEvents, onViewCalendar }) {
  return (
    <div className="upcoming-events-VLP">
      <h4 className="upcoming-events-title-VLP">Upcoming Events</h4>

      <div className="upcoming-events-list-VLP">
        {events.map((event) => (
          <div className="upcoming-event-item-VLP" key={event.id}>
            <div className="upcoming-event-date-VLP">
              <span className="upcoming-event-month-VLP">{event.month}</span>
              <span className="upcoming-event-day-VLP">{event.day}</span>
            </div>

            <div className="upcoming-event-info-VLP">
              <p className="upcoming-event-name-VLP">{event.title}</p>
              <p className="upcoming-event-meta-VLP">
                {event.place} • {event.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="upcoming-events-btn-VLP" onClick={onViewCalendar}>
        View Full Calendar
      </button>
    </div>
  );
}

export default UpcomingEvents;
