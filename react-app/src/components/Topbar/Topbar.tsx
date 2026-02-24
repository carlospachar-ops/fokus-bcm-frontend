import "./Topbar.css";

function Topbar() {
  return (
    <div className="topbar d-flex align-items-center px-3">
      <div className="topbar-left d-flex align-items-center gap-3">
        <button
          className="topbar-menu-btn btn btn-sm btn-outline-light"
          type="button"
        >
          ☰
        </button>

        <div className="topbar-brand fw-bold">FOKUS</div>

        <div className="topbar-section text-uppercase">MY RESPONSIBILITIES</div>
      </div>

      <div className="topbar-center flex-grow-1 px-3">
        <div className="input-group topbar-search">
          <span className="input-group-text topbar-search-icon">🔎</span>
          <input className="form-control" placeholder="SEARCH" />
        </div>
      </div>

      <div className="topbar-right d-flex align-items-center gap-3">
        <div className="topbar-date">February 2023</div>

        <div className="topbar-avatar" title="Usuario">
          U
        </div>
      </div>
    </div>
  );
}

export default Topbar;
