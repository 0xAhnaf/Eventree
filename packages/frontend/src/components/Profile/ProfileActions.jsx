import React from "react";
import "./ProfileActions.css";

const ProfileActions = () => {
  const handleChangePassword = () => {
    console.log("Change password clicked");
  };

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
  };

  return (
    <div className="profile-actions">
      <button className="change-password-btn" onClick={handleChangePassword}>
        <span>🔒</span>
        Change Password
      </button>

      <button className="edit-profile-btn" onClick={handleEditProfile}>
        <span>✎</span>
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileActions;
