import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeSlideshow from './components/HomeSlideshow';
import './HomeCustom.css';
import ImpactSection from './components/ImpactSection';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleDonateClick = () => {
    if (user) {
      // User is logged in - go to donor dashboard
      navigate('/donor-dashboard');
    } else {
      // User is not logged in - show login modal or redirect to signup
      navigate('/donor-dashboard');
    }
  };

  const handleReceiveClick = () => {
    if (user) {
      // User is logged in - go to recipient dashboard
      navigate('/recipient-dashboard');
    } else {
      // User is not logged in - show login modal or redirect to signup
      navigate('/recipient-dashboard');
    }
  };

  return (
    <div>
      <div className="home-bg-wrapper">
        {/* Removed dark overlay */}
        <div className="home-bg-overlay" style={{ position: 'relative', zIndex: 2 }} />
        <div className="home-options-center-area" style={{ position: 'relative', zIndex: 3 }}>
          <h1 className="home-hero-title">
            Reduce Food Waste.<br />
            Feed the Hungry.
          </h1>
          <p className="home-hero-subtitle">
            Connecting donors and NGOs to ensure excess food reaches those who need it most.
          </p>
          <div className="home-options-black-box">
            <div className="home-end-options">
            <h2 className="home-end-title">
              {user ? (
                <>
                  Welcome back, {user.name}!<br />
                  What would you like to do today?
                </>
              ) : (
                "Are you looking to donate or receive?"
              )}
            </h2>
            <div className="home-options">
              <button className="home-option donate" onClick={handleDonateClick}>
                {user ? (
                  <>
                    <span className="option-icon">🍽️</span>
                    <span className="option-text">Donate Food</span>
                    <span className="option-subtitle">List available food items</span>
                  </>
                ) : (
                  <>
                    <span className="option-icon">🍽️</span>
                    <span className="option-text">I want to Donate</span>
                    <span className="option-subtitle">Share excess food with those in need</span>
                  </>
                )}
              </button>
              <button className="home-option receive" onClick={handleReceiveClick}>
                {user ? (
                  <>
                    <span className="option-icon">📦</span>
                    <span className="option-text">Browse Food</span>
                    <span className="option-subtitle">View available donations</span>
                  </>
                ) : (
                  <>
                    <span className="option-icon">📦</span>
                    <span className="option-text">I want to Receive</span>
                    <span className="option-subtitle">Find food donations in your area</span>
                  </>
                )}
              </button>
            </div>
            {user && (
                <div className="user-role-info">
                <p className="role-info-text">
                  You're logged in as a <strong>{user.role}</strong>. 
                  You can access both donation and receiving features.
                </p>
              </div>
            )}
          </div>
          </div>
        </div>
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
          <div className="home-slideshow-smaller">
            <HomeSlideshow />
          </div>
        </div>
      </div>
      <ImpactSection />
    </div>
  );
}

export default Home;