// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";

const BASE_URL = "http://127.0.0.1:5000";

// redirect بحسب الـ role
function redirectByRole(role, navigate) {
  if (role === "admin")        navigate("/admin");
  else if (role === "doctor")  navigate("/predict");
  else                         navigate("/my-results");
}

export default function LoginPage() {
  const navigate      = useNavigate();
  const { login }     = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ─── Login classique ───────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      return toast.error("Please fill in all fields");
    }

    const loadingToast = toast.loading("Signing in...");

    try {
      const res  = await fetch(`${BASE_URL}/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();

      if (data.token) {
        // حفظ في AuthContext بدل localStorage مباشرة
        login({
          token: data.token,
          email: data.email,
          name:  data.name  || "",
          role:  data.role  || "patient",
        });

        toast.success(`Welcome back${data.name ? ", " + data.name : ""}! 👋`, { id: loadingToast });
        setTimeout(() => redirectByRole(data.role, navigate), 800);
      } else {
        toast.error(data.error || "Invalid credentials", { id: loadingToast });
      }
    } catch {
      toast.error("Server error — is the backend running?", { id: loadingToast });
    }
  };

  // ─── Google Login ──────────────────────────────────────────────────────────
  const handleGoogleSuccess = async (credentialResponse) => {
    const loadingToast = toast.loading("Signing in with Google...");

    try {
      const decoded = jwtDecode(credentialResponse.credential);

      // نرسلو Google token للـ backend باش يتحقق ويرجع JWT ديالنا
      const res = await fetch(`${BASE_URL}/auth/google`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ credential: credentialResponse.credential }),
      });

      if (res.ok) {
        const data = await res.json();
        login({
          token: data.token,
          email: data.email,
          name:  data.name || decoded.given_name || "",
          role:  data.role || "patient",
        });
        toast.success(`Welcome, ${data.name || decoded.given_name}! 👋`, { id: loadingToast });
        setTimeout(() => redirectByRole(data.role, navigate), 800);
      } else {
        // fallback — نستعملو Google token مباشرة (بدون role check)
        login({
          token:  credentialResponse.credential,
          email:  decoded.email,
          name:   decoded.given_name || decoded.name || "",
          role:   "patient",   // default للـ Google users
          google: true,
        });
        toast.success(`Welcome, ${decoded.given_name || "User"}! 👋`, { id: loadingToast });
        setTimeout(() => navigate("/my-results"), 800);
      }
    } catch {
      toast.error("Google authentication failed", { id: loadingToast });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white"
      style={{ background: "linear-gradient(135deg, #0f2942 0%, #0d3d56 50%, #0a4a4a 100%)" }}
    >
      <Toaster position="top-right" />

      {/* Blobs */}
      <div className="fixed top-[-100px] left-[-100px] w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.08), transparent 70%)" }} />
      <div className="fixed bottom-[-80px] right-[-80px] w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(52,211,153,0.08), transparent 70%)" }} />

      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.25)" }}
          >
            <svg className="w-6 h-6 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.5 2 5 5.2 5 9.2c0 2.8 1.3 5.3 2.8 7.2C9.5 18.5 10.2 21 12 21c1.8 0 2.5-2.5 4.2-4.6C17.7 14.5 19 12 19 9.2 19 5.2 15.5 2 12 2z" />
              <line x1="12" y1="8" x2="12" y2="13" /><line x1="9.5" y1="10.5" x2="14.5" y2="10.5" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">NephroAI</h1>
          <p className="text-[12px] text-white/30 mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
          }}
        >
          {/* Top strip */}
          <div className="h-0.5" style={{ background: "linear-gradient(90deg, #38bdf8, #34d399, #818cf8)" }} />

          <div className="p-6 space-y-4">

            {/* Email */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">Email</p>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-2.5 rounded-xl text-[13px] text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            </div>

            {/* Password */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">Password</p>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-2.5 rounded-xl text-[13px] text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-2xl font-bold text-[13px] text-white transition-all hover:brightness-110 active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #0d9488)",
                boxShadow: "0 4px 20px rgba(14,165,233,0.3)",
              }}
            >
              Sign In
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Or</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Google */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Authentication Failed")}
                theme="filled_blue"
                shape="pill"
                width="320"
              />
            </div>

            {/* Register link */}
            <p className="text-center text-[12px] text-white/30 pt-1">
              Don't have an account?{" "}
              <Link to="/register" className="text-sky-300 hover:text-sky-200 font-semibold transition-colors">
                Create Account
              </Link>
            </p>

          </div>
        </div>

        <p className="text-center text-[10px] text-white/15 mt-6 uppercase tracking-widest">
          NephroAI · Secure Medical Platform
        </p>

      </div>
    </div>
  );
}