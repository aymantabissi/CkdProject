import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/login");
      } else {
        alert(data.error || "Register failed");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white"
      style={{
        background: "linear-gradient(135deg, #0f2942 0%, #0d3d56 50%, #0a4a4a 100%)"
      }}
    >
      <div
        className="w-[380px] p-8 rounded-2xl border border-white/10"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <h1 className="text-2xl font-bold mb-6 text-teal-300">
          Create Account
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none"
        />

        <button
          onClick={handleRegister}
          className="w-full py-2 rounded-xl font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #0ea5e9, #0d9488)"
          }}
        >
          Register
        </button>

        <p className="text-center text-xs mt-4 text-white/50">
          Already have account?{" "}
          <Link to="/login" className="text-sky-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}