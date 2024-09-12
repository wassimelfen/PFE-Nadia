import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminLogin.css"; 

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/admin", {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        navigate("/admindashboard");
      }
    } catch (error) {
      setErrorMessage("Invalid credentials or server error.");
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-background"></div>
      <div className="admin-login-form">
        <h2>Admin Login</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-control"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
        />
        <button onClick={handleLogin} className="admin-login-btn">
          Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
