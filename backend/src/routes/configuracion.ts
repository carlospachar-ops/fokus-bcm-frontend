import { Router } from "express";
import { pool } from "../db";

const router = Router();

// APPLICATIONS
router.get("/aplicaciones", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        a.id_aplicacion AS codApp,
        a.nombre AS nombre,
        a.descripcion AS descripcion,
        CAST(a.id_proveedor AS CHAR) AS proveedor,
        CAST(a.id_propietario AS CHAR) AS propietario,
        a.version AS version,
        CAST((
          SELECT COUNT(*)
          FROM dependencia_aplicacion da
          WHERE da.id_aplicacion = a.id_aplicacion
        ) AS CHAR) AS dependencias,
        CAST(a.rto_horas AS CHAR) AS rto,
        a.impacto_negocio AS impacto
      FROM aplicacion a
      ORDER BY a.id_aplicacion ASC
      LIMIT 200
    `);

    res.json({ ok: true, data: rows });
  } catch (e: any) {
    console.error("Error en /cfg/aplicaciones:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// LOCATIONS
router.get("/ubicaciones", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        u.id_ubicacion AS codUbicacion,
        u.nombre AS nombre,
        u.descripcion AS descripcion,
        u.ciudad AS ciudad,
        u.pais AS pais,
        u.direccion AS direccion,
        CAST((
          SELECT COUNT(*)
          FROM dependencia_ubicacion du
          WHERE du.id_ubicacion = u.id_ubicacion
        ) AS CHAR) AS dependencias,
        u.tipo_ubicacion AS tipo,
        u.impacto_negocio AS impacto
      FROM ubicacion u
      ORDER BY u.id_ubicacion ASC
      LIMIT 200
    `);

    res.json({ ok: true, data: rows });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// VENDORS / PROVEEDORES
router.get("/proveedores", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.id_proveedor AS codProv,
        p.nombre AS nombre,
        p.descripcion AS descripcion,
        p.email AS contacto,
        p.producto_servicio AS producto,
        CAST(p.fecha_expiracion_contrato AS CHAR) AS expContrato,
        p.direccion AS direccion,
        p.email AS email,
        p.impacto_negocio AS impacto
      FROM proveedor p
      ORDER BY p.id_proveedor ASC
      LIMIT 200
    `);

    res.json({ ok: true, data: rows });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// EMPLOYEES & SKILLS
router.get("/empleados", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        e.id_rol_empleado AS rolId,
        e.nombre AS nombre,
        e.departamento AS departamento,
        e.habilidad_critica AS habilidad,
        CAST(e.numero_requerido AS CHAR) AS numeroReq,
        CAST((
          SELECT COUNT(*)
          FROM empleado_asignado ea
          WHERE ea.id_empleado = e.id_empleado
        ) AS CHAR) AS asignados,
        CAST((
          SELECT COUNT(*)
          FROM empleado_respaldo er
          WHERE er.id_empleado = e.id_empleado
        ) AS CHAR) AS respaldo,
        '' AS impacto
      FROM empleado e
      ORDER BY e.id_empleado ASC
      LIMIT 200
    `);

    res.json({ ok: true, data: rows });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// HARDWARE
router.get("/hardware", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        h.id_hardware AS codHw,
        h.nombre AS nombre,
        h.descripcion AS descripcion,
        CAST(h.id_proveedor AS CHAR) AS proveedor,
        CAST(h.id_propietario AS CHAR) AS propietario,
        h.serial AS serial,
        CAST((
          SELECT COUNT(*)
          FROM dependencia_hardware dh
          WHERE dh.id_hardware = h.id_hardware
        ) AS CHAR) AS dependencias,
        CAST(h.rto_horas AS CHAR) AS rto,
        h.impacto_negocio AS impacto
      FROM hardware h
      ORDER BY h.id_hardware ASC
      LIMIT 200
    `);

    res.json({ ok: true, data: rows });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

//Insertar aplicacions
router.post("/aplicaciones", async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const {
      nombre,
      descripcion,
      id_vendor_software,
      id_propietario,
      version,
      rto_horas,
      impacto_negocio,
      id_proveedor,
      dependencias_ids, // array de ids de aplicaciones dependientes
    } = req.body;

    if (!nombre || String(nombre).trim() === "") {
      conn.release();
      return res.status(400).json({ ok: false, error: "nombre es requerido" });
    }

    const toNumOrNull = (v: any) => {
      if (v === null || v === undefined || v === "") return null;
      const n = Number(v);
      if (Number.isNaN(n)) return "__NaN__";
      return n;
    };

    const provNum = toNumOrNull(id_proveedor);
    if (provNum === "__NaN__") {
      conn.release();
      return res.status(400).json({ ok: false, error: "id_proveedor debe ser numero" });
    }

    const propNum = toNumOrNull(id_propietario);
    if (propNum === "__NaN__") {
      conn.release();
      return res.status(400).json({ ok: false, error: "id_propietario debe ser numero" });
    }

    const vendSoftNum = toNumOrNull(id_vendor_software);
    if (vendSoftNum === "__NaN__") {
      conn.release();
      return res
        .status(400)
        .json({ ok: false, error: "id_vendor_software debe ser numero" });
    }

    const rtoNum = toNumOrNull(rto_horas);
    if (rtoNum === "__NaN__") {
      conn.release();
      return res.status(400).json({ ok: false, error: "rto_horas debe ser numero" });
    }

    const deps: number[] = Array.isArray(dependencias_ids)
      ? dependencias_ids
          .map((x: any) => Number(x))
          .filter((x: any) => !Number.isNaN(x))
      : [];

    await conn.beginTransaction();

    const [result]: any = await conn.query(
      `
      INSERT INTO aplicacion
        (nombre, descripcion, id_vendor_software, version, rto_horas, impacto_negocio, id_proveedor, id_propietario)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        String(nombre).trim(),
        descripcion ? String(descripcion) : null,
        vendSoftNum,
        version ? String(version) : null,
        rtoNum,
        impacto_negocio ? String(impacto_negocio) : null,
        provNum,
        propNum,
      ],
    );

    const id_aplicacion = result.insertId;

    // Insertar dependencias (tabla puente)
    if (deps.length > 0) {
      const values = deps.map((idDep) => [id_aplicacion, idDep]);

      await conn.query(
        `INSERT INTO dependencia_aplicacion (id_aplicacion, id_aplicacion_dependiente) VALUES ?`,
        [values],
      );
    }

    await conn.commit();
    res.status(201).json({ ok: true, id_aplicacion });
  } catch (e: any) {
    try {
      await conn.rollback();
    } catch {}
    res.status(500).json({ ok: false, error: e.message });
  } finally {
    conn.release();
  }
});

