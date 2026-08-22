import React, { useMemo, useState } from "react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProfileSidebar from "../../components/Profile/ProfileSidebar";

import EventsHeader from "./components/EventsHeader/EventsHeader";
import EventFilters from "./components/EventFilters/EventFilters";
import EventGrid from "./components/EventGrid/EventGrid";

import { mockEvents } from "../../utils/events";

import "./MyEvents.css";

const MyEvents = () => {
  const [events] = useState(mockEvents);
  const [activeFilter, setActiveFilter] = useState("All Events");

  const filteredEvents = useMemo(() => {
    if (activeFilter === "All Events") {
      return events;
    }

    return events.filter((event) => event.status === activeFilter);
  }, [events, activeFilter]);

  const handleCreateEvent = () => {
    console.log("Create event");
  };

  const handleManageEvent = (event) => {
    console.log("Manage event:", event);
  };

  return (
    <div className="my-events-page">
      <Navbar />

      <div className="my-events-layout">
        {/* Sidebar */}
        <ProfileSidebar />

        {/* Main Content */}
        <main className="my-events-main">
          <EventsHeader onCreateEvent={handleCreateEvent} />

          <EventFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          <EventGrid
            events={filteredEvents}
            onManageEvent={handleManageEvent}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MyEvents;
