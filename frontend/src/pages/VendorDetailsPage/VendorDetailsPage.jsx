import React, { useState } from "react";
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


const VendorDetailsPage = () => {


  const [selectedDate, setSelectedDate] = useState("");



  const bookedDates = [

    "2026-10-05",
    "2026-10-12",
    "2026-10-19",
    "2026-10-25",
    "2026-11-08",
    "2026-11-16",

  ];




  const handleDateSelect = (date) => {


    if (bookedDates.includes(date)) {

      return;

    }


    setSelectedDate(date);


  };





  return (

    <div className="vendor-details-page">


      <Navbar />



      <VendorGallery />



      <VendorHeader />



      <VendorTabs />





      <div className="vendor-details-container">


        <div className="vendor-left-content">



          <AboutVendor />



          <VendorGallerySection />



          <PricingPackages />



          <AvailabilityCalendar

            bookedDates={bookedDates}

            selectedDate={selectedDate}

            onDateSelect={handleDateSelect}

          />



          <Reviews />



        </div>






        <aside className="vendor-right-sidebar">


          <BookingCard

            bookedDates={bookedDates}

            selectedDate={selectedDate}

            onDateChange={handleDateSelect}

          />


        </aside>



      </div>





      <ChatManager />



      <Footer />



    </div>

  );


};



export default VendorDetailsPage;