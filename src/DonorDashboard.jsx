import React, { useState, useEffect } from 'react';

function DonorDashboard() {
  const [foodRequests, setFoodRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFoodRequests();
  }, []);

  const fetchFoodRequests = async () => {
    try {
      const response = await fetch('http://localhost/Sharing%20Excess/backend/get_requests.php');
      const data = await response.json();
      
      if (data.success) {
        setFoodRequests(data.requests);
      } else {
        setError(data.message || 'Failed to fetch food requests');
      }
    } catch (error) {
      setError('Network error. Please try again.');
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
          status: status // 'accepted' or 'declined'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh the requests list
        fetchFoodRequests();
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
                    <button 
                      onClick={() => handleRespondToRequest(request.id, 'declined')}
                      className="decline-btn"
                    >
                      Decline Request
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
    </div>
  );
}

export default DonorDashboard; 