import React, { useState } from 'react';
import VerificationModal from './components/VerificationModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';

import { useNavigate } from 'react-router-dom';

function LoginModal({ isOpen, onClose, onSignupClick, onLoginSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '' // will be auto-filled for admin/officer
  });
  const [errors, setErrors] = useState({});
  const [showVerification, setShowVerification] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [officerMode, setOfficerMode] = useState(false);

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
    console.log('Login payload:', {
      email: formData.email,
      password: formData.password
    });
    if (officerMode) {
      // Authenticate officer against backend
      try {
        const resp = await fetch('http://localhost/Sharing%20Excess/backend/officer_login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password
          })
        });
        const raw = await resp.text();
        console.log('Officer raw response:', raw, 'status:', resp.status);
        let data;
        try { data = JSON.parse(raw); } catch (e) {
          console.error('Officer JSON parse error:', e);
          setErrors({ submit: 'Unexpected server response. Please try again.' });
          return;
        }
        if (data.success) {
          const officerData = data.officer || {};
          const officerUser = {
            ...officerData,
            role: 'officer',
            // Ensure a concise display name like "officer 1" if name is missing or generic
            name: (officerData.name && officerData.name.trim() !== '')
              ? officerData.name.trim()
              : (`officer ${officerData.id || ''}`).trim()
          };
          localStorage.setItem('user', JSON.stringify(officerUser));
          localStorage.setItem('role', 'officer');
          if (onLoginSuccess) onLoginSuccess(officerUser);
          onClose();
          navigate('/officer', { replace: true });
        } else {
          setErrors({ submit: data.message || 'Invalid officer credentials' });
        }
      } catch (err) {
        console.error('Officer login fetch error:', err);
        setErrors({ submit: 'Network error. Please try again.' });
      }
      return;
    }
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
    // Role selection is no longer required for login; do not block on role
    // newErrors.role = 'Please select a role';

    console.log('Validation errors:', newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log('Proceeding to fetch login.php...');
      try {
        const response = await fetch('http://localhost/Sharing%20Excess/backend/login.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password
          })
        });

        const raw = await response.text();
        console.log('Raw login response:', raw, 'status:', response.status);
        let data;
        try {
          data = JSON.parse(raw);
        } catch (err) {
          console.error('JSON parse error:', err);
          setErrors({ submit: 'Unexpected server response. Please try again.' });
          return;
        }

        console.log('Logged in user:', data.user);
        console.log('Logged in user role:', data.user && data.user.role);
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
          // Close modal and navigate only on success
          onClose();
          localStorage.setItem('role', data.user.role);
          if (data.user.role === 'officer') {
            navigate('/officer', { replace: true });
          } else if (data.user.role === 'admin') {
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
            setErrors({ submit: data.message || 'Invalid credentials' });
          }
        }
      } catch (error) {
        console.error('Login fetch error:', error);
        setErrors({ submit: 'Network error. Please try again.' });
        return;
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
          <button
            type="button"
            className="login-officer-btn"
            style={{ marginBottom: 16, background: officerMode ? '#6c757d' : '#28a745', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4 }}
            onClick={() => setOfficerMode(!officerMode)}
          >
            {officerMode ? 'Back to Normal Login' : 'Login as Officer'}
          </button>
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