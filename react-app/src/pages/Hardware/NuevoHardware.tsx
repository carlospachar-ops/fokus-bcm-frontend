import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NuevoHardware.css";

type Option = {
  id: number;
  nombre: string;
};

type HardwareForm = {
  nombre: string;
  descripcion: string;
  id_proveedor: string;
  id_propietario: string;
  serial: string;
  rto_horas: string;
  impacto_negocio: string;
  dependencias_ids: number[];
};

const initialState: HardwareForm = {
  nombre: "",
  descripcion: "",
  id_proveedor: "",
  id_propietario: "",
  serial: "",
  rto_horas: "",
  impacto_negocio: "",
  dependencias_ids: [],
};

export default function NuevoHardware() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState<HardwareForm>(initialState);
  const [proveedores, setProveedores] = useState<Option[]>([]);
  const [propietarios, setPropietarios] = useState<Option[]>([]);
  const [hardwares, setHardwares] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCatalogos = async () => {
      try {
        const [prov, prop, hw] = await Promise.all([
          fetch(`${baseUrl}/cfg/catalogos/proveedores`).then(r => r.json()),
          fetch(`${baseUrl}/cfg/catalogos/propietarios`).then(r => r.json()),
          fetch(`${baseUrl}/cfg/catalogos/hardware`).then(r => r.json()),
        ]);

        setProveedores(prov.data ?? []);
        setPropietarios(prop.data ?? []);
        setHardwares(hw.data ?? []);
      } catch (error) {
        console.error("Error cargando catálogos", error);
      }
    };

    loadCatalogos();
  }, [baseUrl]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleDependencia = (id: number) => {
    setForm(prev => ({
      ...prev,
      dependencias_ids: prev.dependencias_ids.includes(id)
        ? prev.dependencias_ids.filter(d => d !== id)
        : [...prev.dependencias_ids, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion || null,
      id_proveedor: form.id_proveedor ? Number(form.id_proveedor) : null,
      id_propietario: form.id_propietario ? Number(form.id_propietario) : null,
      serial: form.serial || null,
      rto_horas: form.rto_horas ? Number(form.rto_horas) : null,
      impacto_negocio: form.impacto_negocio || null,
      dependencias_ids: form.dependencias_ids,
    };

    try {
      await fetch(`${baseUrl}/cfg/hardware`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      navigate("/configuracion");
    } catch (error) {
      console.error("Error guardando hardware", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 nuevoHardware" style={{ maxWidth: 980 }}>
      <h3 className="mb-4 nuevoHardware-title">Nuevo hardware</h3>

      <form onSubmit={handleSubmit} className="nuevoHardware-form">
        {/* Nombre */}
        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevoHardware-label">Nombre *</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control nuevoHardware-input"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Serial */}
        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevoHardware-label">Serial</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control nuevoHardware-input"
              name="serial"
              value={form.serial}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="row g-3 align-items-start mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevoHardware-label">
              Descripción
            </label>
          </div>
          <div className="col-12 col-md-9">
            <textarea
              className="form-control nuevoHardware-input"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        {/* Proveedor */}
        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevoHardware-label">Proveedor</label>
          </div>
          <div className="col-12 col-md-9">
            <select
              className="form-select nuevoHardware-input"
              name="id_proveedor"
              value={form.id_proveedor}
              onChange={handleChange}
            >
              <option value="">Seleccione...</option>
              {proveedores.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Propietario */}
        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevoHardware-label">Propietario</label>
          </div>
          <div className="col-12 col-md-9">
            <select
              className="form-select nuevoHardware-input"
              name="id_propietario"
              value={form.id_propietario}
              onChange={handleChange}
            >
              <option value="">Seleccione...</option>
              {propietarios.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dependencias */}
        <div className="row g-3 align-items-start mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevoHardware-label">
              Dependencias de hardware
            </label>
          </div>
          <div className="col-12 col-md-9">
            <div
              className="border rounded p-2"
              style={{ maxHeight: 180, overflow: "auto" }}
            >
              {hardwares.length === 0 ? (
                <div className="text-muted">
                  No hay hardware para seleccionar.
                </div>
              ) : (
                hardwares.map(h => (
                  <label key={h.id} className="d-flex align-items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={form.dependencias_ids.includes(h.id)}
                      onChange={() => toggleDependencia(h.id)}
                    />
                    <span>{h.nombre}</span>
                  </label>
                ))
              )}
            </div>
            <small className="text-muted">
              Selecciona hardware del que depende este componente.
            </small>
          </div>
        </div>

        {/* RTO */}
        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevoHardware-label">RTO (hrs)</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              type="number"
              className="form-control nuevoHardware-input"
              name="rto_horas"
              value={form.rto_horas}
              onChange={handleChange}
              placeholder="Ej: 4"
            />
          </div>
        </div>

        {/* Impacto */}
        <div className="row g-3 align-items-start mb-4">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevoHardware-label">
              Impacto de negocio
            </label>
          </div>
          <div className="col-12 col-md-9">
            <textarea
              className="form-control nuevoHardware-input"
              name="impacto_negocio"
              value={form.impacto_negocio}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="d-flex justify-content-end gap-3 nuevoHardware-actions">
          <button
            type="submit"
            className="btn btn-success px-5 nuevoHardware-btn"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary px-5 nuevoHardware-btn"
            onClick={() => navigate("/configuracion")}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}