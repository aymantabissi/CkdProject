// src/components/KidneyForm.jsx
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import jsPDF from "jspdf";
import { predictKidney } from "../services/api";
import { useNavigate } from "react-router-dom";

function Skeleton({ className = "" }) {
  return <div className={`rounded-xl bg-slate-200 animate-pulse ${className}`} />;
}

function LoadingOverlay() {
  return (
    <div
      className="absolute inset-0 z-20 rounded-3xl flex flex-col items-center justify-center gap-6"
      style={{ background: "rgba(248,250,252,0.92)", backdropFilter: "blur(4px)" }}
    >
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
        <div className="absolute inset-[-6px] rounded-[20px] border-2 border-transparent border-t-sky-400 animate-spin" />
      </div>
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

const SECTION_STYLES = {
  personal: { dot: "bg-blue-400", label: "text-blue-500" },
  blood: { dot: "bg-teal-500", label: "text-teal-600" },
  urine: { dot: "bg-amber-400", label: "text-amber-600" },
  history: { dot: "bg-violet-400", label: "text-violet-600" },
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

export default function KidneyForm() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const [form, setForm] = useState({
    age: "", bp: "", creatinine: "", urea: "",
    hemoglobin: "", sodium: "", potassium: "",
    protein: "", glucose: "", rbc: "",
    diabetes: "", hypertension: "",
  });
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const generatePDF = (predictionOverride, statsOverride) => {
    const currentResult = predictionOverride ?? result;
    const currentStats = statsOverride ?? stats;
    const isHigh = currentResult === "high";

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString("en-GB");
    const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    doc.setFillColor(15, 41, 66);
    doc.rect(0, 0, 210, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("NephroAI \u2014 Kidney Risk Report", 20, 15);
    doc.setFontSize(9);
    doc.setTextColor(125, 211, 252);
    doc.text("AI-Powered Clinical Decision Support", 20, 22);
    doc.setTextColor(180, 180, 180);
    doc.text(`Generated: ${date} at ${time}`, 20, 28);

    const bannerColor = isHigh ? [254, 226, 226] : [209, 250, 229];
    const bannerText = isHigh ? [153, 27, 27] : [6, 95, 70];
    const bannerLabel = isHigh ? "HIGH RISK DETECTED" : "LOW RISK \u2014 NORMAL RANGE";
    doc.setFillColor(...bannerColor);
    doc.roundedRect(15, 45, 180, 15, 4, 4, "F");
    doc.setTextColor(...bannerText);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(bannerLabel, 105, 55, { align: "center" });

    doc.setFillColor(240, 240, 240);
    doc.roundedRect(15, 65, 180, 8, 2, 2, "F");
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(9);
    doc.text("PATIENT CLINICAL DATA", 18, 71);

    const fields = [
      ["Age", form.age + " years"],
      ["Blood Pressure", form.bp + " mmHg"],
      ["Creatinine", form.creatinine + " mg/dL"],
      ["Blood Urea", form.urea + " mg/dL"],
      ["Hemoglobin", form.hemoglobin + " g/dL"],
      ["Sodium", form.sodium + " mEq/L"],
      ["Potassium", form.potassium + " mEq/L"],
      ["Protein in Urine", form.protein === "1" ? "Positive" : "Negative"],
      ["Glucose in Urine", form.glucose === "1" ? "Positive" : "Negative"],
      ["RBC in Urine", form.rbc === "1" ? "Positive" : "Negative"],
      ["Diabetes", form.diabetes === "1" ? "Yes" : "No"],
      ["Hypertension", form.hypertension === "1" ? "Yes" : "No"],
    ];

    let y = 80;
    fields.forEach(([lbl, val], i) => {
      if (i % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(15, y - 5, 180, 8, "F");
      }
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(lbl, 18, y);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.text(val, 120, y);
      y += 8;
    });

    if (currentStats) {
      y += 4;
      doc.setFillColor(isHigh ? 254 : 236, isHigh ? 235 : 253, isHigh ? 235 : 245);
      doc.roundedRect(15, y, 87, 16, 3, 3, "F");
      doc.roundedRect(108, y, 87, 16, 3, 3, "F");

      doc.setTextColor(isHigh ? 153 : 22, isHigh ? 27 : 101, isHigh ? 27 : 52);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`${currentStats.risk_percent}%`, 58, y + 10, { align: "center" });
      doc.text(`${currentStats.confidence}%`, 151, y + 10, { align: "center" });

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.text("RISK SCORE", 58, y + 14, { align: "center" });
      doc.text("CONFIDENCE", 151, y + 14, { align: "center" });
      y += 22;
    }

    y += 4;
    const recText = isHigh
      ? "Further clinical evaluation is strongly recommended. Please consult a nephrologist."
      : "Lab values are within normal range. Maintain a healthy lifestyle and regular checkups.";
    doc.setFillColor(isHigh ? 254 : 240, isHigh ? 242 : 253, isHigh ? 242 : 244);
    doc.setDrawColor(isHigh ? 252 : 134, isHigh ? 165 : 239, isHigh ? 165 : 172);
    doc.roundedRect(15, y, 180, 25, 3, 3, "FD");
    doc.setTextColor(isHigh ? 153 : 22, isHigh ? 27 : 101, isHigh ? 27 : 52);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("CLINICAL RECOMMENDATION", 18, y + 7);
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(recText, 170), 18, y + 14);

    doc.setFillColor(15, 41, 66);
    doc.rect(0, 282, 210, 15, "F");
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(7);
    doc.text("NephroAI \u00B7 For clinical decision support only", 105, 290, { align: "center" });

    doc.save("NephroAI_Report.pdf");
  };

  const handleSubmit = async () => {
    if (!form.age || !form.bp || !form.creatinine) {
      toast.error("Age, Blood Pressure, and Creatinine are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await predictKidney(form);
      const prediction = res.prediction === 1 ? "high" : "low";
      const statsData = { confidence: res.confidence, risk_percent: res.risk_percent };

      setResult(prediction);
      setStats(statsData);
      generatePDF(prediction, statsData);
      toast.success("Report generated & downloaded!", { icon: "📄" });
    } catch (err) {
      toast.error(err?.response?.data?.error || "Server error");
    }
    setLoading(false);
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} containerStyle={{ top: 80 }} />

      {/* Conteneur principal - Centrage Flex complet */}
      <div
        className="min-h-screen flex items-center justify-center p-8 transition-all duration-500"
        style={{ background: "linear-gradient(135deg, #0f2942 0%, #0d3d56 50%, #0a4a4a 100%)" }}
      >
        <div className="fixed top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }} />
        <div className="fixed bottom-[-60px] right-[-60px] w-60 h-60 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #34d399, transparent)" }} />

        {/* Largeur du formulaire augmentée à max-w-5xl */}
        <div className="w-full max-w-5xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)" }}>
                <svg className="w-6 h-6 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.5 2 5 5.2 5 9.2c0 2.8 1.3 5.3 2.8 7.2C9.5 18.5 10.2 21 12 21c1.8 0 2.5-2.5 4.2-4.6C17.7 14.5 19 12 19 9.2 19 5.2 15.5 2 12 2z" />
                  <line x1="12" y1="8" x2="12" y2="13" /><line x1="9.5" y1="10.5" x2="14.5" y2="10.5" />
                </svg>
              </div>
              <div>
                <h1 className="text-[18px] font-bold text-white leading-tight tracking-tight">
                  Kidney Disease Risk Prediction
                </h1>
                <p className="text-[13px] text-sky-300/70">AI-Powered Clinical Decision Support</p>
              </div>
            </div>

            {result && (
              <div className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-[14px] ${
                result === "high"
                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              }`}>
                {result === "high" ? "⚠ High Risk" : "✓ Low Risk"}
              </div>
            )}
          </div>

          {/* Panel principal avec plus de padding */}
          <div
            className="bg-slate-50 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
            style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }}
          >
            {loading && <LoadingOverlay />}
            <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #38bdf8, #34d399, #818cf8)" }} />

            <div className="grid grid-cols-2 divide-x divide-slate-100 min-h-[550px]">

              {/* LEFT SECTION - PLUS D'ESPACE */}
              <div className="px-12 py-10 flex flex-col gap-8">
                <div>
                  <SectionTitle title="Personal Information" type="personal" />
                  <div className="grid grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-2 gap-4">
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

              {/* RIGHT SECTION - PLUS D'ESPACE */}
              <div className="px-12 py-10 flex flex-col gap-8">
                <div>
                  <SectionTitle title="Urine Analysis" type="urine" />
                  <div className="grid grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Diabetes">
                      <Toggle name="diabetes" value={form.diabetes} onChange={set} />
                    </Field>
                    <Field label="Hypertension">
                      <Toggle name="hypertension" value={form.hypertension} onChange={set} />
                    </Field>
                  </div>
                </div>

                {result && (
                  <div className={`rounded-2xl px-6 py-5 border-2 transition-all ${
                    result === "high" ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"
                  }`}>
                    <p className={`text-[13px] font-bold mb-1 ${result === "high" ? "text-red-700" : "text-emerald-700"}`}>
                      {result === "high" ? "High Risk Detected" : "Low Risk — Normal Range"}
                    </p>
                    <p className={`text-[12px] leading-relaxed mb-4 ${result === "high" ? "text-red-500" : "text-emerald-600"}`}>
                      {result === "high"
                        ? "Further clinical evaluation strongly recommended. Consult a nephrologist."
                        : "Lab values appear within acceptable range. Continue routine monitoring."}
                    </p>
                    {stats && (
                      <div className="flex gap-4 pt-4 border-t border-current/10">
                        <div className="flex-1 text-center">
                          <p className={`text-[22px] font-extrabold leading-none ${result === "high" ? "text-red-600" : "text-emerald-600"}`}>
                            {stats.risk_percent}%
                          </p>
                          <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${result === "high" ? "text-red-400" : "text-emerald-500"}`}>
                            Risk Score
                          </p>
                        </div>
                        <div className="w-px bg-current/10" />
                        <div className="flex-1 text-center">
                          <p className={`text-[22px] font-extrabold leading-none ${result === "high" ? "text-red-600" : "text-emerald-600"}`}>
                            {stats.confidence}%
                          </p>
                          <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${result === "high" ? "text-red-400" : "text-emerald-500"}`}>
                            Confidence
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex-1" />

                <div className="flex flex-col gap-3">
                  {result && (
                    <button
                      type="button"
                      onClick={() => generatePDF()}
                      className="w-full py-3 rounded-2xl font-bold text-[13px] text-slate-600 border border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                      Download PDF Report
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-4 rounded-2xl font-bold text-[14px] text-white tracking-wide transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #0ea5e9 0%, #0d9488 100%)",
                      boxShadow: "0 10px 25px rgba(14,165,233,0.35)",
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Predict Risk
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-2">
                    For clinical decision support only · Does not replace medical diagnosis
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-6">
            <span className="text-[11px] text-white/20 uppercase tracking-widest">Nephrology AI Module</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="text-[11px] text-white/20 uppercase tracking-widest">v1.0</span>
          </div>

        </div>
      </div>
    </>
  );
}