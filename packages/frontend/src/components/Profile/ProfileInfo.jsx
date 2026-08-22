import React from "react";
import "./ProfileInfo.css";

const ProfileInfo = () => {
  const user = {
    name: "Kaushik Sarker",
    email: "kaushik.sarker@example.com",
    phone: "+1 (555) 123-4567",
    city: "San Francisco, CA",
    address: "123 Market Street, Suite 400",
  };

  return (
    <div className="profile-info">
      <div className="profile-user">
        <div className="profile-avatar2">KS</div>

        <div className="profile-user-details">
          <h2>{user.name}</h2>

          <p>
            <span>✉</span>
            {user.email}
          </p>
        </div>
      </div>

      <div className="profile-fields">
        <ProfileField label="Full Name" value={user.name} />

        <ProfileField label="Email Address" value={user.email} />

        <ProfileField label="Phone Number" value={user.phone} />

        <ProfileField label="City" value={user.city} />

        <ProfileField label="Address" value={user.address} fullWidth />
      </div>
    </div>
  );
};

const ProfileField = ({ label, value, fullWidth }) => {
  return (
    <div className={`profile-field ${fullWidth ? "profile-field-full" : ""}`}>
      <label>{label}</label>
      <div>{value}</div>
    </div>
  );
};

export default ProfileInfo;
