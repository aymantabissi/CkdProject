import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 80]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.6]);

  return (
    <div className="min-h-screen bg-[#071a2b] text-white overflow-hidden relative">

      {/* 🌈 Animated background blobs */}
      <motion.div
        className="fixed top-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full bg-sky-500/10 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 60, 0] }}
        transition={{ repeat: Infinity, duration: 12 }}
      />

      <motion.div
        className="fixed bottom-[-150px] right-[-150px] w-[450px] h-[450px] rounded-full bg-emerald-500/10 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
        transition={{ repeat: Infinity, duration: 15 }}
      />

      {/* HERO */}
      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16">

        <motion.div style={{ y: y1, opacity }} className="text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            AI Medical System · Kidney Prediction
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold leading-tight"
          >
            Predict Kidney Disease <br />
            <span className="bg-gradient-to-r from-sky-400 to-emerald-400 text-transparent bg-clip-text">
              with AI Accuracy
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-slate-300 max-w-2xl mx-auto text-[15px]"
          >
            A next-generation clinical decision support system using Machine Learning
            to detect kidney disease risk instantly and generate professional medical reports.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="flex justify-center gap-4 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/predict")}
              className="px-8 py-3 rounded-2xl font-bold bg-gradient-to-r from-sky-500 to-emerald-500 shadow-lg"
            >
              Start Prediction
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/about")}
              className="px-8 py-3 rounded-2xl border border-white/10 text-white/80"
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>

        {/* 📊 STATS */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
        >
          {[
            ["400+", "Patients"],
            ["24", "Features"],
            ["97%", "Accuracy"],
            ["AI", "Model"],
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
            >
              <p className="text-3xl font-bold">{s[0]}</p>
              <p className="text-xs text-slate-400 mt-1">{s[1]}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ⚡ FEATURES */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.2 } },
          }}
          className="grid md:grid-cols-3 gap-6 mt-20"
        >
          {[
            {
              title: "AI Diagnosis Engine",
              desc: "Trained ML model for early kidney disease detection.",
            },
            {
              title: "Instant PDF Reports",
              desc: "Professional medical reports generated in seconds.",
            },
            {
              title: "Clinical Insights",
              desc: "Risk score + confidence for better decisions.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="rounded-2xl p-6 bg-white/5 border border-white/10"
            >
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* 🚀 FINAL CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/predict")}
            className="px-10 py-4 rounded-2xl font-bold bg-gradient-to-r from-sky-500 to-emerald-500 shadow-2xl"
          >
            Launch AI Prediction System
          </motion.button>

          <p className="text-xs text-white/30 mt-4">
            Academic PFE Project · Not for medical diagnosis use
          </p>
        </motion.div>
      </div>
    </div>
  );
}