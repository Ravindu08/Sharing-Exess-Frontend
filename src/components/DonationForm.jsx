import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { FaShieldAlt } from 'react-icons/fa';
import '../styles/DonationForm.css';

function DonationForm({ show, onHide }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '1000',
    paymentMethod: 'visa',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || Number(formData.amount) < 100) {
      newErrors.amount = 'Minimum donation is Rs. 100';
    }
    
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Invalid card number';
    }
    
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
    }
    
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'Invalid CVV';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Donation submitted:', formData);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          amount: '1000',
          paymentMethod: 'visa',
          cardNumber: '',
          expiryDate: '',
          cvv: ''
        });
        setIsSuccess(false);
        onHide();
      }, 3000);
    }, 1500);
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{4})(?=\d)/g, '$1 ')
      .trim();
  };

  const handleCardNumberChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatCardNumber(value);
    setFormData(prev => ({
      ...prev,
      cardNumber: formattedValue
    }));
  };

  const handleExpiryDateChange = (e) => {
    let { value } = e.target;
    value = value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    setFormData(prev => ({
      ...prev,
      expiryDate: value
    }));
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered className="donation-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <div className="text-center w-100">
          <div className="donation-icon mb-3">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#E3F5E8" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 10L10.5 15.5L8 13" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h4 className="modal-title mb-2" style={{ color: '#28a745', fontWeight: '700' }}>Make a Life-Changing Donation</h4>
          <p className="text-muted mb-0">Your support helps us fight hunger and reduce food waste in Sri Lanka</p>
        </div>
      </Modal.Header>
      <Modal.Body className="donation-form-body">
        {isSuccess ? (
          <div className="text-center py-4">
            <div className="mb-3">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#28a745" fillOpacity="0.2"/>
                <path d="M8 12L11 15L16 9" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h5 style={{ color: '#28a745' }}>Thank You for Your Donation!</h5>
            <p className="text-muted">Your contribution helps us fight food waste and feed those in need.</p>
            <Button variant="outline-success" onClick={onHide} className="mt-3">Close</Button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <div className="donation-form-grid">
              <div className="donation-form-section">
                <h5>Your Information</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    placeholder="John Doe"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    placeholder="your@email.com"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="donation-form-section">
                <h5>Donation Amount</h5>
                <div className="donation-amounts mb-3">
                  {[500, 1000, 2000, 5000].map(amount => (
                    <button
                      key={amount}
                      type="button"
                      className={`donation-amount-btn ${Number(formData.amount) === amount ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        amount: amount.toString(),
                        customAmount: ''
                      }))}
                    >
                      Rs. {amount.toLocaleString()}
                    </button>
                  ))}
                </div>
                <Form.Group className="mb-3">
                  <Form.Label>Custom Amount (LKR)</Form.Label>
                  <Form.Control
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    isInvalid={!!errors.amount}
                    placeholder="Enter amount (min Rs. 100)"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.amount}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="donation-form-section">
                <h5>Payment Details</h5>
                <div className="payment-methods">
                  {[
                    { type: 'visa', label: 'Visa' },
                    { type: 'mastercard', label: 'Mastercard' },
                    { type: 'amex', label: 'Amex' }
                  ].map(({ type, label }) => (
                    <div 
                      key={type}
                      className={`payment-method ${formData.paymentMethod === type ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: type }))}
                    >
                      <img 
                        src={`/payment-${type}.png`} 
                        alt={label}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://logo.clearbit.com/${type}.com`;
                        }}
                      />
                    </div>
                  ))}
                </div>
                <Form.Group className="mb-3">
                  <Form.Label>Card Number <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    isInvalid={!!errors.cardNumber}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cardNumber}
                  </Form.Control.Feedback>
                </Form.Group>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Expiry Date <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleExpiryDateChange}
                        isInvalid={!!errors.expiryDate}
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.expiryDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>CVV <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="password"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        isInvalid={!!errors.cvv}
                        placeholder="123"
                        maxLength="4"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cvv}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
              <div className="donation-form-section">
                <h5>Your Impact</h5>
                <div className="impact-stats p-4 rounded">
                  <Row className="text-center">
                    <Col xs={4}>
                      <h5 className="mb-0">50,000+</h5>
                      <small className="text-muted">Meals Served</small>
                    </Col>
                    <Col xs={4}>
                      <h5 className="mb-0">10,000+</h5>
                      <small className="text-muted">People Fed</small>
                    </Col>
                    <Col xs={4}>
                      <h5 className="mb-0">25+</h5>
                      <small className="text-muted">Communities</small>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="donation-form-section">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 pt-3 border-top">
                  <div className="security-badge mb-3 mb-md-0">
                    <FaShieldAlt className="me-2" />
                    <span>256-bit Secure Payment</span>
                  </div>
                  <div className="w-100 w-md-auto">
                    <Button 
                      variant="success" 
                      size="lg" 
                      className="donate-now-btn w-100"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                          Processing...
                        </>
                      ) : 'Donate Now'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default DonationForm;
