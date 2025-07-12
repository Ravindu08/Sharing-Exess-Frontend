import React, { useState } from 'react';
import VerificationModal from './components/VerificationModal';

function LoginModal({ isOpen, onClose, onSignupClick, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [showVerification, setShowVerification] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');

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

    // Role validation
    if (!formData.role) {
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
            role: formData.role
          })
        });

        const data = await response.json();
        
        if (data.success) {
          // Save user data to localStorage
          localStorage.setItem('user', JSON.stringify(data.user));
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
          
          // Call the onLoginSuccess callback
          if (onLoginSuccess) {
            onLoginSuccess(data.user);
          }
          
          // Redirect based on role
          if (data.user.role === 'donor') {
            window.location.href = '/donor-dashboard';
          } else {
            window.location.href = '/recipient-dashboard';
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
                  />
                  <span className="role-text">Recipient</span>
                </label>
              </div>
              {errors.role && <span className="error-message">{errors.role}</span>}
            </div>

            {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

            <div className="form-actions">
              <button type="submit" className="login-submit-btn">
                Login
              </button>
              <a href="/forgot-password" className="forgot-password">
                Forgot Password?
              </a>
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
    </>
  );
}

export default LoginModal; 