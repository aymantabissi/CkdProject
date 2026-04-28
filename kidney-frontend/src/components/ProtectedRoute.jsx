// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * استعمال:
 * <ProtectedRoute>                          ← أي user مسجل
 * <ProtectedRoute roles={["admin"]}>        ← admin فقط
 * <ProtectedRoute roles={["admin","doctor"]}> ← admin أو doctor
 */
export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();

  // حين يتحقق من localStorage — ما يعرضش شي
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0f2942, #0a4a4a)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-2xl animate-pulse"
            style={{ background: "rgba(56,189,248,0.2)" }}
          />
          <p className="text-white/40 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // ما مسجلش — روح للـ login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // مسجل لكن ما عندوش الـ role المطلوب
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}