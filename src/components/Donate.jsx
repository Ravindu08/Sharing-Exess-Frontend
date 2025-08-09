import React, { useState, useEffect } from 'react';
import './Donate.css';

function Donate() {
  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    expiryDate: '',
    location: '',
    description: '',
    contactPhone: '',
    contactEmail: ''
  });
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  // --- Add this line for the success message state ---
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);
  const normalizedRole = (user && user.role ? String(user.role).toLowerCase() : '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // --- Update handleSubmit to send data and show a styled message ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to donate.');
      return;
    }
    if (normalizedRole !== 'donor') {
      alert('Only donors can submit donations. You are logged in as ' + (user.role || 'a user') + '.');
      return;
    }
    const payload = {
      donor_id: user.id,
      food_name: formData.foodName,
      quantity: formData.quantity,
      expiry_date: formData.expiryDate,
      location: formData.location,
      description: formData.description,
      contact_phone: formData.contactPhone,
      contact_email: formData.contactEmail
    };
    try {
      const response = await fetch('http://localhost/Sharing%20Excess/backend/add_listing.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMessage('🎉 Thank you for your donation! We will contact you soon.');
        setTimeout(() => {
          setSuccessMessage('');
          window.location.href = '/donor-dashboard';
        }, 1500); // Show message for 1.5 seconds, then redirect
        setFormData({
          foodName: '',
          quantity: '',
          expiryDate: '',
          location: '',
          description: '',
          contactPhone: '',
          contactEmail: ''
        });
      } else {
        setSuccessMessage('');
        alert('Failed to submit donation: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      setSuccessMessage('');
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="donate-page">
      <div className="donate-container">
        <div className="donate-hero">
          <h1 className="donate-hero-title">
            Donate Food
          </h1>
          <p className="donate-hero-subtitle">
            Share your excess food with those who need it most. Your donation can make a real difference in someone's life.
          </p>
        </div>

        {/* Only show form if user is logged in as donor */}
        {user && normalizedRole === 'donor' ? (
          <div className="donate-form-container">
            {/* --- Add this block above the form --- */}
            {successMessage && (
              <div className="success-message" style={{
                background: 'linear-gradient(90deg, #28a745 0%, #20c997 100%)',
                color: '#fff',
                padding: '1.2rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                textAlign: 'center',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(40, 167, 69, 0.15)'
              }}>
                {successMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="donate-form">
              <h2 style={{ 
                color: '#000', 
                textShadow: '2px 2px 8px rgba(255,255,255,0.8)', 
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                Food Donation Form
              </h2>

              <div className="form-row">
                <div className="form-group">
                  <label style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '600', color: '#000' }}>
                    Food Item Name *
                  </label>
                  <input
                    type="text"
                    name="foodName"
                    value={formData.foodName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Rice, Bread, Vegetables"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '600', color: '#000' }}>
                    Quantity *
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 5kg, 10 packets"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '600', color: '#000' }}>
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '600', color: '#000' }}>
                    Pickup Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="Your address or preferred pickup location"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '600', color: '#000' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Additional details about the food item, packaging, etc."
                  rows="4"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '600', color: '#000' }}>
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    required
                    placeholder="Your phone number"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '600', color: '#000' }}>
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    required
                    placeholder="Your email address"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Submit Donation
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="donate-form-container" style={{ textAlign: 'center', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {user ? (
              <>
                <h2 style={{ color: '#000', fontFamily: "'Montserrat', sans-serif", marginBottom: '1.5rem' }}>
                  Only donors can submit donations
                </h2>
                <p style={{ color: '#000', fontFamily: "'Montserrat', sans-serif", marginBottom: '2rem' }}>
                  You are logged in as <strong>{user.role}</strong>. Please use the Request page instead.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                  <a href="/request" className="submit-btn" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', color: '#fff', textDecoration: 'none', fontFamily: "'Montserrat', sans-serif" }}>
                    Go to Request
                  </a>
                </div>
              </>
            ) : (
              <>
                <h2 style={{ color: '#000', fontFamily: "'Montserrat', sans-serif", marginBottom: '1.5rem' }}>
                  Please sign in to submit a donation
                </h2>
                <p style={{ color: '#000', fontFamily: "'Montserrat', sans-serif", marginBottom: '2rem' }}>
                  You must be logged in to donate food. If you don't have an account, please sign up first.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                  <a href="/" className="submit-btn" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', color: '#fff', textDecoration: 'none', fontFamily: "'Montserrat', sans-serif" }}>
                    Go to Home
                  </a>
                </div>
              </>
            )}
          </div>
        )}

        <div className="donate-info">
          <h3 style={{ 
            color: '#000', 
            textShadow: '2px 2px 8px rgba(255,255,255,0.8)', 
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            What We Accept
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '600', color: '#000' }}>✅ Fresh Food</h4>
              <p style={{ fontFamily: "'Montserrat', sans-serif", color: '#000' }}>Fruits, vegetables, bread, dairy products</p>
            </div>
            <div className="info-item">
              <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '600', color: '#000' }}>✅ Packaged Food</h4>
              <p style={{ fontFamily: "'Montserrat', sans-serif", color: '#000' }}>Canned goods, dry foods, snacks</p>
            </div>
            <div className="info-item">
              <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '600', color: '#000' }}>✅ Prepared Meals</h4>
              <p style={{ fontFamily: "'Montserrat', sans-serif", color: '#000' }}>Leftover food from events, restaurants</p>
            </div>
            <div className="info-item">
              <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '600', color: '#000' }}>❌ Expired Food</h4>
              <p style={{ fontFamily: "'Montserrat', sans-serif", color: '#000' }}>We cannot accept expired or spoiled food</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Donate; 