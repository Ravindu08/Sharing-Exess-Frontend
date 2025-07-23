import React, { useState } from 'react';

function ForgotPasswordModal({ show, onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!show) return null;

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('http://localhost/Sharing%20Excess/backend/forgot_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.success) {
        setMessage('A code has been sent to your email.');
        setStep(2);
      } else {
        setError(data.message || 'Failed to send code.');
      }
    } catch (err) {
      setError('Network error.');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('http://localhost/Sharing%20Excess/backend/reset_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newpassword: newPassword })
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Password reset successful! Redirecting...');
        // Store user info in localStorage for Navbar
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        // Redirect based on role
        setTimeout(() => {
          if (data.user && data.user.role === 'donor') {
            window.location.href = '/donor-dashboard';
          } else if (data.user && data.user.role === 'recipient') {
            window.location.href = '/recipient-dashboard';
          } else {
            // fallback: close modal
            onClose();
          }
        }, 1500);
        setStep(3);
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Network error.');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320, maxWidth: 400, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
        <button onClick={onClose} style={{ float: 'right', background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>&times;</button>
        <h2>Forgot Password</h2>
        {step === 1 && (
          <form onSubmit={handleSendCode}>
            <label>Email:</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
            <button type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <label>Verification Code:</label>
            <input type="text" value={code} onChange={e => setCode(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
            <label>New Password:</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
            <button type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        {step === 3 && (
          <div>
            <p style={{ color: 'green' }}>{message}</p>
            <button onClick={onClose} style={{ width: '100%' }}>Close</button>
          </div>
        )}
        {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
        {message && step !== 3 && <p style={{ color: 'green', marginTop: 12 }}>{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPasswordModal; 