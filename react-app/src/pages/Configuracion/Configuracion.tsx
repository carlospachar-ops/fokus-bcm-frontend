import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Configuracion.css";

type ActionBtnProps = {
  title: string;
  onClick?: () => void;
  children: React.ReactNode;
};

function ActionBtn(props: ActionBtnProps) {
  return (
    <button
      type="button"
      className="cfgG-btnIcon"
      title={props.title}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

type SectionProps = {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

function Section(props: SectionProps) {
  return (
    <div className="cfgG-section">
      <div className="cfgG-sectionHeader">
        <div className="cfgG-sectionTitle">{props.title}</div>
        <div className="cfgG-actions">{props.actions}</div>
      </div>
      <div className="cfgG-sectionBody">{props.children}</div>
    </div>
  );
}

type Col = { key: string; label: string; width?: string };

type TableProps = {
  cols: Col[];
  rows: Record<string, string>[];
  emptyText?: string;
};

function DataTable(props: TableProps) {
  return (
    <div className="cfgG-tableWrap">
      <table className="cfgG-table">
        <thead>
          <tr>
            {props.cols.map((c) => (
              <th key={c.key} style={c.width ? { width: c.width } : undefined}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {props.rows.length === 0 ? (
            <tr>
              <td className="cfgG-empty" colSpan={props.cols.length}>
                {props.emptyText ?? "Sin registros"}
              </td>
            </tr>
          ) : (
            props.rows.map((r, idx) => (
              <tr key={idx}>
                {props.cols.map((c) => (
                  <td key={c.key}>{r[c.key] ?? ""}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function Configuracion() {
  const [apps, setApps] = useState<Record<string, string>[]>([]);
  const [ubis, setUbis] = useState<Record<string, string>[]>([]);
  const [provs, setProvs] = useState<Record<string, string>[]>([]);
  const [emps, setEmps] = useState<Record<string, string>[]>([]);
  const [hws, setHws] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

        setApps((a.data ?? []) as Record<string, string>[]);
        setUbis((u.data ?? []) as Record<string, string>[]);
        setProvs((p.data ?? []) as Record<string, string>[]);
        setEmps((e.data ?? []) as Record<string, string>[]);
        setHws((h.data ?? []) as Record<string, string>[]);
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
    { key: "dependencias", label: "Dependencias de aplicacion" },
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

  return (
    <div className="cfgG-page">
      <div className="cfgG-hero">
        <div className="cfgG-heroOverlay" />
        <div className="cfgG-heroTop">
          <div className="cfgG-brand">FOKUS</div>

          <button type="button" className="cfgG-navBtn" onClick={() => navigate("/")}>
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
          <DataTable cols={aplicacionesCols} rows={apps} />
        </Section>

        <Section
          title="LOCATIONS"
          actions={
            <>
              <ActionBtn title="Agregar" onClick={() => alert("Agregar")}>
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
              <ActionBtn title="Agregar" onClick={() => alert("Agregar")}>
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
              <ActionBtn title="Agregar" onClick={() => navigate("/nuevo-empleado")}>
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
              <ActionBtn title="Agregar" onClick={() => alert("Agregar")}>
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
          <DataTable cols={hardwareCols} rows={hws} />
        </Section>
      </div>
    </div>
  );
}

export default Configuracion;
