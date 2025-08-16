import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaHandHoldingHeart, FaHandsHelping, FaLightbulb } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/SupportUs.css';

const SupportUs = () => {
  const navigate = useNavigate();
  return (
    <div className="support-us py-5">
      <Container className="support-container">
        <h1 className="text-center mb-5">Support Our Cause</h1>
        
        <Row className="mb-5">
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="icon-wrapper mb-3">
                  <FaHandHoldingHeart size={40} className="text-primary" />
                </div>
                <h3>Donate</h3>
                <p>Your financial support helps us continue our mission to reduce food waste and feed those in need.</p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/donate-money')}
                  className="donate-btn"
                >
                  Donate Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="icon-wrapper mb-3">
                  <FaHandsHelping size={40} className="text-success" />
                </div>
                <h3>Volunteer</h3>
                <p>Join our team of dedicated volunteers and make a direct impact in your community.</p>
                <Button variant="success" onClick={() => navigate('/contact')}>Volunteer Now</Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="icon-wrapper mb-3">
                  <FaLightbulb size={40} className="text-warning" />
                </div>
                <h3>Partner With Us</h3>
                <p>Businesses and organizations can partner with us to create meaningful change together.</p>
                <Button variant="warning" onClick={() => navigate('/contact')}>Partner With Us</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <div className="impact-stats p-4 rounded-3 mb-5">
          <h2 className="text-center mb-4">Our Impact</h2>
          <Row className="text-center">
            <Col md={4} className="mb-3">
              <h3 className="display-4 text-primary">10,000+</h3>
              <p>Meals Served</p>
            </Col>
            <Col md={4} className="mb-3">
              <h3 className="display-4 text-success">500+</h3>
              <p>Volunteers</p>
            </Col>
            <Col md={4} className="mb-3">
              <h3 className="display-4 text-warning">50+</h3>
              <p>Community Partners</p>
            </Col>
          </Row>
        </div>
        
        <div className="cta-section text-center py-4">
          <h2 className="mb-4">Ready to Make a Difference?</h2>
          <p className="lead mb-4">Join us in our mission to reduce food waste and fight hunger in Sri Lanka.</p>
          <Button variant="primary" size="lg" className="me-2">Get Involved</Button>
          <Button variant="outline-secondary" size="lg">Contact Us</Button>
        </div>
      </Container>
      
      {/* Donation modal removed: navigate to /donate-money instead */}
    </div>
  );
};

export default SupportUs;
