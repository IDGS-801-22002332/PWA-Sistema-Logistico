import React from 'react';
import { LogOut, Home, Users, Package, Map, Truck, Box } from 'lucide-react';
import './panel.css';

const user = JSON.parse(localStorage.getItem('user') || '{}');

const Panel = () => {
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="app-layout">
            
            {/* 1. Sidebar (Menú Lateral) */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <Truck className="sidebar-logo-icon" />
                    <span className="sidebar-logo-text">Logisys CRM</span>
                </div>
                
                <nav className="sidebar-nav">
                    <a href="/panel" className="nav-item active">
                        <Home className="nav-icon" />
                        <span>Inicio</span>
                    </a>
                    
                    <span className="nav-section-title">Maestros</span>
                    <a href="/clientes" className="nav-item">
                        <Users className="nav-icon" />
                        <span>Clientes</span>
                    </a>
                    <a href="/proveedores" className="nav-item">
                        <Truck className="nav-icon" />
                        <span>Proveedores</span>
                    </a>
                    <a href="/localizaciones" className="nav-item">
                        <Map className="nav-icon" />
                        <span>Localizaciones</span>
                    </a>

                    <span className="nav-section-title">Operaciones</span>
                    <a href="/pedidos" className="nav-item">
                        <Package className="nav-icon" />
                        <span>Pedidos</span>
                    </a>
                    <a href="/inventario" className="nav-item">
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

            {/* 2. Contenido Principal */}
            <div className="main-content-wrapper">
                
                {/* 2a. Header (Barra Superior) */}
                <header className="header">
                    <h1 className="header-title">Inicio / Dashboard</h1>
                    <div className="user-info">
                        <span className="user-name">Hola, {user.nombre || 'Usuario'}</span>
                        <div className="user-avatar">{user.nombre ? user.nombre[0] : 'U'}</div>
                    </div>
                </header>
                
                {/* 2b. Área de Contenido */}
                <main className="main-content">
                    <h2 className="content-title">Bienvenido al Panel Principal</h2>
                    <p className="content-text">
                        Aquí se mostrarán tus indicadores clave de desempeño (KPIs) y resúmenes de tus operaciones logísticas.
                    </p>
                    
                    {/* Puedes agregar tarjetas de resumen aquí */}
                    <div className="dashboard-grid">
                        <div className="card">Clientes Activos: 0</div>
                        <div className="card">Proveedores Globales: 0</div>
                        <div className="card">Pedidos en Curso: 0</div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Panel;