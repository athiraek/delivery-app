import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../supabase-client";
import "./UserNavbar.css";

const UserNavbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUser(user);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("name, is_admin")
        .eq("id", user.id)
        .single();

      if (!error) setProfile(profile);
    }
  }

  const handleProfileClick = () => {
    setShowProfile((prev) => !prev);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; // redirect to home
  };

  return (
    <nav className="user-navbar">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / Home */}


        {/* Nav Links */}
        <ul className="flex items-center gap-4">
          <li>
            <Link to="/user-dashboard">Home</Link>
          </li>
          <li>
            <Link to="/user-menu">Menu</Link>
          </li>
          <li>
            <Link to="/user/orders">My Orders</Link>
          </li>
          <li>
            <Link to="/user-cart">Cart</Link>
          </li>

          {/* Profile Icon */}
          <li className="relative">
            <button onClick={handleProfileClick} className="user-profile-btn">
              👤
            </button>

            {showProfile && (
              <div className="user-profile-dropdown">
                {profile ? (
                  <>
                    <p className="user-profile-name">{profile.name}</p>
                    <p className="user-profile-email">{user?.email}</p>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
                <hr />
                <button onClick={handleLogout} className="user-logout-btn">
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default UserNavbar;
