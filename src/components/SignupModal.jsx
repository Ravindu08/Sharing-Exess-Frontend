import React, { useState } from 'react';
import VerificationModal from './VerificationModal';

function SignupModal({ isOpen, onClose, onSignupSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    phone_number: '',
    location: ''
  });
  const [errors, setErrors] = useState({});
  const [showVerification, setShowVerification] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');

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
  
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
  
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
  
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
  
    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
  
    // Phone number validation
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    }
  
    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
  
    if (Object.keys(newErrors).length === 0) {
      try {
        console.log('Attempting to signup with:', {
          name: formData.name,
          email: formData.email,
          role: formData.role
        });
  
        const response = await fetch('http://localhost/Sharing%20Excess/backend/signup.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            phone_number: formData.phone_number,
            location: formData.location
          })
        });
  
        console.log('Response status:', response.status);
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Response data:', data);
  
        if (data.success) {
          localStorage.setItem('username', data.name);
          setSignupEmail(formData.email);
          setShowVerification(true);
        } else {
          setErrors({ submit: data.message || 'Signup failed. Please try again.' });
        }
      } catch (error) {
        console.error('Signup error:', error);
        setErrors({ submit: `Network error: ${error.message}. Please check if the backend is running.` });
      }
    } else {
      setErrors(newErrors);
    }
  };
  

  const handleVerified = () => {
    setShowVerification(false);
    if (onSignupSuccess) onSignupSuccess({ email: signupEmail });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Sign Up for Sharing Excess</h2>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

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
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="role">I want to sign up as:</label>
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

            <div className="form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                placeholder="Enter your phone number"
                value={formData.phone_number}
                onChange={handleChange}
                className={errors.phone_number ? 'error' : ''}
              />
              {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Enter your location"
                value={formData.location}
                onChange={handleChange}
                className={errors.location ? 'error' : ''}
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>

            {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

            <div className="form-actions">
              <button type="submit" className="login-submit-btn">
                Sign Up
              </button>
            </div>

            <div className="signup-link">
              <span>Already have an account? </span>
              <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }}>
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
      <VerificationModal
        isOpen={showVerification}
        email={signupEmail}
        password={formData.password}
        onClose={() => setShowVerification(false)}
        onVerified={handleVerified}
      />
    </>
  );
}

export default SignupModal; 