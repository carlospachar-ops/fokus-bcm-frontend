import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Configuracion.css";

import ActionBtn from "./components/ActionBtn";
import Section from "./components/Section";
import DataTable from "./components/DataTable";
import DepChips from "./components/DepChips";

import type { Col } from "./types";

function Configuracion() {
  const [apps, setApps] = useState<Record<string, any>[]>([]);
  const [ubis, setUbis] = useState<Record<string, any>[]>([]);
  const [provs, setProvs] = useState<Record<string, any>[]>([]);
  const [emps, setEmps] = useState<Record<string, any>[]>([]);
  const [hws, setHws] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // APPLICATIONS UI
  const [appSearchOpen, setAppSearchOpen] = useState(false);
  const [appQuery, setAppQuery] = useState("");
  const [appSelectedId, setAppSelectedId] = useState<number | string | null>(
    null,
  );
  const [appSelectedRow, setAppSelectedRow] = useState<Record<
    string,
    any
  > | null>(null);
  const [appMenuOpen, setAppMenuOpen] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");

        const base = import.meta.env.VITE_API_URL;

        const [a, u, p, e, h] = await Promise.all([
          fetch(`${base}/cfg/aplicaciones`).then((r) => r.json()),
          fetch(`${base}/cfg/ubicaciones`).then((r) => r.json()),
          fetch(`${base}/cfg/proveedores`).then((r) => r.json()),
          fetch(`${base}/cfg/empleados`).then((r) => r.json()),
          fetch(`${base}/cfg/hardware`).then((r) => r.json()),
        ]);

        if (!a.ok) throw new Error(a.error || "Error aplicaciones");
        if (!u.ok) throw new Error(u.error || "Error ubicaciones");
        if (!p.ok) throw new Error(p.error || "Error proveedores");
        if (!e.ok) throw new Error(e.error || "Error empleados");
        if (!h.ok) throw new Error(h.error || "Error hardware");

        setApps((a.data ?? []) as Record<string, any>[]);
        setUbis((u.data ?? []) as Record<string, any>[]);
        setProvs((p.data ?? []) as Record<string, any>[]);
        setEmps((e.data ?? []) as Record<string, any>[]);
        setHws((h.data ?? []) as Record<string, any>[]);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const aplicacionesCols: Col[] = [
    { key: "codApp", label: "Cod. App", width: "110px" },
    { key: "nombre", label: "Nombre", width: "160px" },
    { key: "descripcion", label: "Descripcion" },
    { key: "proveedor", label: "Proveedor", width: "150px" },
    { key: "propietario", label: "Propietario", width: "140px" },
    { key: "version", label: "Version", width: "110px" },
    {
      key: "dependencias_nombres",
      label: "Dependencias de aplicacion",
      render: (value) => <DepChips names={String(value ?? "")} />,
    },
    { key: "rto", label: "RTO", width: "90px" },
    { key: "impacto", label: "Impacto de negocio", width: "170px" },
  ];

  const ubicacionesCols: Col[] = [
    { key: "codUbicacion", label: "Cod. Ubicacion", width: "130px" },
    { key: "nombre", label: "Nombre", width: "160px" },
    { key: "descripcion", label: "Descripcion" },
    { key: "ciudad", label: "Ciudad", width: "130px" },
    { key: "pais", label: "Pais", width: "120px" },
    { key: "direccion", label: "Direccion", width: "180px" },
    { key: "dependencias", label: "Dependencias de ubicacion" },
    { key: "tipo", label: "Tipo de ubicacion", width: "150px" },
    { key: "impacto", label: "Impacto de negocio", width: "170px" },
  ];

  const proveedoresCols: Col[] = [
    { key: "codProv", label: "Cod. Prov", width: "110px" },
    { key: "nombre", label: "Nombre", width: "160px" },
    { key: "descripcion", label: "Descripcion" },
    { key: "contacto", label: "Contacto", width: "160px" },
    { key: "producto", label: "Producto/Servicio provisto", width: "190px" },
    { key: "expContrato", label: "Expiracion del contrato", width: "180px" },
    { key: "direccion", label: "Direccion", width: "180px" },
    { key: "email", label: "Email", width: "180px" },
    { key: "impacto", label: "Impacto de negocio", width: "170px" },
  ];

  const empleadosCols: Col[] = [
    { key: "rolId", label: "Rol ID", width: "90px" },
    { key: "nombre", label: "Nombre", width: "160px" },
    { key: "departamento", label: "Departamento", width: "160px" },
    {
      key: "habilidad",
      label: "Habilidad/Experiencia critica",
      width: "220px",
    },
    { key: "numeroReq", label: "Numero requerido", width: "150px" },
    { key: "asignados", label: "Empleados asignados", width: "170px" },
    { key: "respaldo", label: "Empleados Respaldo", width: "170px" },
    { key: "impacto", label: "Impacto de negocio", width: "170px" },
  ];

  const hardwareCols: Col[] = [
    { key: "codHw", label: "Cod. Hw", width: "100px" },
    { key: "nombre", label: "Nombre", width: "160px" },
    { key: "descripcion", label: "Descripcion" },
    { key: "proveedor", label: "Proveedor", width: "150px" },
    { key: "propietario", label: "Propietario", width: "140px" },
    { key: "serial", label: "Serial", width: "140px" },
    { key: "dependencias", label: "Dependencias de hardware" },
    { key: "rto", label: "RTO", width: "90px" },
    { key: "impacto", label: "Impacto de negocio", width: "170px" },
  ];

  const appsFiltered = useMemo(() => {
    const q = appQuery.trim().toLowerCase();
    if (!q) return apps;

    return apps.filter((row) => {
      const haystack = [
        row.codApp,
        row.nombre,
        row.descripcion,
        row.proveedor,
        row.propietario,
        row.version,
        row.dependencias_nombres,
        row.rto,
        row.impacto,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [apps, appQuery]);

  const onAppEdit = () => {
    console.log("edit id:", appSelectedRow?.codApp, appSelectedRow);
    if (!appSelectedRow) return alert("Selecciona una aplicacion primero.");
    navigate(`/aplicaciones/editar/${appSelectedRow.id_aplicacion}`);
  };

  return (
    <div className="cfgG-page">
      <div className="cfgG-hero">
        <div className="cfgG-heroOverlay" />
        <div className="cfgG-heroTop">
          <div className="cfgG-brand">FOKUS</div>

          <button
            type="button"
            className="cfgG-navBtn"
            onClick={() => navigate("/")}
          >
            ‹ Navigation
          </button>
        </div>

        <div className="cfgG-heroContent">
          <div className="cfgG-heroTitle">BCM Global Settings</div>
        </div>

        <div className="cfgG-rainbow" />
      </div>

      <div className="cfgG-container">
        {loading && <div className="cfgG-loading">Cargando datos...</div>}
        {error && <div className="cfgG-error">Error: {error}</div>}

        <Section
          title="APPLICATIONS"
          actions={
            <>
              <ActionBtn
                title="Agregar"
                onClick={() => navigate("/nueva-aplicacion")}
              >
                +
              </ActionBtn>

              <ActionBtn
                title="Buscar"
                onClick={() => {
                  setAppSearchOpen((v) => !v);
                  setAppQuery("");
                }}
              >
                🔎
              </ActionBtn>

              <ActionBtn title="Editar" onClick={onAppEdit}>
                ✎
              </ActionBtn>

              <ActionBtn title="Mas" onClick={() => setAppMenuOpen((v) => !v)}>
                ⋮
              </ActionBtn>
            </>
          }
        >
          {appSearchOpen ? (
            <div className="cfgG-searchRow" style={{ marginBottom: 20 }}>
              <input
                className="cfgG-searchInput"
                placeholder="Buscar por codigo, nombre, proveedor, propietario, dependencias..."
                value={appQuery}
                onChange={(e) => setAppQuery(e.target.value)}
              />
              <button
                type="button"
                className="cfgG-searchClear"
                onClick={() => {
                  setAppQuery("");
                  setAppSearchOpen(false);
                }}
                title="Limpiar"
              >
                ✕
              </button>
            </div>
          ) : null}

          {appMenuOpen ? (
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 10,
              }}
            >
              <button
                type="button"
                className="cfgG-navBtn"
                onClick={() => {
                  if (!appSelectedRow)
                    return alert("Selecciona una aplicacion primero.");
                  alert(`Aplicacion: ${appSelectedRow.nombre ?? ""}`);
                }}
              >
                Ver
              </button>

              <button type="button" className="cfgG-navBtn" onClick={onAppEdit}>
                Editar
              </button>

              <button
                type="button"
                className="cfgG-navBtn"
                onClick={() => {
                  if (!appSelectedRow)
                    return alert("Selecciona una aplicacion primero.");
                  alert("Aqui luego implementamos eliminar con confirm + API.");
                }}
              >
                Eliminar
              </button>

              <button
                type="button"
                className="cfgG-navBtn"
                onClick={() => setAppMenuOpen(false)}
              >
                Cerrar
              </button>
            </div>
          ) : null}

          <DataTable
            cols={aplicacionesCols}
            rows={appsFiltered}
            rowKey={(row) => row.codApp}
            selectedKey={appSelectedId}
            onRowClick={(row) => {
              console.log("CLICK APP id_aplicacion:", row.codApp, row);
              setAppSelectedRow(row);
              setAppSelectedId(row.codApp);
              setAppMenuOpen(false);
            }}
          />
        </Section>

        <Section
          title="LOCATIONS"
          actions={
            <>
              <ActionBtn
                title="Agregar"
                onClick={() => navigate("/nueva-ubicacion")}
              >
                +
              </ActionBtn>
              <ActionBtn title="Buscar" onClick={() => alert("Buscar")}>
                🔎
              </ActionBtn>
              <ActionBtn title="Editar" onClick={() => alert("Editar")}>
                ✎
              </ActionBtn>
              <ActionBtn title="Mas" onClick={() => alert("Mas")}>
                ⋮
              </ActionBtn>
            </>
          }
        >
          <DataTable cols={ubicacionesCols} rows={ubis} />
        </Section>

        <Section
          title="VENDORS"
          actions={
            <>
              <ActionBtn title="Agregar" onClick={() => navigate("/nuevo-proveedor")}>
                +
              </ActionBtn>
              <ActionBtn title="Buscar" onClick={() => alert("Buscar")}>
                🔎
              </ActionBtn>
              <ActionBtn title="Editar" onClick={() => alert("Editar")}>
                ✎
              </ActionBtn>
              <ActionBtn title="Mas" onClick={() => alert("Mas")}>
                ⋮
              </ActionBtn>
            </>
          }
        >
          <DataTable cols={proveedoresCols} rows={provs} />
        </Section>

        <Section
          title="EMPLOYEES & SKILLS"
          actions={
            <>
              <ActionBtn
                title="Agregar"
                onClick={() => navigate("/nuevo-empleado")}
              >
                +
              </ActionBtn>
              <ActionBtn title="Buscar" onClick={() => alert("Buscar")}>
                🔎
              </ActionBtn>
              <ActionBtn title="Editar" onClick={() => alert("Editar")}>
                ✎
              </ActionBtn>
              <ActionBtn title="Mas" onClick={() => alert("Mas")}>
                ⋮
              </ActionBtn>
            </>
          }
        >
          <DataTable cols={empleadosCols} rows={emps} />
        </Section>

        <Section
          title="HARDWARE"
          actions={
            <>
              <ActionBtn
                title="Agregar"
                onClick={() => navigate("/nuevo-hardware")}
              >
                +
              </ActionBtn>
              <ActionBtn title="Buscar" onClick={() => alert("Buscar")}>
                🔎
              </ActionBtn>
              <ActionBtn
                title="Editar"
                onClick={() => alert("Selecciona un hardware para editar")}
              >
                ✎
              </ActionBtn>
              <ActionBtn title="Mas" onClick={() => alert("Mas")}>
                ⋮
              </ActionBtn>
            </>
          }
        >
          <DataTable cols={hardwareCols} rows={hws} />
        </Section>
      </div>
    </div>
  );
}

export default Configuracion;
