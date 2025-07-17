import React from 'react';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Footer from './components/Footer.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home.jsx';
import DonorDashboard from './DonorDashboard.jsx';
import RecipientDashboard from './RecipientDashboard.jsx';
import BackendTest from './components/BackendTest.jsx';

function App() {
  return (
    <Router>
      <div className="app-root">
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/donor-dashboard" element={<DonorDashboard />} />
            <Route path="/recipient-dashboard" element={<RecipientDashboard />} />
            <Route path="/test-backend" element={<BackendTest />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
