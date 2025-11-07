import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import PanelPrincipal from "./components/PanelPrincipal.jsx";
import Clientes from "./components/Clientes.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/panel" element={<PanelPrincipal />} />
                <Route path="/clientes" element={<Clientes/>} />
            </Routes>
        </Router>
    );
}

export default App;
