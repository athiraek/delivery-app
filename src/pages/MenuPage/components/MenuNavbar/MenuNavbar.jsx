import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "./../../../HomePage/Components/Signin/AuthModal";
import "./MenuNavbar.css";

function MenuNavbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="menu-navbar-container">
        <div className="menu-navbar-content">
          {/* Brand */}
          <Link to="/" className="menu-navbar-brand">
            Home
          </Link>

          {/* Toggle button for mobile */}
          <button
            className="menu-navbar-toggle"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>

          {/* Navbar links */}
          <div className={`menu-navbar-links ${isOpen ? "open" : ""}`}>
            <Link to="/Menu" className="menu-navbar-nav-link">
              Menu
            </Link>
            <Link to="/cart" className="menu-navbar-nav-link">
              Cart
            </Link>
            <button
              onClick={() => setShowLogin(true)}
              className="menu-navbar-nav-link menu-navbar-signin-btn"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {showLogin && <AuthModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default MenuNavbar;
