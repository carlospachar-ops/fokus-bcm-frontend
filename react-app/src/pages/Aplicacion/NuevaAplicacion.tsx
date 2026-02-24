import { useEffect, useState } from "react";
import "./NuevaAplicacion.css";

type Option = { id: number; nombre: string };

type FormState = {
  nombre: string;
  descripcion: string;
  id_vendor_software: string;
  id_propietario: string;
  version: string;
  rto_horas: string;
  impacto_negocio: string;
  id_proveedor: string;
  dependencias_ids: number[];
};

const initState: FormState = {
  nombre: "",
  descripcion: "",
  id_vendor_software: "",
  id_propietario: "",
  version: "",
  rto_horas: "",
  impacto_negocio: "",
  id_proveedor: "",
  dependencias_ids: [],
};

function NuevaAplicacion() {
  const [form, setForm] = useState<FormState>(initState);
  const [loading, setLoading] = useState(false);

  const [proveedores, setProveedores] = useState<Option[]>([]);
  const [propietarios, setPropietarios] = useState<Option[]>([]);
  const [vendorsSoft, setVendorsSoft] = useState<Option[]>([]);
  const [apps, setApps] = useState<Option[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const base = import.meta.env.VITE_API_URL;

        const [p1, p2, p3, p4] = await Promise.all([
          fetch(`${base}/cfg/catalogos/proveedores`).then((r) => r.json()),
          fetch(`${base}/cfg/catalogos/propietarios`).then((r) => r.json()),
          fetch(`${base}/cfg/catalogos/vendor-software`).then((r) => r.json()),
          fetch(`${base}/cfg/catalogos/aplicaciones`).then((r) => r.json()),
        ]);

        if (!p1.ok) throw new Error(p1.error || "Error catalogo proveedores");
        if (!p2.ok) throw new Error(p2.error || "Error catalogo propietarios");
        if (!p3.ok)
          throw new Error(p3.error || "Error catalogo vendor software");
        if (!p4.ok) throw new Error(p4.error || "Error catalogo aplicaciones");

        setProveedores(p1.data ?? []);
        setPropietarios(p2.data ?? []);
        setVendorsSoft(p3.data ?? []);
        setApps(p4.data ?? []);
      } catch (e: any) {
        setError(e.message);
      }
    };

    load();
  }, []);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDep = (id: number) => {
    setForm((prev) => {
      const exists = prev.dependencias_ids.includes(id);
      return {
        ...prev,
        dependencias_ids: exists
          ? prev.dependencias_ids.filter((x) => x !== id)
          : [...prev.dependencias_ids, id],
      };
    });
  };

  const onCancel = () => setForm(initState);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (form.nombre.trim() === "") {
        alert("El nombre es obligatorio.");
        return;
      }

      setLoading(true);
      const base = import.meta.env.VITE_API_URL;

      const payload = {
        nombre: form.nombre.trim(),
        descripcion:
          form.descripcion.trim() === "" ? null : form.descripcion.trim(),
        id_vendor_software:
          form.id_vendor_software.trim() === ""
            ? null
            : Number(form.id_vendor_software),
        id_propietario:
          form.id_propietario.trim() === ""
            ? null
            : Number(form.id_propietario),
        version: form.version.trim() === "" ? null : form.version.trim(),
        rto_horas: form.rto_horas.trim() === "" ? null : Number(form.rto_horas),
        impacto_negocio:
          form.impacto_negocio.trim() === ""
            ? null
            : form.impacto_negocio.trim(),
        id_proveedor:
          form.id_proveedor.trim() === "" ? null : Number(form.id_proveedor),
        dependencias_ids: form.dependencias_ids,
      };

      if (payload.rto_horas !== null && Number.isNaN(payload.rto_horas)) {
        alert("RTO debe ser un numero. Ej: 4");
        return;
      }

      const resp = await fetch(`${base}/cfg/aplicaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await resp.json();
      if (!json.ok) throw new Error(json.error || "No se pudo guardar");

      alert(`Aplicacion guardada. ID: ${json.id_aplicacion}`);
      setForm(initState);
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 nuevaApp" style={{ maxWidth: 980 }}>
      <h3 className="mb-4 nuevaApp-title">Nueva aplicacion</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={onSubmit} className="nuevaApp-form">
        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">Nombre</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control nuevaApp-input"
              name="nombre"
              value={form.nombre}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="row g-3 align-items-start mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">
              Descripcion
            </label>
          </div>
          <div className="col-12 col-md-9">
            <textarea
              className="form-control nuevaApp-input"
              name="descripcion"
              value={form.descripcion}
              onChange={onChange}
              rows={3}
            />
          </div>
        </div>

        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">
              Vendor del software
            </label>
          </div>
          <div className="col-12 col-md-9">
            <select
              className="form-select nuevaApp-input"
              name="id_vendor_software"
              value={form.id_vendor_software}
              onChange={onChange}
            >
              <option value="">Seleccione...</option>
              {vendorsSoft.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">
              Propietario
            </label>
          </div>
          <div className="col-12 col-md-9">
            <select
              className="form-select nuevaApp-input"
              name="id_propietario"
              value={form.id_propietario}
              onChange={onChange}
            >
              <option value="">Seleccione...</option>
              {propietarios.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">Version</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control nuevaApp-input"
              name="version"
              value={form.version}
              onChange={onChange}
              placeholder="Ej: 1.0.0"
            />
          </div>
        </div>

        <div className="row g-3 align-items-start mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">
              Dependencias de aplicacion
            </label>
          </div>
          <div className="col-12 col-md-9">
            <div
              className="border rounded p-2"
              style={{ maxHeight: 180, overflow: "auto" }}
            >
              {apps.length === 0 ? (
                <div className="text-muted">
                  No hay aplicaciones para seleccionar.
                </div>
              ) : (
                apps.map((a) => (
                  <label
                    key={a.id}
                    className="d-flex align-items-center gap-2 mb-1"
                  >
                    <input
                      type="checkbox"
                      checked={form.dependencias_ids.includes(a.id)}
                      onChange={() => toggleDep(a.id)}
                    />
                    <span>{a.nombre}</span>
                  </label>
                ))
              )}
            </div>
            <small className="text-muted">
              Selecciona aplicaciones de las que depende esta aplicacion.
            </small>
          </div>
        </div>

        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">
              RTO (horas)
            </label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control nuevaApp-input"
              name="rto_horas"
              value={form.rto_horas}
              onChange={onChange}
              placeholder="Ej: 4"
            />
          </div>
        </div>

        <div className="row g-3 align-items-start mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">
              Impacto del negocio
            </label>
          </div>
          <div className="col-12 col-md-9">
            <textarea
              className="form-control nuevaApp-input"
              name="impacto_negocio"
              value={form.impacto_negocio}
              onChange={onChange}
              rows={4}
            />
          </div>
        </div>

        <div className="row g-3 align-items-center mb-4">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">
              Proveedor (Vendor)
            </label>
          </div>
          <div className="col-12 col-md-9">
            <select
              className="form-select nuevaApp-input"
              name="id_proveedor"
              value={form.id_proveedor}
              onChange={onChange}
            >
              <option value="">Seleccione...</option>
              {proveedores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-3 nuevaApp-actions">
          <button
            type="submit"
            className="btn btn-success px-5 nuevaApp-btn"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary px-5 nuevaApp-btn"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default NuevaAplicacion;