router.get("/catalogos/proveedores", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id_proveedor AS id, nombre
      FROM proveedor
      ORDER BY nombre
    `);
    res.json({ ok: true, data: rows });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/catalogos/propietarios", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id_propietario AS id, nombre
      FROM propietario
      ORDER BY nombre
    `);
    res.json({ ok: true, data: rows });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/catalogos/vendor-software", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id_vendor_software AS id, nombre
      FROM vendor_software
      ORDER BY nombre
    `);
    res.json({ ok: true, data: rows });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/catalogos/aplicaciones", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id_aplicacion AS id, nombre
      FROM aplicacion
      ORDER BY nombre
      LIMIT 500
    `);
    res.json({ ok: true, data: rows });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/catalogos/empleados", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id_empleado AS id, nombre
      FROM empleado
      ORDER BY nombre
      LIMIT 500
    `);
    res.json({ ok: true, data: rows });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// CREATE EMPLOYEE
router.post("/empleados", async (req, res) => {
  try {
    const {
      nombre,
        departamento,
        aplicaciones_id,
        empleados_respaldo_id,
        habilidad,
        numero_requerido,
        rol_tabla,
        descripcion_rol,
    } = req.body;

    if (!nombre) {
      return res.status(400).json({ ok: false, error: "El nombre es obligatorio" });
    }
    if (!departamento) {
      return res.status(400).json({ ok: false, error: "El departamento es obligatorio" });
    }
    if (!habilidad) {
      return res.status(400).json({ ok: false, error: "La habilidad es obligatoria" });
    }
    if (!numero_requerido || isNaN(Number(numero_requerido))) {
      return res.status(400).json({ ok: false, error: "El numero_requerido es obligatorio y debe ser un numero" });
    }
    if (!rol_tabla) {
      return res.status(400).json({ ok: false, error: "El rol es obligatorio" });
    }
    if (!descripcion_rol) {
      return res.status(400).json({ ok: false, error: "La descripcion del rol es obligatoria" });
    }
    for (const id of empleados_respaldo_id || []) {
      if (isNaN(Number(id))) {
        return res.status(400).json({ ok: false, error: "Todos los empleados de respaldo deben ser numeros" });
      }
    }
    for (const id of aplicaciones_id || []) {
      if (isNaN(Number(id))) {
        return res.status(400).json({ ok: false, error: "Todas las aplicaciones asignadas deben ser numeros" });
      }
    }


    // Insert employee
    

    const [Respuesta] = await pool.query(
      `INSERT INTO rol_empleado (nombre, descripcion) VALUES (?, ?)`,
      [rol_tabla, descripcion_rol],
    );
    const [result] = await pool.query(
      `INSERT INTO empleado 
       (nombre, departamento,rol, habilidad_critica, numero_requerido,id_rol_empleado)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        departamento,
        rol_tabla,
        habilidad,
        numero_requerido,
        (Respuesta as any).insertId,
      ],
    );
    const id_empleado = (result as any).insertId;
    for (const idApp of aplicaciones_id || []) {
      await pool.query(
        `INSERT INTO empleado_asignado (id_empleado, id_aplicacion) VALUES (?, ?)`,
        [id_empleado, idApp],
      );
    }
    for (const idResp of empleados_respaldo_id || []) {
      await pool.query(
        `INSERT INTO empleado_respaldo (id_empleado, id_aplicacion) VALUES (?, ?)`,
        [id_empleado, idResp],
      );
    }
    res.json({ ok: true, id_empleado });
  } catch (e: any) {
    console.error("Error en POST /cfg/empleados:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

export default router;