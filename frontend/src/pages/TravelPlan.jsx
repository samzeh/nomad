import { useLocation } from "react-router-dom";
import { useState } from "react";
import LoadingOverlay from "../components/LoadingOverlay.jsx";

function TravelPlan() {
  const { state } = useLocation();
  const { travelPlan, formData } = state || {};
  const [plan, setPlan] = useState(travelPlan);
  const [loading, setLoading] = useState(false);

  if (!plan) return <p>No travel plan found. Go back and submit the form.</p>;

  const handleGenerateNew = async () => {
    if (!formData) return;

    setLoading(true); 
    const startTime = Date.now();

    try {
      const response = await fetch("http://127.0.0.1:8000/travel-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const newPlan = await response.json();

      const elapsed = Date.now() - startTime;
      if (elapsed < 500) {
        await new Promise((res) => setTimeout(res, 500 - elapsed));
      }

      setPlan(newPlan); 
    } catch (err) {
      console.error("Error fetching new travel plan:", err);
      alert("Failed to generate new plan. Try again.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div style={{ padding: "2rem", position: "relative" }}>
      {/* Overlay while loading */}
      {loading && <LoadingOverlay message="Generating your travel plan… ✈️" />}

      {/* Travel plan info */}
      <h1>{plan.destination}</h1>
      <p>{plan.reasoning}</p>
      <p>Duration: {plan.duration} days</p>
      <p>Total Budget: {plan.total_budget} CAD</p>
      <p>Estimated Cost: {plan.estimated_cost} CAD</p>

      <ul>
        {plan.itinerary.map((day) => (
          <li key={day.day}>
            <strong>Day {day.day}:</strong> {day.activities.join(", ")} (Budget: {day.daily_budget} CAD)
          </li>
        ))}
      </ul>

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
  );
}

export default TravelPlan;