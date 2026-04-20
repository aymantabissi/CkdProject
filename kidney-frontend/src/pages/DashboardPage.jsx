// src/pages/DashboardPage.jsx
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  BarElement, PointElement, LineElement,
  Filler,
} from "chart.js";

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  BarElement, PointElement, LineElement,
  Filler
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Total Records",    value: "400",  sub: "UCI CKD dataset",    accent: "sky"     },
  { label: "High Risk",        value: "158",  sub: "39.5% of total",     accent: "red"     },
  { label: "Low Risk",         value: "242",  sub: "60.5% of total",     accent: "emerald" },
  { label: "Model Accuracy",   value: "97%",  sub: "Random Forest",      accent: "violet"  },
];

const PIE_DATA = {
  labels: ["High Risk", "Low Risk"],
  datasets: [{
    data: [158, 242],
    backgroundColor: ["#f87171", "#34d399"],
    borderColor: ["#0f2942", "#0f2942"],
    borderWidth: 3,
    hoverOffset: 6,
  }],
};

const AGE_DATA = {
  labels: ["0–20", "21–30", "31–40", "41–50", "51–60", "61–70", "71+"],
  datasets: [
    {
      label: "High Risk",
      data: [4, 8, 18, 34, 47, 31, 16],
      backgroundColor: "rgba(248,113,113,0.8)",
      borderRadius: 6,
    },
    {
      label: "Low Risk",
      data: [12, 28, 42, 51, 38, 42, 29],
      backgroundColor: "rgba(52,211,153,0.8)",
      borderRadius: 6,
    },
  ],
};

const FACTORS_DATA = {
  labels: ["High Creatinine", "Diabetes", "Hypertension", "High Urea", "Protein Urine", "Low Hemoglobin"],
  datasets: [{
    label: "Impact %",
    data: [91, 84, 76, 72, 68, 63],
    backgroundColor: [
      "rgba(248,113,113,0.85)",
      "rgba(248,113,113,0.75)",
      "rgba(251,146,60,0.8)",
      "rgba(251,146,60,0.7)",
      "rgba(56,189,248,0.8)",
      "rgba(56,189,248,0.7)",
    ],
    borderRadius: 6,
  }],
};

const LINE_DATA = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Total Predictions",
      data: [28, 34, 41, 38, 52, 47, 61],
      borderColor: "#38bdf8",
      backgroundColor: "rgba(56,189,248,0.08)",
      tension: 0.4,
      fill: true,
      pointBackgroundColor: "#38bdf8",
      pointRadius: 4,
    },
    {
      label: "High Risk",
      data: [11, 14, 17, 13, 22, 18, 25],
      borderColor: "#f87171",
      backgroundColor: "rgba(248,113,113,0.08)",
      tension: 0.4,
      fill: true,
      pointBackgroundColor: "#f87171",
      pointRadius: 4,
    },
  ],
};

// ─── Shared chart options ─────────────────────────────────────────────────────
const gridColor  = "rgba(255,255,255,0.06)";
const tickColor  = "rgba(255,255,255,0.3)";
const legendOpts = {
  labels: {
    color: "rgba(255,255,255,0.4)",
    font: { size: 11 },
    boxWidth: 12,
    padding: 16,
  },
};

const BAR_OPTS = {
  responsive: true,
  plugins: { legend: legendOpts, tooltip: { titleColor: "#fff", bodyColor: "rgba(255,255,255,0.7)", backgroundColor: "#0f2942", borderColor: "rgba(255,255,255,0.1)", borderWidth: 1 } },
  scales: {
    x: { ticks: { color: tickColor, font: { size: 10 } }, grid: { color: gridColor }, border: { display: false } },
    y: { ticks: { color: tickColor, font: { size: 10 } }, grid: { color: gridColor }, border: { display: false } },
  },
};

const H_BAR_OPTS = {
  indexAxis: "y",
  responsive: true,
  plugins: { legend: { display: false }, tooltip: { titleColor: "#fff", bodyColor: "rgba(255,255,255,0.7)", backgroundColor: "#0f2942", borderColor: "rgba(255,255,255,0.1)", borderWidth: 1 } },
  scales: {
    x: { min: 0, max: 100, ticks: { color: tickColor, font: { size: 10 } }, grid: { color: gridColor }, border: { display: false } },
    y: { ticks: { color: "rgba(255,255,255,0.45)", font: { size: 11 } }, grid: { display: false }, border: { display: false } },
  },
};

