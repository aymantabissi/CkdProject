// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute   from "./components/ProtectedRoute";
import Navbar           from "./components/Navbar";
import Chatbot          from "./components/Chatbot";

// Pages
import LandingPage      from "./pages/LandingPage";
import LoginPage        from "./pages/LoginPage";
import PredictionPage   from "./pages/PredictionPage";
import DashboardPage    from "./pages/DashboardPage";
import AboutPage        from "./pages/AboutPage";

// Placeholder pages (نزيدوهم لاحقاً)
const MyResults  = () => <div className="min-h-screen flex items-center justify-center text-white" style={{background:"#0f2942"}}>My Results — Coming Soon</div>;
const AdminPage  = () => <div className="min-h-screen flex items-center justify-center text-white" style={{background:"#0f2942"}}>Admin Dashboard — Coming Soon</div>;
const Unauthorized = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{background:"#0f2942"}}>
    <p className="text-4xl">🔒</p>
    <p className="text-white font-bold text-lg">Access Denied</p>
    <p className="text-white/40 text-sm">You don't have permission to view this page.</p>
  </div>
);

export default function App() {
  return (
   
      <BrowserRouter>
        <Navbar />
        <Chatbot />
        <div className="pt-16">
          <Routes>

            {/* ── Public ── */}
            <Route path="/"             element={<LandingPage />} />
            <Route path="/login"        element={<LoginPage />} />
            <Route path="/about"        element={<AboutPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* ── Doctor + Admin ── */}
            <Route path="/predict" element={
              <ProtectedRoute roles={["doctor", "admin"]}>
                <PredictionPage />
              </ProtectedRoute>
            } />

            {/* ── Admin only ── */}
            <Route path="/dashboard" element={
              <ProtectedRoute roles={["admin", "doctor"]}>
                <DashboardPage />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPage />
              </ProtectedRoute>
            } />

            {/* ── Patient ── */}
            <Route path="/my-results" element={
              <ProtectedRoute roles={["patient", "doctor", "admin"]}>
                <MyResults />
              </ProtectedRoute>
            } />

            {/* ── Fallback ── */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </div>
      </BrowserRouter>
  );
}