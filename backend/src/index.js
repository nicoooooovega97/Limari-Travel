import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import tourRoutes from "./routes/tours.js";
import studyTripRoutes from "./routes/studyTrips.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/study-trips", studyTripRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Travel Limari backend running on http://localhost:${PORT}`);
});
