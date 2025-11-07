import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import PanelPrincipal from "./components/PanelPrincipal.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/panel" element={<PanelPrincipal />} />
            </Routes>
        </Router>
    );
}

export default App;
