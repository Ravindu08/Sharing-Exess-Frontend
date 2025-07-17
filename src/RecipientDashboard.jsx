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
      <div className="dashboard-container">
        <h2>Available Food Listings</h2>
        <div className="loading">Loading food listings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h2>Available Food Listings</h2>
        <div className="error-message">{error}</div>
        <button onClick={fetchFoodListings} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2>Available Food Listings</h2>
      <div className="dashboard-header">
        <p>Browse available food donations from generous donors</p>
        <button onClick={fetchFoodListings} className="refresh-btn">
          <span>🔄</span> Refresh
        </button>
      </div>
      
      {foodListings.length === 0 ? (
        <div className="no-requests">
          <p>No food listings available at the moment.</p>
          <p>Check back later for new donations.</p>
        </div>
      ) : (
        <div className="dashboard-listings">
          {foodListings.map((listing) => (
            <div key={listing.id} className="dashboard-card">
              <div className="food-header">
                <strong className="food-name">{listing.food_name}</strong>
                <span className="quantity-badge">{listing.quantity}</span>
              </div>
              <div className="food-details">
                <div className="detail-item">
                  <span className="detail-label">🏪 Donated by:</span>
                  <span className="detail-value">{listing.donor_name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📅 Expires:</span>
                  <span className="detail-value">{listing.expiry_date}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📍 Location:</span>
                  <span className="detail-value">{listing.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📅 Listed:</span>
                  <span className="detail-value">{new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="listing-actions">
                <button 
                  onClick={() => handleRequestFood(listing.id, listing.food_name)}
                  className="request-btn"
                >
                  📝 Request Food
                </button>
                <button 
                  onClick={() => window.open(`https://maps.google.com/?q=${listing.location}`, '_blank')}
                  className="location-btn"
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