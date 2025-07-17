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
      <div className="dashboard-container">
        <h2>Food Requests</h2>
        <div className="loading">Loading food requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h2>Food Requests</h2>
        <div className="error-message">{error}</div>
        <button onClick={fetchFoodRequests} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2>Food Requests</h2>
      <div className="dashboard-header">
        <p>View and respond to food requests from recipients</p>
        <button onClick={fetchFoodRequests} className="refresh-btn">Refresh</button>
      </div>
      
      {foodRequests.length === 0 ? (
        <div className="no-requests">
          <p>No food requests available at the moment.</p>
          <p>Check back later for new requests.</p>
        </div>
      ) : (
        <div className="dashboard-listings">
          {foodRequests.map((request) => (
            <div key={request.id} className="dashboard-card">
              <strong>{request.food_item}</strong>
              <div>Requested by: {request.recipient_name}</div>
              <div>Quantity: {request.quantity}</div>
              <div>Needed by: {request.needed_by}</div>
              <div>Location: {request.location}</div>
              <div>Status: <span className={`status-${request.status}`}>{request.status}</span></div>
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
                  <span className="accepted-status">✓ Request Accepted</span>
                )}
                {request.status === 'declined' && (
                  <span className="declined-status">✗ Request Declined</span>
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