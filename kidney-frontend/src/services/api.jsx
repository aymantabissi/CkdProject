import axios from "axios";

export const predictKidney = async (data) => {
  const res = await axios.post("http://localhost:5000/predict", data);
  return res.data;
};