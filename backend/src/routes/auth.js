import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../db.js";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Usuario y contraseña son requeridos" });
  }

  const admin = db.prepare("SELECT * FROM admin WHERE username = ?").get(username);
  if (!admin) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const isValid = bcrypt.compareSync(password, admin.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const token = jwt.sign({ sub: admin.id, username: admin.username }, JWT_SECRET, {
    expiresIn: "8h"
  });

  return res.json({ token, username: admin.username });
});

export default router;
