// src/components/KidneyForm.jsx
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { predictKidney } from "../services/api";

// ─── Skeleton pulse block ─────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return (
    <div
      className={`rounded-xl bg-slate-200 animate-pulse ${className}`}
    />
  );
}

// ─── Loading overlay — covers the panel while analyzing ───────────────────────
function LoadingOverlay() {
  return (
    <div
      className="absolute inset-0 z-20 rounded-3xl flex flex-col items-center justify-center gap-6"
      style={{ background: "rgba(248,250,252,0.92)", backdropFilter: "blur(4px)" }}
    >
      {/* Animated kidney icon */}
      <div className="relative">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse"
          style={{ background: "linear-gradient(135deg,rgba(14,165,233,0.15),rgba(13,148,136,0.15))" }}
        >
          <svg className="w-8 h-8 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C8.5 2 5 5.2 5 9.2c0 2.8 1.3 5.3 2.8 7.2C9.5 18.5 10.2 21 12 21c1.8 0 2.5-2.5 4.2-4.6C17.7 14.5 19 12 19 9.2 19 5.2 15.5 2 12 2z" />
            <line x1="12" y1="8" x2="12" y2="13" /><line x1="9.5" y1="10.5" x2="14.5" y2="10.5" />
          </svg>
        </div>
        {/* Spinning ring */}
        <div className="absolute inset-[-6px] rounded-[20px] border-2 border-transparent border-t-sky-400 animate-spin" />
      </div>

      {/* Skeleton rows — simulating "thinking" */}
      <div className="flex flex-col gap-2.5 w-52">
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-4/5" />
        <Skeleton className="h-2.5 w-3/5" />
      </div>

      <p className="text-[12px] font-semibold text-slate-400 tracking-wide">
        Analyzing patient data...
      </p>
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ name, value, onChange }) {
  return (
    <div className="flex gap-1.5">
      {[{ label: "No", val: "0" }, { label: "Yes", val: "1" }].map(({ label, val }) => {
        const active = value === val;
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange({ target: { name, value: val } })}
            className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg border-2 transition-all duration-150 ${
              active && val === "1"
                ? "bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-200"
                : active
                ? "bg-red-400 text-white border-red-400 shadow-sm shadow-red-200"
                : "bg-white/60 text-slate-400 border-slate-200 hover:border-slate-300"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, unit, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[9.5px] font-bold uppercase tracking-[0.09em] text-slate-400 flex items-center gap-1 flex-wrap">
        {label}
        {required && <span className="text-blue-400 text-[9px]">✱</span>}
        {unit && <span className="font-normal normal-case tracking-normal text-slate-300">· {unit}</span>}
      </p>
      {children}
    </div>
  );
}

// ─── NumInput ─────────────────────────────────────────────────────────────────
function NumInput({ name, placeholder, step, value, onChange }) {
  return (
    <input
      name={name}
      type="number"
      step={step}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-white border-2 border-slate-100 rounded-xl px-3 py-2 text-[13px] font-mono font-semibold text-slate-700 placeholder-slate-200 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50 transition-all"
    />
  );
}

// ─── Section title ────────────────────────────────────────────────────────────
const SECTION_STYLES = {
  personal: { dot: "bg-blue-400",   label: "text-blue-500"   },
  blood:    { dot: "bg-teal-500",   label: "text-teal-600"   },
  urine:    { dot: "bg-amber-400",  label: "text-amber-600"  },
  history:  { dot: "bg-violet-400", label: "text-violet-600" },
};

function SectionTitle({ title, type }) {
  const s = SECTION_STYLES[type];
  return (
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      <span className={`text-[10px] font-extrabold uppercase tracking-[0.12em] ${s.label}`}>{title}</span>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function KidneyForm() {
  const [form, setForm] = useState({
    age: "", bp: "", creatinine: "", urea: "",
    hemoglobin: "", sodium: "", potassium: "",
    protein: "", glucose: "", rbc: "",
    diabetes: "", hypertension: "",
  });
  const [result, setResult] = useState(null);   // null | "high" | "low"
  const [stats, setStats]   = useState(null);   // { confidence, risk_percent }
  const [loading, setLoading] = useState(false);

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    // Validation toast
    if (!form.age || !form.bp || !form.creatinine) {
      toast.error("Age, Blood Pressure, and Creatinine are required.", {
        icon: "⚠️",
        style: {
          background: "#FEF2F2",
          color: "#991B1B",
          border: "1px solid #FECACA",
          fontSize: "12px",
          fontWeight: "600",
        },
      });
      return;
    }

    setLoading(true);
    setResult(null);

    // Loading toast
    const loadingToast = toast.loading("Analyzing patient data...", {
      style: {
        background: "#F0F9FF",
        color: "#0C4A6E",
        border: "1px solid #BAE6FD",
        fontSize: "12px",
        fontWeight: "600",
      },
    });

    try {
      const res = await predictKidney(form);
      const prediction = res.prediction === 1 ? "high" : "low";
      setResult(prediction);
      setStats({ confidence: res.confidence, risk_percent: res.risk_percent });

      toast.dismiss(loadingToast);

      // Result toast
      if (prediction === "high") {
        toast.error("High Risk Detected — Clinical evaluation recommended.", {
          duration: 5000,
          icon: "🔴",
          style: {
            background: "#FEF2F2",
            color: "#7F1D1D",
            border: "1px solid #FECACA",
            fontSize: "12px",
            fontWeight: "600",
            maxWidth: "340px",
          },
        });
      } else {
        toast.success("Low Risk — Lab values within normal range.", {
          duration: 5000,
          icon: "🟢",
          style: {
            background: "#F0FDF4",
            color: "#14532D",
            border: "1px solid #BBF7D0",
            fontSize: "12px",
            fontWeight: "600",
            maxWidth: "340px",
          },
        });
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Server error — please try again.", {
        style: {
          background: "#FEF2F2",
          color: "#991B1B",
          border: "1px solid #FECACA",
          fontSize: "12px",
          fontWeight: "600",
        },
      });
    }

    setLoading(false);
  };

  return (
    <>
      {/* ── Toast container — top-right, matches dark theme ── */}
      <Toaster
        position="top-right"
        toastOptions={{ duration: 4000 }}
        containerStyle={{ top: 80 }}
      />

      <div
        className="min-h-screen flex items-center justify-center p-5"
        style={{ background: "linear-gradient(135deg, #0f2942 0%, #0d3d56 50%, #0a4a4a 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="fixed top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }} />
        <div className="fixed bottom-[-60px] right-[-60px] w-60 h-60 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #34d399, transparent)" }} />

        <div className="w-full max-w-3xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)" }}>
                <svg className="w-5 h-5 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.5 2 5 5.2 5 9.2c0 2.8 1.3 5.3 2.8 7.2C9.5 18.5 10.2 21 12 21c1.8 0 2.5-2.5 4.2-4.6C17.7 14.5 19 12 19 9.2 19 5.2 15.5 2 12 2z" />
                  <line x1="12" y1="8" x2="12" y2="13" /><line x1="9.5" y1="10.5" x2="14.5" y2="10.5" />
                </svg>
              </div>
              <div>
                <h1 className="text-[15px] font-bold text-white leading-tight tracking-tight">
                  Kidney Disease Risk Prediction
                </h1>
                <p className="text-[11px] text-sky-300/70">AI-Powered Clinical Decision Support</p>
              </div>
            </div>

            {result && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-[12px] ${
                result === "high"
                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              }`}>
                {result === "high" ? "⚠ High Risk" : "✓ Low Risk"}
              </div>
            )}
          </div>

          {/* Panel — relative for overlay positioning */}
          <div
            className="bg-slate-50 rounded-3xl overflow-hidden shadow-2xl relative"
            style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.4)" }}
          >
            {/* Loading overlay */}
            {loading && <LoadingOverlay />}

            {/* Rainbow top strip */}
            <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #38bdf8, #34d399, #818cf8)" }} />

            {/* Two-column body */}
            <div className="grid grid-cols-2 divide-x divide-slate-100">

              {/* LEFT */}
              <div className="px-7 py-6 flex flex-col gap-6">
                <div>
                  <SectionTitle title="Personal Information" type="personal" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Age" required>
                      <NumInput name="age" placeholder="45" value={form.age} onChange={set} />
                    </Field>
                    <Field label="Blood Pressure" unit="mmHg" required>
                      <NumInput name="bp" placeholder="80" value={form.bp} onChange={set} />
                    </Field>
                  </div>
                </div>

                <div>
                  <SectionTitle title="Blood Tests" type="blood" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Creatinine" unit="mg/dL" required>
                      <NumInput name="creatinine" placeholder="1.2" step="0.1" value={form.creatinine} onChange={set} />
                    </Field>
                    <Field label="Blood Urea" unit="mg/dL">
                      <NumInput name="urea" placeholder="40" value={form.urea} onChange={set} />
                    </Field>
                    <Field label="Hemoglobin" unit="g/dL">
                      <NumInput name="hemoglobin" placeholder="13.5" step="0.1" value={form.hemoglobin} onChange={set} />
                    </Field>
                    <Field label="Sodium" unit="mEq/L">
                      <NumInput name="sodium" placeholder="138" value={form.sodium} onChange={set} />
                    </Field>
                    <Field label="Potassium" unit="mEq/L">
                      <NumInput name="potassium" placeholder="4.0" step="0.1" value={form.potassium} onChange={set} />
                    </Field>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="px-7 py-6 flex flex-col gap-6">
                <div>
                  <SectionTitle title="Urine Analysis" type="urine" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Protein">
                      <Toggle name="protein" value={form.protein} onChange={set} />
                    </Field>
                    <Field label="Glucose">
                      <Toggle name="glucose" value={form.glucose} onChange={set} />
                    </Field>
                    <Field label="Red Blood Cells (RBC)">
                      <Toggle name="rbc" value={form.rbc} onChange={set} />
                    </Field>
                  </div>
                </div>

                <div>
                  <SectionTitle title="Medical History" type="history" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Diabetes">
                      <Toggle name="diabetes" value={form.diabetes} onChange={set} />
                    </Field>
                    <Field label="Hypertension">
                      <Toggle name="hypertension" value={form.hypertension} onChange={set} />
                    </Field>
                  </div>
                </div>

                {/* Result detail card */}
                {result && (
                  <div className={`rounded-2xl px-4 py-3.5 border-2 transition-all ${
                    result === "high"
                      ? "bg-red-50 border-red-200"
                      : "bg-emerald-50 border-emerald-200"
                  }`}>
                    <p className={`text-[11px] font-bold mb-1 ${result === "high" ? "text-red-700" : "text-emerald-700"}`}>
                      {result === "high" ? "High Risk Detected" : "Low Risk — Normal Range"}
                    </p>
                    <p className={`text-[11px] leading-relaxed ${result === "high" ? "text-red-500" : "text-emerald-600"}`}>
                      {result === "high"
                        ? "Further clinical evaluation strongly recommended. Consult a nephrologist."
                        : "Lab values appear within acceptable range. Continue routine monitoring."}
                    </p>
                    {stats && (
                      <div className="flex gap-3 mt-3 pt-3 border-t border-current/10">
                        <div className="flex-1 text-center">
                          <p className={`text-[18px] font-extrabold leading-none ${result === "high" ? "text-red-600" : "text-emerald-600"}`}>
                            {stats.risk_percent}%
                          </p>
                          <p className={`text-[9px] font-bold uppercase tracking-wider mt-1 ${result === "high" ? "text-red-400" : "text-emerald-500"}`}>
                            Risk Score
                          </p>
                        </div>
                        <div className="w-px bg-current/10" />
                        <div className="flex-1 text-center">
                          <p className={`text-[18px] font-extrabold leading-none ${result === "high" ? "text-red-600" : "text-emerald-600"}`}>
                            {stats.confidence}%
                          </p>
                          <p className={`text-[9px] font-bold uppercase tracking-wider mt-1 ${result === "high" ? "text-red-400" : "text-emerald-500"}`}>
                            Confidence
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex-1" />

                {/* Submit */}
                <div>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl font-bold text-[13px] text-white tracking-wide transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #0ea5e9 0%, #0d9488 100%)",
                      boxShadow: "0 4px 20px rgba(14,165,233,0.35)",
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Predict Risk
                  </button>
                  <p className="text-center text-[9.5px] text-slate-300 mt-2.5">
                    For clinical decision support only · Does not replace medical diagnosis
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="text-[10px] text-white/20 uppercase tracking-widest">Nephrology AI Module</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[10px] text-white/20 uppercase tracking-widest">v1.0</span>
          </div>

        </div>
      </div>
    </>
  );
}