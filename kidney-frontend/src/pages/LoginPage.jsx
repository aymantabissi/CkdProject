import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"; // 1. Importi l-toast

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    // Check ila kano les champs khawyin qbel maysefet l-requete
    if (!form.email || !form.password) {
      return toast.error("Please fill in all fields");
    }

    const loadingToast = toast.loading("Logging in..."); // Toast dyal l-entente

    try {
      const res = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);

        // 2. Success message (kat-replace-i l-loading toast)
        toast.success("Login successful!", { id: loadingToast });

        // Tsena chwiya bach l-user ychuf l-message qbel ma t-naviguer
        setTimeout(() => navigate("/"), 1000);
      } else {
        // 3. Error message men l-backend
        toast.error(data.error || "Invalid credentials", { id: loadingToast });
      }
    } catch (err) {
      // 4. Error dial l-connexion
      toast.error("Server error. Please check your connection.", { id: loadingToast });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white"
      style={{
        background: "linear-gradient(135deg, #0f2942 0%, #0d3d56 50%, #0a4a4a 100%)"
      }}
    >
      {/* 5. Darori tzid l-Toaster hna bach t-render-i l-messages */}
      <Toaster position="top-right" reverseOrder={false} />

      <div
        className="w-[380px] p-8 rounded-2xl border border-white/10"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <h1 className="text-2xl font-bold mb-6 text-sky-300">
          Login to NephroAI
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-sky-500/50"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-sky-500/50"
        />

        <button
          onClick={handleLogin}
          className="w-full py-2 rounded-xl font-bold text-white transition-all hover:opacity-90 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #0ea5e9, #0d9488)"
          }}
        >
          Login
        </button>

        <p className="text-center text-xs mt-4 text-white/50">
          Don't have account?{" "}
          <Link to="/register" className="text-sky-300 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}