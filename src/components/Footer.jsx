import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-columns">
          <div className="footer-col">
            <h4>Sharing Excess</h4>
            <p className="footer-tagline">
              Reducing food waste by connecting donors with NGOs and recipients across Sri Lanka.
            </p>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul className="contact-list">
              <li>📍 Uva Wellassa University, Badulla, Sri Lanka</li>
              <li>
                📞 <a href="tel:+94771234567">+94 77 123 4567</a>
              </li>
              <li>
                ✉️ <a href="mailto:info@sharingexcess.lk">info@sharingexcess.lk</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X">X</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">LinkedIn</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/donate">Donate</a></li>
              <li><a href="/request">Request</a></li>
              <li><a href="/ngos">NGOs</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {currentYear} Sharing Excess. All rights reserved.</span>
          <span className="footer-legal">
            <a href="#">Privacy</a>
            <span className="footer-sep">•</span>
            <a href="#">Terms</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;