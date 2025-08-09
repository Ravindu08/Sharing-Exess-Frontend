import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ImpactSection() {
  const [count, setCount] = useState(0);
  const [targetMeals, setTargetMeals] = useState(0);
  const navigate = useNavigate();
  const BASE_MEALS = 1200000; // A baseline for randomization
  const ANIMATION_DURATION = 2000; // ms

  useEffect(() => {
    // Generate a random target between 95% and 115% of BASE_MEALS
    const randomFactor = 0.95 + Math.random() * 0.20; // 0.95 to 1.15
    const newTarget = Math.floor(BASE_MEALS * randomFactor);
    setTargetMeals(newTarget);

    let start = 0;
    const increment = Math.ceil(newTarget / (ANIMATION_DURATION / 16)); // ~60 frames per second
    const interval = setInterval(() => {
      start += increment;
      if (start >= newTarget) {
        setCount(newTarget);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run once on mount

  return (
    <section className="impact-section">
      <div className="impact-content">
        <div className="impact-counter">
          <span className="impact-number">{count.toLocaleString()}</span>
          <span className="impact-label">meals distributed so far</span>
        </div>
        <p className="impact-description">
          Since our founding, we've distributed enough surplus food to provide over <strong>{targetMeals.toLocaleString()}</strong> meals to those in need. Every meal counts in the fight against hunger.
        </p>
        <button className="impact-btn" onClick={() => navigate('/about')}>Learn About Our Impact</button>
      </div>
    </section>
  );
}

export default ImpactSection; 