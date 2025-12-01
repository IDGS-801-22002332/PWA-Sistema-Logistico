import React, { useState, useEffect } from 'react';
import AppLayout from "../Layout/AppLayout";
import { Users, Truck, Package, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign, BarChart3, PieChart, Globe, Building2, UserCheck, Timer, MapPin, FileText, Calendar, Ship, Plane, XCircle, Briefcase, UserCog, BadgePercent } from 'lucide-react';
import { apiGet } from '../services/api';

const PanelPrincipal = () => {
    // Estados para los datos del dashboard
    const [dashboardData, setDashboardData] = useState({
        clientes: [],
        proveedores: [],
        operaciones: [],
        cotizaciones: [],
        usuarios: [],
        solicitudes: [],
        agentes: []
    });

    const [loading, setLoading] = useState(true);
    const [kpis, setKpis] = useState({});

    // Cargar datos del backend
    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const [
                    clientesData, 
                    proveedoresData, 
                    operacionesData, 
                    cotizacionesData, 
                    usuariosData,
                    solicitudesData,
                    agentesData
                ] = await Promise.allSettled([
                    apiGet('/clientes').catch(() => []),
                    apiGet('/proveedores').catch(() => []),
                    apiGet('/operaciones').catch(() => []),
                    apiGet('/cotizaciones').catch(() => []),
                    apiGet('/usuarios').catch(() => []),
                    apiGet('/solicitudes').catch(() => []),
                    apiGet('/agentes').catch(() => [])
                ]);

                const data = {
                    clientes: clientesData.status === 'fulfilled' ? clientesData.value : [],
                    proveedores: proveedoresData.status === 'fulfilled' ? proveedoresData.value : [],
                    operaciones: operacionesData.status === 'fulfilled' ? operacionesData.value : [],
                    cotizaciones: cotizacionesData.status === 'fulfilled' ? cotizacionesData.value : [],
                    usuarios: usuariosData.status === 'fulfilled' ? usuariosData.value : [],
                    solicitudes: solicitudesData.status === 'fulfilled' ? solicitudesData.value : [],
                    agentes: agentesData.status === 'fulfilled' ? agentesData.value : []
                };

                setDashboardData(data);
                calculateKPIs(data);

            } catch (error) {
                console.error('Error cargando datos del dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    // Función para calcular KPIs
    const calculateKPIs = (data) => {
        const { clientes, proveedores, operaciones, cotizaciones, usuarios, solicitudes, agentes } = data;

        // KPIs básicos
        const clientesActivos = clientes.filter(c => c.activo !== false).length;
        const proveedoresActivos = proveedores.length;
        
        // KPIs de operaciones
        const operacionesActivas = operaciones.length;
        const operacionesPorEstatus = operaciones.reduce((acc, op) => {
            const estatus = op.estatus || 'pendiente_documentos';
            acc[estatus] = (acc[estatus] || 0) + 1;
            return acc;
        }, {});

        // KPIs de cotizaciones
        const cotizacionesTotales = cotizaciones.length;
        const cotizacionesPorEstatus = cotizaciones.reduce((acc, cot) => {
            const estatus = cot.estatus || 'pendiente';
            acc[estatus] = (acc[estatus] || 0) + 1;
            return acc;
        }, {});

        // KPIs de usuarios por rol
        const usuariosPorRol = usuarios.reduce((acc, user) => {
            const rol = user.rol || 'sin_rol';
            acc[rol] = (acc[rol] || 0) + 1;
            return acc;
        }, {});

        // KPIs de solicitudes
        const solicitudesTotales = solicitudes.length;
        const solicitudesPorEstatus = solicitudes.reduce((acc, sol) => {
            const estatus = sol.estatus || 'pendiente';
            acc[estatus] = (acc[estatus] || 0) + 1;
            return acc;
        }, {});

        // Ratios y métricas calculadas
        const ratioClienteProveedor = proveedoresActivos > 0 ? (clientesActivos / proveedoresActivos).toFixed(2) : 0;
        const tasaConversionCotizaciones = cotizacionesTotales > 0 ? 
            ((cotizacionesPorEstatus.aprobada || 0) / cotizacionesTotales * 100).toFixed(1) : 0;
        
        // Eficiencia operativa
        const operacionesEntregadas = operacionesPorEstatus.entregado || 0;
        const tasaEntrega = operacionesActivas > 0 ? 
            (operacionesEntregadas / operacionesActivas * 100).toFixed(1) : 0;

        // Operaciones por tipo de servicio
        const operacionesPorTipoServicio = operaciones.reduce((acc, op) => {
            const tipo = op.tipo_servicio || 'terrestre';
            acc[tipo] = (acc[tipo] || 0) + 1;
            return acc;
        }, {});

        setKpis({
            clientesActivos,
            proveedoresActivos,
            operacionesActivas,
            operacionesPorEstatus,
            cotizacionesTotales,
            cotizacionesPorEstatus,
            usuariosPorRol,
            solicitudesTotales,
            solicitudesPorEstatus,
            ratioClienteProveedor,
            tasaConversionCotizaciones,
            tasaEntrega,
            operacionesPorTipoServicio,
            agentesTotales: agentes.length
        });
    };

    if (loading) {
        return (
            <AppLayout activeLink="/panel">
                <div className="agents-container">
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <Activity className="animate-spin" size={48} style={{ color: 'var(--primary)' }} />
                        <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>Cargando dashboard...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout activeLink="/panel">
            <div className="agents-container">
                <h2 className="content-title">Dashboard Ejecutivo - Sistema Logístico</h2>
                <p className="agents-subtitle">Métricas clave de desempeño y análisis operativo en tiempo real</p>

                {/* KPIs Principales */}
                <h3 className="content-title" style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>
                    <BarChart3 size={24} style={{ verticalAlign: 'bottom', marginRight: '0.5rem' }} />
                    Indicadores Clave de Desempeño (KPIs)
                </h3>

                <div className="dashboard-grid">
                    <div className="card-kpi">
                        <h3 className="card-title">Clientes Activos</h3>
                        <p className="card-value">{kpis.clientesActivos || 0}</p>
                        <Users className="card-icon" />
                        <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            Base de clientes registrados
                        </small>
                    </div>

                    <div className="card-kpi">
                        <h3 className="card-title">Proveedores Globales</h3>
                        <p className="card-value">{kpis.proveedoresActivos || 0}</p>
                        <Building2 className="card-icon" />
                        <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            Red de proveedores activos
                        </small>
                    </div>

                    <div className="card-kpi">
                        <h3 className="card-title">Operaciones Activas</h3>
                        <p className="card-value">{kpis.operacionesActivas || 0}</p>
                        <Package className="card-icon" />
                        <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            En proceso de gestión
                        </small>
                    </div>

                    <div className="card-kpi">
                        <h3 className="card-title">Tasa de Entrega</h3>
                        <p className="card-value">{kpis.tasaEntrega || 0}%</p>
                        <CheckCircle className="card-icon" />
                        <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            Operaciones completadas exitosamente
                        </small>
                    </div>
                </div>

                {/* Métricas Operativas */}
                <h3 className="content-title" style={{ fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem' }}>
                    <Activity size={22} style={{ verticalAlign: 'bottom', marginRight: '0.5rem' }} />
                    Resumen Operativo
                </h3>

                <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
                    <div className="card-kpi" style={{ gridColumn: 'span 1' }}>
                        <h3 className="card-title">Estado de Operaciones</h3>
                        <div style={{ fontSize: '1rem', marginTop: '10px', lineHeight: '1.6' }}>
                            <div className="kpi-list-item">
                                <span>
                                    <Clock size={16} className="kpi-icon warning" /> Pendiente Docs:
                                </span> 
                                <strong>{kpis.operacionesPorEstatus?.pendiente_documentos || 0}</strong>
                            </div>
                            <div className="kpi-list-item">
                                <span>
                                    <Truck size={16} className="kpi-icon info" /> En Tránsito:
                                </span> 
                                <strong>{kpis.operacionesPorEstatus?.en_transito || 0}</strong>
                            </div>
                            <div className="kpi-list-item">
                                <span>
                                    <Building2 size={16} className="kpi-icon primary" /> En Aduana:
                                </span> 
                                <strong>{kpis.operacionesPorEstatus?.en_aduana || 0}</strong>
                            </div>
                            <div className="kpi-list-item">
                                <span>
                                    <CheckCircle size={16} className="kpi-icon success" /> Entregadas:
                                </span> 
                                <strong style={{ color: 'var(--success)' }}>{kpis.operacionesPorEstatus?.entregado || 0}</strong>
                            </div>
                            <div className="kpi-list-item">
                                <span>
                                    <XCircle size={16} className="kpi-icon danger" /> Canceladas:
                                </span> 
                                <strong style={{ color: 'var(--danger)' }}>{kpis.operacionesPorEstatus?.cancelado || 0}</strong>
                            </div>
                        </div>
                        <Activity className="card-icon" style={{ opacity: 0.1 }} />
                    </div>

                    <div className="card-kpi" style={{ gridColumn: 'span 1' }}>
                        <h3 className="card-title">Distribución por Servicio</h3>
                        <div style={{ fontSize: '1rem', marginTop: '10px', lineHeight: '1.6' }}>
                            <div className="kpi-list-item">
                                <span>
                                    <Ship size={16} className="kpi-icon primary" /> Marítimo:
                                </span> 
                                <strong>{kpis.operacionesPorTipoServicio?.maritimo || 0}</strong>
                            </div>
                            <div className="kpi-list-item">
                                <span>
                                    <Plane size={16} className="kpi-icon info" /> Aéreo:
                                </span> 
                                <strong>{kpis.operacionesPorTipoServicio?.aereo || 0}</strong>
                            </div>
                            <div className="kpi-list-item">
                                <span>
                                    <Truck size={16} className="kpi-icon secondary" /> Terrestre:
                                </span> 
                                <strong>{kpis.operacionesPorTipoServicio?.terrestre || 0}</strong>
                            </div>
                        </div>
                        <Globe className="card-icon" style={{ opacity: 0.1 }} />
                    </div>
                </div>

                {/* Métricas Comerciales */}
                <h3 className="content-title" style={{ fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem' }}>
                    <Briefcase size={22} style={{ verticalAlign: 'bottom', marginRight: '0.5rem' }} />
                    Métricas Comerciales y Gestión
                </h3>

                <div className="dashboard-grid">
                    <div className="card-kpi">
                        <h3 className="card-title">Cotizaciones Totales</h3>
                        <p className="card-value">{kpis.cotizacionesTotales || 0}</p>
                        <FileText className="card-icon" />
                        <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            Oportunidades comerciales
                        </small>
                    </div>

                    <div className="card-kpi">
                        <h3 className="card-title">Tasa Conversión</h3>
                        <p className="card-value">{kpis.tasaConversionCotizaciones || 0}%</p>
                        <TrendingUp className="card-icon" />
                        <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            Cotizaciones aprobadas
                        </small>
                    </div>

                    <div className="card-kpi">
                        <h3 className="card-title">Solicitudes Activas</h3>
                        <p className="card-value">{kpis.solicitudesTotales || 0}</p>
                        <Clock className="card-icon" />
                        <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            Requerimientos de clientes
                        </small>
                    </div>

                    <div className="card-kpi">
                        <h3 className="card-title">Ratio Cliente/Proveedor</h3>
                        <p className="card-value">{kpis.ratioClienteProveedor || 0}</p>
                        <BarChart3 className="card-icon" />
                        <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            Balance de red comercial
                        </small>
                    </div>
                </div>

                {/* Recursos Humanos y Organización */}
                <h3 className="content-title" style={{ fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem' }}>
                    <Users size={22} style={{ verticalAlign: 'bottom', marginRight: '0.5rem' }} />
                    Recursos y Organización
                </h3>

                <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    <div className="card-kpi" style={{ gridColumn: 'span 1' }}>
                        <h3 className="card-title">Equipo de Trabajo</h3>
                        <div style={{ fontSize: '1rem', marginTop: '10px', lineHeight: '1.6' }}>
                            <div className="kpi-list-item">
                                <span>
                                    <UserCog size={16} className="kpi-icon primary" /> Administradores:
                                </span> 
                                <strong>{kpis.usuariosPorRol?.admin || 0}</strong>
                            </div>
                            <div className="kpi-list-item">
                                <span>
                                    <BadgePercent size={16} className="kpi-icon success" /> Equipo Ventas:
                                </span> 
                                <strong>{kpis.usuariosPorRol?.ventas || 0}</strong>
                            </div>
                            <div className="kpi-list-item">
                                <span>
                                    <Activity size={16} className="kpi-icon info" /> Equipo Operaciones:
                                </span> 
                                <strong>{kpis.usuariosPorRol?.operaciones || 0}</strong>
                            </div>
                            <div className="kpi-list-item">
                                <span>
                                    <Users size={16} className="kpi-icon secondary" /> Usuarios Cliente:
                                </span> 
                                <strong>{kpis.usuariosPorRol?.cliente || 0}</strong>
                            </div>
                        </div>
                        <UserCheck className="card-icon" style={{ opacity: 0.1 }} />
                    </div>

                    <div className="card-kpi" style={{ gridColumn: 'span 1' }}>
                        <h3 className="card-title">Red de Agentes</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '20px', marginBottom: '10px' }}>
                            {kpis.agentesTotales || 0}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Agentes aduanales disponibles para operaciones internacionales
                        </div>
                        <MapPin className="card-icon" style={{ opacity: 0.1 }} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default PanelPrincipal;