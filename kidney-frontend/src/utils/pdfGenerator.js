import jsPDF from "jspdf";





const generatePDF = (prediction, stats, form)=> {
  // ← هاد السطر هو الحل

  const currentResult = prediction;
  const currentStats = stats;
  const currentForm = form;
  
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

    // ─── TABLE — كتستعمل currentForm بدل form ───
    const fields = [
      ["Age",              (currentForm.age         || "—") + " years"],
      ["Blood Pressure",   (currentForm.bp          || "—") + " mmHg"],
      ["Creatinine",       (currentForm.creatinine  || "—") + " mg/dL"],
      ["Blood Urea",       (currentForm.urea        || "—") + " mg/dL"],
      ["Hemoglobin",       (currentForm.hemoglobin  || "—") + " g/dL"],
      ["Sodium",           (currentForm.sodium      || "—") + " mEq/L"],
      ["Potassium",        (currentForm.potassium   || "—") + " mEq/L"],
      ["Protein in Urine", currentForm.protein      === "1" ? "Positive" : "Negative"],
      ["Glucose in Urine", currentForm.glucose      === "1" ? "Positive" : "Negative"],
      ["RBC in Urine",     currentForm.rbc          === "1" ? "Positive" : "Negative"],
      ["Diabetes",         currentForm.diabetes     === "1" ? "Yes" : "No"],
      ["Hypertension",     currentForm.hypertension === "1" ? "Yes" : "No"],
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
      doc.text(String(val), 120, y);
      y += 8;
    });

    // ─── STATS ROW ───
    if (currentStats) {
      y += 4;
      doc.setFillColor(isHigh ? 254 : 236, isHigh ? 235 : 253, isHigh ? 235 : 245);
      doc.roundedRect(15, y, 87, 16, 3, 3, "F");
      doc.roundedRect(108, y, 87, 16, 3, 3, "F");
      doc.setTextColor(isHigh ? 153 : 22, isHigh ? 27 : 101, isHigh ? 27 : 52);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`${currentStats.risk_percent}%`, 58,  y + 10, { align: "center" });
      doc.text(`${currentStats.confidence}%`,   151, y + 10, { align: "center" });
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.text("RISK SCORE",  58,  y + 14, { align: "center" });
      doc.text("CONFIDENCE",  151, y + 14, { align: "center" });
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

  export default generatePDF;