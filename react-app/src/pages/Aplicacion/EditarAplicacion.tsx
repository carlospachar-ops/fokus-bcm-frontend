import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./NuevaAplicacion.css";

import type { Option, FormState } from "./types";
import { initState } from "./types";
import { normalizeName } from "./utils";

import { useCatalogos } from "./hooks/useCatalogos";
import AplicacionForm from "./components/AplicacionForm";

type ApiApp = {
  id_aplicacion: number;

  nombre?: string;
  descripcion?: string;

  proveedor?: string | number | null;
  propietario?: string | number | null;

  version?: string | null;

  dependencias_nombres?: string | null;
  dependencias_ids?: number[] | null;

  rto?: string | number | null;
  rto_horas?: number | null;

  impacto?: string | null;
  impacto_negocio?: string | null;

  id_vendor_software?: number | null;
};

function splitNames(csv: string) {
  return csv
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
}

function toHoursString(x: any) {
  if (x === null || x === undefined) return "";
  if (typeof x === "number") return String(x);
  const s = String(x).trim();
  if (s.endsWith("h")) return s.slice(0, -1).trim();
  return s;
}

export default function EditarAplicacion() {
  const { id } = useParams();
  const appId = Number(id);

  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(initState);
  const [loading, setLoading] = useState(false);

  const [depInput, setDepInput] = useState("");
  const [vendorSoftInput, setVendorSoftInput] = useState("");

  const {
    proveedores,
    propietarios,
    vendorsSoft,
    dependencias,
    error,
    setError,
    reloadCatalogos,
  } = useCatalogos();

  // Refs para evitar loops por cambios de referencia
  const reloadRef = useRef(reloadCatalogos);
  useEffect(() => {
    reloadRef.current = reloadCatalogos;
  }, [reloadCatalogos]);

  const dependenciasRef = useRef<Option[]>([]);
  useEffect(() => {
    dependenciasRef.current = dependencias;
  }, [dependencias]);

  // Bandera para no recargar catálogos mil veces
  const catalogosCargadosRef = useRef(false);

  // 1) Cargar catalogos UNA sola vez (aunque reloadCatalogos cambie)
  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        if (catalogosCargadosRef.current) return;
        setError("");
        await reloadRef.current();
        if (!alive) return;
        catalogosCargadosRef.current = true;
      } catch (e: any) {
        if (!alive) return;
        setError(e.message);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [setError]);

  // 2) Cargar aplicacion por ID UNA sola vez
  const appCargadaRef = useRef<number | null>(null);

  useEffect(() => {
    if (!Number.isFinite(appId) || appId <= 0) return;
    if (appCargadaRef.current === appId) return;

    let alive = true;

    const loadById = async () => {
      try {
        setLoading(true);

        // Asegura catalogos antes de mapear nombres -> ids
        if (!catalogosCargadosRef.current) {
          try {
            await reloadRef.current();
            if (!alive) return;
            catalogosCargadosRef.current = true;
          } catch {}
        }

        const base = import.meta.env.VITE_API_URL;
        const resp = await fetch(`${base}/cfg/aplicaciones/${appId}`);
        const text = await resp.text();

        let json: any = null;
        try {
          json = text ? JSON.parse(text) : null;
        } catch {
          throw new Error(
            `Respuesta no valida JSON. Primeros bytes: ${text.slice(0, 60)}`,
          );
        }

        const data: ApiApp = json?.data ? json.data : json;
        if (!data) throw new Error("No se recibio data de la aplicacion.");

        const idsFromApi = Array.isArray(data.dependencias_ids)
          ? data.dependencias_ids
              .map((x) => Number(x))
              .filter((x) => Number.isFinite(x))
          : [];

        const idsFromNames =
          idsFromApi.length > 0
            ? idsFromApi
            : (typeof data.dependencias_nombres === "string"
                ? splitNames(data.dependencias_nombres)
                : []
              )
                .map((name) => {
                  const key = name.trim().toLowerCase();
                  const found = dependenciasRef.current.find(
                    (d) => d.nombre.trim().toLowerCase() === key,
                  );
                  return found ? found.id : null;
                })
                .filter((x): x is number => x !== null);

        if (!alive) return;

        setForm((prev) => ({
          ...prev,
          nombre: data.nombre ?? "",
          descripcion: data.descripcion ?? "",
          version: data.version ?? "",

          id_proveedor:
            data.proveedor === null || data.proveedor === undefined
              ? ""
              : String(data.proveedor),

          id_propietario:
            data.propietario === null || data.propietario === undefined
              ? ""
              : String(data.propietario),

          rto_horas:
            data.rto_horas !== null && data.rto_horas !== undefined
              ? String(data.rto_horas)
              : toHoursString(data.rto),

          impacto_negocio: data.impacto_negocio ?? data.impacto ?? "",

          id_vendor_software:
            data.id_vendor_software !== null &&
            data.id_vendor_software !== undefined
              ? String(data.id_vendor_software)
              : "",
          vendor_soft_nuevo: null,

          dependencias_ids: idsFromNames,
          dependencias_nuevas: [],
        }));

        appCargadaRef.current = appId;
      } catch (e: any) {
        if (!alive) return;
        alert(`Error cargando aplicacion: ${e.message}`);
        navigate("/configuracion");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    loadById();

    return () => {
      alive = false;
    };
  }, [appId, navigate]);

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

  const selectedVendorSoft = useMemo(() => {
    if (form.vendor_soft_nuevo) return null;
    const idStr = String(form.id_vendor_software || "").trim();
    if (!idStr) return null;
    return vendorsSoft.find((x) => x.id === Number(idStr)) || null;
  }, [form.id_vendor_software, form.vendor_soft_nuevo, vendorsSoft]);

  const clearExistingVendorSoft = () => {
    setForm((prev) => ({
      ...prev,
      id_vendor_software: "",
      vendor_soft_nuevo: null,
    }));
    setVendorSoftInput("");
  };

  const clearNewVendorSoft = () => {
    setForm((prev) => ({ ...prev, vendor_soft_nuevo: null }));
    setVendorSoftInput("");
  };

  const onCancel = () => {
    navigate("/configuracion");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!Number.isFinite(appId) || appId <= 0) {
        alert("ID de aplicacion invalido.");
        return;
      }

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

      const resp = await fetch(`${base}/cfg/aplicaciones/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await resp.text();
      let json: any = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(
          `Respuesta no valida JSON. Primeros bytes: ${text.slice(0, 60)}`,
        );
      }

      if (!json?.ok) throw new Error(json?.error || "No se pudo actualizar");

      alert("Aplicacion actualizada.");
      navigate("/configuracion");
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AplicacionForm
      title={`Editar aplicacion #${appId}`}
      submitLabel="Guardar cambios"
      form={form}
      loading={loading}
      error={error}
      proveedores={proveedores}
      propietarios={propietarios}
      vendorsSoft={vendorsSoft}
      dependencias={dependencias}
      depInput={depInput}
      setDepInput={setDepInput}
      vendorSoftInput={vendorSoftInput}
      setVendorSoftInput={setVendorSoftInput}
      onChange={onChange}
      selectedDeps={selectedDeps}
      onPickVendorSoft={pickVendorSoftware}
      onCreateVendorSoft={createVendorSoftware}
      selectedVendorSoft={selectedVendorSoft}
      onClearVendorSoftExisting={clearExistingVendorSoft}
      onClearVendorSoftNew={clearNewVendorSoft}
      onAddExistingDep={addExistingDep}
      onAddNewDep={addNewDep}
      onRemoveExistingDep={removeExistingDep}
      onRemoveNewDep={removeNewDep}
      onNewPropietario={() =>
        navigate(
          `/nuevo-contacto?return=${encodeURIComponent(
            `/aplicaciones/editar/${appId}`,
          )}`,
        )
      }
      onNewProveedor={() =>
        navigate(
          `/nuevo-proveedor?return=${encodeURIComponent(
            `/aplicaciones/editar/${appId}`,
          )}`,
        )
      }
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}
