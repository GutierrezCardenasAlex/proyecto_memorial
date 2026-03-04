import express from "express";
import { pool } from "../db.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

/* ======================================================
   CONFIG MULTER (SUBIDA DE IMAGENES PERSONA)
====================================================== */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { slug } = req.body;

    const uploadPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "personas",
      slug || "general"
    );

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

/* ======================================================
   LISTADO PERSONAS
====================================================== */

router.get("/", async (req, res) => {
  const { search = "" } = req.query;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM datos_generales
       WHERE nombre_completo ILIKE $1
       ORDER BY nombre_completo`,
      [`%${search}%`]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   CREAR PERSONA
====================================================== */

router.post("/", upload.single("imagen"), async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      nombre_completo,
      titulo,
      biografia,
      slug,
      province,
      country,
      anio_nacimiento,
      anio_fallecimiento,
      dia_cumpleanos,
      dia_fallecimiento,
      estado
    } = req.body;

    const ruta_imagen = req.file
      ? `uploads/personas/${slug}/${req.file.originalname}`
      : null;

    const result = await client.query(
      `INSERT INTO datos_generales (
        nombre_completo, titulo, biografia, slug,
        province, country,
        anio_nacimiento, anio_fallecimiento,
        dia_cumpleanos, dia_fallecimiento,
        ruta_imagen, estado
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
      [
        nombre_completo,
        titulo,
        biografia,
        slug,
        province,
        country,
        anio_nacimiento,
        anio_fallecimiento,
        dia_cumpleanos,
        dia_fallecimiento,
        ruta_imagen,
        estado || "activo"
      ]
    );

    await client.query("COMMIT");

    res.status(201).json(result.rows[0]);

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

/* ======================================================
   ===== RUTAS RELACIONADAS (ANTES DE /:id) =====
====================================================== */

router.post("/educacion", async (req, res) => {
  const {
    persona_id,
    title,
    institution,
    description,
    province,
    country,
    date_start,
    date_end
  } = req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO educacion
       (persona_id,title,institution,description,province,country,date_start,date_end)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        persona_id,
        title,
        institution,
        description,
        province,
        country,
        date_start,
        date_end
      ]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/intereses", async (req, res) => {
  const { persona_id, title, descripcion } = req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO intereses (persona_id,title,descripcion)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [persona_id, title, descripcion]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/trayectoria", async (req, res) => {
  const {
    persona_id,
    cargo,
    institucion,
    anio_inicio,
    anio_fin,
    descripcion
  } = req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO trayectoria
       (persona_id,cargo,institucion,anio_inicio,anio_fin,descripcion)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [
        persona_id,
        cargo,
        institucion,
        anio_inicio,
        anio_fin,
        descripcion
      ]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/logros", async (req, res) => {
  const { persona_id, titulo, biografia, lugar, fecha } = req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO logros
       (persona_id,titulo,biografia,lugar,fecha)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [persona_id, titulo, biografia, lugar, fecha]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// STORAGE PARA GALERÍA
const storageGaleria = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const { persona_id } = req.body;

      if (!persona_id) {
        return cb(new Error("persona_id requerido"));
      }

      // 🔥 Buscar el slug en la base de datos
      const result = await pool.query(
        "SELECT slug FROM datos_generales WHERE id = $1",
        [persona_id]
      );

      if (result.rowCount === 0) {
        return cb(new Error("Persona no encontrada"));
      }

      const slug = result.rows[0].slug;

      const uploadPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "personas",
        slug,
        "galeria"
      );

      // 🔥 Crear carpeta si no existe
      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);

    } catch (error) {
      cb(error);
    }
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const uploadGaleria = multer({ storage: storageGaleria });

router.post("/galeria", uploadGaleria.single("imagen"), async (req, res) => {
  const { persona_id, titulo } = req.body;

  try {

    if (!req.file) {
      return res.status(400).json({ error: "Imagen requerida" });
    }

    // 🔥 Obtener slug otra vez (para guardar ruta correcta)
    const result = await pool.query(
      "SELECT slug FROM datos_generales WHERE id = $1",
      [persona_id]
    );

    const slug = result.rows[0].slug;

    const ruta_imagen = `uploads/personas/${slug}/galeria/${req.file.filename}`;

    const { rows } = await pool.query(
      `INSERT INTO galeria (persona_id, titulo, ruta_imagen)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [persona_id, titulo, ruta_imagen]
    );

    res.status(201).json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   PERSONA POR SLUG (CON RELACIONES)
====================================================== */
router.get("/slug/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    // 1️⃣ Datos principales
    const personaRes = await pool.query(
      "SELECT * FROM datos_generales WHERE slug = $1",
      [slug]
    );

    if (personaRes.rowCount === 0) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }

    const persona = personaRes.rows[0];
    const personaId = persona.id;

    // 2️⃣ Relaciones
    const educacion = await pool.query(
      "SELECT * FROM educacion WHERE persona_id = $1 ORDER BY date_start DESC",
      [personaId]
    );

    const intereses = await pool.query(
      "SELECT * FROM intereses WHERE persona_id = $1",
      [personaId]
    );

    const trayectoria = await pool.query(
      "SELECT * FROM trayectoria WHERE persona_id = $1",
      [personaId]
    );

    const logros = await pool.query(
      "SELECT * FROM logros WHERE persona_id = $1 ORDER BY fecha DESC",
      [personaId]
    );

    const galeria = await pool.query(
      "SELECT * FROM galeria WHERE persona_id = $1",
      [personaId]
    );

    // 3️⃣ Respuesta completa
    res.json({
      ...persona,
      educacion: educacion.rows,
      intereses: intereses.rows,
      trayectoria: trayectoria.rows,
      logros: logros.rows,
      galeria: galeria.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
/* ======================================================
   PERSONA POR ID (SIEMPRE AL FINAL)
====================================================== */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 1️⃣ Datos principales
    const personaRes = await pool.query(
      "SELECT * FROM datos_generales WHERE id = $1",
      [id]
    );

    if (personaRes.rowCount === 0) {
      return res.status(404).json({ error: "No encontrado" });
    }

    const persona = personaRes.rows[0];

    // 2️⃣ Relaciones
    const educacion = await pool.query(
      "SELECT * FROM educacion WHERE persona_id = $1 ORDER BY date_start DESC",
      [id]
    );

    const intereses = await pool.query(
      "SELECT * FROM intereses WHERE persona_id = $1",
      [id]
    );

    const trayectoria = await pool.query(
      "SELECT * FROM trayectoria WHERE persona_id = $1",
      [id]
    );

    const logros = await pool.query(
      "SELECT * FROM logros WHERE persona_id = $1 ORDER BY fecha DESC",
      [id]
    );

    const galeria = await pool.query(
      "SELECT * FROM galeria WHERE persona_id = $1",
      [id]
    );

    // 3️⃣ Respuesta completa
    res.json({
      ...persona,
      educacion: educacion.rows,
      intereses: intereses.rows,
      trayectoria: trayectoria.rows,
      logros: logros.rows,
      galeria: galeria.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre_completo, titulo, biografia } = req.body;

  try {
    await pool.query(
      `UPDATE datos_generales
       SET nombre_completo=$1, titulo=$2, biografia=$3
       WHERE id=$4`,
      [nombre_completo, titulo, biografia, id]
    );

    res.json({ message: "Actualizado correctamente" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM datos_generales WHERE id=$1", [id]);
    res.json({ message: "Eliminado correctamente" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;