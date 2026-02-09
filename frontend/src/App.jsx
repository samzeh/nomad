import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormPage from "./pages/FormPage";
import TravelPlan from "./pages/TravelPlan";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/plan" element={<TravelPlan />} />
      </Routes>
    </Router>
  );
}

export default App;
