// src/layouts/AppLayout.jsx

import React from 'react';
import { LogOut, Home, Users, Package, Map, Truck, Box } from 'lucide-react';
// Importamos el CSS del panel, que ahora es el CSS del Layout
import '../components/panel.css'; 

// Función para obtener la información del usuario (Marco)
const user = JSON.parse(localStorage.getItem('user') || '{}');

// Componente que envuelve la aplicación
const AppLayout = ({ children, activeLink }) => {
    
    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirigir al login
        window.location.href = '/'; 
    };

    // Función auxiliar para determinar si un enlace está activo
    const isActive = (linkPath) => activeLink === linkPath ? 'active' : '';

    return (
        <div className="app-layout">
            
            {/* 1. Sidebar (Menú Lateral PERMANENTE) */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <Truck className="sidebar-logo-icon" />
                    <span className="sidebar-logo-text">Logisys CRM</span>
                </div>
                
                <nav className="sidebar-nav">
                    
                    <a href="/panel" className={`nav-item ${isActive('/panel')}`}>
                        <Home className="nav-icon" />
                        <span>Inicio</span>
                    </a>
                    
                    <span className="nav-section-title">Maestros</span>
                    <a href="/clientes" className={`nav-item ${isActive('/clientes')}`}>
                        <Users className="nav-icon" />
                        <span>Clientes</span>
                    </a>
                    <a href="/proveedores" className={`nav-item ${isActive('/proveedores')}`}>
                        <Truck className="nav-icon" />
                        <span>Proveedores</span>
                    </a>
                    <a href="/localizaciones" className={`nav-item ${isActive('/localizaciones')}`}>
                        <Map className="nav-icon" />
                        <span>Localizaciones</span>
                    </a>

                    <span className="nav-section-title">Operaciones</span>
                    <a href="/pedidos" className={`nav-item ${isActive('/pedidos')}`}>
                        <Package className="nav-icon" />
                        <span>Pedidos</span>
                    </a>
                    <a href="/inventario" className={`nav-item ${isActive('/inventario')}`}>
                        <Box className="nav-icon" />
                        <span>Inventario</span>
                    </a>
                </nav>
                
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-button">
                        <LogOut className="nav-icon" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* 2. Wrapper del Contenido Principal */}
            <div className="main-content-wrapper">
                
                {/* 2a. Header (Barra Superior PERMANENTE) */}
                <header className="header">
                    <h1 className="header-title">{activeLink === '/panel' ? 'Inicio / Dashboard' : 'Clientes / Listado'}</h1>
                    <div className="user-info">
                        <span className="user-name">Hola, {user.nombre || 'Usuario'}</span>
                        <div className="user-avatar">{user.nombre ? user.nombre[0] : 'U'}</div>
                    </div>
                </header>
                
                {/* 2b. Área de Contenido DINÁMICO (Aquí se inserta Clientes o Panel) */}
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;