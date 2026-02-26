import { useState } from "react";
import "./AgregarProveedor.css";


type FormState = {
  nombre: string;
  descripcion: string;
  producto_servicio: string;
  fecha_expiracion_contrato: string;
  direccion: string;
  email: string;
  impacto_negocio: string;
};

const initState: FormState = {
  nombre: "",
  descripcion: "",
  producto_servicio: "",
  fecha_expiracion_contrato: "",
  direccion: "",
  email: "",
  impacto_negocio: "",
};



function AgregarProveedor() {
  const [form, setForm] = useState<FormState>(initState);
  const [loading, setLoading] = useState(false);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
  };

/*
    Envio y verificacion de empleados hacia el backend
*/

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (form.nombre.trim() === "") {
        alert("El nombre es obligatorio.");
        return;
      }else if (form.descripcion.trim() === "") {
        alert("La descripción es obligatoria.");
        return;
      }else if (form.producto_servicio.trim() === "") {
        alert("El producto/servicio es obligatorio.");
        return;
      }else if (form.fecha_expiracion_contrato.trim() === "") {
        alert("La fecha de expiración del contrato es obligatoria.");
        return;
      }else if (form.direccion.trim() === "") {
        alert("La dirección es obligatoria.");
        return;
      }else if (form.email.trim() === "") {
        alert("El email es obligatorio.");
        return;
      }else if (form.impacto_negocio.trim() === "") {
        alert("El impacto en el negocio es obligatorio.");
        return;
      }
      setLoading(true);
      const base = import.meta.env.VITE_API_URL;

      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion,
        producto_servicio: form.producto_servicio,
        fecha_expiracion_contrato: form.fecha_expiracion_contrato,
        direccion: form.direccion,
        email: form.email,
        impacto_negocio: form.impacto_negocio,
      };

      const resp = await fetch(`${base}/cfg/proveedores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await resp.json();
      if (!json.ok) throw new Error(json.error || "No se pudo guardar");

      alert(`Proveedor guardado. ID: ${json.id_proveedor}`);
      setForm(initState);
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };
  const onCancel = () => setForm(initState);
  return (
    <div className="container py-4 nuevaApp" style={{ maxWidth: 980 }}>
      <h3 className="mb-4 nuevaApp-title">Nuevo proveedor</h3>

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
        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">Descripción</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control nuevaApp-input"
              name="descripcion"
              value={form.descripcion}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">Producto/Servicio</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control nuevaApp-input"
              name="producto_servicio"
              value={form.producto_servicio}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">Fecha de expiración del contrato</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control nuevaApp-input"
              name="fecha_expiracion_contrato"
              value={form.fecha_expiracion_contrato}
              onChange={onChange}
              type="date"
            />
          </div>
        </div>
        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">direccion</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control nuevaApp-input"
              name="direccion"
              value={form.direccion}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">Email</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control nuevaApp-input"
              name="email"
              value={form.email}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">Impacto de negocio</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control nuevaApp-input"
              name="impacto_negocio"
              value={form.impacto_negocio}
              onChange={onChange}
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

export default AgregarProveedor;
