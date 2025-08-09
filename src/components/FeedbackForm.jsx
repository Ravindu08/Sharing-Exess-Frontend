import React, { useState } from 'react';

function FeedbackForm({ requestId, recipientId }) {
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost/Sharing%20Excess/backend/submit_feedback.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: requestId,
          recipient_id: recipientId,
          comment: comment.trim()
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setIsSubmitted(true);
        setComment(''); // Clear the comment after successful submission
        setTimeout(() => setIsSubmitted(false), 3000); // Hide success message after 3 seconds
      } else {
        setError(data.message || 'Failed to submit feedback');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '16px' }}>
      {isSubmitted && (
        <div style={{
          padding: '12px',
          marginBottom: '16px',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px'
        }}>
          <span>✓</span>
          <span>Thank you for your feedback!</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#333',
            fontSize: '14px'
          }}>
            Your Feedback:
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isLoading}
            rows={3}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '14px',
              resize: 'vertical',
              minHeight: '80px',
              marginBottom: '8px'
            }}
            placeholder="Share your experience with this food donation..."
            required
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="submit"
            disabled={!comment.trim() || isLoading}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: '500',
              opacity: (!comment.trim() || isLoading) ? 0.7 : 1,
              pointerEvents: (!comment.trim() || isLoading) ? 'none' : 'auto',
              transition: 'opacity 0.2s',
              fontSize: '14px'
            }}
          >
            {isLoading ? 'Submitting...' : 'Submit Feedback'}
          </button>
          
          {error && (
            <span style={{ color: '#dc3545', fontSize: '13px' }}>
              {error}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

export default FeedbackForm;
