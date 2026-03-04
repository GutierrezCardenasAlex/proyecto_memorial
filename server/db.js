import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 👇 calcular ruta raíz
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 cargar .env desde la raíz del proyecto
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

console.log("DB_HOST =", process.env.DB_HOST);
console.log("DB_USER =", process.env.DB_USER);
console.log("DB_PASSWORD =", process.env.DB_PASSWORD);

const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
});
