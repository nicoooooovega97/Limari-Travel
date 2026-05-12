// backend/db.js - Versión PostgreSQL
import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configurar conexión a PostgreSQL desde variables de Railway
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT || 5432,
  ssl: { rejectUnauthorized: false } // Railway requiere SSL
});

// Crear tablas si no existen
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Crear tabla admin
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      )
    `);

    // Crear tabla tours
    await client.query(`
      CREATE TABLE IF NOT EXISTS tours (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        image TEXT,
        date TEXT,
        "displayDate" TEXT,
        price TEXT,
        "reservationPrice" TEXT,
        status TEXT,
        month INTEGER,
        year INTEGER,
        description TEXT,
        includes TEXT,
        itinerary TEXT,
        "importantInfo" TEXT,
        schedule TEXT
      )
    `);

    // Crear tabla study_trips
    await client.query(`
      CREATE TABLE IF NOT EXISTS study_trips (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        duration TEXT,
        description TEXT,
        price TEXT,
        image TEXT,
        tags TEXT,
        includes TEXT,
        itinerary TEXT
      )
    `);

    // Crear admin por defecto si no existe
    const result = await client.query('SELECT COUNT(1) FROM admin');
    if (parseInt(result.rows[0].count) === 0) {
      const username = process.env.ADMIN_USERNAME || "admin";
      const password = process.env.ADMIN_PASSWORD || "limari2026";
      const passwordHash = bcrypt.hashSync(password, 10);
      
      await client.query(
        'INSERT INTO admin (username, password_hash) VALUES ($1, $2)',
        [username, passwordHash]
      );
      console.log(`Admin seeded: ${username}`);
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    client.release();
  }
}

initializeDatabase();

export default {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect()
};