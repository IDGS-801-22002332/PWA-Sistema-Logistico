// src/layout/AppLayout.jsx
import React from 'react';
import {
    LogOut, Home, Users, Package, ClipboardList,
    Truck, FileText, UserCog, DollarSign,
    BadgeCheck
} from 'lucide-react';

import '../components/panel.css';

const user = JSON.parse(localStorage.getItem('user') || '{}');

const AppLayout = ({ children, activeLink }) => {

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    const isActive = (route) =>
        (activeLink === route ? "nav-item active" : "nav-item");

    return (
        <div className="app-layout">

            {/* SIDEBAR */}
            <aside className="sidebar">

                <div className="sidebar-header">
                    <Truck className="sidebar-logo-icon" />
                    <span className="sidebar-logo-text">CRM Logistico</span>
                </div>

                <nav className="sidebar-nav">

                    {/* INICIO */}
                    <a href="/panel" className={isActive('/panel')}>
                        <Home className="nav-icon" />
                        <span>Inicio</span>
                    </a>

                    {/* ---------------- MAESTROS ---------------- */}
                    <span className="nav-section-title">Maestros</span>

                    <a href="/agentes" className={isActive('/agentes')}>
                        <BadgeCheck className="nav-icon" />
                        <span>Agentes</span>
                    </a>

                    <a href="/clientes" className={isActive('/clientes')}>
                        <Users className="nav-icon" />
                        <span>Clientes</span>
                    </a>

                    <a href="/proveedores" className={isActive('/proveedores')}>
                        <Truck className="nav-icon" />
                        <span>Proveedores</span>
                    </a>

                    <a href="/tarifas" className={isActive('/tarifas')}>
                        <DollarSign className="nav-icon" />
                        <span>Tarifas</span>
                    </a>

                    <a href="/usuarios" className={isActive('/usuarios')}>
                        <UserCog className="nav-icon" />
                        <span>Usuarios</span>
                    </a>

                    {/* ---------------- OPERACIONES ---------------- */}
                    <span className="nav-section-title">Operaciones</span>

                    <a href="/cotizaciones" className={isActive('/cotizaciones')}>
                        <FileText className="nav-icon" />
                        <span>Cotizaciones</span>
                    </a>

                    <a href="/operaciones" className={isActive('/operaciones')}>
                        <ClipboardList className="nav-icon" />
                        <span>Operaciones</span>
                    </a>

                    <a href="/solicitudes" className={isActive('/solicitudes')}>
                        <Package className="nav-icon" />
                        <span>Solicitudes</span>
                    </a>

                </nav>

                {/* LOGOUT (FIJO Y NO RECORTADO) */}
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-button">
                        <LogOut className="nav-icon" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>

            </aside>

            {/* HEADER + CONTENIDO */}
            <div className="main-content-wrapper">

                <header className="header">
                    <h1 className="header-title">CRM Logistico PWA</h1>

                    <div className="user-info">
                        <span className="user-name">Hola, {user.nombre || 'Usuario'}</span>
                        <div className="user-avatar">
                            {user.nombre ? user.nombre[0] : 'U'}
                        </div>
                    </div>
                </header>

                <main className="main-content">
                    {children}
                </main>

            </div>

        </div>
    );
};

export default AppLayout;
