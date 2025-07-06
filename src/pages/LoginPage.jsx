// In LoginPage.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContextContext";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import "../styling/Login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setToken } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthSuccess = (data) => {
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      // Check for role and redirect accordingly
      // Support both 'role' and 'roles' (array or string)
      let isAdmin = false;
      if (data.user.role) {
        isAdmin = typeof data.user.role === 'string' && data.user.role.toLowerCase() === "admin";
      } else if (Array.isArray(data.user.roles)) {
        isAdmin = data.user.roles.some(r => typeof r === 'string' && r.toLowerCase() === "admin");
      }
      if (isAdmin) {
        navigate("/admin", { replace: true });
      } else {
        const redirectTo = location.state?.from?.pathname || "/";
        navigate(redirectTo, { replace: true });
      }
    } else {
      setError("Login successful, but authentication data is incomplete.");
      console.error('Incomplete data from backend:', data);
    }
  };

  const validate = () => {
    if (!email) return "Email is required";
    if (!password) return "Password is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
        // This remains correct, pointing to AuthController
        const res = await fetch("https://localhost:7216/api/Auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        let data = null;
        const text = await res.text();
        if (text) {
          data = JSON.parse(text);
        }
        if (!res.ok) {
          const errorMessage = (data && (data.message || data.error || data.title)) || "Login failed";
          throw new Error(errorMessage);
        }
        handleAuthSuccess(data);
    } catch (err) {
      setError(err.message || "A network error occurred.");
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);
    const idToken = credentialResponse.credential;
    if (!idToken) {
      setError("Google sign-in did not return a valid credential.");
      setLoading(false);
      return;
    }
    try {
        // CORRECTION: Update this URL to point to the GoogleAuthController
        const res = await fetch("https://localhost:7216/api/GoogleAuth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
        });
        let data = null;
        const text = await res.text();
        if (text) {
          data = JSON.parse(text);
        }
        if (!res.ok) {
          const errorMessage = (data && (data.message || data.error)) || "Google sign-in failed.";
          throw new Error(errorMessage);
        }
        handleAuthSuccess(data);
    } catch (err) {
      setError(err.message || "Network error during Google sign-in.");
      console.error('Google sign-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (err) => {
    if (!loading) {
       setError("Google login failed or was cancelled.");
    }
    console.error("Google Login Error:", err)
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} noValidate>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      </form>
      <div className="google-login-container">
        <p className="or-divider"><span>OR</span></p>
        <div style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
            />
        </div>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default LoginPage;