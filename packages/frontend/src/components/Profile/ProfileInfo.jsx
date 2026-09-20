import React, { useRef } from "react";
import "./ProfileInfo.css";

const ProfileInfo = ({ data, isEditing, onChange, onImageUpload }) => {
  const fileInputRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="profile-info">
      <div className="profile-user">
        <div
          className={`profile-avatar-container ${isEditing ? "editable" : ""}`}
          onClick={handleAvatarClick}
        >
          {data.profile_image_url ? (
            <img
              src={data.profile_image_url}
              alt={data.name}
              className="profile-avatar-img"
            />
          ) : (
            <div className="profile-avatar2">{getInitials(data.name)}</div>
          )}

          {isEditing && (
            <div className="avatar-hover-overlay">
              <span>📷 Change PFP</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                style={{ display: "none" }}
              />
            </div>
          )}
        </div>

        <div className="profile-user-details">
          <h2>{data.name || "User"}</h2>
          <p>
            <span>✉</span>
            {data.email}
          </p>
        </div>
      </div>

      <div className="profile-fields">
        <ProfileField
          label="Full Name"
          name="name"
          value={data.name}
          isEditing={isEditing}
          onChange={onChange}
        />
        <ProfileField
          label="Email Address"
          name="email"
          value={data.email}
          isEditing={false}
        />
        <ProfileField
          label="Phone Number"
          name="phone"
          value={data.phone}
          isEditing={isEditing}
          onChange={onChange}
        />
        <ProfileField
          label="City"
          name="city"
          value={data.city}
          isEditing={isEditing}
          onChange={onChange}
        />
        <ProfileField
          label="Address"
          name="address"
          value={data.address}
          isEditing={isEditing}
          onChange={onChange}
          fullWidth
        />
      </div>
    </div>
  );
};

const ProfileField = ({ label, name, value, isEditing, onChange, fullWidth }) => {
  return (
    <div className={`profile-field ${fullWidth ? "profile-field-full" : ""}`}>
      <label>{label}</label>
      {isEditing && name !== "email" ? (
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={onChange}
          className="profile-input"
        />
      ) : (
        <div className="profile-field-value">{value || "N/A"}</div>
      )}
    </div>
  );
};

export default ProfileInfo;