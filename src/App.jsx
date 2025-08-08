import React from 'react';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Footer from './components/Footer.jsx';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home.jsx';
import DonorDashboard from './DonorDashboard.jsx';
import RecipientDashboard from './RecipientDashboard.jsx';
import OfficerDashboard from './OfficerDashboard.jsx';
import BackendTest from './components/BackendTest.jsx';
import NGOs from './components/NGOs.jsx';
import Donate from './components/Donate.jsx';
import FoodDonationsDashboard from './components/FoodDonationsDashboard.jsx';
import CalendarPage from './components/CalendarPage.jsx';
import Contact from './components/Contact.jsx';
import Request from './components/Request.jsx';

function AppContent() {
  const location = useLocation();
  const isOfficerPage = location.pathname.startsWith('/officer');
  return (
      <div className="app-root">
        <Navbar />
        <div className={isOfficerPage ? 'main-background no-bg' : 'main-background'}>
          <div className="app-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/donor-dashboard" element={<DonorDashboard />} />
              <Route path="/recipient-dashboard" element={<RecipientDashboard />} />
              <Route path="/test-backend" element={<BackendTest />} />
              <Route path="/about" element={<About />} />
              <Route path="/ngos" element={<NGOs />} />
              <Route path="/donate" element={<Donate />} />
              {/* <Route path="/request" element={<Request />} /> */}
              <Route path="/food-donations" element={<FoodDonationsDashboard />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/officer" element={<OfficerDashboard />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
