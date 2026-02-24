import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar/Topbar";

function MainLayout() {
  return (
    <div style={{ minHeight: "100vh", background: "#f3f6fb" }}>
      <Topbar />

      <div className="container-fluid">
        <div className="py-2" style={{ fontSize: 13, color: "#5a6b7a" }}>
          Fokus › BCM Main Navigation
        </div>
      </div>

      <Outlet />
    </div>
  );
}

export default MainLayout;
