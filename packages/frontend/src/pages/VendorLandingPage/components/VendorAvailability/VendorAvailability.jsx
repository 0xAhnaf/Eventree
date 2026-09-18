import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Save,
} from "lucide-react";

import {
  fetchVendorAvailability,
  saveVendorAvailability,
  VENDOR_AVAILABILITY_UPDATED_EVENT,
  VENDOR_BOOKINGS_UPDATED_EVENT,
} from "../../../../services/vendorApi.js";

import "./VendorAvailability.css";

const formatDateValue = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0",
  )}`;

const formatReadableDate = (dateValue) =>
  new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const todayStart = () => {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

function VendorAvailability() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();

    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [savedBlockedDates, setSavedBlockedDates] = useState([]);

  const [blockedDates, setBlockedDates] = useState([]);

  const [confirmedBookingDates, setConfirmedBookingDates] = useState([]);

  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadAvailability = useCallback(async () => {
    try {
      const availability = await fetchVendorAvailability();
      const nextBlockedDates = Array.isArray(availability.blocked_dates)
        ? availability.blocked_dates
        : [];
      const nextReservedDates = Array.isArray(availability.reserved_dates)
        ? availability.reserved_dates
        : [];

      setSavedBlockedDates(nextBlockedDates);
      setBlockedDates(nextBlockedDates);
      setConfirmedBookingDates(nextReservedDates);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message || "Could not load availability.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAvailability();
    window.addEventListener(VENDOR_AVAILABILITY_UPDATED_EVENT, loadAvailability);
    window.addEventListener(VENDOR_BOOKINGS_UPDATED_EVENT, loadAvailability);

    return () => {
      window.removeEventListener(
        VENDOR_AVAILABILITY_UPDATED_EVENT,
        loadAvailability,
      );
      window.removeEventListener(VENDOR_BOOKINGS_UPDATED_EVENT, loadAvailability);
    };
  }, [loadAvailability]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const hasUnsavedChanges =
    JSON.stringify([...blockedDates].sort()) !==
    JSON.stringify([...savedBlockedDates].sort());

  const monthBlockedDates = useMemo(
    () =>
      blockedDates.filter((date) =>
        date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`),
      ),
    [blockedDates, month, year],
  );

  const monthConfirmedDates = useMemo(
    () =>
      confirmedBookingDates.filter((date) =>
        date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`),
      ),
    [confirmedBookingDates, month, year],
  );

  const toggleBlockedDate = (dateValue) => {
    if (confirmedBookingDates.includes(dateValue)) {
      return;
    }

    const selectedDate = new Date(`${dateValue}T00:00:00`);

    if (selectedDate < todayStart()) {
      return;
    }

    setBlockedDates((currentDates) =>
      currentDates.includes(dateValue)
        ? currentDates.filter((date) => date !== dateValue)
        : [...currentDates, dateValue].sort(),
    );

    setSaveMessage("");
    setErrorMessage("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage("");
    setErrorMessage("");

    try {
      const availability = await saveVendorAvailability(blockedDates);
      const savedDates = Array.isArray(availability.blocked_dates)
        ? availability.blocked_dates
        : [];

      setSavedBlockedDates(savedDates);
      setBlockedDates(savedDates);
      setConfirmedBookingDates(
        Array.isArray(availability.reserved_dates)
          ? availability.reserved_dates
          : [],
      );
      setSaveMessage(
        "Availability saved. Customers now see the updated calendar.",
      );
    } catch (error) {
      setErrorMessage(error.message || "Availability could not be saved.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetChanges = () => {
    setBlockedDates(savedBlockedDates);
    setSaveMessage("Unsaved availability changes were reset.");
    setErrorMessage("");
  };

  const calendarDays = [];

  for (let index = 0; index < firstDay; index += 1) {
    calendarDays.push(
      <div
        className="vav-calendar-empty"
        key={`empty-${index}`}
        aria-hidden="true"
      />,
    );
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const dateValue = formatDateValue(year, month, day);
    const dateObject = new Date(`${dateValue}T00:00:00`);
    const isPast = dateObject < todayStart();
    const isConfirmed = confirmedBookingDates.includes(dateValue);
    const isBlocked = blockedDates.includes(dateValue);

    let className = "vav-calendar-day";

    if (isPast) {
      className += " vav-calendar-day-past";
    } else if (isConfirmed) {
      className += " vav-calendar-day-booked";
    } else if (isBlocked) {
      className += " vav-calendar-day-blocked";
    } else {
      className += " vav-calendar-day-available";
    }

    calendarDays.push(
      <button
        type="button"
        key={dateValue}
        className={className}
        disabled={isPast || isConfirmed}
        onClick={() => toggleBlockedDate(dateValue)}
        aria-label={`${formatReadableDate(dateValue)} ${
          isConfirmed
            ? "booked"
            : isBlocked
              ? "blocked"
              : isPast
                ? "past date"
                : "available"
        }`}
      >
        {day}
      </button>,
    );
  }

  return (
    <section className="vav-page">
      {isLoading && <p className="vav-save-message">Loading availability...</p>}
      {errorMessage && <p className="vav-save-message">{errorMessage}</p>}
      <div className="vav-overview-grid">
        <article className="vav-overview-card">
          <span className="vav-overview-icon">
            <CalendarCheck size={21} />
          </span>

          <div>
            <span>Blocked this month</span>
            <strong>{monthBlockedDates.length}</strong>
          </div>
        </article>

        <article className="vav-overview-card">
          <span className="vav-overview-icon vav-overview-icon-booked">
            <CheckCircle2 size={21} />
          </span>

          <div>
            <span>Client bookings this month</span>
            <strong>{monthConfirmedDates.length}</strong>
          </div>
        </article>
      </div>

      <div className="vav-layout">
        <section className="vav-calendar-card">
          <div className="vav-calendar-header">
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
              aria-label="Previous month"
            >
              <ChevronLeft size={20} />
            </button>

            <div>
              <h2>
                {currentMonth.toLocaleDateString("en-GB", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <p>Click an available date to block or reopen it for clients.</p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
              aria-label="Next month"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="vav-weekdays">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="vav-calendar-grid">{calendarDays}</div>

          <div className="vav-legend">
            <span>
              <i className="vav-dot vav-dot-available" />
              Available
            </span>

            <span>
              <i className="vav-dot vav-dot-blocked" />
              Blocked by vendor
            </span>

            <span>
              <i className="vav-dot vav-dot-booked" />
              Booked by client
            </span>
          </div>
        </section>

        <aside className="vav-side-card">
          <div>
            <h2>Unavailable dates</h2>
            <p>
              Booked dates are locked. Vendor-blocked dates can be reopened from
              the calendar.
            </p>
          </div>

          <div className="vav-date-list">
            {[...monthConfirmedDates, ...monthBlockedDates]
              .sort()
              .map((dateValue) => {
                const isConfirmed = confirmedBookingDates.includes(dateValue);

                return (
                  <div className="vav-date-item" key={dateValue}>
                    <div>
                      <strong>{formatReadableDate(dateValue)}</strong>
                      <span>
                        {isConfirmed
                          ? "Booked by a client"
                          : "Blocked by vendor"}
                      </span>
                    </div>

                    {!isConfirmed && (
                      <button
                        type="button"
                        onClick={() => toggleBlockedDate(dateValue)}
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                );
              })}

            {!monthConfirmedDates.length && !monthBlockedDates.length && (
              <div className="vav-empty-list">
                No unavailable dates in this month.
              </div>
            )}
          </div>

          <div className="vav-actions">
            <button
              type="button"
              className="vav-reset-button"
              onClick={resetChanges}
              disabled={!hasUnsavedChanges}
            >
              <RotateCcw size={17} />
              Reset
            </button>

            <button
              type="button"
              className="vav-save-button"
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
            >
              <Save size={17} />
              {isSaving ? "Saving..." : "Save availability"}
            </button>
          </div>

          {saveMessage && (
            <p className="vav-save-message" aria-live="polite">
              {saveMessage}
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}

export default VendorAvailability;
