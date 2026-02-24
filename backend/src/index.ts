import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db";
import cfgRoutes from "./routes/configuracion";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/cfg", cfgRoutes);

app.get("/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT DATABASE() AS bd, NOW() AS fecha");
    res.json({ ok: true, data: rows });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});