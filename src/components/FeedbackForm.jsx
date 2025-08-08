import React, { useState } from 'react';

function FeedbackForm({ requestId, recipientId, onSubmitted }) {
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost/Sharing%20Excess/backend/submit_feedback.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: requestId,
          recipient_id: recipientId,
          comment,
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Feedback submitted!');
        if (onSubmitted) onSubmitted();
      } else {
        setMessage(data.message || 'Failed to submit feedback');
      }
    } catch (err) {
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 12, background: '#f1f1f1', padding: 16, borderRadius: 8 }}>
      <div style={{ marginTop: 8 }}>
        <label>Comment: </label>
        <textarea value={comment} onChange={e => setComment(e.target.value)} disabled={loading} rows={3} style={{ width: '100%' }} />
      </div>
      <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
      {message && <div style={{ color: 'green', marginTop: 8 }}>{message}</div>}
    </form>
  );
}

export default FeedbackForm;
