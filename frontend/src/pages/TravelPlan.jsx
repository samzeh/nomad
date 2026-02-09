import { useState, useEffect } from "react";
import LoadingOverlay from "../components/LoadingOverlay.jsx";
import "../TravelPlan.css";

function TravelPlan() {
  const savedPlan = JSON.parse(localStorage.getItem("travelPlan") || "null");
  const savedForm = JSON.parse(localStorage.getItem("formData") || "{}");

  const [plan, setPlan] = useState(savedPlan);
  const [loading, setLoading] = useState(false);

  const form = savedForm;

  useEffect(() => {
    if (plan) localStorage.setItem("travelPlan", JSON.stringify(plan));
  }, [plan]);

  if (!form || Object.keys(form).length === 0) {
    return <Navigate to="/" replace />;
  }

  const handleGenerateNew = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/travel-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const newPlan = await response.json();

      setPlan(newPlan);
    } catch (err) {
      console.error("Error generating new travel plan:", err);
      alert("Failed to generate new plan. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <LoadingOverlay/>}

      <div className="glassPanel">
        <div className="info-container">
          <h2 className="title">{plan.destination}</h2>

          <div className="trip-info-box">
            <div className="trip-info-item">
              <h1 className="trip-info-title">Trip Dates:</h1>
              <h2 className="trip-info-value">{plan.start_date} - {plan.end_date}</h2>
            </div>
            <div className="trip-info-item">
              <h1 className="trip-info-title">Total Budget:</h1>
              <h2 className="trip-info-value">${plan.total_budget}</h2>
            </div>
            <div className="trip-info-item">
              <h1 className="trip-info-title">Estimated Costs:</h1>
              <h2 className="trip-info-value">${plan.estimated_cost}</h2>
            </div>
          </div>

          <p className="description-text">{plan.reasoning}</p>

          <div className="activity-carousel">
            {plan.itinerary.map((day) => (
              <div className="activity-card" key={day.day}>
                <h3 className="activity-title">Day {day.day}</h3>
                <ul className="activity-description-list">
                  {day.activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
                <p className="activity-budget">Budget: {day.daily_budget} CAD</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerateNew}
            className="generate-button"
            disabled={loading}
          >
            {loading ? "Generating…" : "Generate New Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TravelPlan;
