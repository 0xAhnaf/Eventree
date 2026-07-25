import React, { useState } from "react";
import "./BookingCard.css";

const BookingCard = ({
  vendor={vendor},
  bookedDates = [],
  selectedDate = "",
  onDateChange,
  
}) => {

  const [dateError, setDateError] = useState("");


  const handleDateChange = (event) => {

    const newDate = event.target.value;


    if (!newDate) {

      setDateError("");

      if (typeof onDateChange === "function") {
        onDateChange("");
      }

      return;
    }



    if (bookedDates.includes(newDate)) {

      setDateError(
        "This date is already booked. Please select another date."
      );

      return;

    }



    setDateError("");

    if (typeof onDateChange === "function") {
      onDateChange(newDate);
    }

  };



  return (

    <div className="booking-card">


      <h2>
        Book This Vendor
      </h2>



      <div className="starting-price">

        <span>
          Starting from
        </span>

        <h3>
          {vendor.price}
        </h3>

      </div>




      <div className="booking-field">

        <label htmlFor="booking-event-date">
          Event Date
        </label>


        <input

          id="booking-event-date"

          type="date"

          value={selectedDate}

          onChange={handleDateChange}

        />


        {dateError && (

          <p
            style={{
              margin: "8px 0 0",
              color: "#b42318",
              fontSize: "13px",
              lineHeight: "1.4",
            }}
          >

            {dateError}

          </p>

        )}


      </div>




      <div className="booking-field">

        <label htmlFor="booking-package">
          Select Package
        </label>


        <select
          id="booking-package"
          defaultValue="general"
        >

          <option value="general">
            General Package
          </option>


          <option value="premium">
            Premium Package
          </option>


        </select>


      </div>





      <div className="booking-field">

        <label htmlFor="booking-event-type">
          Event Type
        </label>


        <input

          id="booking-event-type"

          type="text"

          placeholder="Example: Wedding, Birthday, Corporate Event"

        />


      </div>





      <div className="booking-field">

        <label htmlFor="booking-guests">
          Number of Guests
        </label>


        <input

          id="booking-guests"

          type="number"

          min="1"

          placeholder="Enter guests"

        />


      </div>





      <button

        type="button"

        className="booking-button"

      >

        Send Booking Request

      </button>


    </div>

  );

};


export default BookingCard;