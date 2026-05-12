// backend/routes/studyTrips.js - Versión PostgreSQL
import express from "express";
import db from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

function parseStudyTrip(row) {
  if (!row) return null;
  return {
    ...row,
    tags: row.tags ? JSON.parse(row.tags) : null,
    includes: row.includes ? JSON.parse(row.includes) : null,
    itinerary: row.itinerary ? JSON.parse(row.itinerary) : null
  };
}

// GET all study trips
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM study_trips ORDER BY id DESC");
    res.json(result.rows.map(parseStudyTrip));
  } catch (error) {
    console.error("Error getting study trips:", error);
    res.status(500).json({ error: "Error al obtener giras de estudio" });
  }
});

// POST create study trip
router.post("/", authenticate, async (req, res) => {
  const { title, duration, description, price, image, tags, includes, itinerary } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO study_trips
        (title, duration, description, price, image, tags, includes, itinerary)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        title,
        duration,
        description,
        price,
        image,
        JSON.stringify(tags || []),
        JSON.stringify(includes || {}),
        JSON.stringify(itinerary || [])
      ]
    );
    
    res.status(201).json(parseStudyTrip(result.rows[0]));
  } catch (error) {
    console.error("Error creating study trip:", error);
    res.status(500).json({ error: "Error al crear gira de estudio" });
  }
});

// PUT update study trip
router.put("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, duration, description, price, image, tags, includes, itinerary } = req.body;

  try {
    // Verificar si existe
    const existing = await db.query("SELECT * FROM study_trips WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Gira de estudio no encontrada" });
    }

    const result = await db.query(
      `UPDATE study_trips SET
        title = $1,
        duration = $2,
        description = $3,
        price = $4,
        image = $5,
        tags = $6,
        includes = $7,
        itinerary = $8
      WHERE id = $9
      RETURNING *`,
      [
        title,
        duration,
        description,
        price,
        image,
        JSON.stringify(tags || []),
        JSON.stringify(includes || {}),
        JSON.stringify(itinerary || []),
        id
      ]
    );
    
    res.json(parseStudyTrip(result.rows[0]));
  } catch (error) {
    console.error("Error updating study trip:", error);
    res.status(500).json({ error: "Error al actualizar gira de estudio" });
  }
});

// DELETE study trip
router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  
  try {
    const existing = await db.query("SELECT * FROM study_trips WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Gira de estudio no encontrada" });
    }

    await db.query("DELETE FROM study_trips WHERE id = $1", [id]);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting study trip:", error);
    res.status(500).json({ error: "Error al eliminar gira de estudio" });
  }
});

export default router;