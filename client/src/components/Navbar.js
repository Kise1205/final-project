import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">🍎 Calorie Tracker</Link>
        <div className="navbar-nav ms-auto">
          {user ? (
            <>
              {user.role === 'admin' && <Link className="nav-link" to="/admin">Admin</Link>}
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
              <button className="btn btn-outline-light ms-3" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;