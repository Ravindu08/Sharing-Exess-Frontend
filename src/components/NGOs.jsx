import React from "react";
import "./NGOs.css";

const cooperations = [
  {
    id: 1,
    name: "Ceylon Biscuits Limited (CBL)",
    logoUrl: "/cbl.jpg",
    type: "Corporate",
    description: "Leading food manufacturer supporting community nutrition programs and disaster relief efforts across Sri Lanka. CBL has distributed over 1 million nutrition packs to families in need.",
    impact: "1M+ nutrition packs distributed",
    website: "https://www.cbl.lk/"
  },
  {
    id: 2,
    name: "Dilmah Tea",
    logoUrl: "/dilmah.jpg",
    type: "Corporate",
    description: "Promoting sustainable agriculture, rural development, and ethical tea production. Dilmah supports over 10,000 smallholder farmers.",
    impact: "10,000+ farmers supported",
    website: "https://www.dilmahtea.com/"
  },
  {
    id: 3,
    name: "MAS Holdings",
    logoUrl: "/mas.jpg",
    type: "Corporate",
    description: "Empowering women and supporting local communities through apparel manufacturing and education initiatives. MAS has provided 5,000+ scholarships.",
    impact: "5,000+ scholarships awarded",
    website: "https://www.masholdings.com/"
  },
  {
    id: 4,
    name: "Brandix",
    logoUrl: "/brandix.png",
    type: "Corporate",
    description: "Driving sustainability and education initiatives in Sri Lanka, including water conservation and school programs.",
    impact: "100+ schools supported",
    website: "https://www.brandix.com/"
  },
  {
    id: 5,
    name: "Red Bull",
    logoUrl: "/redbull.jpg",
    type: "Corporate",
    description: "Supporting youth empowerment, sports, and community events in Sri Lanka. Red Bull has sponsored 50+ local events.",
    impact: "50+ community events sponsored",
    website: "https://www.redbull.com/lk-en/"
  },
  {
    id: 6,
    name: "John Keells Holdings",
    logoUrl: "/johnkeellsholdings.jpg",
    type: "Corporate",
    description: "Investing in health, education, and environmental projects, including the John Keells Foundation's island-wide initiatives.",
    impact: "200+ community projects",
    website: "https://www.keells.com/"
  },
  {
    id: 7,
    name: "Hemas Holdings",
    logoUrl: "/hemas.jpg",
    type: "Corporate",
    description: "Supporting healthcare and community well-being across Sri Lanka, with a focus on maternal and child health.",
    impact: "30+ health clinics established",
    website: "https://www.hemas.com/"
  },
  {
    id: 8,
    name: "Hayleys",
    logoUrl: "/hayleys.jpg",
    type: "Corporate",
    description: "Championing environmental and social responsibility initiatives, including reforestation and clean water projects.",
    impact: "1M+ trees planted",
    website: "https://www.hayleys.com/"
  },
  {
    id: 10,
    name: "Dialog Axiata",
    logoUrl: "/dialog.jpg",
    type: "Corporate",
    description: "Driving digital inclusion and educational programs, providing free internet to 1,000+ schools.",
    impact: "1,000+ schools connected",
    website: "https://www.dialog.lk/"
  },
  {
    id: 11,
    name: "Commercial Bank of Ceylon",
    logoUrl: "/commercial.jpg",
    type: "Corporate",
    description: "Supporting entrepreneurship and financial literacy, with micro-loans to 20,000+ small businesses.",
    impact: "20,000+ micro-loans granted",
    website: "https://www.combank.lk/"
  },
  // Add more cooperations as needed
];

const NGOs = () => (
  <div className="ngos-page">
    <section className="ngos-hero">
      <img src="/volunteer-hero.jpg" alt="Volunteers" className="ngos-hero-img" style={{ width: '600px', maxWidth: '98vw' }} />
      <div className="ngos-hero-content">
        <h2>Cooperations in Sri Lanka</h2>
        <h1>Making an Impact in Local Communities</h1>
        <p>
          We proudly collaborate with leading Sri Lankan cooperations that are committed to uplifting communities, supporting education, health, and sustainability. Their contributions make a real difference across the island.
        </p>
        <a href="/contact" className="ngos-cta-btn">Reach out to the team</a>
      </div>
    </section>
    <section className="partners-section">
      <h2>Our Cooperations</h2>
      <div className="partners-grid expanded">
        {cooperations.map(coop => (
          <div className="partner-card expanded" key={coop.id}>
            {coop.logoUrl && (
              <img src={coop.logoUrl} alt={coop.name} className="partner-logo large" />
            )}
            <h3>{coop.name}</h3>
            <p className="partner-type">{coop.type}</p>
            <p className="partner-impact">{coop.impact}</p>
            <p className="partner-desc">{coop.description}</p>
            {coop.website && (
              <a href={coop.website} target="_blank" rel="noopener noreferrer" className="partner-link">
                Visit Website
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default NGOs; 