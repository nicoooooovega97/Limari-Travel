import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import tourRoutes from "./routes/tours.js";
import studyTripRoutes from "./routes/studyTrips.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración CORS más robusta
const allowedOrigins = [
  'http://localhost:5173',
  'https://limari-travel.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Tus rutas API
app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/study-trips", studyTripRoutes);

// Ruta de prueba
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Travel Limari backend running on http://localhost:${PORT}`);
});