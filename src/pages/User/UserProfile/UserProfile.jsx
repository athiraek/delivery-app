// src/components/UserProfileCard.js
import React from "react";
import "./UserProfile.css";

const UserProfile = ({ user, profile, onLogout }) => {
  if (!profile) return null; // don't render if profile not loaded

  return (
    <div className="user-profile-card">
      <h2 className="user-profile-title">Profile</h2>
      <p><strong>Name:</strong> {profile.name || "N/A"}</p>
      <p><strong>Email:</strong> {user?.email || "N/A"}</p>

      <button
        onClick={onLogout}
        className="user-profile-logout-btn"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
