import React, { useEffect, useState } from "react";

import "./AvailabilityCalendar.css";

const AvailabilityCalendar = ({
  bookedDates = [],
  selectedDate = "",
  onDateSelect,
}) => {
  const [currentDate, setCurrentDate] = useState(
    new Date(2026, 9, 1)
  );

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    const selectedDateObject = new Date(
      `${selectedDate}T00:00:00`
    );

    if (Number.isNaN(selectedDateObject.getTime())) {
      return;
    }

    setCurrentDate(
      new Date(
        selectedDateObject.getFullYear(),
        selectedDateObject.getMonth(),
        1
      )
    );
  }, [selectedDate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("en-GB", {
    month: "long",
  });

  const firstDay = new Date(year, month, 1).getDay();

  const totalDays = new Date(year, month + 1, 0).getDate();

  const formatDate = (day) => {
    const formattedMonth = String(month + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");

    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isUnavailable = (day) => {
    const formattedDate = formatDate(day);

    return bookedDates.includes(formattedDate);
  };

  const selectDate = (day) => {
    const formattedDate = formatDate(day);

    if (bookedDates.includes(formattedDate)) {
      return;
    }

    if (typeof onDateSelect === "function") {
      onDateSelect(formattedDate);
    }
  };

  const calendarDays = [];

  for (let index = 0; index < firstDay; index += 1) {
    calendarDays.push(
      <div
        key={`empty-${index}`}
        className="empty-day"
        aria-hidden="true"
      />
    );
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const formattedDate = formatDate(day);
    const unavailable = isUnavailable(day);
    const selected = selectedDate === formattedDate;

    let dayClassName = "day";

    if (unavailable) {
      dayClassName += " booked";
    } else if (selected) {
      dayClassName += " selected";
    } else {
      dayClassName += " available";
    }

    calendarDays.push(
      <button
        type="button"
        key={formattedDate}
        className={dayClassName}
        onClick={() => selectDate(day)}
        disabled={unavailable}
        aria-label={`${formattedDate} ${
          unavailable ? "unavailable" : "available"
        }`}
      >
        {day}
      </button>
    );
  }

  return (
    <section
      className="availability-calendar"
      id="availability"
    >
      <h2>Availability</h2>

      <div className="calendar-box">
        <div className="calendar-header">
          <button
            type="button"
            onClick={previousMonth}
            aria-label="Previous month"
          >
            ←
          </button>

          <h3>
            {monthName} {year}
          </h3>

          <button
            type="button"
            onClick={nextMonth}
            aria-label="Next month"
          >
            →
          </button>
        </div>

        <div className="weekdays">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        <div className="calendar-days">{calendarDays}</div>

        <div className="calendar-legend">
          <div>
            <span className="available-dot" />
            <span>Available</span>
          </div>

          <div>
            <span className="booked-dot" />
            <span>Unavailable</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvailabilityCalendar;