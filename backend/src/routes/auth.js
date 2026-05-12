import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../db.js";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

router.post("/login", (req, res) => {
  console.log("📝 Login request received:", req.body);
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    console.log("❌ Missing credentials");
    return res.status(400).json({ error: "Usuario y contraseña son requeridos" });
  }

  try {
    const admin = db.prepare("SELECT * FROM admin WHERE username = ?").get(username);
    
    if (!admin) {
      console.log(`❌ User not found: ${username}`);
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const isValid = bcrypt.compareSync(password, admin.password_hash);
    
    if (!isValid) {
      console.log(`❌ Invalid password for: ${username}`);
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { sub: admin.id, username: admin.username }, 
      JWT_SECRET, 
      { expiresIn: "8h" }
    );

    console.log(`✅ Login successful for: ${username}`);
    return res.json({ token, username: admin.username });
    
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;