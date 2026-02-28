// src/pages/Aplicacion/NuevaAplicacion/components/AutoCreate.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { Option } from "../types";
import { normalizeName } from "../utils";

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

export default function AutoCreate(props: AutoCreateProps) {
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
