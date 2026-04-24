import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google"; // Import du bouton Google
import { jwtDecode } from "jwt-decode"; // Pour lire les infos de l'utilisateur Google

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Login Classique
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      return toast.error("Please fill in all fields");
    }

    const loadingToast = toast.loading("Logging in...");

    try {
      const res = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form) 
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        toast.success("Login successful!", { id: loadingToast });
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(data.error || "Invalid credentials", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Server error. Please check your connection.", { id: loadingToast });
    }
  };

  // Login Google
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google User Data:", decoded);

      // Stockage du token Google
      localStorage.setItem("token", credentialResponse.credential);

      toast.success(`Welcome ${decoded.given_name || 'User'}!`);
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      toast.error("Error processing Google Login");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white"
      style={{
        background: "linear-gradient(135deg, #0f2942 0%, #0d3d56 50%, #0a4a4a 100%)",
      }}
    >
      <Toaster position="top-right" reverseOrder={false} />

      <div
        className="w-[400px] p-8 rounded-3xl border border-white/10 shadow-2xl"
        style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(10px)" }}
      >
        <h1 className="text-3xl font-bold mb-8 text-sky-300 text-center tracking-tight">
          Login to NephroAI
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
          />

          <button
            onClick={handleLogin}
            className="w-full py-3 mt-2 rounded-xl font-bold text-white transition-all hover:brightness-110 active:scale-[0.98] shadow-lg shadow-sky-900/20"
            style={{
              background: "linear-gradient(135deg, #0ea5e9, #0d9488)",
            }}
          >
            Sign In
          </button>
        </div>

        {/* Separator "OR" */}
        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">
            Or continue with
          </span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Google Auth Button Container */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google Authentication Failed")}
            theme="filled_blue"
            shape="pill"
            width="100%"
          />
        </div>

        <p className="text-center text-sm mt-8 text-white/40">
          Don't have an account?{" "}
          <Link to="/register" className="text-sky-300 hover:text-sky-200 font-semibold transition-colors">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}