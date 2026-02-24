import { useState } from "react";

type FormState = {
  nombre: string;
  numeroMovil: string;
  numeroFijo: string;
  email: string;
  posicion: string;
  departamento: string;
};

const initState: FormState = {
  nombre: "",
  numeroMovil: "",
  numeroFijo: "",
  email: "",
  posicion: "",
  departamento: "",
};

function NuevoContacto() {
  const [form, setForm] = useState<FormState>(initState);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contacto:", form);
    alert("Grabado (simulado).");
  };

  const onCancel = () => {
    setForm(initState);
  };

  return (
    <div
      className="container py-4"
      style={{
        maxWidth: 750,
        border: "1px solid #000",
        padding: "30px",
        backgroundColor: "#f8f9fa",
      }}
    >
      <h4 className="mb-4">Nuevo contacto</h4>

      <form onSubmit={onSubmit}>
        <div className="row mb-3 align-items-center">
          <div className="col-4">
            <label className="form-label">Nombre</label>
          </div>
          <div className="col-8">
            <input
              className="form-control"
              name="nombre"
              value={form.nombre}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="row mb-3 align-items-center">
          <div className="col-4">
            <label className="form-label">Numero movil</label>
          </div>
          <div className="col-6">
            <input
              className="form-control"
              name="numeroMovil"
              value={form.numeroMovil}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="row mb-3 align-items-center">
          <div className="col-4">
            <label className="form-label">Numero fijo</label>
          </div>
          <div className="col-6">
            <input
              className="form-control"
              name="numeroFijo"
              value={form.numeroFijo}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="row mb-3 align-items-center">
          <div className="col-4">
            <label className="form-label">e-mail</label>
          </div>
          <div className="col-6">
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="row mb-3 align-items-center">
          <div className="col-4">
            <label className="form-label">Posicion</label>
          </div>
          <div className="col-6">
            <input
              className="form-control"
              name="posicion"
              value={form.posicion}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="row mb-4 align-items-center">
          <div className="col-4">
            <label className="form-label">Departamento</label>
          </div>
          <div className="col-8">
            <input
              className="form-control"
              name="departamento"
              value={form.departamento}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="d-flex justify-content-between px-5">
          <button type="submit" className="btn btn-success px-4">
            Grabar
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default NuevoContacto;
