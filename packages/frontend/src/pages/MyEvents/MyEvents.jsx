import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomerDashboardLayout } from "../../components/CustomerDashboard";
import { listEvents, saveEvent, deleteEvent, completeEvent } from "../../services/eventsApi";
import EventForm from "./components/EventForm";
import EventStatusFilters from "./components/EventsOverview/EventStatusFilters";
import EventsOverviewGrid from "./components/EventsOverview/EventsOverviewGrid";
import EventsOverviewHeader from "./components/EventsOverview/EventsOverviewHeader";
import EventWorkspace from "./components/EventWorkspace";
import "./MyEvents.css";

export default function MyEvents() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [filter, setFilter] = useState("All Events");
  const selected = events.find(
    (event) => String(event.id) === params.get("eventId"),
  );
  const creating = params.get("create") === "1";

  const refresh = useCallback(async () => {
    try {
      setEvents(await listEvents());
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const update = () => {
      if (!document.hidden) refresh();
    };
    window.addEventListener("focus", update);
    const timer = window.setInterval(update, 30000);

    return () => {
      window.removeEventListener("focus", update);
      window.clearInterval(timer);
    };
  }, [refresh]);

  function manage(eventId) {
    setEditing(false);
    setParams({ eventId: String(eventId) });
  }

  async function save(values, eventId) {
    const saved = await saveEvent(values, eventId);
    setEvents((current) => [
      saved,
      ...current.filter((event) => event.id !== saved.id),
    ]);
    setEditing(false);

    const returnTo = params.get("returnTo");
    if (
      !eventId &&
      returnTo &&
      /^\/browse-vendor\/\d+$/.test(returnTo)
    ) {
      navigate(returnTo + "?eventId=" + saved.id);
      return;
    }

    setParams({ eventId: String(saved.id) });
  }

  async function action(kind) {
    if (busy || !selected) return;

    const confirmation =
      kind === "delete"
        ? "Delete this event?"
        : "Mark this event completed? Pending requests will close and event details will be locked.";

    if (!window.confirm(confirmation)) return;

    setBusy(true);
    setError("");

    try {
      if (kind === "delete") {
        await deleteEvent(selected.id);
        setEvents((current) =>
          current.filter((event) => event.id !== selected.id),
        );
        setParams({});
      } else {
        const updated = await completeEvent(selected.id);
        setEvents((current) =>
          current.map((event) =>
            event.id === updated.id ? updated : event,
          ),
        );
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  const filteredEvents = events.filter(
    (event) => filter === "All Events" || event.status === filter,
  );

  let content;

  if (loading) {
    content = <p role="status">Loading your events...</p>;
  } else if (creating || (editing && selected)) {
    content = (
      <EventForm
        key={creating ? "new" : selected.id}
        event={creating ? null : selected}
        onSave={save}
        onCancel={() => {
          setEditing(false);
          if (creating) setParams({});
        }}
      />
    );
  } else if (selected) {
    content = (
      <EventWorkspace
        event={selected}
        busy={busy}
        onBack={() => setParams({})}
        onEdit={() => setEditing(true)}
        onDelete={() => action("delete")}
        onComplete={() => action("complete")}
      />
    );
  } else {
    content = (
      <>
        <EventsOverviewHeader
          onCreateEvent={() => setParams({ create: "1" })}
        />

        {params.get("eventId") && (
          <p role="status">That event was not found in your account.</p>
        )}

        <EventStatusFilters
          activeFilter={filter}
          onFilterChange={setFilter}
        />

        <EventsOverviewGrid
          events={filteredEvents}
          hasAnyEvents={events.length > 0}
          onManageEvent={manage}
        />
      </>
    );
  }

  return (
    <CustomerDashboardLayout className="me-page" contentClassName="me-main">
      {error && (
        <div className="me-error" role="alert">
          {error}{" "}
          <button type="button" className="me-secondary" onClick={refresh}>
            Retry
          </button>
        </div>
      )}

      {content}
    </CustomerDashboardLayout>
  );
}
