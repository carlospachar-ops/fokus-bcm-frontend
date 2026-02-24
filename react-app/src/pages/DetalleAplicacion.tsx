function DetalleAplicacion() {
  return (
    <div className="container-fluid py-4">
      <h3 className="mb-4">Nombre de la aplicacion</h3>

      <div className="row">
        {/* Columna izquierda */}
        <div className="col-md-4">
          <div className="border p-3 h-100">
            <h5 className="fw-bold mb-3">Detalle de la aplicacion</h5>

            <div className="mb-2">
              <strong>Nombre:</strong>
            </div>
            <div className="mb-2">
              <strong>Descripcion:</strong>
            </div>
            <div className="mb-2">
              <strong>Proveedor:</strong>
            </div>
            <div className="mb-2">
              <strong>Propietario:</strong>
            </div>
            <div className="mb-2">
              <strong>Version:</strong>
            </div>
            <div className="mb-2">
              <strong>Dependencias:</strong>
            </div>
            <div className="mb-2">
              <strong>RTO (horas):</strong>
            </div>
            <div className="mb-2">
              <strong>Impacto del negocio:</strong>
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="col-md-8">
          {/* Documentos */}
          <div className="border p-3 mb-4">
            <h5 className="fw-bold">Documentos de la aplicacion</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-sm mt-2">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Descripcion</th>
                    <th>Tipo</th>
                    <th>Autor</th>
                    <th>Fecha expiracion</th>
                    <th>Ubicacion</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="text-center">
                      Sin documentos
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Contactos */}
          <div className="border p-3 mb-4">
            <h5 className="fw-bold">Detalles del contacto</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-sm mt-2">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Celular</th>
                    <th>Fijo</th>
                    <th>e-mail</th>
                    <th>Posicion</th>
                    <th>Departamento</th>
                    <th>Responsable</th>
                    <th>Comentarios</th>
                    <th>Tipo contacto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={9} className="text-center">
                      Sin contactos
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Procesos */}
          <div className="border p-3 mb-4">
            <h5 className="fw-bold">Procesos de negocio relacionados</h5>
            <div
              style={{
                height: "120px",
                backgroundColor: "#f8f9fa",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>
      </div>

      {/* Comentarios */}
      <div className="border p-3">
        <h5 className="fw-bold">Comentarios</h5>
        <div
          style={{
            height: "100px",
            backgroundColor: "#f8f9fa",
            border: "1px solid #ccc",
          }}
        />
        <small className="text-muted">
          (En esta seccion se lleva un historial de comentarios con usuario y
          fecha)
        </small>
      </div>
    </div>
  );
}

export default DetalleAplicacion;
