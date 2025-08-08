import React from 'react';

function About() {
  return (
    <section
      className="about"
      style={{
        position: 'relative',
        backgroundImage: 'url(/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        zIndex: 1
      }}
    >
      {/* Dark overlay removed for brighter background */}
      <div className="container" style={{ position: 'relative', zIndex: 3 }}>
        <h2 style={{ color: '#fff', textShadow: '1px 1px 6px rgba(0,0,0,0.5)', fontFamily: "'Montserrat', sans-serif" }}>About Sharing Excess</h2>
        <p style={{ fontSize: '1.2rem', fontWeight: 500, color: '#fff', textShadow: '1px 1px 6px rgba(0,0,0,0.5)', fontFamily: "'Montserrat', sans-serif" }}>
          Every year, millions of tons of food are wasted while countless families go hungry. In Sri Lanka alone, food insecurity affects thousands of children and adults daily. At the same time, surplus food from restaurants, events, and households often ends up in landfills, contributing to environmental harm.
        </p>
        <p style={{ color: '#fff', textShadow: '1px 1px 6px rgba(0,0,0,0.5)', fontFamily: "'Montserrat', sans-serif" }}>
          <em>Imagine a world where no meal goes to waste and no person goes to bed hungry.</em>
        </p>
        <p style={{ color: '#fff', textShadow: '1px 1px 6px rgba(0,0,0,0.5)', fontFamily: "'Montserrat', sans-serif" }}>
          <strong>Sharing Excess</strong> is a food redistribution platform in Sri Lanka that bridges the gap between surplus and scarcity. Our mission is to create a sustainable system where leftover food is redirected to trusted NGOs, minimizing waste and maximizing impact. By connecting donors with NGOs and recipients, we ensure that good food reaches those who need it most.
        </p>
        <div style={{ margin: '40px 0', background: 'rgba(40,167,69,0.92)', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.18)', padding: '30px', textAlign: 'left' }}>
          <h3 style={{ color: '#fff', textShadow: '1px 1px 6px rgba(0,0,0,0.5)', fontFamily: "'Montserrat', sans-serif" }}>Why This Matters</h3>
          <ul style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#fff', textShadow: '1px 1px 6px rgba(0,0,0,0.5)', fontFamily: "'Montserrat', sans-serif" }}>
            <li>Over 800,000 Sri Lankans face food insecurity every year.</li>
            <li>1/3 of all food produced globally is lost or wasted.</li>
            <li>Food waste is a major contributor to climate change.</li>
            <li>Redistributing surplus food can save lives and protect the environment.</li>
          </ul>
        </div>
        <div style={{ margin: '40px 0', background: 'rgba(255,255,255,0.9)', borderRadius: '12px', padding: '30px', textAlign: 'left', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#28a745', textShadow: '1px 1px 6px rgba(0,0,0,0.3)', fontFamily: "'Montserrat', sans-serif" }}>How It Works</h3>
          <ol style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#000', textShadow: 'none', fontFamily: "'Montserrat', sans-serif" }}>
            <li><strong>Donors</strong> (restaurants, hotels, individuals) list surplus food on our platform.</li>
            <li><strong>NGOs</strong> and <strong>recipients</strong> browse available food and request what they need.</li>
            <li>We coordinate safe, timely pickups and deliveries to ensure food reaches those in need.</li>
            <li>Everyone benefits: less waste, more full stomachs, and a healthier planet.</li>
          </ol>
        </div>
        <div style={{ margin: '40px 0', background: 'rgba(40,167,69,0.92)', borderRadius: '12px', padding: '30px', textAlign: 'center' }}>
          <h3 style={{ color: '#fff', textShadow: '1px 1px 6px rgba(0,0,0,0.5)', fontFamily: "'Montserrat', sans-serif" }}>Join Us in Making a Difference</h3>
          <p style={{ fontSize: '1.15rem', color: '#fff', textShadow: '1px 1px 6px rgba(0,0,0,0.5)', fontFamily: "'Montserrat', sans-serif" }}>
            Whether you are a business, an NGO, or an individual, you can help us fight hunger and food waste. <br />
            <strong>Become a donor, recipient, or volunteer today!</strong>
          </p>
        </div>
        <hr style={{ margin: '40px 0', border: '1px solid #ccc' }} />
        <h2 style={{ color: '#fff', textShadow: '1px 1px 6px rgba(0,0,0,0.5)', fontFamily: "'Montserrat', sans-serif" }}>Contact Us</h2>
        <p style={{ color: '#fff', textShadow: '1px 1px 6px rgba(0,0,0,0.5)', fontFamily: "'Montserrat', sans-serif" }}>
          <strong>Email:</strong> info@sharingexcess.lk<br />
          <strong>Phone:</strong> +94 77 123 4567<br />
          <strong>Address:</strong> Uva Wellassa University, Badulla, Sri Lanka
        </p>
      </div>
    </section>
  );
}

export default About; 