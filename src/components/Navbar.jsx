import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../LoginModal.jsx';
import SignupModal from './SignupModal.jsx';

function Navbar() {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLoginClick = (e) => {
    e.preventDefault();
    setIsLoginModalOpen(true);
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    setIsSignupModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    
    // Redirect to home page and refresh
    navigate('/');
    window.location.reload();
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    closeLoginModal();
  };

  const handleSignupSuccess = (userData) => {
    setUser(userData);
    closeSignupModal();
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
        <div className="container-fluid px-4">
          <a className="navbar-brand" href="/">
            <span className="brand-text">Sharing Excess</span>
          </a>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  <span className="nav-text">Home</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/donate">
                  <span className="nav-text">Donate</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/ngos">
                  <span className="nav-text">NGOs</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contact">
                  <span className="nav-text">Contact</span>
                </a>
              </li>
            </ul>
            <div className="navbar-nav">
              {user ? (
                // User is logged in - show user info and logout button
                <div className="user-section">
                  <div className="user-info">
                    <span className="user-name">Hello, {user.name}</span>
                    <span className="user-role">({user.role})</span>
                  </div>
                  <button className="nav-link logout-btn" onClick={handleLogout}>
                    <span className="logout-text">Logout</span>
                  </button>
                </div>
              ) : (
                // User is not logged in - show login and signup buttons
                <>
                  <a className="nav-link signup-btn" href="#" onClick={handleSignupClick}>
                    <span className="signup-text">Sign Up</span>
                  </a>
                  <a className="nav-link login-btn" href="#" onClick={handleLoginClick}>
                    <span className="login-text">Login</span>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeLoginModal} 
        onSignupClick={handleSignupClick}
        onLoginSuccess={handleLoginSuccess}
      />
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={closeSignupModal}
        onSignupSuccess={handleSignupSuccess}
      />
    </>
  );
}

export default Navbar; 