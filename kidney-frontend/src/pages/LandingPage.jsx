// src/pages/LandingPage.jsx
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.5 2 5 5.2 5 9.2c0 2.8 1.3 5.3 2.8 7.2C9.5 18.5 10.2 21 12 21c1.8 0 2.5-2.5 4.2-4.6C17.7 14.5 19 12 19 9.2 19 5.2 15.5 2 12 2z" />
        <line x1="12" y1="8" x2="12" y2="13" /><line x1="9.5" y1="10.5" x2="14.5" y2="10.5" />
      </svg>
    ),
    color: "from-sky-500/20 to-sky-500/5 border-sky-500/20 text-sky-300",
    dot: "bg-sky-400",
    title: "What is Kidney Disease?",
    desc: "Chronic Kidney Disease (CKD) affects millions worldwide. Early detection is critical to slow its progression and improve patient outcomes.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: "from-teal-500/20 to-teal-500/5 border-teal-500/20 text-teal-300",
    dot: "bg-teal-400",
    title: "How the AI Works",
    desc: "Our Machine Learning model was trained on clinical data — blood tests, urine analysis, and medical history — to predict kidney disease risk with high accuracy.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18M9 21V9" />
      </svg>
    ),
    color: "from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-300",
    dot: "bg-violet-400",
    title: "Data & Model",
    desc: "Based on the UCI Chronic Kidney Disease dataset — 400 patient records, 24 clinical features. Model: Random Forest / Logistic Regression.",
  },
];

const stats = [
  { value: "400+", label: "Patient records" },
  { value: "24", label: "Clinical features" },
  { value: "97%", label: "Model accuracy" },
  { value: "2", label: "Disease classes" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "linear-gradient(135deg, #0f2942 0%, #0d3d56 50%, #0a4a4a 100%)" }}
    >
      {/* Decorative blobs */}
      <div
        className="fixed top-[-120px] left-[-120px] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.08), transparent 70%)" }}
      />
      <div
        className="fixed bottom-[-80px] right-[-80px] w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(52,211,153,0.08), transparent 70%)" }}
      />

      <div className="relative max-w-4xl mx-auto px-6 py-8 pb-16">

        {/* ── Hero ── */}
        <div className="text-center mb-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-sky-300 text-[11px] font-semibold uppercase tracking-widest">
              PFE Project · AI &amp; BI in Healthcare
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight leading-tight mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Kidney Disease<br />
            <span
              className="font-extrabold"
              style={{ background: "linear-gradient(90deg, #38bdf8, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Risk Prediction
            </span>
          </h1>

          <p className="text-slate-300 text-[15px] leading-relaxed max-w-xl mx-auto mb-10">
            An AI-powered clinical decision support tool that predicts the risk of
            acute or chronic kidney disease from patient lab data — in seconds.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate("/predict")}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-[13px] text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #0d9488)",
                boxShadow: "0 8px 30px rgba(14,165,233,0.3)",
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Prediction
            </button>

            <button
              onClick={() => navigate("/about")}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-[13px] text-white/70 border border-white/10 hover:border-white/20 hover:text-white transition-all"
            >
              Learn More
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <div
              key={s.label}
              className="text-center rounded-2xl py-7 px-4 border border-white/5"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <p className="text-3xl font-extrabold text-white mb-2">{s.value}</p>
              <p className="text-[10.5px] text-slate-400 uppercase tracking-widest font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Feature cards ── */}
        <div className="grid grid-cols-3 gap-5 mb-16">
          {features.map((f) => (
            <div
              key={f.title}
              className={`rounded-2xl border bg-gradient-to-b p-5 ${f.color}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 bg-white/5 ${f.color.split(" ").find(c => c.startsWith("text-"))}`}>
                {f.icon}
              </div>
              <h3 className="text-[13px] font-bold text-white mb-2">{f.title}</h3>
              <p className="text-[12px] text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* ── CTA bottom strip ── */}
        <div
          className="rounded-3xl p-8 text-center border border-white/5"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <h2 className="text-xl font-bold text-white mb-2">Ready to analyze a patient?</h2>
          <p className="text-slate-400 text-[13px] mb-6">Enter clinical data and get an instant AI-powered risk assessment.</p>
          <button
            onClick={() => navigate("/predict")}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-[13px] text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #0ea5e9, #0d9488)",
              boxShadow: "0 6px 24px rgba(14,165,233,0.25)",
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Open Prediction Form
          </button>
        </div>

        {/* ── Footer note ── */}
        <p className="text-center text-[10.5px] text-white/20 mt-10 uppercase tracking-widest">
          Nephrology AI Module · PFE 2024–2025 · For academic use only
        </p>

      </div>
    </div>
  );
}