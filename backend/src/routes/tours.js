// backend/routes/tours.js - Versión PostgreSQL
import express from "express";
import db from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

function parseTour(row) {
  if (!row) return null;
  return {
    ...row,
    includes: row.includes ? JSON.parse(row.includes) : null,
    itinerary: row.itinerary ? JSON.parse(row.itinerary) : null,
    importantInfo: row.importantInfo ? JSON.parse(row.importantInfo) : null,
    schedule: row.schedule ? JSON.parse(row.schedule) : null
  };
}

// GET all tours
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tours ORDER BY id DESC");
    res.json(result.rows.map(parseTour));
  } catch (error) {
    console.error("Error getting tours:", error);
    res.status(500).json({ error: "Error al obtener tours" });
  }
});

// GET single tour
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM tours WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tour no encontrado" });
    }
    res.json(parseTour(result.rows[0]));
  } catch (error) {
    console.error("Error getting tour:", error);
    res.status(500).json({ error: "Error al obtener tour" });
  }
});

// POST create tour
router.post("/", authenticate, async (req, res) => {
  const {
    title,
    image,
    date,
    displayDate,
    price,
    reservationPrice,
    status,
    month,
    year,
    description,
    includes,
    itinerary,
    importantInfo,
    schedule
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO tours 
        (title, image, date, "displayDate", price, "reservationPrice", status, month, year, description, includes, itinerary, "importantInfo", schedule)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        title,
        image,
        date,
        displayDate,
        price,
        reservationPrice,
        status,
        month,
        year,
        description,
        JSON.stringify(includes || []),
        JSON.stringify(itinerary || []),
        JSON.stringify(importantInfo || []),
        JSON.stringify(schedule || [])
      ]
    );
    
    res.status(201).json(parseTour(result.rows[0]));
  } catch (error) {
    console.error("Error creating tour:", error);
    res.status(500).json({ error: "Error al crear tour" });
  }
});

// PUT update tour
router.put("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const {
    title,
    image,
    date,
    displayDate,
    price,
    reservationPrice,
    status,
    month,
    year,
    description,
    includes,
    itinerary,
    importantInfo,
    schedule
  } = req.body;

  try {
    // Verificar si existe
    const existing = await db.query("SELECT * FROM tours WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Tour no encontrado" });
    }

    const result = await db.query(
      `UPDATE tours SET
        title = $1,
        image = $2,
        date = $3,
        "displayDate" = $4,
        price = $5,
        "reservationPrice" = $6,
        status = $7,
        month = $8,
        year = $9,
        description = $10,
        includes = $11,
        itinerary = $12,
        "importantInfo" = $13,
        schedule = $14
      WHERE id = $15
      RETURNING *`,
      [
        title,
        image,
        date,
        displayDate,
        price,
        reservationPrice,
        status,
        month,
        year,
        description,
        JSON.stringify(includes || []),
        JSON.stringify(itinerary || []),
        JSON.stringify(importantInfo || []),
        JSON.stringify(schedule || []),
        id
      ]
    );
    
    res.json(parseTour(result.rows[0]));
  } catch (error) {
    console.error("Error updating tour:", error);
    res.status(500).json({ error: "Error al actualizar tour" });
  }
});

// DELETE tour
router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  
  try {
    const existing = await db.query("SELECT * FROM tours WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Tour no encontrado" });
    }

    await db.query("DELETE FROM tours WHERE id = $1", [id]);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting tour:", error);
    res.status(500).json({ error: "Error al eliminar tour" });
  }
});

export default router;