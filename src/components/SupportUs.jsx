import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaHandHoldingHeart, FaHandsHelping, FaLightbulb } from 'react-icons/fa';

const SupportUs = () => {
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
                <Button variant="primary">Donate Now</Button>
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
                <Button variant="success">Volunteer Now</Button>
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
                <Button variant="warning">Partner With Us</Button>
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
      
      <style jsx>{`
        .support-us {
          background-color: transparent;
          min-height: calc(100vh - 160px);
        }
        .support-container {
          /* Same gradient as .custom-navbar */
          background: linear-gradient(135deg, #4ca728 0%, #20c997 100%);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 12px 32px rgba(40, 167, 69, 0.25);
          padding: 2rem;
          color: #fff;
        }
        .support-container h1,
        .support-container h2,
        .support-container h3,
        .support-container p { color: #fff; }
        .support-container .card p,
        .support-container .card h3 { color: #212529; }
        .icon-wrapper {
          width: 80px;
          height: 80px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
        }
        .card {
          transition: transform 0.3s ease;
          border: none;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.95);
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .impact-stats h3 {
          font-weight: 700;
        }
        .cta-section {
          background: linear-gradient(135deg, rgba(248, 249, 250, 0.9) 0%, rgba(233, 236, 239, 0.9) 100%);
          border-radius: 15px;
          padding: 3rem !important;
        }
        /* Override: make CTA heading and paragraph black as requested */
        .support-container .cta-section h2,
        .support-container .cta-section p {
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default SupportUs;
