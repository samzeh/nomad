import { useState } from "react";
import "./App.css";

function App() {
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("");
  const [culturalPreferences, setCulturalPreferences] = useState("");
  const [interests, setInterests] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted travel info:", { date, budget, interests, culturalPreferences });
    alert(`Travel Date: ${date}\nBudget: ${budget} CAD\nInterests: ${interests}\nCultural Preferences: ${culturalPreferences}`);
  };

  return (
    <>
      <div className="logo-container">
        <h1>Nomad</h1>
      </div>

      <div className="form-container">
        <form 
          onSubmit={handleSubmit} 
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            padding: "2rem",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <label>
            Travel Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{ marginTop: "0.5rem", padding: "0.5rem", borderRadius: "8px", border: "1px solid #ccc", width: "100%" }}
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
              style={{ marginTop: "0.5rem", padding: "0.5rem", borderRadius: "8px", border: "1px solid #ccc", width: "100%" }}
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
              style={{ marginTop: "0.5rem", padding: "0.5rem", borderRadius: "8px", border: "1px solid #ccc", width: "100%" }}
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
              style={{ marginTop: "0.5rem", padding: "0.5rem", borderRadius: "8px", border: "1px solid #ccc", width: "100%" }}
            />
          </label>

          <button
            type="submit"
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "10px",
              border: "none",
              background: "rgba(255, 255, 255, 0.6)",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
