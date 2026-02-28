import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home/Home";
import NuevaAplicacion from "./pages/Aplicacion/NuevaAplicacion";
import NuevoContacto from "./pages/Propietario/NuevoContacto";
import NuevoArchivoAdjunto from "./pages/NuevoArchivoAdjunto";
import DetalleAplicacion from "./pages/DetalleAplicacion";
import DetalleUbicacion from "./pages/DetalleUbicacion";
import DetalleProceso from "./pages/DetalleProceso";
import Configuracion from "./pages/Configuracion/Configuracion";
import AgregarEmpleado from "./pages/Empleado/AgregarEmpleado";
import AgregarUbicacion from "./pages/Ubicacion/AgregarUbicacion";
import NuevoHardware from "./pages/Hardware/NuevoHardware";
import EditarHardware from "./pages/Hardware/ModificarHardware";
import EditarAplicacion from "./pages/Aplicacion/EditarAplicacion";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/nueva-aplicacion" element={<NuevaAplicacion />} />
          <Route path="/nuevo-contacto" element={<NuevoContacto />} />
          <Route path="/nuevo-empleado" element={<AgregarEmpleado />} />
          <Route path="/nueva-ubicacion" element={<AgregarUbicacion />} />
          <Route path="/nuevo-hardware" element={<NuevoHardware />} />
          <Route path="/Hardware/editar/:id" element={<EditarHardware />} />
          <Route
            path="/aplicaciones/editar/:id"
            element={<EditarAplicacion />}
          />
          <Route
            path="/nuevo-archivo-adjunto"
            element={<NuevoArchivoAdjunto />}
          />
          <Route path="/detalle-aplicacion" element={<DetalleAplicacion />} />
          <Route path="/detalle-ubicacion" element={<DetalleUbicacion />} />
          <Route path="/detalle-proceso" element={<DetalleProceso />} />
          <Route path="/configuracion" element={<Configuracion />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
