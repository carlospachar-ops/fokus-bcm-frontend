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

        CAST(COUNT(da.id_dependencia) AS CHAR) AS dependencias,

        COALESCE(
          GROUP_CONCAT(d.nombre ORDER BY d.nombre SEPARATOR ', '),
          ''
        ) AS dependencias_nombres,

        CAST(a.rto_horas AS CHAR) AS rto,
        a.impacto_negocio AS impacto
      FROM aplicacion a
      LEFT JOIN dependencia_aplicacion da
        ON da.id_aplicacion = a.id_aplicacion
      LEFT JOIN dependencia d
        ON d.id_dependencia = da.id_dependencia
      GROUP BY
        a.id_aplicacion,
        a.nombre,
        a.descripcion,
        a.id_proveedor,
        a.id_propietario,
        a.version,
        a.rto_horas,
        a.impacto_negocio
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
      vendor_software_nuevo, // NUEVO (string o null)
      id_propietario,
      version,
      rto_horas,
      impacto_negocio,
      id_proveedor,

      dependencias_ids, // number[]
      dependencias_nuevas, // string[]
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
      return res
        .status(400)
        .json({ ok: false, error: "id_proveedor debe ser numero" });
    }

    const propNum = toNumOrNull(id_propietario);
    if (propNum === "__NaN__") {
      conn.release();
      return res
        .status(400)
        .json({ ok: false, error: "id_propietario debe ser numero" });
    }

    const rtoNum = toNumOrNull(rto_horas);
    if (rtoNum === "__NaN__") {
      conn.release();
      return res
        .status(400)
        .json({ ok: false, error: "rto_horas debe ser numero" });
    }

    const vendSoftNumRaw = toNumOrNull(id_vendor_software);
    if (vendSoftNumRaw === "__NaN__") {
      conn.release();
      return res
        .status(400)
        .json({ ok: false, error: "id_vendor_software debe ser numero" });
    }

    const normalize = (s: string) =>
      String(s ?? "")
        .trim()
        .replace(/\s+/g, " ");
    const vendorNuevo = vendor_software_nuevo
      ? normalize(vendor_software_nuevo)
      : "";
    const impactoTxt = impacto_negocio ? String(impacto_negocio) : null;

    const depsExistentes: number[] = Array.isArray(dependencias_ids)
      ? dependencias_ids
          .map((x: any) => Number(x))
          .filter((x: any) => !Number.isNaN(x))
      : [];

    const depsNuevasRaw: string[] = Array.isArray(dependencias_nuevas)
      ? dependencias_nuevas
          .map((x: any) => normalize(x))
          .filter((x: string) => x !== "")
      : [];

    // quitar duplicados deps nuevas (case-insensitive)
    const depsNuevas: string[] = [];
    const seenNew = new Set<string>();
    for (const d of depsNuevasRaw) {
      const key = d.toLowerCase();
      if (!seenNew.has(key)) {
        seenNew.add(key);
        depsNuevas.push(d);
      }
    }

    await conn.beginTransaction();

    // 1) Resolver vendor software
    let vendSoftFinal: number | null =
      vendSoftNumRaw === null ? null : vendSoftNumRaw;

    if (vendorNuevo !== "") {
      const [foundVS]: any = await conn.query(
        `SELECT id_vendor_software FROM vendor_software WHERE LOWER(nombre)=LOWER(?) LIMIT 1`,
        [vendorNuevo],
      );

      if (Array.isArray(foundVS) && foundVS.length > 0) {
        vendSoftFinal = Number(foundVS[0].id_vendor_software);
      } else {
        const [insVS]: any = await conn.query(
          `INSERT INTO vendor_software (nombre) VALUES (?)`,
          [vendorNuevo],
        );
        vendSoftFinal = insVS.insertId;
      }
    }

    // 2) Insertar aplicacion
    const [result]: any = await conn.query(
      `
      INSERT INTO aplicacion
        (nombre, descripcion, id_vendor_software, version, rto_horas, impacto_negocio, id_proveedor, id_propietario)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        normalize(nombre),
        descripcion ? String(descripcion) : null,
        vendSoftFinal,
        version ? String(version) : null,
        rtoNum,
        impactoTxt,
        provNum,
        propNum,
      ],
    );

    const id_aplicacion = result.insertId;

    // 3) Resolver IDs para dependencias nuevas (crear si no existen)
    const depsNuevasIds: number[] = [];

    for (const depName of depsNuevas) {
      const [foundDep]: any = await conn.query(
        `SELECT id_dependencia FROM dependencia WHERE LOWER(nombre)=LOWER(?) LIMIT 1`,
        [depName],
      );

      if (Array.isArray(foundDep) && foundDep.length > 0) {
        depsNuevasIds.push(Number(foundDep[0].id_dependencia));
      } else {
        const [insDep]: any = await conn.query(
          `INSERT INTO dependencia (nombre) VALUES (?)`,
          [depName],
        );
        depsNuevasIds.push(insDep.insertId);
      }
    }

    // 4) Unir deps existentes + nuevas, quitar duplicados
    const allDeps = [...depsExistentes, ...depsNuevasIds]
      .map((x) => Number(x))
      .filter((x) => !Number.isNaN(x));

    const finalDeps: number[] = [];
    const seen = new Set<number>();
    for (const idDep of allDeps) {
      if (!seen.has(idDep)) {
        seen.add(idDep);
        finalDeps.push(idDep);
      }
    }

    // 5) Insertar en tabla puente dependencia_aplicacion
    if (finalDeps.length > 0) {
      const values = finalDeps.map((idDep) => [id_aplicacion, idDep]);

      await conn.query(
        `INSERT INTO dependencia_aplicacion (id_aplicacion, id_dependencia) VALUES ?`,
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

router.get("/catalogos/dependencias", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id_dependencia AS id, nombre
      FROM dependencia
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

router.post("/proveedores", async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      producto_servicio,
      fecha_expiracion_contrato,
      direccion,
      email,
      impacto_negocio,
    } = req.body;

    if (!nombre) {
      return res.status(400).json({ ok: false, error: "El nombre es obligatorio" });
    }
    if (!descripcion) {
      return res.status(400).json({ ok: false, error: "La descripción es obligatoria" });
    }
    if (!producto_servicio) {
      return res.status(400).json({ ok: false, error: "El producto/servicio es obligatorio" });
    }
    if (!fecha_expiracion_contrato) {
      return res.status(400).json({ ok: false, error: "La fecha de expiración del contrato es obligatoria" });
    }
    if (!direccion) {
      return res.status(400).json({ ok: false, error: "La dirección es obligatoria" });
    }
    if (!email) {
      return res.status(400).json({ ok: false, error: "El email es obligatorio" });
    }
    if (!impacto_negocio) {
      return res.status(400).json({ ok: false, error: "El impacto en el negocio es obligatorio" });
    }


    // Insert employee
    
    const [result] = await pool.query(
      `INSERT INTO proveedor 
       (nombre, descripcion, producto_servicio, fecha_expiracion_contrato, direccion, email, impacto_negocio)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        descripcion,
        producto_servicio,
        fecha_expiracion_contrato,
        direccion,
        email,
        impacto_negocio,
      ],
    );
    const id_proveedor = (result as any).insertId;
    res.json({ ok: true, id_proveedor });
  } catch (e: any) {
    console.error("Error en POST /cfg/proveedores:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

export default router;
