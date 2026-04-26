// src/pages/DashboardPage.jsx

import { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  BarElement, PointElement, LineElement,
  Filler,
} from "chart.js";
import { getStats } from "../services/api";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

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

// ─── Export Buttons ───────────────────────────────────────────────────────────
function ExportButton({ onClick, icon, label, color, disabled }) {
  const colors = {
    red:   { bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.3)", text: "#fca5a5", hover: "rgba(248,113,113,0.2)" },
    green: { bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.3)",  text: "#6ee7b7", hover: "rgba(52,211,153,0.2)" },
  };
  const c = colors[color];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.background = c.hover)}
      onMouseLeave={e => !disabled && (e.currentTarget.style.background = c.bg)}
    >
      {icon}
      {label}
    </button>
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
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    getStats()
      .then((raw) => {
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

  // ── Export PDF ──────────────────────────────────────────────────────────────
  const handleExportPDF = () => {
    if (!data) return;
    setExporting(true);

    try {
      const pdf   = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      let y = 15;

      // Header
      pdf.setFillColor(15, 41, 66);
      pdf.rect(0, 0, pageW, 30, "F");
      pdf.setTextColor(56, 189, 248);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.text("BI DASHBOARD · NEPHROLOGY AI MODULE", 14, 10);
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.text("Clinical Statistics", 14, 22);
      pdf.setTextColor(150, 180, 200);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(`CKD Dataset · ${data.total_records} records · ${new Date().toLocaleDateString()}`, 14, 29);
      y = 42;

      // Summary Cards
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(56, 189, 248);
      pdf.text("SUMMARY", 14, y);
      y += 6;

      const cards = [
        { label: "Total Records",  value: String(data.total_records), color: [56, 189, 248] },
        { label: "High Risk",      value: `${data.high_risk} (${Math.round(data.high_risk / data.total_records * 100)}%)`, color: [248, 113, 113] },
        { label: "Low Risk",       value: `${data.low_risk} (${Math.round(data.low_risk / data.total_records * 100)}%)`,   color: [52, 211, 153]  },
        { label: "Model Accuracy", value: data.model_accuracy ? `${data.model_accuracy}%` : "N/A", color: [167, 139, 250] },
      ];

      const cardW = (pageW - 28 - 9) / 4;
      cards.forEach((card, i) => {
        const x = 14 + i * (cardW + 3);
        pdf.setFillColor(20, 50, 80);
        pdf.roundedRect(x, y, cardW, 22, 3, 3, "F");
        pdf.setDrawColor(...card.color);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(x, y, cardW, 22, 3, 3, "S");
        pdf.setTextColor(...card.color);
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "bold");
        pdf.text(card.label.toUpperCase(), x + 3, y + 7);
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(13);
        pdf.text(card.value, x + 3, y + 17);
      });
      y += 32;

      // Risk Factors Table
      if (data.risk_factors?.length) {
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(56, 189, 248);
        pdf.text("RISK FACTOR IMPACT", 14, y);
        y += 6;

        pdf.setFillColor(20, 50, 80);
        pdf.rect(14, y, pageW - 28, 8, "F");
        pdf.setTextColor(150, 180, 200);
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "bold");
        pdf.text("Factor", 17, y + 5.5);
        pdf.text("Impact %", pageW - 40, y + 5.5);
        pdf.text("Level", pageW - 25, y + 5.5);
        y += 8;

        data.risk_factors.forEach((rf, i) => {
          if (i % 2 === 0) {
            pdf.setFillColor(18, 45, 72);
            pdf.rect(14, y, pageW - 28, 7, "F");
          }
          const impactColor = rf.impact >= 80 ? [248, 113, 113] : rf.impact >= 60 ? [251, 146, 60] : [52, 211, 153];
          const level       = rf.impact >= 80 ? "HIGH" : rf.impact >= 60 ? "MEDIUM" : "LOW";

          pdf.setTextColor(220, 230, 240);
          pdf.setFontSize(8);
          pdf.setFont("helvetica", "normal");
          pdf.text(rf.factor, 17, y + 5);
          pdf.setTextColor(...impactColor);
          pdf.setFont("helvetica", "bold");
          pdf.text(`${rf.impact}%`, pageW - 38, y + 5);
          pdf.text(level, pageW - 23, y + 5);

          const barX = 60, barW = pageW - 28 - 60 - 40, barH = 2.5;
          pdf.setFillColor(30, 60, 90);
          pdf.roundedRect(barX, y + 2.5, barW, barH, 1, 1, "F");
          pdf.setFillColor(...impactColor);
          pdf.roundedRect(barX, y + 2.5, barW * rf.impact / 100, barH, 1, 1, "F");
          y += 7;
        });
        y += 6;
      }

      // Age Distribution Table
      if (data.age_distribution?.length) {
        if (y > 220) { pdf.addPage(); y = 15; }

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(56, 189, 248);
        pdf.text("AGE DISTRIBUTION", 14, y);
        y += 6;

        pdf.setFillColor(20, 50, 80);
        pdf.rect(14, y, pageW - 28, 8, "F");
        pdf.setTextColor(150, 180, 200);
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "bold");
        const col1 = 17, col2 = 70, col3 = 110, col4 = 150;
        pdf.text("Age Group", col1, y + 5.5);
        pdf.text("High Risk", col2, y + 5.5);
        pdf.text("Low Risk",  col3, y + 5.5);
        pdf.text("Total",     col4, y + 5.5);
        y += 8;

        data.age_distribution.forEach((d, i) => {
          if (i % 2 === 0) {
            pdf.setFillColor(18, 45, 72);
            pdf.rect(14, y, pageW - 28, 7, "F");
          }
          pdf.setTextColor(220, 230, 240);
          pdf.setFontSize(8);
          pdf.setFont("helvetica", "normal");
          pdf.text(String(d.age),  col1, y + 5);
          pdf.setTextColor(248, 113, 113);
          pdf.text(String(d.high), col2, y + 5);
          pdf.setTextColor(52, 211, 153);
          pdf.text(String(d.low),  col3, y + 5);
          pdf.setTextColor(255, 255, 255);
          pdf.text(String((d.high ?? 0) + (d.low ?? 0)), col4, y + 5);
          y += 7;
        });
      }

      // Footer
      const pageH = pdf.internal.pageSize.getHeight();
      pdf.setFillColor(15, 41, 66);
      pdf.rect(0, pageH - 12, pageW, 12, "F");
      pdf.setTextColor(80, 120, 150);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.text("Nephrology AI Module · PFA 2025–2026 · Generated by CKD Dashboard", 14, pageH - 4);
      pdf.text("Page 1", pageW - 20, pageH - 4);

      pdf.save(`CKD_Dashboard_${new Date().toISOString().slice(0, 10)}.pdf`);

    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  // ── Export Excel ────────────────────────────────────────────────────────────
  const handleExportExcel = () => {
    if (!data) return;

    const wb = XLSX.utils.book_new();

    const summaryRows = [
      ["Metric", "Value"],
      ["Total Records",  data.total_records],
      ["High Risk",      data.high_risk],
      ["Low Risk",       data.low_risk],
      ["Model Accuracy", data.model_accuracy ? `${data.model_accuracy}%` : "N/A"],
      ["Features Count", data.features_count],
      ["Export Date",    new Date().toLocaleDateString()],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryRows), "Summary");

    if (data.age_distribution?.length) {
      const ageRows = [
        ["Age Group", "High Risk", "Low Risk", "Total"],
        ...data.age_distribution.map(d => [d.age, d.high, d.low, (d.high ?? 0) + (d.low ?? 0)]),
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(ageRows), "Age Distribution");
    }

    if (data.risk_factors?.length) {
      const factorRows = [
        ["Factor", "Impact (%)"],
        ...data.risk_factors.map(d => [d.factor, d.impact]),
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(factorRows), "Risk Factors");
    }

    XLSX.writeFile(wb, `CKD_Dashboard_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // ── Chart data ──────────────────────────────────────────────────────────────
  const ageDist     = data?.age_distribution ?? [];
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

  const pieOpts  = { responsive: true, cutout: "62%", plugins: { legend: legendOpts, tooltip: tooltipStyle } };
  const barOpts  = { responsive: true, plugins: { legend: legendOpts, tooltip: tooltipStyle }, scales: { x: axisStyle, y: axisStyle } };
  const hBarOpts = { indexAxis: "y", responsive: true, plugins: { legend: { display: false }, tooltip: tooltipStyle }, scales: { x: { ...axisStyle, min: 0, max: 100 }, y: { ...axisStyle, grid: { display: false } } } };

  const canExport = !loading && !!data;

  return (
    <div className="min-h-screen text-white"
      style={{ background: "linear-gradient(135deg, #0f2942 0%, #0d3d56 50%, #0a4a4a 100%)" }}>

      <div className="fixed top-[-100px] left-[-100px] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.07), transparent 70%)" }} />

      <div className="relative max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
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

          {/* Export Buttons */}
          <div className="flex items-center gap-3 mt-1 shrink-0">
            <ExportButton
              onClick={handleExportExcel}
              disabled={!canExport}
              color="green"
              label="Export Excel"
              icon={
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16l-3-3m0 0l3-3m-3 3h8" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
                </svg>
              }
            />
            <ExportButton
              onClick={handleExportPDF}
              disabled={!canExport || exporting}
              color="red"
              label={exporting ? "Génération..." : "Export PDF"}
              icon={
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9l-5-6H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v6h6" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6M9 17h4" />
                </svg>
              }
            />
          </div>
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
          Nephrology AI Module · PFA 2025–2026 · Live from API
        </p>

      </div>
    </div>
  );
}