import React from "react";
import "./ProfileActions.css";

const ProfileActions = ({
  isEditing,
  saving,
  onEdit,
  onCancel,
  onSave,
  onChangePassword,
}) => {
  return (
    <div className="profile-actions">
      {isEditing ? (
        <>
          <button
            className="cancel-btn"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="save-profile-btn"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </>
      ) : (
        <>
          <button className="change-password-btn" onClick={onChangePassword}>
            <span>🔒</span>
            Change Password
          </button>
          <button className="edit-profile-btn" onClick={onEdit}>
            <span>✎</span>
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
};

export default ProfileActions;