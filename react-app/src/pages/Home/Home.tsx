import { useNavigate } from "react-router-dom";
import "./Home.css";

type TileProps = {
  title: string;
  subtitle?: string;
  icon: string;
  onClick: () => void;
};

function Tile(props: TileProps) {
  return (
    <button
      type="button"
      className="tile text-start border bg-white"
      onClick={props.onClick}
    >
      <div className="tile-icon">{props.icon}</div>
      <div className="fw-semibold">{props.title}</div>
      {props.subtitle ? (
        <div className="tile-subtitle">{props.subtitle}</div>
      ) : null}
    </button>
  );
}

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid pb-4">
      <div className="bg-white border rounded-3 p-4">
        <div className="row g-4 align-items-stretch">
          {/* Izquierda */}
          <div className="col-12 col-lg-7">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="home-badge">∞</div>

              <div>
                <div className="home-title fw-bold">
                  Business Continuity Management
                </div>
                <div className="home-subtitle">FOKUS CORP</div>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-4">
                <Tile
                  title="Risk Management"
                  icon="🛡️"
                  onClick={() => navigate("/detalle-proceso")}
                />
              </div>

              <div className="col-12 col-md-4">
                <Tile
                  title="Business Impact Analysis (BIA)"
                  icon="📋"
                  onClick={() => navigate("/detalle-aplicacion")}
                />
              </div>

              <div className="col-12 col-md-4">
                <Tile
                  title="Business Continuity Plans (BCP)"
                  icon="🧾"
                  onClick={() => navigate("/detalle-ubicacion")}
                />
              </div>

              <div className="col-12 col-md-4">
                <Tile
                  title="Crisis Events"
                  icon="🚨"
                  onClick={() => navigate("/nuevo-contacto")}
                />
              </div>

              <div className="col-12 col-md-4">
                <Tile
                  title="Exercises"
                  icon="🧪"
                  onClick={() => navigate("/nuevo-archivo-adjunto")}
                />
              </div>

              <div className="col-12 col-md-4">
                <Tile
                  title="BCM Reporting"
                  icon="📊"
                  onClick={() => navigate("/nueva-aplicacion")}
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                className="btn btn-primary px-4"
                type="button"
                onClick={() => navigate("/configuracion")}
              >
                ⚙️ BCM Settings
              </button>
            </div>

            <div className="home-support mt-3">
              For support & suggestions, please reach out to{" "}
              <span className="fw-semibold">soporte@email.com</span>
            </div>
          </div>

          {/* Derecha */}
          <div className="col-12 col-lg-5">
            <div className="home-hero border rounded-3">
              <div className="home-hero-bg" />

              <div className="home-hero-logo">FOKUS</div>

              <div className="home-hero-caption">BCM Main Navigation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
