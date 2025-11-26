import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import PanelPrincipal from "./components/PanelPrincipal.jsx";
import Clientes from "./components/Clientes.jsx";
import Agentes from "./components/Agentes.jsx";
import Proveedores from "./components/Proveedores.jsx";
import Tarifas from "./components/Tarifas.jsx";
import Usuarios from "./components/Usuarios.jsx";
import Cotizaciones from "./components/Cotizaciones.jsx";
import Operaciones from "./components/Operaciones.jsx";
import Solicitudes from "./components/Solicitudes.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
    return (
        <Router>
            <Routes>

                {/* Ruta libre */}
                <Route path="/" element={<Login />} />

                {/* Rutas protegidas */}
                <Route
                    path="/panel"
                    element={
                        <ProtectedRoute>
                            <PanelPrincipal />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/clientes"
                    element={
                        <ProtectedRoute>
                            <Clientes />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/agentes"
                    element={
                        <ProtectedRoute>
                            <Agentes />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/proveedores"
                    element={
                        <ProtectedRoute>
                            <Proveedores />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tarifas"
                    element={
                        <ProtectedRoute>
                            <Tarifas />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/usuarios"
                    element={
                        <ProtectedRoute>
                            <Usuarios />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cotizaciones"
                    element={
                        <ProtectedRoute>
                            <Cotizaciones />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/operaciones"
                    element={
                        <ProtectedRoute>
                            <Operaciones />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/solicitudes"
                    element={
                        <ProtectedRoute>
                            <Solicitudes />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </Router>
    );
}

export default App;