const LINE_OPTS = {
  responsive: true,
  plugins: { legend: legendOpts, tooltip: { titleColor: "#fff", bodyColor: "rgba(255,255,255,0.7)", backgroundColor: "#0f2942", borderColor: "rgba(255,255,255,0.1)", borderWidth: 1 } },
  scales: {
    x: { ticks: { color: tickColor, font: { size: 10 } }, grid: { color: gridColor }, border: { display: false } },
    y: { ticks: { color: tickColor, font: { size: 10 } }, grid: { color: gridColor }, border: { display: false } },
  },
};

const PIE_OPTS = {
  responsive: true,
  cutout: "62%",
  plugins: {
    legend: legendOpts,
    tooltip: { titleColor: "#fff", bodyColor: "rgba(255,255,255,0.7)", backgroundColor: "#0f2942", borderColor: "rgba(255,255,255,0.1)", borderWidth: 1 },
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const ACCENTS = {
  sky:     { bg: "rgba(56,189,248,0.1)",  border: "rgba(56,189,248,0.2)",  text: "#7dd3fc" },
  emerald: { bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.2)",  text: "#6ee7b7" },
  red:     { bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.2)", text: "#fca5a5" },
  violet:  { bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)", text: "#c4b5fd" },
};

function StatCard({ label, value, sub, accent }) {
  const a = ACCENTS[accent];
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-1"
      style={{ background: a.bg, border: `1px solid ${a.border}` }}>
      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: a.text }}>{label}</p>
      <p className="text-3xl font-extrabold text-white leading-none mt-1">{value}</p>
      {sub && <p className="text-[11px] text-white/35 mt-1">{sub}</p>}
    </div>
  );
}

function Panel({ title, sub, children, className = "" }) {
  return (
    <div className={`rounded-2xl p-5 ${className}`}
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <p className="text-[13px] font-bold text-white">{title}</p>
      {sub && <p className="text-[11px] text-white/30 mt-0.5 mb-4">{sub}</p>}
      {!sub && <div className="mb-4" />}
      {children}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="min-h-screen text-white"
      style={{ background: "linear-gradient(135deg, #0f2942 0%, #0d3d56 50%, #0a4a4a 100%)" }}>

      {/* Blobs */}
      <div className="fixed top-[-100px] left-[-100px] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.07), transparent 70%)" }} />
      <div className="fixed bottom-[-80px] right-[-80px] w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(52,211,153,0.07), transparent 70%)" }} />

      <div className="relative max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="text-sky-300 text-[10px] font-bold uppercase tracking-widest">BI Dashboard</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Clinical{" "}
            <span style={{ background: "linear-gradient(90deg,#38bdf8,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Statistics
            </span>
          </h1>
          <p className="text-white/30 text-[12px] mt-1">
            Based on UCI Chronic Kidney Disease dataset · 400 patient records
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {STATS.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Row 1: Pie + Horizontal Bar */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          <Panel title="Risk Distribution" sub="High Risk vs Low Risk patients">
            <Doughnut data={PIE_DATA} options={PIE_OPTS} />
          </Panel>

          <Panel title="Risk Factor Impact" sub="Correlation with CKD (% of high-risk cases)">
            <Bar data={FACTORS_DATA} options={H_BAR_OPTS} />
          </Panel>
        </div>

        {/* Row 2: Grouped Bar + Line */}
        <div className="grid grid-cols-2 gap-5 mb-6">
          <Panel title="Age Distribution" sub="High Risk vs Low Risk by age group">
            <Bar data={AGE_DATA} options={BAR_OPTS} />
          </Panel>

          <Panel title="Monthly Predictions" sub="Total predictions vs high-risk cases">
            <Line data={LINE_DATA} options={LINE_OPTS} />
          </Panel>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-white/15 uppercase tracking-widest">
          Nephrology AI Module · PFE 2024–2025 · Data: UCI CKD Dataset
        </p>

      </div>
    </div>
  );
}