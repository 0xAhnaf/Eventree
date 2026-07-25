import React from "react";
import { Bell, Search } from "lucide-react";

import "./DashboardHeader.css";


const DashboardHeader = () => {

  return (

    <header className="dashboard-header">


      {/* Left Section */}

      <div className="dashboard-header-title">

        <h1>
          Dashboard Overview
        </h1>

        <p>
          Welcome back, Admin. Here's what's happening with EVENTREE today.
        </p>

      </div>



      {/* Right Section */}

      <div className="dashboard-header-actions">


        <div className="dashboard-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search..."
          />

        </div>



        <button className="notification-btn">

          <Bell size={20} />

          <span className="notification-dot"></span>

        </button>



        <div className="admin-profile">

          <div className="admin-avatar">
            A
          </div>


          <div className="admin-info">

            <h4>
              Admin
            </h4>

            <p>
              EVENTREE
            </p>

          </div>

        </div>


      </div>


    </header>

  );

};


export default DashboardHeader;