// src/pages/Aplicacion/NuevaAplicacion/hooks/useCatalogos.ts
import { useCallback, useState } from "react";
import type { Option } from "../types";

type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

async function fetchApiJson<T>(url: string): Promise<ApiResponse<T>> {
  const resp = await fetch(url);

  // Evita el clásico: Unexpected token '<' cuando el backend devuelve HTML (404/500)
  const text = await resp.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(
      `Respuesta no valida JSON desde ${url}. Primeros bytes: ${text.slice(0, 60)}`,
    );
  }

  if (!resp.ok) {
    throw new Error(json?.error || `HTTP ${resp.status} en ${url}`);
  }

  return json as ApiResponse<T>;
}

export function useCatalogos() {
  const [proveedores, setProveedores] = useState<Option[]>([]);
  const [propietarios, setPropietarios] = useState<Option[]>([]);
  const [vendorsSoft, setVendorsSoft] = useState<Option[]>([]);
  const [dependencias, setDependencias] = useState<Option[]>([]);
  const [error, setError] = useState("");

  const reloadCatalogos = useCallback(async () => {
    const base = import.meta.env.VITE_API_URL;

    const [p1, p2, p3, p4] = await Promise.all([
      fetchApiJson<Option[]>(`${base}/cfg/catalogos/proveedores`),
      fetchApiJson<Option[]>(`${base}/cfg/catalogos/propietarios`),
      fetchApiJson<Option[]>(`${base}/cfg/catalogos/vendor-software`),
      fetchApiJson<Option[]>(`${base}/cfg/catalogos/dependencias`),
    ]);

    if (!p1.ok) throw new Error(p1.error || "Error catalogo proveedores");
    if (!p2.ok) throw new Error(p2.error || "Error catalogo propietarios");
    if (!p3.ok) throw new Error(p3.error || "Error catalogo vendor software");
    if (!p4.ok) throw new Error(p4.error || "Error catalogo dependencias");

    setProveedores(p1.data ?? []);
    setPropietarios(p2.data ?? []);
    setVendorsSoft(p3.data ?? []);
    setDependencias(p4.data ?? []);

    setError("");
  }, []);

  return {
    proveedores,
    propietarios,
    vendorsSoft,
    dependencias,
    error,
    setError,
    reloadCatalogos,
  };
}
