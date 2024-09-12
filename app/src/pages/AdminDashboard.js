import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", password: "" });
  const [editingUser, setEditingUser] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const addUser = async () => {
    try {
      await axios.post("http://localhost:5000/api/users", newUser);
      fetchUsers();
      setNewUser({ username: "", password: "" });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const updateUser = async () => {
    try {
      // Ensure the newUsername and password fields are correctly populated
      if (editingUser.username) {
        await axios.put(
          `http://localhost:5000/api/users/${editingUser.username}`, // Use backticks for template literals
          {
            newUsername: editingUser.newUsername || editingUser.username, // Update username if newUsername is provided
            password: editingUser.password,
          }
        );
        fetchUsers(); // Refresh the user list
        setEditingUser({ username: "", password: "" }); // Clear the form
      } else {
        console.error("No username provided for update.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (username) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${username}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const startEditingUser = async (user) => {
    try {
      // If the API returns the unhashed password, you can use that directly
      const response = await axios.get(
        `http://localhost:5000/api/users/${user.username}`
      );
      const unhashedUser = response.data;

      setEditingUser({
        username: unhashedUser.username,
        password: unhashedUser.password, // Ensure this is unhashed from the server
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>User Management</h1>
      <div className="user-form">
        <h2>{editingUser.username ? "Edit User" : "Add New User"}</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={editingUser.username || newUser.username} // Ensure value is defined
          onChange={editingUser.username ? handleEditChange : handleInputChange}
        />
        <div className="password-input-container">
          <input
            type={isPasswordVisible ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={editingUser.password || newUser.password}
            onChange={
              editingUser.username ? handleEditChange : handleInputChange
            }
          />
          <span
            className="password-toggle-icon"
            onClick={togglePasswordVisibility}
          >
            {isPasswordVisible ? "🙈" : "👁️"}
          </span>
        </div>

        <button onClick={editingUser.username ? updateUser : addUser}>
          {editingUser.username ? "Update User" : "Add User"}
        </button>
      </div>
      <div className="user-list">
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.username}>
              <span>{user.username}</span>
              <button onClick={() => setEditingUser(user)}>Edit</button>
              <button onClick={() => deleteUser(user.username)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
