// src/pages/Aplicacion/NuevaAplicacion/components/FormRow.tsx
import React from "react";

type Props = {
  label: string;
  align?: "center" | "start";
  className?: string;
  children: React.ReactNode;
};

export default function FormRow(props: Props) {
  const align = props.align ?? "center";

  return (
    <div
      className={`row g-3 align-items-${align} mb-2 ${props.className ?? ""}`}
    >
      <div className="col-12 col-md-3">
        <label className="form-label mb-0 nuevaApp-label">{props.label}</label>
      </div>
      <div className="col-12 col-md-9">{props.children}</div>
    </div>
  );
}
