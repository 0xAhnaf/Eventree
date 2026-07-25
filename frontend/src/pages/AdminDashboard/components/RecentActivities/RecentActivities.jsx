import React from "react";
import {
  UserPlus,
  CalendarCheck,
  CreditCard,
  Star,
} from "lucide-react";

import "./RecentActivities.css";


const RecentActivities = () => {


  const activities = [

    {
      title: "New vendor registered",
      description: "Elegant Moments Studio joined EVENTREE",
      time: "10 minutes ago",
      icon: <UserPlus size={18} />,
    },


    {
      title: "Booking confirmed",
      description: "Wedding event booking approved",
      time: "35 minutes ago",
      icon: <CalendarCheck size={18} />,
    },


    {
      title: "Payment released",
      description: "Vendor payout successfully processed",
      time: "1 hour ago",
      icon: <CreditCard size={18} />,
    },


    {
      title: "New review submitted",
      description: "Client rated a vendor 5 stars",
      time: "2 hours ago",
      icon: <Star size={18} />,
    },

  ];



  return (

    <div className="recent-activities">


      <div className="recent-activities-header">

        <h3>
          Recent Activities
        </h3>

        <p>
          Latest platform updates
        </p>

      </div>



      <div className="activity-timeline">


        {activities.map((activity, index) => (

          <div
            className="activity-item"
            key={index}
          >


            <div className="activity-icon">

              {activity.icon}

            </div>



            <div className="activity-details">

              <h4>
                {activity.title}
              </h4>


              <p>
                {activity.description}
              </p>


              <span>
                {activity.time}
              </span>


            </div>


          </div>

        ))}


      </div>


    </div>

  );

};


export default RecentActivities;