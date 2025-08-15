import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LoginModal from '../LoginModal.jsx';
import SignupModal from './SignupModal.jsx';

function Navbar() {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Check if user is logged in on component mount
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Scroll visibility effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
    // Save username for display
    if (userData && userData.name) {
      setUsername(userData.name);
      localStorage.setItem('username', userData.name);
    }
    // Redirect recipient to dashboard
    // Redirect admin email to calendar
    if (userData && userData.email === 'admin@sharingexcess.com') {
      navigate('/calendar');
    } else if (userData && userData.role === 'recipient') {
      navigate('/recipient-dashboard');
    } else if (userData && userData.role === 'donor') {
      navigate('/donor-dashboard');
    }
  };

  const handleSignupSuccess = (userData) => {
    setUser(userData);
    closeSignupModal();
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg navbar-light custom-navbar ${isVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
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
                <Link className="nav-link" to="/ngos">
                  <span className="nav-text">NGOs</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/calendar">
                  <span className="nav-text">Calendar</span>
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="aboutContactDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="nav-text">About & Contact</span>
                </a>
                <ul className="dropdown-menu custom-dropdown" aria-labelledby="aboutContactDropdown">
                  <li>
                    <Link className="dropdown-item dropdown-item-enhanced" to="/about">
                      <span className="dropdown-item-icon">ℹ️</span>
                      <span className="dropdown-item-text">
                        <span className="dropdown-item-title">About Us</span>
                        <span className="dropdown-item-subtitle">Learn about our mission</span>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item dropdown-item-enhanced" to="/contact">
                      <span className="dropdown-item-icon">✉️</span>
                      <span className="dropdown-item-text">
                        <span className="dropdown-item-title">Contact Us</span>
                        <span className="dropdown-item-subtitle">Get in touch with our team</span>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item dropdown-item-enhanced" to="/support-us">
                      <span className="dropdown-item-icon">💚</span>
                      <span className="dropdown-item-text">
                        <span className="dropdown-item-title">Support Us</span>
                        <span className="dropdown-item-subtitle">Donate, volunteer, partner</span>
                      </span>
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
            <div className="navbar-nav">
              {user ? (
                // User is logged in - show user info and logout button
                <div className="user-section">
                  <div className="user-info">
                    {user && user.email === 'admin@sharingexcess.com' ? (
  <span className="user-name" style={{ fontSize: '1.3rem', fontWeight: 700, display: 'block', lineHeight: 1.1 }}>
    Admin Account
  </span>
) : user && user.role === 'admin' ? (
  <span className="user-name" style={{ fontSize: '1.3rem', fontWeight: 700, display: 'block', lineHeight: 1.1 }}>
    Admin
  </span>
) : (
  <span className="user-name" style={{ fontSize: '1.3rem', fontWeight: 700, display: 'block', lineHeight: 1.1 }}>
    Hello, {(user && user.name) || username || 'User'}
    {user && user.role && (
      <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 400, color: '#eaffea', marginTop: 2 }}>
        ({user.role})
      </span>
    )}
  </span>
)}
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