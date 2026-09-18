import React, { useCallback, useEffect, useState } from "react";
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

import {
  fetchPublicVendor,
  fetchPublicVendorAvailability,
} from "../../services/vendorApi.js";

const VendorDetailsPage = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [bookedDates, setBookedDates] = useState([]);

  const refreshAvailability = useCallback(async () => {
    const availability = await fetchPublicVendorAvailability(id);
    const unavailableDates = Array.isArray(availability.unavailable_dates)
      ? availability.unavailable_dates
      : [];

    setBookedDates(unavailableDates);
    setSelectedDate((currentDate) =>
      unavailableDates.includes(currentDate) ? "" : currentDate,
    );
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setPageError("");
    setSelectedPackageId("");

    Promise.all([fetchPublicVendor(id), fetchPublicVendorAvailability(id)])
      .then(([vendorData, availability]) => {
        if (!isMounted) return;

        setVendor(vendorData);
        setSelectedPackageId(
          Array.isArray(vendorData.packages) && vendorData.packages.length
            ? String(vendorData.packages[0].id)
            : "",
        );
        setBookedDates(
          Array.isArray(availability.unavailable_dates)
            ? availability.unavailable_dates
            : [],
        );
      })
      .catch((error) => {
        if (isMounted) {
          setPageError(error.message || "Could not load this vendor.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDateSelect = (date) => {
    if (bookedDates.includes(date)) {
      return;
    }

    setSelectedDate(date);
  };

  if (isLoading) {
    return (
      <div className="vendor-details-page">
        <Navbar />
        <div className="vendor-details-container">Loading vendor...</div>
        <Footer />
      </div>
    );
  }

  if (pageError || !vendor) {
    return (
      <div className="vendor-details-page">
        <Navbar />
        <div className="vendor-details-container">
          {pageError || "Vendor not found."}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="vendor-details-page">
      <Navbar />

      <VendorGallery vendor={vendor} />

      <VendorHeader vendor={vendor} />

      <VendorTabs />

      <div className="vendor-details-container">
        <div className="vendor-left-content">
          <AboutVendor vendor={vendor} />

          <VendorGallerySection
            images={(vendor.portfolio || []).map((image) => image.url)}
            amenities={vendor.amenities}
          />

          <PricingPackages
            packages={vendor.packages}
            selectedPackageId={selectedPackageId}
            onPackageSelect={setSelectedPackageId}
          />

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
            selectedPackageId={selectedPackageId}
            onPackageChange={setSelectedPackageId}
            vendor={vendor}
            onBookingCreated={refreshAvailability}
          />
        </aside>
      </div>

      <ChatManager vendor={vendor} />

      <Footer />
    </div>
  );
};

export default VendorDetailsPage;
