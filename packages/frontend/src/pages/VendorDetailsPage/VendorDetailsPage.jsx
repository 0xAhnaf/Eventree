import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./VendorDetailsPage.css";

import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

import VendorGallery from "./components/VendorGallery/VendorGallery";
import VendorHeader from "./components/VendorHeader/VendorHeader";
import VendorTabs from "./components/VendorTabs/VendorTabs";
import AboutVendor from "./components/AboutVendor/AboutVendor";
import VendorGallerySection from "./components/VendorGallerySection/VendorGallerySection";
import PricingPackages from "./components/PricingPackages/PricingPackages";
import AvailabilityCalendar from "./components/AvailabilityCalendar/AvailabilityCalendar";
import Reviews from "./components/Reviews/Reviews";
import BookingCard from "./components/BookingCard/BookingCard";
import ChatManager from "./components/ChatManager/ChatManager";

import vendors from "../../components/vendors.js";

import {
  getVendorUnavailableDates,
  VENDOR_AVAILABILITY_STORAGE_KEY,
  VENDOR_AVAILABILITY_UPDATED_EVENT,
  VENDOR_BOOKINGS_STORAGE_KEY,
  VENDOR_BOOKINGS_UPDATED_EVENT,
} from "../../utils/vendorPortalStorage.js";

const VendorDetailsPage = () => {
  const { id } = useParams();

  const vendor = vendors.find((vendorItem) => vendorItem.id === Number(id));

  const [selectedDate, setSelectedDate] = useState("");

  const [bookedDates, setBookedDates] = useState(() =>
    getVendorUnavailableDates(Number(id)),
  );

  useEffect(() => {
    const syncUnavailableDates = (event) => {
      if (
        event?.type === "storage" &&
        event.key &&
        event.key !== VENDOR_AVAILABILITY_STORAGE_KEY &&
        event.key !== VENDOR_BOOKINGS_STORAGE_KEY
      ) {
        return;
      }

      const nextUnavailableDates = getVendorUnavailableDates(Number(id));

      setBookedDates(nextUnavailableDates);

      setSelectedDate((currentSelectedDate) =>
        nextUnavailableDates.includes(currentSelectedDate)
          ? ""
          : currentSelectedDate,
      );
    };

    syncUnavailableDates();

    window.addEventListener("storage", syncUnavailableDates);
    window.addEventListener(
      VENDOR_AVAILABILITY_UPDATED_EVENT,
      syncUnavailableDates,
    );
    window.addEventListener(
      VENDOR_BOOKINGS_UPDATED_EVENT,
      syncUnavailableDates,
    );

    return () => {
      window.removeEventListener("storage", syncUnavailableDates);
      window.removeEventListener(
        VENDOR_AVAILABILITY_UPDATED_EVENT,
        syncUnavailableDates,
      );
      window.removeEventListener(
        VENDOR_BOOKINGS_UPDATED_EVENT,
        syncUnavailableDates,
      );
    };
  }, [id]);

  const handleDateSelect = (date) => {
    if (bookedDates.includes(date)) {
      return;
    }

    setSelectedDate(date);
  };

  return (
    <div className="vendor-details-page">
      <Navbar />

      <VendorGallery vendor={vendor} />

      <VendorHeader vendor={vendor} />

      <VendorTabs />

      <div className="vendor-details-container">
        <div className="vendor-left-content">
          <AboutVendor vendor={vendor} />

          <VendorGallerySection images={vendor.photos} />

          <PricingPackages />

          <AvailabilityCalendar
            bookedDates={bookedDates}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />

          <Reviews vendor={vendor} />
        </div>

        <aside className="vendor-right-sidebar">
          <BookingCard
            bookedDates={bookedDates}
            selectedDate={selectedDate}
            onDateChange={handleDateSelect}
            vendor={vendor}
          />
        </aside>
      </div>

      <ChatManager />

      <Footer />
    </div>
  );
};

export default VendorDetailsPage;
