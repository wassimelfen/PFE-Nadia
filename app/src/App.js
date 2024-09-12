import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import CNavbar from "./components/Navbar.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Dashboard from "./pages/Dashboard.js";
import Tickets from "./pages/Tickets.js";
import { AuthProvider } from "./context/AuthContext.js";
import AuthContext from "./context/AuthContext.js";
import AdminLogin from "./pages/AdminLogin.js";
import AdminDashboard from "./pages/AdminDashboard.js";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <CNavbar />
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/tickets"
              element={
                <PrivateRoute>
                  <CNavbar />
                  <Tickets />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

// verifier si token existe ou non
const PrivateRoute = ({ children }) => {
  const { auth } = React.useContext(AuthContext);
  return auth ? children : <Navigate to="/login" />;
};

export default App;
