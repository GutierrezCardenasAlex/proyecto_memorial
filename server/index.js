import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

import { pool } from "./db.js";
import personasRoutes from "./routes/personas.js";

const app = express();

// 📌 Necesario para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// 🔥 SERVIR IMÁGENES (ANTES DE TODO)
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "public", "uploads")
  )
);
// API
app.use("/api/personas", personasRoutes);

// 📁 Servir frontend compilado
app.use(express.static(path.join(__dirname, "../dist")));

// 🔥 CATCH ALL (siempre al final)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor corriendo en puerto " + PORT);
});