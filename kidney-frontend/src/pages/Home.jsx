// src/components/KidneyForm.jsx
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import jsPDF from "jspdf";
import { predictKidney } from "../services/api";
import Field from '../ui/Field.jsx'
import NumInput from "../ui/NumInput.jsx";
import generatePDF from "../utils/pdfGenerator.js";
import Toggle from "../ui/Toggle.jsx";
import LoadingOverlay from "../ui/LoadingOverlay.jsx";
import { useNavigate } from "react-router-dom";



function SectionTitle({ title, type }) {
  const s = SECTION_STYLES[type];
  return (
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      <span className={`text-[10px] font-extrabold uppercase tracking-[0.12em] ${s.label}`}>{title}</span>
    </div>
  );
}



const SECTION_STYLES = {
  personal: { dot: "bg-blue-400", label: "text-blue-500" },
  blood: { dot: "bg-teal-500", label: "text-teal-600" },
  urine: { dot: "bg-amber-400", label: "text-amber-600" },
  history: { dot: "bg-violet-400", label: "text-violet-600" },
};



export default function KidneyForm() {
  //pour 
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // pour verifier si login exsit or no

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
const handleUpload = async () => {
  if (!file) return;
  setLoading(true);
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (data.inputs) {
      // ✅ Updati l-form state bach l-interface t-beddel
      setForm(data.inputs);
      
      // ✅ Update result o stats bach l-pourcentage ibane
      const pred = data.prediction === 1 ? "high" : "low";
      setResult(pred);
      setStats({
        confidence: data.confidence,
        risk_percent: data.risk_percent
      });

      // ✅ Generate PDF b-had l-data jdid
      //generatePDF(pred, {confidence: data.confidence, risk_percent: data.risk_percent});

      //toast.success("File analyzed & UI updated!");
    }
  } catch (err) {
    toast.error("Error connecting to server");
  } finally {
    setLoading(false);
  }
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
                      onClick={() => generatePDF(result, stats, form)}
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
<div className="mt-3 flex flex-col gap-2">

  {/* Upload Input */}
  <label className="w-full cursor-pointer border-2 border-dashed border-slate-300 rounded-2xl py-3 text-center text-[11px] text-slate-400 hover:border-blue-400 hover:text-blue-500 transition">
    {file ? file.name : "Upload Analysis File (PDF / Image / CSV)"}
    <input
      type="file"
      accept=".pdf,.jpg,.png,.csv"
      onChange={(e) => setFile(e.target.files[0])}
      hidden
    />
  </label>

  {/* Upload Button */}
  <button
    type="button"
    onClick={handleUpload}
    disabled={!file}
    className="w-full py-2.5 rounded-2xl font-bold text-[12px] text-white transition-all disabled:opacity-40"
    style={{
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    }}
  >
    Upload & Analyze File
  </button>

</div>
                  <p className="text-center text-[9.5px] text-slate-300 mt-2.5">
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