import React from "react";
import "./TravelPlan.css";


// trying glass effect did not work

function TestPage() {
  return (
    <div>
      <div className="glassPanel">
        <div className="info-container">
            <h2 className="title">Your trip to Japan</h2>
            <div className = "trip-info-box">
              <div className = "trip-info-item">
                <h1 className = "trip-info-title">Duration:</h1>
                <h2 className = "trip-info-value">5 days</h2>
              </div>
              <div className = "trip-info-item">
                <h1 className = "trip-info-title">Total Budget:</h1>
                <h2 className = "trip-info-value">$3000</h2>
              </div>
              <div className = "trip-info-item">
                <h1 className = "trip-info-title">Estimated Costs:</h1>
                <h2 className = "trip-info-value">$1500</h2>
              </div>
            </div>
            <p className="description-text">
            Japans unique and diverse atmosphere aligns with your love to explore different cultures!             Japans unique and diverse atmosphere aligns with your love to explore different cultures!
            </p>

            <div className = "activity-carousel">
                <div className="activity-card">
                    <h3 className="activity-title">Day 1</h3>
                    <p className="activity-description">Experience the vibrant city life, from the bustling streets of Shibuya to the historic temples of Asakusa.</p>
                </div>

                <div className="activity-card">
                    <h3 className="activity-title">Day 2</h3>
                    <p className="activity-description">Discover ancient traditions and stunning temples in Kyoto, a city that perfectly blends history with natural beauty.</p>
                </div>

                <div className="activity-card">
                    <h3 className="activity-title">Day 3</h3>
                    <p className="activity-description">Unwind in the hot springs of Hakone while enjoying breathtaking views of Mount Fuji.</p>
                </div>

                <div className="activity-card">
                    <h3 className="activity-title">Day 3</h3>
                    <p className="activity-description">Unwind in the hot springs of Hakone while enjoying breathtaking views of Mount Fuji.</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

export default TestPage;
