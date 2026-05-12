import express from "express";
import db from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

function parseTour(row) {
  return {
    ...row,
    includes: row.includes ? JSON.parse(row.includes) : null,
    itinerary: row.itinerary ? JSON.parse(row.itinerary) : null,
    importantInfo: row.importantInfo ? JSON.parse(row.importantInfo) : null,
    schedule: row.schedule ? JSON.parse(row.schedule) : null
  };
}

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM tours ORDER BY id DESC").all();
  res.json(rows.map(parseTour));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const tour = db.prepare("SELECT * FROM tours WHERE id = ?").get(id);
  if (!tour) {
    return res.status(404).json({ error: "Tour no encontrado" });
  }
  res.json(parseTour(tour));
});

router.post("/", authenticate, (req, res) => {
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

  const result = db
    .prepare(
      `INSERT INTO tours
        (title, image, date, displayDate, price, reservationPrice, status, month, year, description, includes, itinerary, importantInfo, schedule)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
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
    );

  const tour = db.prepare("SELECT * FROM tours WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(parseTour(tour));
});

router.put("/:id", authenticate, (req, res) => {
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

  const existing = db.prepare("SELECT * FROM tours WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ error: "Tour no encontrado" });
  }

  db.prepare(
    `UPDATE tours SET
      title = ?,
      image = ?,
      date = ?,
      displayDate = ?,
      price = ?,
      reservationPrice = ?,
      status = ?,
      month = ?,
      year = ?,
      description = ?,
      includes = ?,
      itinerary = ?,
      importantInfo = ?,
      schedule = ?
    WHERE id = ?`
  ).run(
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
  );

  const tour = db.prepare("SELECT * FROM tours WHERE id = ?").get(id);
  res.json(parseTour(tour));
});

router.delete("/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare("SELECT * FROM tours WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ error: "Tour no encontrado" });
  }

  db.prepare("DELETE FROM tours WHERE id = ?").run(id);
  res.status(204).send();
});

export default router;
