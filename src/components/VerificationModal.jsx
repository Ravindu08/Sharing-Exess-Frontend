import React, { useState } from 'react';

function VerificationModal({ isOpen, email, password, onClose, onVerified }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost/Sharing%20Excess/backend/verify_email.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verification_code: code })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Email verified! Logging you in...');
        // Auto-login after verification
        try {
          const loginRes = await fetch('http://localhost/Sharing%20Excess/backend/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role: 'recipient' })
          });
          const loginData = await loginRes.json();
          if (loginData.success) {
            localStorage.setItem('user', JSON.stringify(loginData.user));
            if (loginData.token) localStorage.setItem('token', loginData.token);
          }
        } catch (err) {}
        setTimeout(() => {
          setSuccess('');
          onVerified && onVerified();
          onClose();
        }, 1500);
      } else {
        setError(data.message || 'Verification failed.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setVerifying(false);
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost/Sharing%20Excess/backend/resend_verification.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Verification code resent! Check your email.');
      } else {
        setError(data.message || 'Could not resend code.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setResending(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Email Verification</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleVerify} className="login-form">
          <div className="form-group">
            <label htmlFor="code">Enter the code sent to <b>{email}</b>:</label>
            <input
              type="text"
              id="code"
              name="code"
              placeholder="Verification code"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message submit-error">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <div className="form-actions">
            <button type="submit" className="login-submit-btn" disabled={verifying}>
              {verifying ? 'Verifying...' : 'Verify'}
            </button>
            <button type="button" className="login-submit-btn" onClick={handleResend} disabled={resending}>
              {resending ? 'Resending...' : 'Resend Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerificationModal; 