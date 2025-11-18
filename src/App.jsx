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

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/panel" element={<PanelPrincipal />} />
                <Route path="/clientes" element={<Clientes/>} />
                <Route path="/agentes" element={<Agentes/>} />
                <Route path="/proveedores" element={<Proveedores/>} />
                <Route path="/tarifas" element={<Tarifas/>} />
                <Route path="/usuarios" element={<Usuarios/>} />
                <Route path="/cotizaciones" element={<Cotizaciones/>} />
                <Route path="/operaciones" element={<Operaciones/>} />
                <Route path="/solicitudes" element={<Solicitudes/>} />
            </Routes>
        </Router>
    );
}

export default App;
