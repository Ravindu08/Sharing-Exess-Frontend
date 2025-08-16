import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FINAL_MEALS = 1234567; // Placeholder, update as needed
const ANIMATION_DURATION = 2000; // ms

function ImpactSection() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let start = 0;
    const increment = Math.ceil(FINAL_MEALS / (ANIMATION_DURATION / 16));
    const interval = setInterval(() => {
      start += increment;
      if (start >= FINAL_MEALS) {
        setCount(FINAL_MEALS);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="impact-section">
      <div className="impact-content">
        <div className="impact-counter">
          <span className="impact-number">{count.toLocaleString()}</span>
          <span className="impact-label">meals distributed so far</span>
        </div>
        <p className="impact-description">
          Since our founding, we've distributed enough surplus food to provide over <strong>{FINAL_MEALS.toLocaleString()}</strong> meals to those in need. Every meal counts in the fight against hunger.
        </p>
        <button className="impact-btn" onClick={() => navigate('/about')}>Learn About Our Impact</button>
      </div>
    </section>
  );
}

export default ImpactSection; 