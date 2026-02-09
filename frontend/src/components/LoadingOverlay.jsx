// components/LoadingOverlay.jsx
import { useEffect, useState } from "react";

export default function LoadingOverlay({ message = "Generating your travel plan… ✈️" }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Increment progress gradually until it hits 90% (we'll wait for API to reach 100%)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // stop at 90%, wait for API
        return prev + Math.random() * 5; // add 0-5% randomly
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.overlay}>
      <h2>{message}</h2>
      <p>Please wait</p>
      <div style={styles.progressBarContainer}>
        <div style={{ ...styles.progressBarFill, width: `${progress}%` }} />
      </div>
      <p>{Math.floor(progress)}%</p>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,1)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif",
    zIndex: 9999,
  },
  
  progressBarContainer: {
    width: "60%",
    height: "20px",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "1rem",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: "10px 0 0 10px",
    transition: "width 0.3s ease-in-out",
  },
};
