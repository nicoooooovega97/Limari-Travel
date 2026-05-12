// backend/routes/auth.js - Versión PostgreSQL
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../db.js";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: "Usuario y contraseña son requeridos" });
  }

  try {
    const result = await db.query(
      'SELECT * FROM admin WHERE username = $1',
      [username]
    );
    
    const admin = result.rows[0];
    
    if (!admin) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const isValid = bcrypt.compareSync(password, admin.password_hash);
    
    if (!isValid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { sub: admin.id, username: admin.username }, 
      JWT_SECRET, 
      { expiresIn: "8h" }
    );

    return res.json({ token, username: admin.username });
    
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;