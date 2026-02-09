import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import LoadingOverlay from "../components/LoadingOverlay";

function FormPage() {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [home_location, setHomeLocation] = useState("");
  const [interests, setInterests] = useState("");
  const [culturalPreferences, setCulturalPreferences] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const requestBody = {
      budget: Number(budget),
      start_date: startDate,
      end_date: endDate,
      date_range: `${startDate} - ${endDate}`,
      interests: interests.split(",").map((i) => i.trim()),
      cultural_preferences: culturalPreferences,
      home_location: home_location,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/travel-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const travelPlan = await response.json();

      localStorage.setItem("travelPlan", JSON.stringify(travelPlan));
      localStorage.setItem("formData", JSON.stringify(requestBody));

      navigate("/plan", { state: { travelPlan } });
    } catch (err) {
      console.error("Error fetching travel plan:", err);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay message="Generating your travel plan… ✈️" />}
      <div className="logo-container">
        <h1>Nomad</h1>
        <img src="/icon.gif" alt="Nomad logo" />
      </div>

      <div className="form-container">
        <h1>Where to?</h1>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            height: "100%",
          }}
        >
          <label>
            Travel Dates:
            <div style={{ display: "flex", gap: "1rem" }}>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                style={{
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  flex: 1,
                }}
              />
              <span style={{ alignSelf: "center" }}>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                style={{
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  flex: 1,
                }}
              />
            </div>
          </label>

          <label>
            Travelling from:
            <input
              type="text"
              value={home_location}
              onChange={(e) => setHomeLocation(e.target.value)}
              required
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                border: "none",
                width: "100%",
              }}
            />
          </label>
          
          <label>
            Budget (CAD):
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              min={0}
              required
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                border: "none",
                width: "100%",
              }}
            />
          </label>

          <label>
            Interests/Hobbies:
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              required
              placeholder="e.g., hiking, food, art"
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "100%",
              }}
            />
          </label>

          <label>
            Cultural Preferences:
            <input
              type="text"
              value={culturalPreferences}
              onChange={(e) => setCulturalPreferences(e.target.value)}
              required
              placeholder="e.g., museums, local cuisine"
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "100%",
              }}
            />
          </label>

          <button
            type="submit"
            className = "submit-button"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default FormPage;
