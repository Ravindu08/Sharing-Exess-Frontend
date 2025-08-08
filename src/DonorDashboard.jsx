import React, { useState, useEffect } from 'react';

function DonorDashboard() {
  const [foodRequests, setFoodRequests] = useState([]);
  const [myDonations, setMyDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFoodRequests();
    fetchMyDonations();
  }, []);

  const fetchFoodRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost/Sharing%20Excess/backend/get_requests.php');
      const data = await response.json();
      if (data.success) {
        setFoodRequests(data.requests);
      }
    } catch (error) {
      // Optionally set error state here
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMyDonations = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('http://localhost/Sharing%20Excess/backend/get_donor_donations.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donor_id: user.id
        }),
      });
      const data = await response.json();
      if (data.success) {
        setMyDonations(data.donations);
      }
    } catch (error) {
      // Optionally set error state here
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToRequest = async (requestId, status) => {
    try {
      const response = await fetch('http://localhost/Sharing%20Excess/backend/respond_to_request.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request_id: requestId,
          status: status, // 'accepted'
          user_id: JSON.parse(localStorage.getItem('user')).id,
          user_name: JSON.parse(localStorage.getItem('user')).name
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh both requests and donations lists
        fetchFoodRequests();
        fetchMyDonations();
        alert(`Request ${status} successfully!`);
      } else {
        alert(data.message || 'Failed to respond to request');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <h2 style={{ 
          color: '#000', 
          textShadow: '2px 2px 8px rgba(255,255,255,0.8)', 
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '2.5rem',
          fontWeight: '900',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          Food Requests
        </h2>
        <div className="loading" style={{ 
          textAlign: 'center', 
          color: '#000', 
          fontSize: '1.2rem', 
          padding: '40px',
          fontFamily: "'Montserrat', sans-serif",
          textShadow: '1px 1px 6px rgba(255,255,255,0.8)'
        }}>
          Loading food requests...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h2 style={{ 
          color: '#000', 
          textShadow: '2px 2px 8px rgba(255,255,255,0.8)', 
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '2.5rem',
          fontWeight: '900',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          Food Requests
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
        <button onClick={fetchFoodRequests} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2 style={{ 
        color: '#000', 
        textShadow: '2px 2px 8px rgba(255,255,255,0.8)', 
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '2.5rem',
        fontWeight: '900',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        Food Requests
      </h2>
      <div className="dashboard-header">
        <p style={{ 
          color: '#000', 
          textShadow: '1px 1px 6px rgba(255,255,255,0.8)', 
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '1.1rem',
          margin: 0
        }}>
          View and respond to food requests from recipients
        </p>
        <button onClick={fetchFoodRequests} className="refresh-btn">Refresh</button>
      </div>
      
      {foodRequests.length === 0 ? (
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
            No food requests available at the moment.
          </p>
          <p style={{ margin: '10px 0', fontSize: '1.1rem', color: '#000', fontFamily: "'Montserrat', sans-serif" }}>
            Check back later for new requests.
          </p>
        </div>
      ) : (
        <div className="dashboard-listings">
          {foodRequests.map((request) => (
            <div key={request.id} className="dashboard-card" style={{ 
              background: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: '16px', 
              padding: '1.5rem', 
              marginBottom: '1.5rem', 
              boxShadow: '0 4px 24px rgba(40, 167, 69, 0.10)',
              border: '1px solid rgba(40, 167, 69, 0.2)',
              fontFamily: "'Montserrat', sans-serif"
            }}>
              <strong style={{ color: '#000', fontFamily: "'Montserrat', sans-serif", fontSize: '1.2rem' }}>{request.food_item}</strong>
              <div style={{ color: '#000', fontFamily: "'Montserrat', sans-serif", marginTop: '0.5rem' }}>Requested by: {request.recipient_name}</div>
              <div style={{ color: '#000', fontFamily: "'Montserrat', sans-serif" }}>Quantity: {request.quantity}</div>
              <div style={{ color: '#000', fontFamily: "'Montserrat', sans-serif" }}>Needed by: {request.needed_by}</div>
              <div style={{ color: '#000', fontFamily: "'Montserrat', sans-serif" }}>Location: {request.location}</div>
              <div style={{ color: '#000', fontFamily: "'Montserrat', sans-serif" }}>Status: <span className={`status-${request.status}`}>{request.status}</span></div>
              <div className="request-actions">
                {request.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleRespondToRequest(request.id, 'accepted')}
                      className="accept-btn"
                    >
                      Accept Request
                    </button>
                  </>
                )}
                {request.status === 'accepted' && (
                  <span className="accepted-status" style={{ fontFamily: "'Montserrat', sans-serif" }}>✓ Request Accepted</span>
                )}
                {request.status === 'declined' && (
                  <span className="declined-status" style={{ fontFamily: "'Montserrat', sans-serif" }}>✗ Request Declined</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 style={{marginTop: 32}}>My Donations (My Food Listings)</h3>
      {myDonations.length === 0 ? (
        <div className="no-requests">
          <p>You have not listed any food donations yet.</p>
        </div>
      ) : (
        <div className="dashboard-listings">
          {myDonations.map((don) => (
  don.id === 'custom' ? (
    <div key="custom-requests" className="dashboard-card" style={{ background: '#f8f9fa', border: '2px solid #28a745', borderRadius: '12px', marginBottom: '1.5rem', padding: '1.5rem' }}>
      <div className="food-header">
        <strong className="food-name" style={{ color: '#28a745', fontSize: '1.2rem' }}>Accepted Custom Requests</strong>
        <span className="quantity-badge">{don.total_requests}</span>
      </div>
      <div className="food-details">
        {don.requests && don.requests.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {don.requests.map((req) => (
              <li key={req.id} style={{ marginBottom: 12, color: '#222', fontFamily: "'Montserrat', sans-serif", background: '#fff', borderRadius: 6, padding: '10px 12px', border: '1px solid #e0e0e0' }}>
                <div><b>Recipient:</b> {req.recipient_name || 'Unknown'}</div>
                <div><b>Food:</b> {req.food_name}</div>
                <div><b>Quantity:</b> {req.quantity}</div>
                <div><b>Needed by:</b> {req.needed_by}</div>
                <div><b>Location:</b> {req.location}</div>
                <div><b>Accepted on:</b> {req.accepted_at ? new Date(req.accepted_at).toLocaleDateString() : ''}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div>No accepted custom requests.</div>
        )}
      </div>
    </div>
  ) : (
    <div key={don.id} className="dashboard-card">
      <div className="food-header">
        <strong className="food-name">{don.food_name}</strong>
        <span className="quantity-badge">{don.quantity}</span>
        <span className="status-badge" style={{marginLeft: 8, color: '#fff', background: don.status === 'accepted' ? '#28a745' : don.status === 'requested' ? '#6c757d' : '#007bff', borderRadius: 6, padding: '4px 10px', fontWeight: 700}}>
          {don.status.charAt(0).toUpperCase() + don.status.slice(1)}
        </span>
        {don.accepted_by && (
          <span className="accepted-badge" style={{marginLeft: 8, color: '#fff', background: '#28a745', borderRadius: 6, padding: '4px 10px', fontWeight: 700}}>
            Accepted by {don.accepted_by}
          </span>
        )}
      </div>
      <div className="food-details">
        <div className="detail-item"><span className="detail-label">📅 Expiry:</span> <span className="detail-value">{don.expiry_date}</span></div>
        <div className="detail-item"><span className="detail-label">📍 Location:</span> <span className="detail-value">{don.location}</span></div>
        <div className="detail-item"><span className="detail-label">🗓️ Listed:</span> <span className="detail-value">{new Date(don.created_at).toLocaleDateString()}</span></div>
        <div className="detail-item"><span className="detail-label">Total Requests:</span> <span className="detail-value">{don.total_requests}</span></div>
        {/* Accepted Requests Section */}
        {don.requests && don.requests.length > 0 && (
          <div className="accepted-requests" style={{ marginTop: 12, background: '#eaffea', borderRadius: 8, padding: '10px 14px' }}>
            <strong style={{ color: '#28a745', fontFamily: "'Montserrat', sans-serif" }}>Accepted Requests:</strong>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {don.requests.map((req) => (
                <li key={req.id} style={{ marginBottom: 6, color: '#222', fontFamily: "'Montserrat', sans-serif" }}>
                  <span style={{ fontWeight: 600 }}>{req.recipient_name}</span> &times; {req.quantity} for <span style={{ fontWeight: 600 }}>{req.needed_by}</span> <br/>
                  <span style={{ color: '#28a745' }}>Accepted on: {new Date(req.accepted_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
))}
        </div>
      )}
    </div>
  );
}

export default DonorDashboard;