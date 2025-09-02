import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../../../supabase-client";
import "./Signin.css"; // Import the CSS file

const Signin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (isRegister) {
      // ✅ Register new user
      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      setSuccess("Account created! Please check your email to confirm.");
      setIsRegister(false);
      setEmail("");
      setPassword("");
    } else {
      // ✅ Sign In existing user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return;
      }

      // Fetch user profile to check if admin
      const userId = signInData.user.id;
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userId)
        .single();

      if (profileError) {
        setError("Failed to fetch profile info.");
        setIsLoading(false);
        return;
      }

      // Determine redirect after login
      const state = location.state || {};
      const buyNowItem = state.buyNowItem; // selected item from Buy Now
      const redirectTo = state.redirectTo || (profile.is_admin ? "/admin" : "/user-cart");

      if (profile.is_admin) {
        navigate("/admin");
      } else if (buyNowItem) {
        // Go to checkout with selected item
        navigate("/checkout", { state: { buyNowItem } });
      } else {
        // Default redirect for normal users
        navigate(redirectTo);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="signin-page">
      <form onSubmit={handleAuth} className="signin-form">
        <h3 className="signin-title">{isRegister ? "Create Account" : "Welcome Back"}</h3>
        <p className="signin-subtitle">
          {isRegister
            ? "Sign up to get started with your account"
            : "Sign in to your account to continue"}
        </p>

        {success && <div className="success-message"><span>✅</span> {success}</div>}
        {error && <div className="error-message"><span>⚠️</span> {error}</div>}

        <div className="form-group">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`form-input ${error && email === "" ? "error" : ""}`}
          />
          <div className="input-icon">📧</div>
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`form-input ${error && password === "" ? "error" : ""}`}
          />
          <div className="input-icon">🔒</div>
        </div>

        <button
          type="submit"
          className={`submit-btn ${isLoading ? "loading" : ""}`}
          disabled={isLoading}
        >
          {isLoading
            ? isRegister
              ? "Creating Account..."
              : "Signing In..."
            : isRegister
            ? "Create Account"
            : "Sign In"}
        </button>

        <div className="toggle-section">
          <p className="toggle-text">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setSuccess("");
              setEmail("");
              setPassword("");
            }}
            className="toggle-btn"
          >
            {isRegister ? "Sign In Instead" : "Create Account"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signin;
