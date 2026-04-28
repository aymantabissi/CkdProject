// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // { token, email, name, role }
  const [loading, setLoading] = useState(true);   // حين يتحقق من localStorage

  // عند بداية التطبيق — نتحقق إذا كان فيه token محفوظ
  useEffect(() => {
    const stored = localStorage.getItem("nephroai_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // تحقق بسيط — إذا عندو token و role
        if (parsed?.token && parsed?.role) {
          setUser(parsed);
        }
      } catch {
        localStorage.removeItem("nephroai_user");
      }
    }
    setLoading(false);
  }, []);

  // ─── Login ──────────────────────────────────────────────────────────────
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("nephroai_user", JSON.stringify(userData));
  };

  // ─── Logout ─────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    localStorage.removeItem("nephroai_user");
  };

  // ─── Helper: authorization header ───────────────────────────────────────
  const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: user?.token ? `Bearer ${user.token}` : "",
  });

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, authHeader }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook سهل الاستعمال
export function useAuth() {
  return useContext(AuthContext);
}