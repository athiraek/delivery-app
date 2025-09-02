import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHero.css";

export default function AdminHero() {
  const navigate = useNavigate();

  return (
    <div className="hero-container">
      {/* Background Elements */}
      <div className="hero-bg-pattern"></div>
      <div className="hero-bg-gradient-1"></div>
      <div className="hero-bg-gradient-2"></div>

      {/* Hero Content */}
      <div className="hero-content">
        <div className="hero-text-section">
          <h2 className="hero-title">Dashboard Overview</h2>
          <p className="hero-description">
            Monitor your food delivery platform in real-time. Track orders,
            manage drivers, and optimize operations from your central command
            center.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="actions-grid">
          <div className="action-card">
            <h3 className="action-title">View Menu</h3>
            <p className="action-description">
              Browse all restaurant menus, check item availability, and manage
              menu visibility settings.
            </p>
            <button
              className="action-button blue"
              onClick={() => navigate("/AdminMenuList")}
            >
              View Menu →
            </button>
          </div>

          <div className="action-card">
            <h3 className="action-title">Add Menu</h3>
            <p className="action-description">
              Add new menu items, set prices, upload images, and configure item
              details for restaurants.
            </p>
            <button
              className="action-button green"
              onClick={() => navigate("/AdminMenuAdd")}
            >
              Add Menu →
            </button>
          </div>

          <div className="action-card">
            <h3 className="action-title">View Orders</h3>
            <p className="action-description">
              Monitor all incoming orders, track delivery status, and manage
              order fulfillment processes.
            </p>
            <button
              className="action-button purple"
              onClick={() => navigate("/AdminOrder")}
            >
              View Orders →
            </button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="floating-element floating-1"></div>
      <div className="floating-element floating-2"></div>
      <div className="floating-element floating-3"></div>
    </div>
  );
}
