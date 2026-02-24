import { useState } from "react";

type FormState = {
  nombre: string;
  descripcion: string;
  tipo: string;
  autor: string;
  fechaCreacion: string;
  departamento: string;
  configuracionArchivo: string;
  fechaCarga: string;
};

const initState: FormState = {
  nombre: "",
  descripcion: "",
  tipo: "",
  autor: "",
  fechaCreacion: "",
  departamento: "",
  configuracionArchivo: "",
  fechaCarga: "",
};

function NuevoArchivoAdjunto() {
  const [form, setForm] = useState<FormState>(initState);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario:", form);
    alert("Grabado (simulado). Revisa consola.");
  };

  const onCancel = () => {
    setForm(initState);
  };

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <h4 className="mb-4">Nuevo archivo adjunto</h4>

      <div className="mb-3 fw-semibold">General</div>

      <form onSubmit={onSubmit}>
        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0">Nombre</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control"
              name="nombre"
              value={form.nombre}
              onChange={onChange}
              required
            />
          </div>
        </div>

        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0">Descripcion</label>
          </div>
          <div className="col-12 col-md-9">
            <textarea
              className="form-control"
              name="descripcion"
              value={form.descripcion}
              onChange={onChange}
              rows={2}
            />
          </div>
        </div>

        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0">Tipo</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control"
              name="tipo"
              value={form.tipo}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0">Autor</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control"
              name="autor"
              value={form.autor}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0">Fecha de creacion</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              type="date"
              className="form-control"
              name="fechaCreacion"
              value={form.fechaCreacion}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0">Departamento</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control"
              name="departamento"
              value={form.departamento}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0">Configuracion archivo</label>
          </div>
          <div className="col-12 col-md-9">
            <div className="input-group">
              <input
                className="form-control"
                name="configuracionArchivo"
                value={form.configuracionArchivo}
                onChange={onChange}
                placeholder="Seleccionar archivo..."
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => alert("Prueba.")}
              >
                ...
              </button>
            </div>
          </div>
        </div>

        <div className="row g-3 align-items-center mb-4">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0">Fecha de carga</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              type="date"
              className="form-control"
              name="fechaCarga"
              value={form.fechaCarga}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="d-flex justify-content-center gap-3">
          <button type="submit" className="btn btn-success px-5">
            Grabar
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary px-5"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default NuevoArchivoAdjunto;
