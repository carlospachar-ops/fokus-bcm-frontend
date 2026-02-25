import { useEffect, useState, useCallback } from "react";
import "./AgregarUbicacion.css";

type Option = { id: number; nombre: string };

type FormState = {
  nombre: string;
  descripcion: string;
  ciudad: string;
  pais: string;
  direccion: string;
  tipo_ubicacion: string;
  impacto_negocio: string;
};

const initState: FormState = {
  nombre: "",
  descripcion: "",
  ciudad: "",
  pais: "",
  direccion: "",
  tipo_ubicacion: "",
  impacto_negocio: "",
};

type Suggestion = { id: number; nombre: string };

export function AgregarUbicacion() {
  const [form, setForm] = useState<FormState>(initState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Country dropdown
  const [paises, setPaises] = useState<Option[]>([]);

  // Tipo autocomplete states
  const [tipoSuggestions, setTipoSuggestions] = useState<Suggestion[]>([]);
  const [showTipoSuggestions, setShowTipoSuggestions] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<Option | null>(null);

  // Dependencias autocomplete states
  const [depQuery, setDepQuery] = useState("");
  const [depSuggestions, setDepSuggestions] = useState<Suggestion[]>([]);
  const [showDepSuggestions, setShowDepSuggestions] = useState(false);
  const [selectedDeps, setSelectedDeps] = useState<Option[]>([]);

  // Load countries for dropdown
  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const base = import.meta.env.VITE_API_URL;
        const resp = await fetch(`${base}/cfg/catalogos/paises`);
        const json = await resp.json();
        if (json.ok) {
          setPaises(json.data || []);
        }
      } catch (e: any) {
        setError(e.message);
      }
    };
    load();
  }, []);

  const searchTipo = useCallback(async (query: string) => {
    if (query.length < 1) {
      setTipoSuggestions([]);
      return;
    }
    try {
      const base = import.meta.env.VITE_API_URL;
      const resp = await fetch(`${base}/cfg/catalogos/tipos-ubicacion/search?q=${encodeURIComponent(query)}`);
      const json = await resp.json();
      if (json.ok) {
        setTipoSuggestions(json.data || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const searchDep = useCallback(async (query: string) => {
    if (query.length < 1) {
      setDepSuggestions([]);
      return;
    }
    try {
      const base = import.meta.env.VITE_API_URL;
      const resp = await fetch(`${base}/cfg/catalogos/ubicaciones/search?q=${encodeURIComponent(query)}`);
      const json = await resp.json();
      if (json.ok) {
        setDepSuggestions(json.data || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Debounced search for tipo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (form.tipo_ubicacion.length > 0 && !selectedTipo) {
        searchTipo(form.tipo_ubicacion);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [form.tipo_ubicacion, selectedTipo, searchTipo]);

  const addDependencia = (dep: Option) => {
    if (!selectedDeps.find(d => d.id === dep.id)) {
      setSelectedDeps([...selectedDeps, dep]);
    }
    setDepQuery("");
    setDepSuggestions([]);
    setShowDepSuggestions(false);
  };

  const removeDependencia = (id: number) => {
    setSelectedDeps(selectedDeps.filter(d => d.id !== id));
  };

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    if (name === "tipo_ubicacion") {
      setSelectedTipo(null);
      setShowTipoSuggestions(true);
    }
  };

  const selectTipo = (tipo: Suggestion) => {
    setSelectedTipo({ id: tipo.id, nombre: tipo.nombre });
    setForm((prev) => ({ ...prev, tipo_ubicacion: tipo.nombre }));
    setTipoSuggestions([]);
    setShowTipoSuggestions(false);
  };

  const onCancel = () => {
    setForm(initState);
    setSelectedTipo(null);
    setSelectedDeps([]);
    setDepQuery("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (form.nombre.trim() === "") {
        alert("El nombre es obligatorio.");
        return;
      }

      setLoading(true);
      const base = import.meta.env.VITE_API_URL;

      // Si hay un tipo seleccionado, usar su ID, si no, crear nuevo
      let tipoId = selectedTipo?.id;
      if (!tipoId && form.tipo_ubicacion.trim()) {
        const tipoResp = await fetch(`${base}/cfg/catalogos/tipos-ubicacion`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: form.tipo_ubicacion.trim() })
        });
        const tipoJson = await tipoResp.json();
        if (tipoJson.ok) {
          tipoId = tipoJson.id;
        }
      }

      const payload = {
        nombre: form.nombre.trim(),
        descripcion:
          form.descripcion.trim() === "" ? null : form.descripcion.trim(),
        ciudad: form.ciudad.trim() === "" ? null : form.ciudad.trim(),
        id_pais: form.pais ? Number(form.pais) : null,
        direccion: form.direccion.trim() === "" ? null : form.direccion.trim(),
        id_tipo_ubicacion: tipoId || null,
        impacto_negocio:
          form.impacto_negocio.trim() === ""
            ? null
            : form.impacto_negocio.trim(),
        dependencias_ids: selectedDeps.map(d => d.id),
      };

      const resp = await fetch(`${base}/cfg/ubicaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await resp.json();
      if (!json.ok) throw new Error(json.error || "No se pudo guardar");

      alert(`Ubicación guardada. ID: ${json.id_ubicacion}`);
      onCancel();
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 nuevaApp" style={{ maxWidth: 980 }}>
      <h3 className="mb-4 nuevaApp-title">Nueva ubicación</h3>

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
            <label className="form-label mb-0 nuevaApp-label">Ciudad</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control nuevaApp-input"
              name="ciudad"
              value={form.ciudad}
              onChange={onChange}
            />
          </div>
        </div>

        {/* País - Solo combobox */}
        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">País</label>
          </div>
          <div className="col-12 col-md-9">
            <select
              className="form-select nuevaApp-input"
              name="pais"
              value={form.pais}
              onChange={onChange}
            >
              <option value="">Seleccione...</option>
              {paises.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row g-3 align-items-start mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">
              Dirección
            </label>
          </div>
          <div className="col-12 col-md-9">
            <textarea
              className="form-control nuevaApp-input"
              name="direccion"
              value={form.direccion}
              onChange={onChange}
              rows={2}
            />
          </div>
        </div>

        {/* Tipo de ubicación con autocompletado */}
        <div className="row g-3 align-items-start mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">
              Tipo de ubicación
            </label>
          </div>
          <div className="col-12 col-md-9">
            <div className="position-relative">
              <input
                className="form-control nuevaApp-input"
                name="tipo_ubicacion"
                value={form.tipo_ubicacion}
                onChange={onChange}
                onFocus={() => setShowTipoSuggestions(true)}
                onBlur={() => setTimeout(() => setShowTipoSuggestions(false), 200)}
                placeholder="Escribe para buscar o agregar..."
              />
              {showTipoSuggestions && tipoSuggestions.length > 0 && (
                <div className="position-absolute w-100 border rounded mt-1 bg-white" style={{ zIndex: 1000, maxHeight: 200, overflow: "auto" }}>
                  {tipoSuggestions.map(t => (
                    <div
                      key={t.id}
                      className="p-2 hover-bg"
                      style={{ cursor: "pointer" }}
                      onClick={() => selectTipo(t)}
                    >
                      {t.nombre}
                    </div>
                  ))}
                  {form.tipo_ubicacion.length > 0 && !tipoSuggestions.find(t => t.nombre.toLowerCase() === form.tipo_ubicacion.toLowerCase()) && (
                    <div
                      className="p-2 text-primary border-top"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedTipo({ id: -1, nombre: form.tipo_ubicacion });
                        setTipoSuggestions([]);
                        setShowTipoSuggestions(false);
                      }}
                    >
                      + Agregar "{form.tipo_ubicacion}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dependencias con autocompletado */}
        <div className="row g-3 align-items-start mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">
              Dependencias
            </label>
          </div>
          <div className="col-12 col-md-9">
            <div className="position-relative">
              <input
                className="form-control nuevaApp-input"
                value={depQuery}
                onChange={(e) => {
                  setDepQuery(e.target.value);
                  const timer = setTimeout(() => searchDep(e.target.value), 300);
                  return () => clearTimeout(timer);
                }}
                onFocus={() => setShowDepSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDepSuggestions(false), 200)}
                placeholder="Escribe para buscar..."
              />
              {showDepSuggestions && depSuggestions.length > 0 && (
                <div className="position-absolute w-100 border rounded mt-1 bg-white" style={{ zIndex: 1000, maxHeight: 200, overflow: "auto" }}>
                  {depSuggestions.map(d => (
                    <div
                      key={d.id}
                      className="p-2 hover-bg"
                      style={{ cursor: "pointer" }}
                      onClick={() => addDependencia(d)}
                    >
                      {d.nombre}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Selected dependencies */}
            {selectedDeps.length > 0 && (
              <div className="mt-2">
                {selectedDeps.map(d => (
                  <span key={d.id} className="badge bg-secondary me-1 mb-1 p-2">
                    {d.nombre}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-2"
                      style={{ fontSize: "0.5rem" }}
                      onClick={() => removeDependencia(d.id)}
                    />
                  </span>
                ))}
              </div>
            )}
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
