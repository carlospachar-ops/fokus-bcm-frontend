import { useEffect, useState } from "react";
import "./AgregarEmpleado.css";

type Option = { id: number; nombre: string };

type FormState = {
  nombre: string;
  departamento: string;
  aplicaciones_id: number[];
  empleados_respaldo_ids: number[];
  habilidad: string;
  numero_requerido?: number;
  rol_tabla:string;
  descripcion_rol: string;
};

const initState: FormState = {
  nombre: "",
  departamento: "",
  aplicaciones_id: [],
  empleados_respaldo_ids: [],
  habilidad: "",
  numero_requerido: undefined,
  rol_tabla: "",
  descripcion_rol: "",
};



function AgregarEmpleado() {
  const [form, setForm] = useState<FormState>(initState);
  const [loading, setLoading] = useState(false);

  const [aplicaciones, setAplicaciones] = useState<Option[]>([]);

  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const base = import.meta.env.VITE_API_URL;

        const [p1] = await Promise.all([
          fetch(`${base}/cfg/catalogos/aplicaciones`).then((r) => r.json()),

        ]);

        if (!p1.ok) throw new Error(p1.error || "Error catalogo aplicaciones");
        setAplicaciones(p1.data ?? []);
      } catch (e: any) {
        setError(e.message);
      }
    };

    load();
  }, []);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAplicacion = (id: number) => {
    setForm((prev) => {
      const exists = prev.aplicaciones_id.includes(id);
      return {
        ...prev,
        aplicaciones_id: exists
          ? prev.aplicaciones_id.filter((x) => x !== id)
          : [...prev.aplicaciones_id, id],
      };
    });
  };

  const onCancel = () => setForm(initState);

/*
    Envio y verificacion de empleados hacia el backend
*/

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (form.nombre.trim() === "") {
        alert("El nombre es obligatorio.");
        return;
      }else if (form.departamento.trim() === "") {
        alert("El departamento es obligatorio.");
        return;
      }else if (form.habilidad.trim() === "") {
        alert("La habilidad/experiencia critica es obligatoria.");
        return;
      }else if (form.numero_requerido === undefined || form.numero_requerido < 1) {
        alert("El numero requerido es obligatorio y debe ser al menos 1.");
        return;
      }else if (form.rol_tabla.trim() === "") {
        alert("El rol es obligatorio.");
        return;
      }else if (form.descripcion_rol.trim() === "") {
        alert("La descripcion del rol es obligatoria.");
        return;
      }

      setLoading(true);
      const base = import.meta.env.VITE_API_URL;

      const payload = {
        nombre: form.nombre.trim(),
        departamento: form.departamento,
        aplicaciones_id: form.aplicaciones_id,
        empleados_respaldo_ids: form.empleados_respaldo_ids,
        habilidad: form.habilidad,
        numero_requerido: form.numero_requerido,
        rol_tabla: form.rol_tabla,
        descripcion_rol: form.descripcion_rol,
      };

      const resp = await fetch(`${base}/cfg/empleados`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await resp.json();
      if (!json.ok) throw new Error(json.error || "No se pudo guardar");

      alert(`Empleado guardado. ID: ${json.id_empleado}`);
      setForm(initState);
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

    function toggleEmpleadoRespaldo(id: number): void {
        setForm((prev) => {
            const exists = prev.empleados_respaldo_ids.includes(id);
            return {
                ...prev,
                empleados_respaldo_ids: exists
                    ? prev.empleados_respaldo_ids.filter((x) => x !== id)
                    : [...prev.empleados_respaldo_ids, id],
            };
        });
    }

  return (
    <div className="container py-4 nuevaApp" style={{ maxWidth: 980 }}>
      <h3 className="mb-4 nuevaApp-title">Nuevo empleado</h3>

      {error && <div className="alert alert-danger">{error}</div>}

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
            <label className="form-label mb-0 nuevaApp-label">Departamento</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control nuevaApp-input"
              name="departamento"
              value={form.departamento}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">Habilidad/Experiencia critica</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control nuevaApp-input"
              name="habilidad"
              value={form.habilidad}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">Numero Requerido</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control nuevaApp-input"
              name="numero_requerido"
              value={form.numero_requerido}
              onChange={onChange}
              type="number"
            />
          </div>
        </div>
        
        <div><div className="row g-3 align-items-center mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">Rol</label>
          </div>
          <div className="col-12 col-md-9">
            <input
              className="form-control nuevaApp-input"
              name="rol_tabla"
              value={form.rol_tabla || ""}
              onChange={onChange}
            />
          </div>
        </div>
          <div className="row g-3 align-items-center mb-2">
            <div className="col-12 col-md-3">
              <label className="form-label mb-0 nuevaApp-label">Descripcion</label>
            </div>
            <div className="col-12 col-md-9">
              <input
                className="form-control nuevaApp-input"
                name="descripcion_rol"
                value={form.descripcion_rol || ""}
                onChange={onChange}
                />
            </div>
          </div></div>

        <div className="row g-3 align-items-start mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">
              Aplicaciones Asignadas
            </label>
          </div>
          <div className="col-12 col-md-9">
            <div
              className="border rounded p-2"
              style={{ maxHeight: 180, overflow: "auto" }}
            >
              {aplicaciones.length === 0 ? (
                <div className="text-muted">
                  No hay aplicaciones para asignar.
                </div>
              ) : (
                aplicaciones.map((a) => (
                  <label
                    key={a.id}
                    className="d-flex align-items-center gap-2 mb-1"
                  >
                    <input
                      type="checkbox"
                      checked={form.aplicaciones_id.includes(a.id)}
                      onChange={() => toggleAplicacion(a.id)}
                    />
                    <span>{a.nombre}</span>
                  </label>
                ))
              )}
            </div>
            <small className="text-muted">
              Selecciona las aplicaciones asignadas a este empleado. Puedes asignar varias.
            </small>
          </div>
        </div>

        <div className="row g-3 align-items-start mb-2">
          <div className="col-12 col-md-3">
            <label className="form-label mb-0 nuevaApp-label">
              Empleados Respaldo
            </label>
          </div>
          <div className="col-12 col-md-9">
            <div
              className="border rounded p-2"
              style={{ maxHeight: 180, overflow: "auto" }}
            >
              {aplicaciones.length === 0 ? (
                <div className="text-muted">
                  No hay empleados para asignar.
                </div>
              ) : (
                aplicaciones.map((a) => (
                  <label
                    key={a.id}
                    className="d-flex align-items-center gap-2 mb-1"
                  >
                    <input
                      type="checkbox"
                      checked={form.empleados_respaldo_ids.includes(a.id)}
                      onChange={() => toggleEmpleadoRespaldo(a.id)}
                    />
                    <span>{a.nombre}</span>
                  </label>
                ))
              )}
            </div>
            <small className="text-muted">
              Selecciona los empleados respaldos de este empleado. Puedes asignar varios.
            </small>
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

export default AgregarEmpleado;
