import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TravelPlan from "./pages/TravelPlan";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plan" element={<TravelPlan />} />
      </Routes>
    </Router>
  );
}

export default App;
