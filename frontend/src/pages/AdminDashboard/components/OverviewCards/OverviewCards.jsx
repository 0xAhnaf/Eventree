import React, { useEffect, useState } from "react";
import {
  Wallet,
  CalendarCheck,
  Building2,
  Clock3,
} from "lucide-react";

import "./OverviewCards.css";



const formatCurrency = (value) => {

  return `৳${value.toLocaleString("en-BD")}`;

};



const AnimatedNumber = ({ value, currency = false }) => {

  const [count, setCount] = useState(0);


  useEffect(() => {

    let start = 0;

    const duration = 1200;

    const increment = value / (duration / 16);


    const timer = setInterval(() => {

      start += increment;


      if (start >= value) {

        setCount(value);

        clearInterval(timer);

      } else {

        setCount(Math.floor(start));

      }


    }, 16);



    return () => clearInterval(timer);


  }, [value]);



  return (

    <>
      {
        currency
          ? formatCurrency(count)
          : count.toLocaleString("en-BD")
      }
    </>

  );

};





const OverviewCards = () => {


  const cards = [

    {
      title: "Total Revenue",
      value: 428930,
      currency: true,
      description: "Overall platform earnings",
      icon: <Wallet size={24} />,
    },


    {
      title: "Total Bookings",
      value: 1248,
      currency: false,
      description: "Successful event bookings",
      icon: <CalendarCheck size={24} />,
    },


    {
      title: "Active Vendors",
      value: 248,
      currency: false,
      description: "Verified event partners",
      icon: <Building2 size={24} />,
    },


    {
      title: "Pending Approvals",
      value: 14,
      currency: false,
      description: "Vendor requests waiting",
      icon: <Clock3 size={24} />,
    },

  ];



  return (

    <div className="overview-cards">


      {cards.map((card, index) => (


        <div
          className="overview-card"
          key={index}
        >


          <div className="overview-icon">

            {card.icon}

          </div>



          <div className="overview-content">


            <p>
              {card.title}
            </p>



            <h2>

              <AnimatedNumber
                value={card.value}
                currency={card.currency}
              />

            </h2>



            <span>
              {card.description}
            </span>


          </div>


        </div>


      ))}


    </div>

  );

};


export default OverviewCards;