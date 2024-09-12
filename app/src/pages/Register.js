/** @format */

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext.js";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        password,
      });
      console.log(response.data);
      if (response.status === 201) {
        const token = response.data.token;
        console.log(token);
        login(token);
        navigate("/dashboard");
      } else {
        console.error("Registration failed:", response.data);
        setErrorMessage("Registration failed. Please try again.");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage(
        "Failed to connect to the server. Please try again later."
      );
      setShowErrorModal(true);
    }
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div>
      <div className='background'></div>
      <form onSubmit={handleRegister}>
        <h3>Register Here</h3>

        <label htmlFor='username'>Username</label>
        <input
          type='text'
          placeholder='Username'
          id='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor='password'>Password</label>
        <input
          type='password'
          placeholder='Password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit' className='login'>
          Register
        </button>
        <button type='button' className='register' onClick={redirectToLogin}>
          Log In
        </button>
      </form>
      <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={redirectToLogin}>
            Login
          </Button>
          <Button variant='secondary' onClick={handleCloseErrorModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Register;
