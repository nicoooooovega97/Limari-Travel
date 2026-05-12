import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import tourRoutes from "./routes/tours.js";
import studyTripRoutes from "./routes/studyTrips.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// 🔥 CONFIGURACIÓN CORS MÁS PERMISIVA PARA PROBAR
app.use(cors({
  origin: '*',  // Permite TODOS los orígenes (solo para pruebas)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Manejar preflight requests
app.options('*', cors());

app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Rutas
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
  console.log(`CORS enabled for all origins (testing mode)`);
});