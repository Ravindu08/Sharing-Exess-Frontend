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
        <button onClick={openRequestModal} className="request-food-btn" style={{marginLeft: 8}}>
          <span>➕</span> Request Custom Food
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
          <div className="modal-content" style={{ background: '#fff', padding: 32, borderRadius: 16, minWidth: 350, maxWidth: 420, boxShadow: '0 4px 24px rgba(40,167,69,0.15)', fontFamily: "'Montserrat', sans-serif", position: 'relative' }}>
            <button onClick={closeRequestModal} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#28a745', fontWeight: 700 }}>&times;</button>
            <h2 style={{ color: '#28a745', fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: '2rem', textAlign: 'center', marginBottom: 24 }}>Request Custom Food</h2>
            <form onSubmit={handleCustomRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="form-group">
                <label style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, color: '#000', marginBottom: 4 }}>Food Name:</label>
                <input type="text" name="food_name" value={customRequest.food_name} onChange={handleCustomRequestChange} required style={{ width: '100%', marginBottom: 0, padding: 10, borderRadius: 8, border: '1px solid #ccc', fontFamily: "'Montserrat', sans-serif" }} />
              </div>
              <div className="form-group">
                <label style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, color: '#000', marginBottom: 4 }}>Quantity:</label>
                <input type="text" name="quantity" value={customRequest.quantity} onChange={handleCustomRequestChange} required style={{ width: '100%', marginBottom: 0, padding: 10, borderRadius: 8, border: '1px solid #ccc', fontFamily: "'Montserrat', sans-serif" }} />
              </div>
              <div className="form-group">
                <label style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, color: '#000', marginBottom: 4 }}>Needed By:</label>
                <input type="date" name="needed_by" value={customRequest.needed_by} onChange={handleCustomRequestChange} required style={{ width: '100%', marginBottom: 0, padding: 10, borderRadius: 8, border: '1px solid #ccc', fontFamily: "'Montserrat', sans-serif" }} />
              </div>
              <div className="form-group">
                <label style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, color: '#000', marginBottom: 4 }}>Location:</label>
                <input type="text" name="location" value={customRequest.location} onChange={handleCustomRequestChange} required style={{ width: '100%', marginBottom: 0, padding: 10, borderRadius: 8, border: '1px solid #ccc', fontFamily: "'Montserrat', sans-serif" }} />
              </div>
              <button type="submit" disabled={requestLoading} style={{ width: '100%', background: '#28a745', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: 18, fontFamily: "'Montserrat', sans-serif", marginTop: 8, boxShadow: '0 2px 8px rgba(40,167,69,0.10)', cursor: requestLoading ? 'not-allowed' : 'pointer' }}>
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