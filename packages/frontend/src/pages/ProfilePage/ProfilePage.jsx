import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerDashboardLayout } from "../../components/CustomerDashboard";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileInfo from "../../components/Profile/ProfileInfo";
import ProfileActions from "../../components/Profile/ProfileActions";
import { useAuth } from "../../context/AuthContext";
import "./ProfilePage.css";


const CLOUDINARY_UPLOAD_PRESET = "ml_default";
const CLOUDINARY_CLOUD_NAME = "ui3ge2ze";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    profile_image_url: "",
    profile_image_public_id: "",
  });

  const token = localStorage.getItem("eventree_token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/customer-profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        const fetchedData = {
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          city: data.profile?.city || "",
          address: data.profile?.address || "",
          profile_image_url: data.profile?.profile_image_url || "",
          profile_image_public_id: data.profile?.profile_image_public_id || "",
        };
        setFormData(fetchedData);

        // Keep local context state synchronized on initial load
        updateUser({
          ...data.user,
          profile_image_url: data.profile?.profile_image_url,
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/customer-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          city: data.profile?.city || "",
          address: data.profile?.address || "",
          profile_image_url: data.profile?.profile_image_url || "",
          profile_image_public_id: data.profile?.profile_image_public_id || "",
        });

        // Update global AuthContext state globally
        updateUser({
          ...data.user,
          profile_image_url: data.profile?.profile_image_url,
        });

        setIsEditing(false);
      } else {
        if (data.errors) {
          const firstErrorMessage = Object.values(data.errors)[0]?.[0];
          alert(firstErrorMessage || "Validation failed.");
        } else {
          alert(data.message || "Failed to update profile.");
        }
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Could not connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (CLOUDINARY_UPLOAD_PRESET === "YOUR_UNSIGNED_PRESET_HERE") {
      alert("Please set your Cloudinary unsigned preset name in ProfilePage.jsx first!");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: uploadData }
      );
      const data = await res.json();

      if (res.ok && data.secure_url) {
        setFormData((prev) => ({
          ...prev,
          profile_image_url: data.secure_url,
          profile_image_public_id: data.public_id,
        }));
      } else {
        console.error("Cloudinary Error:", data);
        alert(`Upload failed: ${data.error?.message || "Check preset configuration"}`);
      }
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <CustomerDashboardLayout className="profile-page" contentClassName="profile-main">
      <div className="profile-content">
        <ProfileHeader />
        <section className="profile-card">
          <ProfileInfo
            data={formData}
            isEditing={isEditing}
            onChange={handleChange}
            onImageUpload={handleImageUpload}
          />
          <ProfileActions
            isEditing={isEditing}
            saving={saving}
            onEdit={() => setIsEditing(true)}
            onCancel={() => setIsEditing(false)}
            onSave={handleSave}
            onChangePassword={() => navigate("/forgot-password")}
          />
        </section>
      </div>
    </CustomerDashboardLayout>
  );
};

export default ProfilePage;