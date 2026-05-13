// routes/galleries.js
import express from "express";
import db from "../db.js";
import { authenticate } from "../middleware/auth.js";
import { uploadImages, getImageUrl } from "../middleware/upload.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Obtener todas las imágenes de un tour específico
router.get("/tour/:tourId", (req, res) => {
  const { tourId } = req.params;
  
  const images = db.prepare(`
    SELECT * FROM tour_galleries 
    WHERE tour_id = ? 
    ORDER BY is_cover DESC, sort_order ASC, created_at DESC
  `).all(tourId);
  
  res.json(images);
});

// Obtener solo la imagen de portada de un tour
router.get("/tour/:tourId/cover", (req, res) => {
  const { tourId } = req.params;
  
  const cover = db.prepare(`
    SELECT * FROM tour_galleries 
    WHERE tour_id = ? AND is_cover = 1 
    LIMIT 1
  `).get(tourId);
  
  res.json(cover || null);
});

// Subir múltiples imágenes (requiere autenticación)
router.post("/upload/:tourId", authenticate, (req, res, next) => {
  // Primero procesar la subida
  uploadImages(req, res, (err) => {
    if (err) {
      console.error("Error en uploadImages:", err);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  const { tourId } = req.params;
  let { captions } = req.body;
  
  console.log("Files recibidos:", req.files?.length || 0);
  console.log("Captions:", captions);
  
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No se seleccionaron imágenes" });
  }
  
  // Verificar que el tour existe
  const tour = db.prepare("SELECT id FROM tours WHERE id = ?").get(tourId);
  if (!tour) {
    // Limpiar archivos subidos si el tour no existe
    req.files.forEach(file => {
      fs.unlinkSync(file.path);
    });
    return res.status(404).json({ error: "Tour no encontrado" });
  }
  
  // Parsear captions si vienen como JSON string
  let captionsList = [];
  if (captions) {
    try {
      captionsList = JSON.parse(captions);
    } catch (e) {
      captionsList = [];
    }
  }
  
  const insertedImages = [];
  
  // Insertar cada imagen
  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];
    const imageUrl = `/uploads/tours/${file.filename}`;
    const caption = captionsList[i] || null;
    
    // La primera imagen de la tanda se marca como portada si no hay ninguna imagen existente
    const existingImages = db.prepare("SELECT COUNT(*) as count FROM tour_galleries WHERE tour_id = ?").get(tourId);
    const isCover = existingImages.count === 0 && i === 0;
    
    // Si esta es portada y hay otras portadas, las desmarcamos
    if (isCover) {
      db.prepare("UPDATE tour_galleries SET is_cover = 0 WHERE tour_id = ?").run(tourId);
    }
    
    const result = db.prepare(`
      INSERT INTO tour_galleries (tour_id, image_url, caption, is_cover, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `).run(tourId, imageUrl, caption, isCover ? 1 : 0, i);
    
    const newImage = db.prepare("SELECT * FROM tour_galleries WHERE id = ?").get(result.lastInsertRowid);
    insertedImages.push(newImage);
  }
  
  console.log(`✅ ${insertedImages.length} imágenes subidas para el tour ${tourId}`);
  res.status(201).json(insertedImages);
});

// Subir una sola imagen (opcional)
router.post("/single/:tourId", authenticate, (req, res, next) => {
  uploadImages(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  const { tourId } = req.params;
  const { caption, is_cover } = req.body;
  
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No se seleccionó ninguna imagen" });
  }
  
  const file = req.files[0];
  
  // Verificar que el tour existe
  const tour = db.prepare("SELECT id FROM tours WHERE id = ?").get(tourId);
  if (!tour) {
    fs.unlinkSync(file.path);
    return res.status(404).json({ error: "Tour no encontrado" });
  }
  
  const imageUrl = `/uploads/tours/${file.filename}`;
  const isCoverBool = is_cover === "true" || is_cover === true;
  
  // Si esta imagen es portada, quitar portada de otras imágenes del mismo tour
  if (isCoverBool) {
    db.prepare("UPDATE tour_galleries SET is_cover = 0 WHERE tour_id = ?").run(tourId);
  }
  
  const result = db.prepare(`
    INSERT INTO tour_galleries (tour_id, image_url, caption, is_cover)
    VALUES (?, ?, ?, ?)
  `).run(tourId, imageUrl, caption || null, isCoverBool ? 1 : 0);
  
  const newImage = db.prepare("SELECT * FROM tour_galleries WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(newImage);
});

// Actualizar imagen de galería (requiere autenticación)
router.put("/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const { caption, is_cover } = req.body;
  
  const existing = db.prepare("SELECT * FROM tour_galleries WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ error: "Imagen no encontrada" });
  }
  
  // Si esta imagen va a ser portada, quitar portada de las demás imágenes del mismo tour
  if (is_cover) {
    db.prepare("UPDATE tour_galleries SET is_cover = 0 WHERE tour_id = ? AND id != ?").run(existing.tour_id, id);
  }
  
  db.prepare(`
    UPDATE tour_galleries SET 
      caption = COALESCE(?, caption),
      is_cover = COALESCE(?, is_cover)
    WHERE id = ?
  `).run(caption, is_cover ? 1 : 0, id);
  
  const updated = db.prepare("SELECT * FROM tour_galleries WHERE id = ?").get(id);
  res.json(updated);
});

// Eliminar imagen de galería (requiere autenticación)
router.delete("/:id", authenticate, (req, res) => {
  const { id } = req.params;
  
  const existing = db.prepare("SELECT * FROM tour_galleries WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ error: "Imagen no encontrada" });
  }
  
  // Eliminar el archivo físico
  const imagePath = path.join(__dirname, "..", existing.image_url);
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
    console.log(`Archivo eliminado: ${imagePath}`);
  }
  
  db.prepare("DELETE FROM tour_galleries WHERE id = ?").run(id);
  res.status(204).send();
});

// Reordenar imágenes (requiere autenticación)
router.post("/reorder", authenticate, (req, res) => {
  const { orders } = req.body;
  
  if (!Array.isArray(orders)) {
    return res.status(400).json({ error: "Formato inválido" });
  }
  
  const updateStmt = db.prepare("UPDATE tour_galleries SET sort_order = ? WHERE id = ?");
  
  for (const { id, sort_order } of orders) {
    updateStmt.run(sort_order, id);
  }
  
  res.json({ success: true });
});

export default router;