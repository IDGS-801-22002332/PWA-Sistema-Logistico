import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Mail, Lock, LogIn } from 'lucide-react';
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Intentando iniciar sesión con:", { email, password });
        // Redirigir sin validar
        navigate('/panel');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="motto-panel">
                    <Truck className="motto-icon" />
                    <h2 className="motto-title">CRM Logistico PWA</h2>
                    <p className="motto-text">
                        Tu plataforma de gestión logística. Eficiencia en cada envío.
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
                            <label htmlFor="email" className="input-label">Correo Electrónico</label>
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
                            <label htmlFor="password" className="input-label">Contraseña</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="login-input"
                                />
                            </div>
                        </div>

                        <div className="options-row">
                            <div className="checkbox-wrapper">
                                <input id="remember-me" type="checkbox" className="checkbox-input" />
                                <label htmlFor="remember-me" className="checkbox-label">Recordarme</label>
                            </div>
                            <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
                        </div>

                        <button type="submit" className="login-button">
                            <LogIn className="w-5 h-5" />
                            <span>Iniciar Sesión</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
