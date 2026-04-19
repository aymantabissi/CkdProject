// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/predict", label: "Prediction" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-8"
      style={{
        background: "rgba(15, 41, 66, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.25)" }}
        >
          <svg
            className="w-4 h-4 text-sky-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2C8.5 2 5 5.2 5 9.2c0 2.8 1.3 5.3 2.8 7.2C9.5 18.5 10.2 21 12 21c1.8 0 2.5-2.5 4.2-4.6C17.7 14.5 19 12 19 9.2 19 5.2 15.5 2 12 2z" />
            <line x1="12" y1="8" x2="12" y2="13" />
            <line x1="9.5" y1="10.5" x2="14.5" y2="10.5" />
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-bold text-white leading-none">NephroAI</p>
          <p className="text-[10px] text-sky-300/60 leading-none mt-0.5">Kidney Risk Predictor</p>
        </div>
      </div>

      {/* Links */}
      <div className="flex items-center gap-1">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-[12.5px] font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-sky-500/15 text-sky-300 border border-sky-500/20"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate("/predict")}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white transition-all hover:scale-[1.03] active:scale-[0.97]"
        style={{
          background: "linear-gradient(135deg, #0ea5e9, #0d9488)",
          boxShadow: "0 4px 16px rgba(14,165,233,0.25)",
        }}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Predict Now
      </button>
    </nav>
  );
}