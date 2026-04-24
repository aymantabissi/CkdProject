// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  BarElement, PointElement, LineElement,
  Filler,
} from "chart.js";
import { getStats } from "../services/api";

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  BarElement, PointElement, LineElement,
  Filler
);

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl p-5 animate-pulse"
      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="h-2.5 w-24 rounded-full bg-white/10 mb-3" />
      <div className="h-8 w-16 rounded-lg bg-white/10 mb-2" />
      <div className="h-2 w-20 rounded-full bg-white/10" />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="rounded-2xl p-5 animate-pulse"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="h-3 w-32 rounded-full bg-white/10 mb-2" />
      <div className="h-2 w-48 rounded-full bg-white/10 mb-6" />
      <div className="h-48 rounded-xl bg-white/5" />
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
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

function Panel({ title, sub, children }) {
  return (
    <div className="rounded-2xl p-5"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <p className="text-[13px] font-bold text-white">{title}</p>
      {sub && <p className="text-[11px] text-white/30 mt-0.5 mb-4">{sub}</p>}
      {!sub && <div className="mb-4" />}
      {children}
    </div>
  );
}

// ─── Shared chart options ─────────────────────────────────────────────────────
const gridColor = "rgba(255,255,255,0.06)";
const tickColor = "rgba(255,255,255,0.3)";
const tooltipStyle = {
  titleColor: "#fff",
  bodyColor: "rgba(255,255,255,0.7)",
  backgroundColor: "#0f2942",
  borderColor: "rgba(255,255,255,0.1)",
  borderWidth: 1,
};
const legendOpts = {
  labels: { color: "rgba(255,255,255,0.4)", font: { size: 11 }, boxWidth: 12, padding: 16 },
};
const axisStyle = {
  ticks: { color: tickColor, font: { size: 10 } },
  grid: { color: gridColor },
  border: { display: false },
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    getStats()
      .then((raw) => {
        // نضمنو كل field عنده قيمة default
        setData({
          total_records:    raw.total_records    ?? raw.high_risk + raw.low_risk ?? 0,
          high_risk:        raw.high_risk        ?? 0,
          low_risk:         raw.low_risk         ?? 0,
          model_accuracy:   raw.model_accuracy   ?? 0,
          features_count:   raw.features_count   ?? 12,
          age_distribution: raw.age_distribution ?? [],
          risk_factors:     raw.risk_factors     ?? [],
        });
      })
      .catch(() => setError("Failed to load stats — is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  // ── Chart data (built from API response) ──────────────────────────────────
  const ageDist    = data?.age_distribution ?? [];
  const riskFactors = data?.risk_factors     ?? [];

  const pieData = data ? {
    labels: ["High Risk", "Low Risk"],
    datasets: [{
      data: [data.high_risk, data.low_risk],
      backgroundColor: ["#f87171", "#34d399"],
      borderColor: ["#0f2942", "#0f2942"],
      borderWidth: 3,
      hoverOffset: 6,
    }],
  } : null;

  const ageData = ageDist.length ? {
    labels: ageDist.map(d => d.age),
    datasets: [
      { label: "High Risk", data: ageDist.map(d => d.high), backgroundColor: "rgba(248,113,113,0.8)", borderRadius: 6 },
      { label: "Low Risk",  data: ageDist.map(d => d.low),  backgroundColor: "rgba(52,211,153,0.8)",  borderRadius: 6 },
    ],
  } : null;

  const factorsData = riskFactors.length ? {
    labels: riskFactors.map(d => d.factor),
    datasets: [{
      label: "Impact %",
      data: riskFactors.map(d => d.impact),
      backgroundColor: riskFactors.map(d =>
        d.impact >= 80 ? "rgba(248,113,113,0.85)" :
        d.impact >= 60 ? "rgba(251,146,60,0.8)" :
                         "rgba(56,189,248,0.8)"
      ),
      borderRadius: 6,
    }],
  } : null;

  const pieOpts    = { responsive: true, cutout: "62%", plugins: { legend: legendOpts, tooltip: tooltipStyle } };
  const barOpts    = { responsive: true, plugins: { legend: legendOpts, tooltip: tooltipStyle }, scales: { x: axisStyle, y: axisStyle } };
  const hBarOpts   = { indexAxis: "y", responsive: true, plugins: { legend: { display: false }, tooltip: tooltipStyle }, scales: { x: { ...axisStyle, min: 0, max: 100 }, y: { ...axisStyle, grid: { display: false } } } };

  return (
    <div className="min-h-screen text-white"
      style={{ background: "linear-gradient(135deg, #0f2942 0%, #0d3d56 50%, #0a4a4a 100%)" }}>

      <div className="fixed top-[-100px] left-[-100px] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.07), transparent 70%)" }} />

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
            Live data from backend · Chronic Kidney Disease dataset · {data ? `${data.total_records} records` : "..."}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
            <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p className="text-[12px] text-red-300">{error}</p>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {loading ? (
            [1,2,3,4].map(i => <SkeletonCard key={i} />)
          ) : data ? (
            <>
              <StatCard label="Total Records"  value={data.total_records || (data.high_risk + data.low_risk)} sub="CKD dataset" accent="sky" />
              <StatCard label="High Risk"      value={data.high_risk}
                sub={data.total_records ? `${Math.round(data.high_risk / data.total_records * 100)}% of total` : `${data.high_risk} patients`}
                accent="red" />
              <StatCard label="Low Risk"       value={data.low_risk}
                sub={data.total_records ? `${Math.round(data.low_risk / data.total_records * 100)}% of total` : `${data.low_risk} patients`}
                accent="emerald" />
              <StatCard label="Model Accuracy" value={data.model_accuracy ? `${data.model_accuracy}%` : "N/A"} sub="Gradient Boosting" accent="violet" />
            </>
          ) : null}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          {loading ? (
            <><SkeletonChart /><SkeletonChart /></>
          ) : data ? (
            <>
              <Panel title="Risk Distribution" sub="High Risk vs Low Risk patients">
                {pieData && <Doughnut data={pieData} options={pieOpts} />}
              </Panel>
              <Panel title="Risk Factor Impact" sub="% of high-risk cases per factor">
                {factorsData && <Bar data={factorsData} options={hBarOpts} />}
              </Panel>
            </>
          ) : null}
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 gap-5 mb-6">
          {loading ? (
            <SkeletonChart />
          ) : data ? (
            <Panel title="Age Distribution" sub="High Risk vs Low Risk by age group">
              {ageData && <Bar data={ageData} options={barOpts} />}
            </Panel>
          ) : null}
        </div>

        <p className="text-center text-[10px] text-white/15 uppercase tracking-widest">
          Nephrology AI Module · PFE 2024–2025 · Live from API
        </p>

      </div>
    </div>
  );
}