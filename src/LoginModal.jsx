import React, { useState } from 'react';
import VerificationModal from './components/VerificationModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';

import { useNavigate } from 'react-router-dom';

function LoginModal({ isOpen, onClose, onSignupClick, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '' // will be auto-filled for admin/officer
  });
  const [errors, setErrors] = useState({});
  const [showVerification, setShowVerification] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Auto-fill role for admin/officer
    let autoRole = formData.role;
    if (formData.email === 'admin@sharingexcess.com') autoRole = 'admin';
    else if (formData.email === 'officer@sharingexcess.com') autoRole = 'officer';
    else if (!formData.role && formData.email) autoRole = '';
    // This ensures officer@sharingexcess.com always gets 'officer' role sent
    if (!autoRole) {
      newErrors.role = 'Please select a role';
    }

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch('http://localhost/Sharing%20Excess/backend/login.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role: autoRole || formData.role
          })
        });

        const data = await response.json();
        
        if (data.success) {
          // Save user data to localStorage
          localStorage.setItem('user', JSON.stringify(data.user));
localStorage.setItem('role', data.user.role);
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
          
          // Call the onLoginSuccess callback
          if (onLoginSuccess) {
            onLoginSuccess(data.user);
          }
          
          // Redirect based on role
          if (data.user.role === 'admin' || data.user.role === 'officer') {
            localStorage.setItem('role', data.user.role); // ensure role is set
            navigate('/calendar', { replace: true });
          } else if (data.user.role === 'donor') {
            navigate('/donor-dashboard', { replace: true });
          } else {
            navigate('/recipient-dashboard', { replace: true });
          }
        } else {
          if (data.message && data.message.toLowerCase().includes('not verified')) {
            setLoginEmail(formData.email);
            setShowVerification(true);
          } else {
            setErrors({ submit: data.message });
          }
        }
      } catch (error) {
        setErrors({ submit: 'Network error. Please try again.' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleVerified = () => {
    setShowVerification(false);
    setErrors({});
    // Optionally, auto-login or prompt user to login again
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Login to Sharing Excess</h2>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
              <div className="password-hint">Your password must be at least 6 characters long.</div>
            </div>

            <div className="form-group">
              <label htmlFor="role">I am a:</label>
              <div className="role-options">
                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="donor"
                    checked={formData.role === 'donor'}
                    onChange={handleChange}
                    disabled={formData.email === 'admin@sharingexcess.com' || formData.email === 'officer@sharingexcess.com'}
                  />
                  <span className="role-text">Donor</span>
                </label>
                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="recipient"
                    checked={formData.role === 'recipient'}
                    onChange={handleChange}
                    disabled={formData.email === 'admin@sharingexcess.com' || formData.email === 'officer@sharingexcess.com'}
                  />
                  <span className="role-text">Recipient</span>
                </label>
                {/* Hide role selection for admin/officer */}
                {(formData.email === 'admin@sharingexcess.com' || formData.email === 'officer@sharingexcess.com') && (
                  <div style={{ color: '#28a745', fontWeight: 600, marginTop: 8 }}>
                    Logging in as <b>{formData.email === 'admin@sharingexcess.com' ? 'Admin' : 'Officer'}</b>
                  </div>
                )}
              </div>
              {errors.role && <span className="error-message">{errors.role}</span>}
            </div>

            {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

            <div className="form-actions">
              <button type="submit" className="login-submit-btn">
                Login
              </button>
              <button className="forgot-password-link" onClick={() => setShowForgot(true)} style={{ marginTop: 12, background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
                Forgot Password?
              </button>
            </div>

            <div className="signup-link">
              <span>Don't have an account? </span>
              <a href="#" onClick={(e) => { e.preventDefault(); onSignupClick(); }}>
                Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
      <VerificationModal
        isOpen={showVerification}
        email={loginEmail}
        onClose={() => setShowVerification(false)}
        onVerified={handleVerified}
      />
      <ForgotPasswordModal show={showForgot} onClose={() => setShowForgot(false)} />
    </>
  );
}

export default LoginModal; 