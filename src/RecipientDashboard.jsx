import React, { useState, useEffect } from 'react';

function RecipientDashboard() {
  const [foodListings, setFoodListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [customRequest, setCustomRequest] = useState({ food_name: '', quantity: '', needed_by: '', location: '' });
  const [myRequests, setMyRequests] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    fetchFoodListings();
    fetchMyRequests();
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

  const fetchMyRequests = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'recipient') return;
    try {
      const response = await fetch('http://localhost/Sharing%20Excess/backend/get_requests.php?recipient_id=' + user.id);
      const data = await response.json();
      if (data.success) {
        setMyRequests(data.requests || []);
      }
    } catch (e) {}
  };

  const handleRequestFood = async (listingId, foodName) => {
    // Get recipient_id from localStorage user
    const user = JSON.parse(localStorage.getItem('user'));
    const recipient_id = user && user.role === 'recipient' ? user.id : null;
    if (!recipient_id) {
      alert('You must be logged in as a recipient to request food.');
      return;
    }
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
          location: 'Colombo',
          recipient_id // Pass recipient_id to backend
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

  const openRequestModal = () => {
    setCustomRequest({ food_name: '', quantity: '', needed_by: '', location: '' });
    setShowRequestModal(true);
  };

  const closeRequestModal = () => {
    setShowRequestModal(false);
  };

  const handleCustomRequestChange = (e) => {
    setCustomRequest({ ...customRequest, [e.target.name]: e.target.value });
  };

  const handleCustomRequestSubmit = async (e) => {
    e.preventDefault();
    setRequestLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'recipient') {
      alert('You must be logged in as a recipient to request food.');
      setRequestLoading(false);
      return;
    }
    try {
      const response = await fetch('http://localhost/Sharing%20Excess/backend/request_food.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_id: user.id,
          food_name: customRequest.food_name,
          quantity: customRequest.quantity,
          needed_by: customRequest.needed_by,
          location: customRequest.location
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Custom food request submitted successfully!');
        fetchMyRequests();
        closeRequestModal();
      } else {
        alert(data.message || 'Failed to submit request');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
    setRequestLoading(false);
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
        <button onClick={openRequestModal} className="request-food-btn" style={{marginLeft: 8}}>
          <span>➕</span> Request Custom Food
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
      <h3 style={{marginTop: 32}}>My Food Requests</h3>
      {myRequests.length === 0 ? (
        <div className="no-requests">
          <p>You have not made any food requests yet.</p>
        </div>
      ) : (
        <div className="dashboard-listings">
          {myRequests.map((req) => (
            <div key={req.id} className="dashboard-card">
              <div className="food-header">
                <strong className="food-name">{req.food_name}</strong>
                <span className="quantity-badge">{req.quantity}</span>
              </div>
              <div className="food-details">
                <div className="detail-item">
                  <span className="detail-label">📅 Needed by:</span>
                  <span className="detail-value">{req.needed_by}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📍 Location:</span>
                  <span className="detail-value">{req.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🗓️ Requested:</span>
                  <span className="detail-value">{new Date(req.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showRequestModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320, maxWidth: 400, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            <button onClick={closeRequestModal} style={{ float: 'right', background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>&times;</button>
            <h2>Request Custom Food</h2>
            <form onSubmit={handleCustomRequestSubmit}>
              <label>Food Name:</label>
              <input type="text" name="food_name" value={customRequest.food_name} onChange={handleCustomRequestChange} required style={{ width: '100%', marginBottom: 12 }} />
              <label>Quantity:</label>
              <input type="text" name="quantity" value={customRequest.quantity} onChange={handleCustomRequestChange} required style={{ width: '100%', marginBottom: 12 }} />
              <label>Needed By:</label>
              <input type="date" name="needed_by" value={customRequest.needed_by} onChange={handleCustomRequestChange} required style={{ width: '100%', marginBottom: 12 }} />
              <label>Location:</label>
              <input type="text" name="location" value={customRequest.location} onChange={handleCustomRequestChange} required style={{ width: '100%', marginBottom: 12 }} />
              <button type="submit" disabled={requestLoading} style={{ width: '100%' }}>
                {requestLoading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipientDashboard; 