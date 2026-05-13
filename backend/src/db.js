import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.join(__dirname, "..", "data");
const dbFile = path.join(dbDir, "database.sqlite");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const db = new Database(dbFile);

db.pragma("journal_mode = WAL");

db.prepare(`
  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    image TEXT,
    date TEXT,
    displayDate TEXT,
    price TEXT,
    reservationPrice TEXT,
    status TEXT,
    month INTEGER,
    year INTEGER,
    description TEXT,
    includes TEXT,
    itinerary TEXT,
    importantInfo TEXT,
    schedule TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS study_trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    duration TEXT,
    description TEXT,
    price TEXT,
    image TEXT,
    tags TEXT,
    includes TEXT,
    itinerary TEXT
  )
`).run();

// db.js - Agregar al final del archivo, antes de export default db

// Crear tabla de galerías de tours
db.prepare(`
  CREATE TABLE IF NOT EXISTS tour_galleries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tour_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    is_cover BOOLEAN DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
  )
`).run();

// db.js - Agregar al final, antes de export default db

// Crear tabla de galerías de tours
db.prepare(`
  CREATE TABLE IF NOT EXISTS tour_galleries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tour_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    is_cover BOOLEAN DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
  )
`).run();

db.prepare(`CREATE INDEX IF NOT EXISTS idx_tour_galleries_tour_id ON tour_galleries(tour_id)`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_tour_galleries_is_cover ON tour_galleries(is_cover)`).run();

console.log("Tabla tour_galleries verificada/creada correctamente");

// Crear índice para búsquedas rápidas
db.prepare(`CREATE INDEX IF NOT EXISTS idx_tour_galleries_tour_id ON tour_galleries(tour_id)`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_tour_galleries_is_cover ON tour_galleries(is_cover)`).run();

console.log("Tabla tour_galleries verificada/creada correctamente");

const adminCount = db.prepare("SELECT COUNT(1) AS count FROM admin").get();
if (adminCount.count === 0) {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "limari2026";
  const passwordHash = bcrypt.hashSync(password, 10);

  db.prepare("INSERT INTO admin (username, password_hash) VALUES (?, ?)").run(username, passwordHash);
  console.log(`Admin seeded: ${username}`);
}

export default db;
