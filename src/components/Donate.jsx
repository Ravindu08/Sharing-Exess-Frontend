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
  const [showDonateMoney, setShowDonateMoney] = useState(false);
  const [showDonateFood, setShowDonateFood] = useState(true);
  const [moneyForm, setMoneyForm] = useState({ name: '', email: '', amount: '', card: '', comment: '', monthly: true, dedicate: false });
  const [moneySuccess, setMoneySuccess] = useState('');
  const presetAmounts = [6000, 4000, 3500, 3000, 2500, 2000];

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

  const handleMoneyChange = e => {
    const { name, value, type, checked } = e.target;
    setMoneyForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handlePreset = amt => setMoneyForm(f => ({ ...f, amount: amt }));

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

  const handleMoneySubmit = async e => {
    e.preventDefault();
    if (!moneyForm.name || !moneyForm.email || !moneyForm.amount || !moneyForm.card) {
      setMoneySuccess('');
      alert('Please fill all fields.');
      return;
    }
    if (!/^\d{16}$/.test(moneyForm.card)) {
      setMoneySuccess('');
      alert('Card number must be exactly 16 digits.');
      return;
    }
    // Only save last 4 digits for demo
    const payload = {
      name: moneyForm.name,
      email: moneyForm.email,
      amount: moneyForm.amount,
      card_last4: moneyForm.card.slice(-4),
      comment: moneyForm.comment,
      monthly: moneyForm.monthly ? 1 : 0,
      dedicate: moneyForm.dedicate ? 1 : 0
    };
    try {
      const res = await fetch('http://localhost/Sharing%20Excess/backend/add_money_donation.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setMoneySuccess('Thank you for your donation!');
        setMoneyForm({ name: '', email: '', amount: '', card: '', comment: '', monthly: true, dedicate: false });
        // NOTE: Backend should send a thank you email to the donor here.
      } else {
        setMoneySuccess('');
        alert('Failed to save donation.');
      }
    } catch {
      setMoneySuccess('');
      alert('Network error.');
    }
  };

  return (
    <div className="donate-page">
      <div className="donate-container">
        <div className="donate-hero">
          <h1 className="donate-hero-title">Donate Food</h1>
          <p className="donate-hero-subtitle">Share your excess food with those who need it most. Your donation can make a real difference in someone's life.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px', marginBottom: '16px' }}>
            <button 
              onClick={() => {
                setShowDonateFood(true);
                setShowDonateMoney(false);
              }} 
              className="submit-btn" 
              style={{ 
                background: showDonateFood ? '#28a745' : '#fff', 
                color: showDonateFood ? '#fff' : '#28a745',
                border: '2px solid #28a745',
                fontWeight: 700, 
                fontSize: 18, 
                borderRadius: 8, 
                padding: '10px 28px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Donate Food
            </button>
            <button 
              onClick={() => {
                setShowDonateMoney(s => !s);
                setShowDonateFood(false);
              }} 
              className="submit-btn" 
              style={{ 
                background: showDonateMoney ? '#007bff' : '#fff', 
                color: showDonateMoney ? '#fff' : '#007bff',
                border: '2px solid #007bff',
                fontWeight: 700, 
                fontSize: 18, 
                borderRadius: 8, 
                padding: '10px 28px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Donate Money
            </button>
          </div>

          {showDonateMoney && (
            <div style={{ background: '#fff', border: '2px solid #28a745', borderRadius: 16, padding: 0, margin: '16px 0', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', boxShadow: '0 4px 24px rgba(40,167,69,0.10)' }}>
              <div style={{ display: 'flex', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ flex: 1, background: '#f8f9fa', padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <img src="/logo.png" alt="SE" style={{ width: 48, marginBottom: 12 }} />
                  <h4 style={{ color: '#28a745', fontWeight: 700, marginBottom: 8 }}>Every Rs 4000 can provide 10 meals.</h4>
                  <p style={{ color: '#222', fontSize: 15, textAlign: 'center', marginBottom: 0 }}>Your donation helps rescue surplus food and deliver it to people facing hunger. All the food we rescue is donated - we just need to move it. Let's be the generation to end world hunger. Let's Free Food.</p>
                </div>
                <form onSubmit={handleMoneySubmit} style={{ flex: 1.2, padding: 32, background: '#fff', borderLeft: '1px solid #e0e0e0', borderRadius: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <button type="button" onClick={() => setMoneyForm(f => ({ ...f, monthly: false }))} style={{ flex: 1, background: !moneyForm.monthly ? '#e3f2fd' : '#fff', border: '1.5px solid #007bff', color: '#007bff', fontWeight: 600, borderRadius: 8, padding: 8, cursor: 'pointer' }}>Give once</button>
                    <button type="button" onClick={() => setMoneyForm(f => ({ ...f, monthly: true }))} style={{ flex: 1, background: moneyForm.monthly ? '#ffe3ec' : '#fff', border: '1.5px solid #e83e8c', color: '#e83e8c', fontWeight: 600, borderRadius: 8, padding: 8, cursor: 'pointer' }}>❤ Monthly</button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    {presetAmounts.map(amt => (
                      <button key={amt} type="button" onClick={() => handlePreset(amt)} style={{ background: moneyForm.amount == amt ? '#007bff' : '#f1f3f4', color: moneyForm.amount == amt ? '#fff' : '#007bff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>{`Rs ${amt.toLocaleString()}`}</button>
                    ))}
                  </div>
                  <input type="number" name="amount" value={moneyForm.amount} onChange={handleMoneyChange} placeholder="Rs 4,000" style={{ fontSize: 22, fontWeight: 700, color: '#007bff', border: '2px solid #007bff', borderRadius: 8, padding: 10, marginBottom: 8 }} min="1" required />
                  <input type="text" name="name" value={moneyForm.name} onChange={handleMoneyChange} placeholder="Your Name" style={{ padding: 8, fontSize: 16, borderRadius: 6, border: '1px solid #ccc' }} required />
                  <input type="email" name="email" value={moneyForm.email} onChange={handleMoneyChange} placeholder="Your Email" style={{ padding: 8, fontSize: 16, borderRadius: 6, border: '1px solid #ccc' }} required />
                  <input type="text" name="card" value={moneyForm.card} onChange={handleMoneyChange} placeholder="Card Number (demo)" style={{ padding: 8, fontSize: 16, borderRadius: 6, border: '1px solid #ccc' }} required maxLength={16} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" name="dedicate" checked={moneyForm.dedicate} onChange={handleMoneyChange} id="dedicate" />
                    <label htmlFor="dedicate" style={{ fontSize: 15, color: '#222' }}>Dedicate this donation</label>
                  </div>
                  <textarea name="comment" value={moneyForm.comment} onChange={handleMoneyChange} placeholder="Add comment (optional)" style={{ padding: 8, fontSize: 15, borderRadius: 6, border: '1px solid #ccc', minHeight: 40 }} />
                  <button type="submit" className="submit-btn" style={{ background: '#007bff', color: '#fff', fontWeight: 700, fontSize: 18, borderRadius: 8, padding: '12px 0', marginTop: 8 }}>Donate {moneyForm.monthly ? 'monthly' : 'now'}</button>
                  {moneySuccess && <div style={{ color: '#28a745', fontWeight: 600, marginTop: 8, textAlign: 'center' }}>{moneySuccess}</div>}
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Show login message only when not logged in and not showing money form */}
        {!user && !showDonateMoney && (
          <div className="donate-form-container" style={{ textAlign: 'center', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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
          </div>
        )}

        {/* Show food donation form when logged in and showDonateFood is true */}
        {user && showDonateFood && (
          <div className="donate-form-container">
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