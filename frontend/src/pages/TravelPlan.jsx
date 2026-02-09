import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingOverlay from "../components/LoadingOverlay.jsx";
import "./TravelPlan.css";

function TravelPlan() {
  const { state } = useLocation();
  const { travelPlan, formData } = state || {};

  const [plan, setPlan] = useState(travelPlan || null);
  const [form, setForm] = useState(formData || JSON.parse(localStorage.getItem("formData")));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (plan) localStorage.setItem("travelPlan", JSON.stringify(plan));
  }, [plan]);

  if (!form) return <p>No form data found. Go back and submit the form.</p>;

  const handleGenerateNew = async () => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const response = await fetch("http://127.0.0.1:8000/travel-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const newPlan = await response.json();

      const elapsed = Date.now() - startTime;
      if (elapsed < 500) {
        await new Promise((res) => setTimeout(res, 500 - elapsed));
      }

      setPlan(newPlan);
    } catch (err) {
      console.error("Error generating new travel plan:", err);
      alert("Failed to generate new plan. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!plan) return <p>Loading your travel plan…</p>;

  return (
    <div>
      {loading && <LoadingOverlay message="Generating your travel plan… ✈️" />}

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
            style={{
              marginTop: "2rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "10px",
              border: "none",
              background: "#4caf50",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
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
