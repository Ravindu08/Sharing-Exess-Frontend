import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeSlideshow from './components/HomeSlideshow';

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
    <div className="home-bg-wrapper" style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundImage: 'url(/background.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      {/* Removed dark overlay */}
      <div className="home-bg-overlay" style={{ position: 'relative', zIndex: 2 }} />
      <div className="home-options-container" style={{ position: 'relative', zIndex: 3 }}>
        <h1 className="home-hero-title">
          Reduce Food Waste.<br />
          Feed the Hungry.
        </h1>
        <p className="home-hero-subtitle">
          Connecting donors and NGOs to ensure excess food reaches those who need it most.
        </p>
        <HomeSlideshow />
        <div className="home-divider" />
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
                  <span className="option-text" style={{color: '#fff'}}>Donate Food</span>
                  <span className="option-subtitle" style={{color: '#fff'}}>List available food items</span>
                </>
              ) : (
                <>
                  <span className="option-icon">🍽️</span>
                  <span className="option-text" style={{color: '#fff'}}>I want to Donate</span>
                  <span className="option-subtitle" style={{color: '#fff'}}>Share excess food with those in need</span>
                </>
              )}
            </button>
            <button className="home-option receive" onClick={handleReceiveClick}>
              {user ? (
                <>
                  <span className="option-icon">📦</span>
                  <span className="option-text" style={{color: '#fff'}}>Browse Food</span>
                  <span className="option-subtitle" style={{color: '#fff'}}>View available donations</span>
                </>
              ) : (
                <>
                  <span className="option-icon">📦</span>
                  <span className="option-text" style={{color: '#fff'}}>I want to Receive</span>
                  <span className="option-subtitle" style={{color: '#fff'}}>Find food donations in your area</span>
                </>
              )}
            </button>
          </div>
          {user && (
            <div className="user-role-info">
              <p className="role-info-text" style={{color: '#fff'}}>
                You're logged in as a <strong>{user.role}</strong>. 
                You can access both donation and receiving features.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home; 