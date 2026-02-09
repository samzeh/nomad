import React from "react";

// trying glass effect did not work

function TestPage() {
  return (
    <div style={styles.page}>
      {/* Full-page background image */}
      <img
        src="https://picsum.photos/1600/900"
        alt="background"
        style={styles.bg}
      />

      {/* Glass panel on the right */}
      <div style={styles.glassPanel}>
        <h2 style={styles.title}>Liquid Glass Panel</h2>
        <p style={styles.text}>
          Your travel planner form will go here.
        </p>
      </div>
    </div>
  );
}

export default TestPage;

const styles = {
  page: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    background: "#000",
  },

  bg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  },

  glassPanel: {
    position: "fixed",
    right: "64px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "450px",
    height: "600px",
    
    // Glassmorphism effect
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px) saturate(180%)",
    WebkitBackdropFilter: "blur(10px) saturate(180%)", // Safari support
    
    // Border and shadows
    border: "1px solid rgba(255, 255, 255, 0.18)",
    borderRadius: "28px",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    
    // Content styling
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "40px",
    color: "white",
    zIndex: 10,
  },

  title: {
    fontSize: "32px",
    marginBottom: "20px",
    fontWeight: "600",
    margin: 0,
    marginBottom: "20px",
  },

  text: {
    fontSize: "16px",
    lineHeight: 1.5,
    margin: 0,
  },
};