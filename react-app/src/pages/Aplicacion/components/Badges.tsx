// src/pages/Aplicacion/NuevaAplicacion/components/Badges.tsx
import type { Option } from "../types";

type Props = {
  existing: Option[];
  nuevos: string[];
  disabled?: boolean;
  onRemoveExisting: (id: number) => void;
  onRemoveNew: (name: string) => void;
};

export default function Badges(props: Props) {
  const hasAny = props.existing.length > 0 || props.nuevos.length > 0;

  if (!hasAny) return null;

  return (
    <div className="mt-2 nuevaAppBadges">
      {props.existing.map((d) => (
        <span key={d.id} className="nuevaAppBadge nuevaAppBadge--ok">
          {d.nombre}
          <button
            type="button"
            className="nuevaAppBadgeX"
            onClick={() => props.onRemoveExisting(d.id)}
            disabled={props.disabled}
            title="Quitar"
          >
            ×
          </button>
        </span>
      ))}

      {props.nuevos.map((d) => (
        <span key={d} className="nuevaAppBadge nuevaAppBadge--warn">
          {d}
          <button
            type="button"
            className="nuevaAppBadgeX"
            onClick={() => props.onRemoveNew(d)}
            disabled={props.disabled}
            title="Quitar"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}
