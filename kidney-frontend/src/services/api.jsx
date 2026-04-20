// src/services/api.js

const BASE_URL = "http://localhost:5000";

export async function predictKidney(formData) {
  const response = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Server error");
  }

  return response.json();
  // returns: { prediction, confidence, risk_percent, label }
}

export async function getStats() {
  const response = await fetch(`${BASE_URL}/stats`);
  if (!response.ok) throw new Error("Failed to fetch stats");
  return response.json();
}