import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Mail, Lock, LogIn } from "lucide-react";
import "./Login.css";
import { apiPost } from "../services/api"; 

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await apiPost("/login", { email, password });
            if (response?.access_token) {
                localStorage.setItem("token", response.access_token);

                if (response.user) {
                    localStorage.setItem("user", JSON.stringify(response.user));
                }

                setLoading(false);
                navigate("/panel");
            } else {
                throw new Error("Respuesta inválida del servidor");
            }
        } catch (err) {
            console.error("Login failed", err);

            if (err?.response?.status === 401) {
                setError("Credenciales inválidas");
            } else {
                setError(err?.message || "Error al iniciar sesión");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="motto-panel">
                    <Truck className="motto-icon" />
                    <h2 className="motto-title">CRM Logistico PWA</h2>
                    <p className="motto-text">
                        Tu plataforma de gestión logística. Eficiencia en cada
                        envío.
                    </p>
                </div>

                <div className="form-panel">
                    <div className="mobile-logo">
                        <Truck className="mobile-icon" />
                    </div>

                    <h2 className="form-title">Bienvenido de vuelta</h2>
                    <p className="form-subtitle">
                        Inicia sesión para acceder a tu sistema logístico.
                    </p>

                    <form onSubmit={handleLogin} className="login-form">
                        <div>
                            <label htmlFor="email" className="input-label">
                                Correo Electrónico
                            </label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ejemplo@logisys.com"
                                    required
                                    className="login-input"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="input-label">
                                Contraseña
                            </label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="••••••••"
                                    required
                                    className="login-input"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            <LogIn className="w-5 h-5" />
                            <span>
                                {loading ? "Conectando..." : "Iniciar Sesión"}
                            </span>
                        </button>

                        {error && (
                            <div
                                className="error-message"
                                style={{
                                    color: "var(--danger, #c33)",
                                    marginTop: "8px",
                                }}
                            >
                                {error}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
