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
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
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
          style={{
            background: "rgba(56,189,248,0.15)",
            border: "1px solid rgba(56,189,248,0.25)",
          }}
        >
          🩺
        </div>

        <div>
          <p className="text-[13px] font-bold text-white">NephroAI</p>
          <p className="text-[10px] text-sky-300/60">Kidney Predictor</p>
        </div>
      </div>

      {/* Links */}
      <div className="flex items-center gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-[12.5px] font-semibold transition ${
                isActive
                  ? "bg-sky-500/15 text-sky-300 border border-sky-500/20"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-2">
        {!token ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm text-white/70 hover:text-white"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 rounded-xl text-sm font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #0d9488)",
              }}
            >
              Register
            </button>
          </>
        ) : (
          <>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl text-sm font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #ef4444, #f97316)",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}