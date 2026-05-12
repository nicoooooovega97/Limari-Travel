import express from "express";
import db from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

function parseStudyTrip(row) {
  return {
    ...row,
    tags: row.tags ? JSON.parse(row.tags) : null,
    includes: row.includes ? JSON.parse(row.includes) : null,
    itinerary: row.itinerary ? JSON.parse(row.itinerary) : null
  };
}

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM study_trips ORDER BY id DESC").all();
  res.json(rows.map(parseStudyTrip));
});

router.post("/", authenticate, (req, res) => {
  const { title, duration, description, price, image, tags, includes, itinerary } = req.body;

  const result = db
    .prepare(
      `INSERT INTO study_trips
        (title, duration, description, price, image, tags, includes, itinerary)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      title,
      duration,
      description,
      price,
      image,
      JSON.stringify(tags || []),
      JSON.stringify(includes || {}),
      JSON.stringify(itinerary || [])
    );

  const trip = db.prepare("SELECT * FROM study_trips WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(parseStudyTrip(trip));
});

router.put("/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const { title, duration, description, price, image, tags, includes, itinerary } = req.body;

  const existing = db.prepare("SELECT * FROM study_trips WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ error: "Gira de estudio no encontrada" });
  }

  db.prepare(
    `UPDATE study_trips SET
      title = ?,
      duration = ?,
      description = ?,
      price = ?,
      image = ?,
      tags = ?,
      includes = ?,
      itinerary = ?
    WHERE id = ?`
  ).run(
    title,
    duration,
    description,
    price,
    image,
    JSON.stringify(tags || []),
    JSON.stringify(includes || {}),
    JSON.stringify(itinerary || []),
    id
  );

  const trip = db.prepare("SELECT * FROM study_trips WHERE id = ?").get(id);
  res.json(parseStudyTrip(trip));
});

router.delete("/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare("SELECT * FROM study_trips WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ error: "Gira de estudio no encontrada" });
  }

  db.prepare("DELETE FROM study_trips WHERE id = ?").run(id);
  res.status(204).send();
});

export default router;
