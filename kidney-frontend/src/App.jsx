// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage    from "./pages/LandingPage";
import PredictionPage from "./pages/PredictionPage";
import DashboardPage  from "./pages/DashboardPage";
import AboutPage      from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/"          element={<LandingPage />}    />
          <Route path="/predict"   element={<PredictionPage />} />
          <Route path="/dashboard" element={<DashboardPage />}  />
          <Route path="/about"     element={<AboutPage />}      />
          <Route path="/login" element={<LoginPage />} />
<Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}