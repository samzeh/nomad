import { useEffect, useState } from "react";
import "../LoadingOverlay.css";


export default function LoadingOverlay() {
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
    <div className="overlay">
      <video className="loading-video" autoPlay muted loop playsInline>
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <div className="loading-text">
        <h2>creating adventures...</h2>
        <img src="/icon.gif" alt="Nomad logo" />
        <p>{Math.floor(progress)}%</p>
      </div>
    </div>
  );
}