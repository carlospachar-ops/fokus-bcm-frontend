import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./NuevaAplicacion.css";

type Option = { id: number; nombre: string };

type FormState = {
  nombre: string;
  descripcion: string;

  id_vendor_software: string;
  vendor_soft_nuevo: string | null;

  id_propietario: string;
  version: string;
  rto_horas: string;
  impacto_negocio: string;
  id_proveedor: string;

  dependencias_ids: number[];
  dependencias_nuevas: string[];
};

const initState: FormState = {
  nombre: "",
  descripcion: "",
  id_vendor_software: "",
  vendor_soft_nuevo: null,
  id_propietario: "",
  version: "",
  rto_horas: "",
  impacto_negocio: "",
  id_proveedor: "",
  dependencias_ids: [],
  dependencias_nuevas: [],
};

function normalizeName(s: string) {
  return String(s ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

type AutoCreateProps = {
  placeholder: string;
  disabled?: boolean;
  catalog: Option[];
  value: string;
  setValue: (v: string) => void;
  selectedIds?: number[];
  selectedNames?: string[];
  onPickExisting?: (opt: Option) => void;
  onCreateNew?: (name: string) => void;
};

function AutoCreate(props: AutoCreateProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const inputNormalized = normalizeName(props.value);
  const inputLower = inputNormalized.toLowerCase();

  const suggestions = useMemo(() => {
    if (!inputLower) return [];
    return props.catalog
      .filter((d) => d.nombre.toLowerCase().includes(inputLower))
      .slice(0, 8);
  }, [props.catalog, inputLower]);

  const existsExact = useMemo(() => {
    if (!inputLower) return false;
    return props.catalog.some(
      (d) => d.nombre.trim().toLowerCase() === inputLower,
    );
  }, [props.catalog, inputLower]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={wrapRef} className="ac-wrap">
      <input
        className="form-control nuevaApp-input"
        value={props.value}
        onChange={(e) => {
          props.setValue(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={props.placeholder}
        disabled={props.disabled}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);

          if (e.key === "Enter") {
            e.preventDefault();
            const v = normalizeName(props.value);
            if (!v) return;

            const exact = props.catalog.find(
              (d) => d.nombre.trim().toLowerCase() === v.toLowerCase(),
            );

            if (exact && props.onPickExisting) {
              props.onPickExisting(exact);
              props.setValue("");
              setOpen(false);
              return;
            }

            if (!exact && props.onCreateNew) {
              props.onCreateNew(v);
              props.setValue("");
              setOpen(false);
            }
          }
        }}
      />

      {open && inputNormalized !== "" ? (
        <div className="ac-menu border rounded bg-white">
          {suggestions.length > 0 ? (
            <>
              {suggestions.map((s) => {
                const disabledRow =
                  (props.selectedIds
                    ? props.selectedIds.includes(s.id)
                    : false) ||
                  (props.selectedNames
                    ? props.selectedNames.some(
                        (n) => n.toLowerCase() === s.nombre.toLowerCase(),
                      )
                    : false);

                return (
                  <button
                    key={s.id}
                    type="button"
                    className="btn btn-light w-100 text-start ac-row"
                    onClick={() =>
                      props.onPickExisting && props.onPickExisting(s)
                    }
                    disabled={props.disabled || disabledRow}
                  >
                    <span>{s.nombre}</span>
                    <span className="text-muted ac-rowHint">
                      {disabledRow ? "Agregado" : "Seleccionar"}
                    </span>
                  </button>
                );
              })}

              {!existsExact ? (
                <div className="p-2 border-top">
                  <div className="text-muted ac-note">
                    No existe exactamente como "{inputNormalized}".
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100"
                    onClick={() =>
                      props.onCreateNew && props.onCreateNew(inputNormalized)
                    }
                    disabled={props.disabled}
                  >
                    Agregar nuevo: "{inputNormalized}"
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="p-2">
              <div className="text-muted ac-note">
                No existe. Puedes agregarlo.
              </div>
              <button
                type="button"
                className="btn btn-outline-primary w-100"
                onClick={() =>
                  props.onCreateNew && props.onCreateNew(inputNormalized)
                }
                disabled={props.disabled}
              >
                Agregar nuevo: "{inputNormalized}"
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function NuevaAplicacion() {
  const [form, setForm] = useState<FormState>(initState);
  const [loading, setLoading] = useState(false);

  const [proveedores, setProveedores] = useState<Option[]>([]);
  const [propietarios, setPropietarios] = useState<Option[]>([]);
  const [vendorsSoft, setVendorsSoft] = useState<Option[]>([]);
  const [dependencias, setDependencias] = useState<Option[]>([]);
  const [error, setError] = useState("");

  const [depInput, setDepInput] = useState("");
  const [vendorSoftInput, setVendorSoftInput] = useState("");

  const navigate = useNavigate();
  const query = useQuery();

  const reloadCatalogs = async () => {
    const base = import.meta.env.VITE_API_URL;

    const [p1, p2, p3, p4] = await Promise.all([
      fetch(`${base}/cfg/catalogos/proveedores`).then((r) => r.json()),
      fetch(`${base}/cfg/catalogos/propietarios`).then((r) => r.json()),
      fetch(`${base}/cfg/catalogos/vendor-software`).then((r) => r.json()),
      fetch(`${base}/cfg/catalogos/dependencias`).then((r) => r.json()),
    ]);

    if (!p1.ok) throw new Error(p1.error || "Error catalogo proveedores");
    if (!p2.ok) throw new Error(p2.error || "Error catalogo propietarios");
    if (!p3.ok) throw new Error(p3.error || "Error catalogo vendor software");
    if (!p4.ok) throw new Error(p4.error || "Error catalogo dependencias");

    setProveedores(p1.data ?? []);
    setPropietarios(p2.data ?? []);
    setVendorsSoft(p3.data ?? []);
    setDependencias(p4.data ?? []);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        await reloadCatalogs();
      } catch (e: any) {
        setError(e.message);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const prov = query.get("set_proveedor");
    const prop = query.get("set_propietario");

    const apply = async () => {
      if (!prov && !prop) return;

      try {
        await reloadCatalogs();
        setForm((prev) => ({
          ...prev,
          id_proveedor: prov ? String(prov) : prev.id_proveedor,
          id_propietario: prop ? String(prop) : prev.id_propietario,
        }));
      } catch {}
    };

    apply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const selectedDeps = useMemo(() => {
    const ids = new Set(form.dependencias_ids);
    return dependencias.filter((d) => ids.has(d.id));
  }, [dependencias, form.dependencias_ids]);

  const addExistingDep = (dep: Option) => {
    setForm((prev) => {
      if (prev.dependencias_ids.includes(dep.id)) return prev;
      return { ...prev, dependencias_ids: [...prev.dependencias_ids, dep.id] };
    });
    setDepInput("");
  };

  const addNewDep = (name: string) => {
    const value = normalizeName(name);
    const key = value.toLowerCase();
    if (!value) return;

    const found = dependencias.find(
      (d) => d.nombre.trim().toLowerCase() === key,
    );
    if (found) {
      addExistingDep(found);
      return;
    }

    setForm((prev) => {
      if (prev.dependencias_nuevas.some((x) => x.toLowerCase() === key))
        return prev;
      return {
        ...prev,
        dependencias_nuevas: [...prev.dependencias_nuevas, value],
      };
    });
    setDepInput("");
  };

  const removeExistingDep = (id: number) => {
    setForm((prev) => ({
      ...prev,
      dependencias_ids: prev.dependencias_ids.filter((x) => x !== id),
    }));
  };

  const removeNewDep = (name: string) => {
    setForm((prev) => ({
      ...prev,
      dependencias_nuevas: prev.dependencias_nuevas.filter((x) => x !== name),
    }));
  };

  const pickVendorSoftware = (v: Option) => {
    setForm((prev) => ({
      ...prev,
      id_vendor_software: String(v.id),
      vendor_soft_nuevo: null,
    }));
    setVendorSoftInput("");
  };

  const createVendorSoftware = (name: string) => {
    const value = normalizeName(name);
    if (!value) return;

    const found = vendorsSoft.find(
      (x) => x.nombre.trim().toLowerCase() === value.toLowerCase(),
    );

    if (found) {
      pickVendorSoftware(found);
      return;
    }

    setForm((prev) => ({
      ...prev,
      id_vendor_software: "",
      vendor_soft_nuevo: value,
    }));
    setVendorSoftInput("");
  };

  const clearVendorSoftNew = () => {
    setForm((prev) => ({ ...prev, vendor_soft_nuevo: null }));
  };

  const onCancel = () => {
    setForm(initState);
    setDepInput("");
    setVendorSoftInput("");
    navigate("/configuracion");
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

      const payload = {
        nombre: normalizeName(form.nombre),
        descripcion:
          form.descripcion.trim() === "" ? null : form.descripcion.trim(),

        id_propietario:
          form.id_propietario.trim() === ""
            ? null
            : Number(form.id_propietario),
        id_proveedor:
          form.id_proveedor.trim() === "" ? null : Number(form.id_proveedor),

        version: form.version.trim() === "" ? null : form.version.trim(),
        rto_horas: form.rto_horas.trim() === "" ? null : Number(form.rto_horas),
        impacto_negocio:
          form.impacto_negocio.trim() === ""
            ? null
            : form.impacto_negocio.trim(),

        dependencias_ids: form.dependencias_ids,
        dependencias_nuevas: form.dependencias_nuevas,

        id_vendor_software: form.vendor_soft_nuevo
          ? null
          : form.id_vendor_software.trim() === ""
            ? null
            : Number(form.id_vendor_software),
        vendor_software_nuevo: form.vendor_soft_nuevo,
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
      setDepInput("");
      setVendorSoftInput("");

      navigate("/configuracion");
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 nuevaApp nuevaAppMax">
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
        </div>

        <div className="row g-3 align-items-start mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">
              Vendor del software
            </label>
          </div>
          <div className="col-12 col-md-9">
            <AutoCreate
              placeholder="Escribe para buscar o crear (ej: Oracle)"
              catalog={vendorsSoft}
              value={vendorSoftInput}
              setValue={setVendorSoftInput}
              disabled={loading}
              onPickExisting={pickVendorSoftware}
              onCreateNew={createVendorSoftware}
              selectedNames={
                form.vendor_soft_nuevo ? [form.vendor_soft_nuevo] : []
              }
            />

            {form.vendor_soft_nuevo ? (
              <div className="mt-2">
                <span className="nuevaAppBadge nuevaAppBadge--warn">
                  Nuevo: {form.vendor_soft_nuevo}
                  <button
                    type="button"
                    className="nuevaAppBadgeX"
                    onClick={clearVendorSoftNew}
                    disabled={loading}
                    title="Quitar"
                  >
                    ×
                  </button>
                </span>
                <div className="text-muted nuevaAppHelp">
                  Se creara al guardar la aplicacion.
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">
              Propietario
            </label>
          </div>
          <div className="col-12 col-md-9">
            <div className="d-flex gap-2">
              <select
                className="form-select nuevaApp-input"
                name="id_propietario"
                value={form.id_propietario}
                onChange={onChange}
                disabled={loading}
              >
                <option value="">Seleccione...</option>
                {propietarios.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="btn btn-outline-primary"
                disabled={loading}
                onClick={() =>
                  navigate(
                    `/nuevo-contacto?return=${encodeURIComponent("/nueva-aplicacion")}`,
                  )
                }
                title="Nuevo propietario"
              >
                + Nuevo
              </button>
            </div>
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
              disabled={loading}
            />
          </div>
        </div>

        <div className="row g-3 align-items-start mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">
              Dependencias
            </label>
          </div>
          <div className="col-12 col-md-9">
            <AutoCreate
              placeholder="Escribe para buscar o crear (ej: Node.js)"
              catalog={dependencias}
              value={depInput}
              setValue={setDepInput}
              disabled={loading}
              selectedIds={form.dependencias_ids}
              selectedNames={form.dependencias_nuevas}
              onPickExisting={addExistingDep}
              onCreateNew={addNewDep}
            />

            {selectedDeps.length > 0 || form.dependencias_nuevas.length > 0 ? (
              <div className="mt-2 nuevaAppBadges">
                {selectedDeps.map((d) => (
                  <span key={d.id} className="nuevaAppBadge nuevaAppBadge--ok">
                    {d.nombre}
                    <button
                      type="button"
                      className="nuevaAppBadgeX"
                      onClick={() => removeExistingDep(d.id)}
                      disabled={loading}
                      title="Quitar"
                    >
                      ×
                    </button>
                  </span>
                ))}

                {form.dependencias_nuevas.map((d) => (
                  <span key={d} className="nuevaAppBadge nuevaAppBadge--warn">
                    {d}
                    <button
                      type="button"
                      className="nuevaAppBadgeX"
                      onClick={() => removeNewDep(d)}
                      disabled={loading}
                      title="Quitar"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <small className="text-muted">
                Escribe para buscar. Si no existe, podras agregarla como nueva.
              </small>
            )}
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
              disabled={loading}
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
              disabled={loading}
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
            <div className="d-flex gap-2">
              <select
                className="form-select nuevaApp-input"
                name="id_proveedor"
                value={form.id_proveedor}
                onChange={onChange}
                disabled={loading}
              >
                <option value="">Seleccione...</option>
                {proveedores.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="btn btn-outline-primary"
                disabled={loading}
                onClick={() =>
                  navigate(
                    `/nuevo-proveedor?return=${encodeURIComponent("/nueva-aplicacion")}`,
                  )
                }
                title="Nuevo proveedor"
              >
                + Nuevo
              </button>
            </div>
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
