/** @format */

import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    
    //creer les CDN
    const preconnectLink = document.createElement("link");
    preconnectLink.rel = "preconnect";
    preconnectLink.href = "https://fonts.gstatic.com";

    const fontAwesomeLink = document.createElement("link");
    fontAwesomeLink.rel = "stylesheet";
    fontAwesomeLink.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";

    const googleFontsLink = document.createElement("link");
    googleFontsLink.rel = "stylesheet";
    googleFontsLink.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;600&display=swap";

    
    document.head.appendChild(preconnectLink);
    document.head.appendChild(fontAwesomeLink);
    document.head.appendChild(googleFontsLink);

    
    return () => {
      document.head.removeChild(preconnectLink);
      document.head.removeChild(fontAwesomeLink);
      document.head.removeChild(googleFontsLink);
    };
  }, []);

// fonction pour le login
  const handleLogin = async (e) => {
    e.preventDefault(); 
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      const token = response.data.token;//prendre le token du backend
      login(token);//enregister le token
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(
        "Failed to connect to the server. Please try again later."
      );
      setShowErrorModal(true);
    }
  };

  //redirectionner vers la page register
  const redirectToRegister = () => {
    navigate("/register");
  };

  //desactiver le modal d'erreur
  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div>
      <div className="background">
      </div>
      <form onSubmit={handleLogin}> 
        <h3>Login Here</h3>

        <label htmlFor="username">Username</label>
        <input 
          type="text" 
          placeholder="Username" 
          id="username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="login"> 
          Log In
        </button>
        <button type="button" className="register" onClick={redirectToRegister}> 
          Register
        </button>
      </form>
      <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={redirectToRegister}>
            Register
          </Button>
          <Button variant="secondary" onClick={handleCloseErrorModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
