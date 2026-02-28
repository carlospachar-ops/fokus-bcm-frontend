export type Option = { id: number; nombre: string };

export type FormState = {
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

export const initState: FormState = {
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
