import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/predict", label: "Prediction" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-4"
      style={{
        // Khdina l-alwan dyal l-login background bach yji mowhed
        background: "rgba(15, 41, 66, 0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Logo modernisé */}
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => navigate("/")}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-sky-500/20 shadow-lg shadow-sky-500/10"
          style={{ background: "rgba(14, 165, 233, 0.15)" }}
        >
          <span className="text-xl">🩺</span>
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-tight text-white leading-none">
            Nephro<span className="text-sky-400">AI</span>
          </h1>
          <p className="text-[9px] font-medium text-sky-300/40 uppercase tracking-[0.15em]">
            Kidney Predictor
          </p>
        </div>
      </div>

      {/* Nav Links Mowhedin */}
      <div className="flex items-center gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 ${
                isActive
                  ? "text-sky-300 bg-sky-500/10 border border-sky-500/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Auth Buttons Mowhedin m3a design dyal Login */}
      <div className="flex items-center gap-4">
        {!token ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-semibold text-white/60 hover:text-white transition-all"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-sky-500/20"
              style={{
                // Nefs l-gradient li f-bouton login dyalk
                background: "linear-gradient(135deg, #0ea5e9, #0d9488)",
              }}
            >
              Register
            </button>
          </>
        ) : (
          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-red-500/10"
            style={{
              background: "linear-gradient(135deg, #ef4444, #f97316)",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}