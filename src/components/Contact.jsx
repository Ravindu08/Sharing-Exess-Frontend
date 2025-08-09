import React, { useState } from 'react';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder: Add your form submission logic here (e.g., send to backend or email)
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSubmitted(true);
    // Reset form after submission
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40
    }}>
      <div style={{
        background: 'white',
        borderRadius: 16,
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
        maxWidth: 550,
        width: '100%',
        padding: '36px 28px',
        margin: '0 auto',
        zIndex: 2,
        border: '1px solid #e0e0e0'
      }}>
        <h2 style={{ textAlign: 'center', color: '#28a745', fontWeight: 900, fontSize: '2.2rem', marginBottom: 18 }}>Contact Us</h2>
        <p style={{ textAlign: 'center', color: '#333', marginBottom: 28 }}>
          We'd love to hear from you! Fill out the form below or reach us directly at <a href="mailto:info@sharingexcess.lk" style={{ color: '#28a745', textDecoration: 'underline' }}>info@sharingexcess.lk</a>.
        </p>
        {submitted ? (
          <div style={{ color: '#28a745', textAlign: 'center', fontWeight: 700, fontSize: '1.1rem', marginBottom: 18 }}>
            Thank you for reaching out! We'll get back to you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label htmlFor="name" style={{ fontWeight: 600, color: '#222', marginBottom: 4, display: 'block' }}>Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
                required
              />
            </div>
            <div>
              <label htmlFor="email" style={{ fontWeight: 600, color: '#222', marginBottom: 4, display: 'block' }}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
                required
              />
            </div>
            <div>
              <label htmlFor="message" style={{ fontWeight: 600, color: '#222', marginBottom: 4, display: 'block' }}>Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 16, resize: 'vertical' }}
                required
              />
            </div>
            {error && <div style={{ color: '#dc3545', fontWeight: 600, marginBottom: 8 }}>{error}</div>}
            <button type="submit" style={{
              width: '100%',
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 0',
              fontWeight: 700,
              fontSize: 18,
              marginTop: 8,
              boxShadow: '0 2px 8px rgba(40,167,69,0.10)',
              cursor: 'pointer'
            }}>
              Send Message
            </button>
          </form>
        )}
        <div style={{ marginTop: 32, color: '#555', fontSize: '1rem', textAlign: 'center' }}>
          <div><strong>Email:</strong> <a href="mailto:info@sharingexcess.lk" style={{ color: '#28a745', textDecoration: 'underline' }}>info@sharingexcess.lk</a></div>
          <div><strong>Phone:</strong> <a href="tel:+94771234567" style={{ color: '#28a745', textDecoration: 'underline' }}>+94 77 123 4567</a></div>
          <div><strong>Address:</strong> Uva Wellassa University, Badulla, Sri Lanka</div>
        </div>
      </div>
    </div>
  );
}

export default Contact; 