// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import PredictionPage from "./pages/PredictionPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <BrowserRouter>
        <div className="pt-2">

      {/* Navbar shown on every page */}
      <Navbar />

      {/* Page content — pt-20 to avoid navbar overlap */}
      <div className="pt-20">
        <Routes>
          <Route path="/"        element={<LandingPage />} />
          <Route path="/predict" element={<PredictionPage />} />
          <Route path="/about"   element={<AboutPage />} />
        </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}