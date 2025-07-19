import React, { useState, useEffect } from 'react';

function RecipientDashboard() {
  const [foodListings, setFoodListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFoodListings();
  }, []);

  const fetchFoodListings = async () => {
    try {
      const response = await fetch('http://localhost/Sharing%20Excess/backend/get_listings.php');
      const data = await response.json();
      
      if (data.success) {
        setFoodListings(data.listings);
      } else {
        setError(data.message || 'Failed to fetch food listings');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestFood = async (listingId, foodName) => {
    try {
      const response = await fetch('http://localhost/Sharing%20Excess/backend/request_food.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listing_id: listingId,
          food_name: foodName,
          quantity: 'As needed',
          needed_by: new Date().toISOString().split('T')[0],
          location: 'Colombo'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Food request submitted successfully!');
        fetchFoodListings(); // Refresh the listings
      } else {
        alert(data.message || 'Failed to submit request');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{
        backgroundImage: "url(/background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh"
      }}>
        <h2 style={{ 
          color: '#000', 
          textShadow: '2px 2px 8px rgba(255,255,255,0.8)', 
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '2.5rem',
          fontWeight: '900',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          Available Food Listings
        </h2>
        <div className="loading" style={{ 
          textAlign: 'center', 
          color: '#000', 
          fontSize: '1.2rem', 
          padding: '40px',
          fontFamily: "'Montserrat', sans-serif",
          textShadow: '1px 1px 6px rgba(255,255,255,0.8)'
        }}>
          Loading food listings...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container" style={{
        backgroundImage: "url(/background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh"
      }}>
        <h2 style={{ 
          color: '#000', 
          textShadow: '2px 2px 8px rgba(255,255,255,0.8)', 
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '2.5rem',
          fontWeight: '900',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          Available Food Listings
        </h2>
        <div className="error-message" style={{ 
          textAlign: 'center', 
          color: '#dc3545', 
          background: 'rgba(255, 255, 255, 0.9)', 
          padding: '20px', 
          borderRadius: '12px', 
          border: '1px solid #fed7d7', 
          margin: '20px',
          fontSize: '1.1rem',
          fontFamily: "'Montserrat', sans-serif"
        }}>
          {error}
        </div>
        <button onClick={fetchFoodListings} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{
      backgroundImage: "url(/background.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "100vh"
    }}>
      <h2 style={{ 
        color: '#000', 
        textShadow: '2px 2px 8px rgba(255,255,255,0.8)', 
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '2.5rem',
        fontWeight: '900',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        Available Food Listings
      </h2>
      <div className="dashboard-header">
        <p style={{ 
          color: '#000', 
          textShadow: '1px 1px 6px rgba(255,255,255,0.8)', 
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '1.1rem',
          margin: 0
        }}>
          Browse available food donations from generous donors
        </p>
        <button onClick={fetchFoodListings} className="refresh-btn">
          <span>🔄</span> Refresh
        </button>
      </div>
      
      {foodListings.length === 0 ? (
        <div className="no-requests" style={{ 
          background: 'rgba(255, 255, 255, 0.9)', 
          borderRadius: '12px', 
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', 
          margin: '20px',
          padding: '40px',
          textAlign: 'center',
          color: '#000',
          fontFamily: "'Montserrat', sans-serif"
        }}>
          <p style={{ margin: '10px 0', fontSize: '1.1rem', color: '#000', fontFamily: "'Montserrat', sans-serif" }}>
            No food listings available at the moment.
          </p>
          <p style={{ margin: '10px 0', fontSize: '1.1rem', color: '#000', fontFamily: "'Montserrat', sans-serif" }}>
            Check back later for new donations.
          </p>
        </div>
      ) : (
        <div className="dashboard-listings">
          {foodListings.map((listing) => (
            <div key={listing.id} className="dashboard-card" style={{ 
              background: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: '16px', 
              padding: '1.5rem', 
              marginBottom: '1.5rem', 
              boxShadow: '0 4px 24px rgba(40, 167, 69, 0.10)',
              border: '1px solid rgba(40, 167, 69, 0.2)',
              fontFamily: "'Montserrat', sans-serif"
            }}>
              <div className="food-header">
                <strong className="food-name" style={{ color: '#000', fontFamily: "'Montserrat', sans-serif", fontSize: '1.2rem' }}>{listing.food_name}</strong>
                <span className="quantity-badge" style={{ color: '#28a745', background: 'rgba(40, 167, 69, 0.12)', fontWeight: 700 }}>{listing.quantity}</span>
              </div>
              <div className="food-details">
                <div className="detail-item"><span className="detail-label" style={{ color: '#000', fontWeight: 600 }}>🏪 Donated by:</span> <span className="detail-value" style={{ color: '#000' }}>{listing.donor_name}</span></div>
                <div className="detail-item"><span className="detail-label" style={{ color: '#000', fontWeight: 600 }}>📅 Expires:</span> <span className="detail-value" style={{ color: '#000' }}>{listing.expiry_date}</span></div>
                <div className="detail-item"><span className="detail-label" style={{ color: '#000', fontWeight: 600 }}>📍 Location:</span> <span className="detail-value" style={{ color: '#000' }}>{listing.location}</span></div>
                <div className="detail-item"><span className="detail-label" style={{ color: '#000', fontWeight: 600 }}>📅 Listed:</span> <span className="detail-value" style={{ color: '#000' }}>{new Date(listing.created_at).toLocaleDateString()}</span></div>
              </div>
              <div className="listing-actions">
                <button 
                  onClick={() => handleRequestFood(listing.id, listing.food_name)}
                  className="request-btn"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  📝 Request Food
                </button>
                <button 
                  onClick={() => window.open(`https://maps.google.com/?q=${listing.location}`, '_blank')}
                  className="location-btn"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  🗺️ View Location
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipientDashboard; 