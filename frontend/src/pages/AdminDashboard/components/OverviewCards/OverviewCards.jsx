import React, { useEffect, useState } from "react";
import {
  IndianRupee,
  CalendarCheck,
  Building2,
  Clock3,
} from "lucide-react";

import "./OverviewCards.css";


const AnimatedNumber = ({ value, prefix = "" }) => {

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
      {prefix}
      {count.toLocaleString()}
    </>

  );

};



const OverviewCards = () => {


  const cards = [

    {
      title: "Total Revenue",
      value: 428930,
      prefix: "৳",
      description: "Overall platform earnings",
      icon: <IndianRupee size={24} />,
    },


    {
      title: "Total Bookings",
      value: 1248,
      description: "Successful event bookings",
      icon: <CalendarCheck size={24} />,
    },


    {
      title: "Active Vendors",
      value: 248,
      description: "Verified event partners",
      icon: <Building2 size={24} />,
    },


    {
      title: "Pending Approvals",
      value: 14,
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
                prefix={card.prefix}
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