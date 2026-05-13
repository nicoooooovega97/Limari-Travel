// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import tourRoutes from "./routes/tours.js";
import studyTripRoutes from "./routes/studyTrips.js";
import galleryRoutes from "./routes/galleries.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

// Configuración CORS mejorada
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// Manejar explícitamente las solicitudes OPTIONS (preflight)
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes subidas)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/study-trips", studyTripRoutes);
app.use("/api/galleries", galleryRoutes);

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