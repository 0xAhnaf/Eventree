import React from "react";
import { CustomerDashboardLayout } from "../../components/CustomerDashboard";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileInfo from "../../components/Profile/ProfileInfo";
import ProfileActions from "../../components/Profile/ProfileActions";
import "./ProfilePage.css";

const ProfilePage = () => {
  return (
    <CustomerDashboardLayout
      className="profile-page"
      contentClassName="profile-main"
    >
      <div className="profile-content">
        <ProfileHeader />

        <section className="profile-card">
          <ProfileInfo />
          <ProfileActions />
        </section>
      </div>
    </CustomerDashboardLayout>
  );
};

export default ProfilePage;
