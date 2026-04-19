// src/pages/AboutPage.jsx

const team = [
  { initials: "??", name: "Your Name", role: "Developer & ML Engineer" },
];

const techStack = [
  { name: "React + Vite", cat: "Frontend" },
  { name: "Tailwind CSS", cat: "Styling" },
  { name: "Python Flask", cat: "Backend" },
  { name: "Scikit-learn", cat: "ML Model" },
  { name: "Pandas / NumPy", cat: "Data Processing" },
  { name: "UCI CKD Dataset", cat: "Training Data" },
];

export default function AboutPage() {
  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "linear-gradient(135deg, #0f2942 0%, #0d3d56 50%, #0a4a4a 100%)" }}
    >
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="text-sky-300 text-[11px] font-semibold uppercase tracking-widest">About this project</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-4">
            Kidney Disease<br />
            <span style={{ background: "linear-gradient(90deg,#38bdf8,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Prediction System
            </span>
          </h1>
          <p className="text-slate-300 text-[14px] leading-relaxed max-w-xl">
            This project was developed as part of a Final Year Project (PFE) focused on the
            application of Machine Learning and Business Intelligence techniques to predict
            the risk of Acute or Chronic Kidney Disease from clinical and biological patient data.
          </p>
        </div>

        {/* Objective */}
        <div
          className="rounded-2xl border border-white/5 p-6 mb-6"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <h2 className="text-[13px] font-bold text-sky-300 uppercase tracking-widest mb-3">Objective</h2>
          <p className="text-slate-300 text-[13px] leading-relaxed">
            To build a clinical decision support system that helps healthcare professionals
            detect kidney disease risk early — improving diagnosis speed and patient care —
            using a trained ML model served through a REST API.
          </p>
        </div>

        {/* Tech Stack */}
        <div
          className="rounded-2xl border border-white/5 p-6 mb-6"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <h2 className="text-[13px] font-bold text-teal-300 uppercase tracking-widest mb-4">Tech Stack</h2>
          <div className="grid grid-cols-3 gap-3">
            {techStack.map((t) => (
              <div
                key={t.name}
                className="rounded-xl p-3 border border-white/5"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{t.cat}</p>
                <p className="text-[13px] font-semibold text-white">{t.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div
          className="rounded-2xl border border-white/5 p-6 mb-6"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <h2 className="text-[13px] font-bold text-violet-300 uppercase tracking-widest mb-4">Developer</h2>
          {team.map((m) => (
            <div key={m.name} className="flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-[13px] font-bold text-sky-300"
                style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.2)" }}
              >
                {m.initials}
              </div>
              <div>
                <p className="text-[14px] font-bold text-white">{m.name}</p>
                <p className="text-[12px] text-slate-400">{m.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[11px] text-white/20 mt-8 leading-relaxed">
          This tool is for academic and clinical decision support purposes only.<br />
          It does not replace professional medical diagnosis or specialist consultation.
        </p>

      </div>
    </div>
  );
}