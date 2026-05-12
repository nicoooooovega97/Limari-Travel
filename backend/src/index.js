import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import tourRoutes from "./routes/tours.js";
import studyTripRoutes from "./routes/studyTrips.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Configuración CORS mejorada
const corsOptions = {
  origin: [
    "http://localhost:5173", 
    "https://limari-travel.vercel.app"
  ], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// 🔧 Manejar explícitamente las peticiones OPTIONS (preflight)
app.options('*', cors(corsOptions));

app.use(express.json());

// Logging para debugging (opcional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/study-trips", studyTripRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Travel Limari backend running on http://localhost:${PORT}`);
  console.log(`CORS enabled for: https://limari-travel.vercel.app`);
});