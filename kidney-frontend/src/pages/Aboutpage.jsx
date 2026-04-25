// src/pages/AboutPage.jsx
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const techStack = [
  { name: "React + Vite", cat: "Frontend" },
  { name: "Tailwind CSS", cat: "UI" },
  { name: "Flask API", cat: "Backend" },
  { name: "Scikit-learn", cat: "ML" },
  { name: "Pandas / NumPy", cat: "Data" },
  { name: "CKD Dataset", cat: "Dataset" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden"
      style={{ background: "linear-gradient(135deg,#0f2942,#0d3d56,#0a4a4a)" }}>

      {/* Floating Background Orbs */}
      <div className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-sky-400/10 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-teal-400/10 blur-3xl rounded-full animate-pulse" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto px-6 py-16 relative z-10"
      >

        {/* HEADER */}
        <motion.div variants={item} className="text-center mb-14">
          <p className="text-sky-300 text-xs uppercase tracking-[0.3em] mb-4">
            AI Medical Project
          </p>

          <h1 className="text-5xl font-black leading-tight">
            Kidney Disease
            <span className="block bg-gradient-to-r from-sky-400 to-teal-300 text-transparent bg-clip-text">
              Prediction System
            </span>
          </h1>

          <p className="text-slate-300 mt-6 max-w-2xl mx-auto text-sm leading-relaxed">
            Advanced AI-powered clinical decision support system that predicts kidney disease risk
            using machine learning trained on real medical datasets.
          </p>
        </motion.div>

        {/* CARDS GRID */}
        <motion.div
          variants={container}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {[
            {
              title: "Objective",
              text: "Early detection of kidney disease using AI models to assist doctors in decision making.",
              color: "from-sky-500/20",
            },
            {
              title: "Impact",
              text: "Faster diagnosis, improved patient care, reduced medical risk through prediction.",
              color: "from-teal-500/20",
            },
            {
              title: "Model",
              text: "Trained ML model using Random Forest & Logistic Regression on CKD dataset.",
              color: "from-violet-500/20",
            },
          ].map((c, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ scale: 1.05 }}
              className={`p-6 rounded-2xl border border-white/10 backdrop-blur-xl bg-gradient-to-b ${c.color} to-transparent`}
            >
              <h3 className="text-sm font-bold mb-2 text-white">{c.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{c.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* TECH STACK */}
        <motion.div variants={item} className="mb-16">
          <h2 className="text-sm uppercase tracking-widest text-teal-300 mb-6 text-center">
            Tech Stack
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {techStack.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg"
              >
                <p className="text-[10px] text-slate-400 uppercase">{t.cat}</p>
                <p className="text-sm font-semibold">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA SECTION */}
        <motion.div
          variants={item}
          whileHover={{ scale: 1.02 }}
          className="p-10 text-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
        >
          <h2 className="text-2xl font-bold mb-3">
            Built for Medical Intelligence 🚀
          </h2>
          <p className="text-slate-300 text-sm mb-6">
            A complete AI pipeline from dataset → training → prediction → UI visualization.
          </p>

          <button className="px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-sky-500 to-teal-400 hover:scale-105 transition">
            Explore Project
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}