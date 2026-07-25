import React from "react";

import AdminSidebar from "./components/AdminSidebar/AdminSidebar";
import DashboardHeader from "./components/DashboardHeader/DashboardHeader";

import OverviewCards from "./components/OverviewCards/OverviewCards";
import RevenueChart from "./components/RevenueChart/RevenueChart";
import RecentActivities from "./components/RecentActivities/RecentActivities";
import VendorWatchlist from "./components/VendorWatchlist/VendorWatchlist";
import PaymentAlerts from "./components/PaymentAlerts/PaymentAlerts";

import "./AdminDashboard.css";


const AdminDashboard = () => {

  return (

    <div className="admin-dashboard">


      {/* Fixed Sidebar */}

      <AdminSidebar />



      {/* Dashboard Content */}

      <section className="admin-dashboard-content">


        {/* Top Header */}

        <DashboardHeader />



        {/* Statistics */}

        <section className="dashboard-section overview-section">

          <OverviewCards />

        </section>



        {/* Analytics Row */}

        <section className="dashboard-section dashboard-two-column">


          <div className="dashboard-main-card">

            <RevenueChart />

          </div>



          <div className="dashboard-side-card">

            <PaymentAlerts />

          </div>


        </section>




        {/* Activity + Vendors */}

        <section className="dashboard-section dashboard-two-column">


          <div className="dashboard-main-card">

            <RecentActivities />

          </div>



          <div className="dashboard-main-card">

            <VendorWatchlist />

          </div>


        </section>


      </section>


    </div>

  );

};


export default AdminDashboard;