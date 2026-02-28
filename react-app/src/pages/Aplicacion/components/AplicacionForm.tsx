// components/AplicacionForm.tsx
import AutoCreate from "./AutoCreate";
import FormRow from "./FormRow";
import Badges from "./Badges";

import type { Option, FormState } from "../types";

type Props = {
  title: string;
  submitLabel: string;

  form: FormState;
  loading: boolean;

  error?: string;

  proveedores: Option[];
  propietarios: Option[];
  vendorsSoft: Option[];
  dependencias: Option[];

  depInput: string;
  setDepInput: (v: string) => void;

  vendorSoftInput: string;
  setVendorSoftInput: (v: string) => void;

  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;

  selectedDeps: Option[];

  onPickVendorSoft: (v: Option) => void;
  onCreateVendorSoft: (name: string) => void;

  selectedVendorSoft?: Option | null;
  onClearVendorSoftExisting: () => void;
  onClearVendorSoftNew: () => void;

  onAddExistingDep: (dep: Option) => void;
  onAddNewDep: (name: string) => void;
  onRemoveExistingDep: (id: number) => void;
  onRemoveNewDep: (name: string) => void;

  onNewPropietario: () => void;
  onNewProveedor: () => void;

  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

function AplicacionForm(props: Props) {
  const {
    title,
    submitLabel,
    form,
    loading,
    error,

    proveedores,
    propietarios,
    vendorsSoft,
    dependencias,

    depInput,
    setDepInput,
    vendorSoftInput,
    setVendorSoftInput,

    onChange,
    selectedDeps,

    onPickVendorSoft,
    onCreateVendorSoft,

    selectedVendorSoft,
    onClearVendorSoftExisting,
    onClearVendorSoftNew,

    onAddExistingDep,
    onAddNewDep,
    onRemoveExistingDep,
    onRemoveNewDep,

    onNewPropietario,
    onNewProveedor,

    onSubmit,
    onCancel,
  } = props;

  return (
    <div className="container py-4 nuevaApp nuevaAppMax">
      <h3 className="mb-4 nuevaApp-title">{title}</h3>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <form onSubmit={onSubmit} className="nuevaApp-form">
        <FormRow label="Nombre">
          <input
            className="form-control nuevaApp-input"
            name="nombre"
            value={form.nombre}
            onChange={onChange}
            disabled={loading}
          />
        </FormRow>

        <FormRow label="Descripcion" align="start">
          <textarea
            className="form-control nuevaApp-input"
            name="descripcion"
            value={form.descripcion}
            onChange={onChange}
            rows={3}
            disabled={loading}
          />
        </FormRow>

        <FormRow label="Vendor del software" align="start">
          {form.vendor_soft_nuevo ? (
            <div>
              <span className="nuevaAppBadge nuevaAppBadge--warn">
                Nuevo: {form.vendor_soft_nuevo}
                <button
                  type="button"
                  className="nuevaAppBadgeX"
                  onClick={onClearVendorSoftNew}
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
          ) : selectedVendorSoft ? (
            <div>
              <span className="nuevaAppBadge nuevaAppBadge--ok">
                Seleccionado: {selectedVendorSoft.nombre}
                <button
                  type="button"
                  className="nuevaAppBadgeX"
                  onClick={onClearVendorSoftExisting}
                  disabled={loading}
                  title="Cambiar"
                >
                  ×
                </button>
              </span>
            </div>
          ) : (
            <AutoCreate
              placeholder="Escribe para buscar o crear (ej: Oracle)"
              catalog={vendorsSoft}
              value={vendorSoftInput}
              setValue={setVendorSoftInput}
              disabled={loading}
              onPickExisting={onPickVendorSoft}
              onCreateNew={onCreateVendorSoft}
              selectedIds={[]}
              selectedNames={[]}
            />
          )}
        </FormRow>

        <FormRow label="Propietario">
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
              onClick={onNewPropietario}
              title="Nuevo propietario"
            >
              + Nuevo
            </button>
          </div>
        </FormRow>

        <FormRow label="Version">
          <input
            className="form-control nuevaApp-input"
            name="version"
            value={form.version}
            onChange={onChange}
            placeholder="Ej: 1.0.0"
            disabled={loading}
          />
        </FormRow>

        <FormRow label="Dependencias" align="start">
          <AutoCreate
            placeholder="Escribe para buscar o crear (ej: Node.js)"
            catalog={dependencias}
            value={depInput}
            setValue={setDepInput}
            disabled={loading}
            selectedIds={form.dependencias_ids}
            selectedNames={form.dependencias_nuevas}
            onPickExisting={onAddExistingDep}
            onCreateNew={onAddNewDep}
          />

          <Badges
            existing={selectedDeps}
            nuevos={form.dependencias_nuevas}
            disabled={loading}
            onRemoveExisting={onRemoveExistingDep}
            onRemoveNew={onRemoveNewDep}
          />

          {selectedDeps.length === 0 &&
          form.dependencias_nuevas.length === 0 ? (
            <small className="text-muted">
              Escribe para buscar. Si no existe, podras agregarla como nueva.
            </small>
          ) : null}
        </FormRow>

        <FormRow label="RTO (horas)">
          <input
            className="form-control nuevaApp-input"
            name="rto_horas"
            value={form.rto_horas}
            onChange={onChange}
            placeholder="Ej: 4"
            disabled={loading}
          />
        </FormRow>

        <FormRow label="Impacto del negocio" align="start">
          <textarea
            className="form-control nuevaApp-input"
            name="impacto_negocio"
            value={form.impacto_negocio}
            onChange={onChange}
            rows={4}
            disabled={loading}
          />
        </FormRow>

        <FormRow label="Proveedor (Vendor)" className="mb-4">
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
              onClick={onNewProveedor}
              title="Nuevo proveedor"
            >
              + Nuevo
            </button>
          </div>
        </FormRow>

        <div className="d-flex justify-content-end gap-3 nuevaApp-actions">
          <button
            type="submit"
            className="btn btn-success px-5 nuevaApp-btn"
            disabled={loading}
          >
            {loading ? "Guardando..." : submitLabel}
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

export default AplicacionForm;
