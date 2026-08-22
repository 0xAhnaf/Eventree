import React from "react";
import ProfileSidebar from "../../components/Profile/ProfileSidebar";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileInfo from "../../components/Profile/ProfileInfo";

import ProfileActions from "../../components/Profile/ProfileActions";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./ProfilePage.css";

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-layout">
        <ProfileSidebar />

        <main className="profile-main">
          <div className="profile-content">
            <ProfileHeader />

            <section className="profile-card">
              <ProfileInfo />

              <ProfileActions />
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
