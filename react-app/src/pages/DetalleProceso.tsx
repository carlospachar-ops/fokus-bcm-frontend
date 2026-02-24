function DetalleProceso() {
  return (
    <div className="container py-4" style={{ maxWidth: 1100 }}>
      <div className="border p-4" style={{ background: "#f8f9fa" }}>
        <div className="row align-items-start">
          {/* Icono */}
          <div className="col-12 col-md-2 d-flex justify-content-center">
            <div
              style={{
                width: 90,
                height: 90,
                border: "2px solid #000",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
              }}
              title="Icono proceso"
            >
              ⎈
            </div>
          </div>

          {/* Titulo + descripcion */}
          <div className="col-12 col-md-10">
            <h2 className="mb-2">Nombre del proceso</h2>
            <p className="mb-4" style={{ fontSize: 18 }}>
              Descripcion del proceso
            </p>

            {/* Fila 1: RTO RPO MTPD Estado */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-3">
                <label className="form-label fw-semibold">RTO</label>
                <input className="form-control" />
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label fw-semibold">RPO</label>
                <input className="form-control" />
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label fw-semibold">MTPD</label>
                <input className="form-control" />
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label fw-semibold">Estado</label>
                <input className="form-control" />
              </div>
            </div>

            {/* Fila 2: Fecha proxima revision + Criticidad */}
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Fecha de proxima revision
                </label>
                <input
                  type="date"
                  className="form-control"
                  style={{ maxWidth: 260 }}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Criticidad</label>
                <input className="form-control" style={{ maxWidth: 320 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleProceso;
