import React, { useState, useMemo } from 'react';
import { FileText, Building2, User, Truck, Calendar, DollarSign, MapPin, List, Plus, Search, Clock, Activity, Edit, Box, Factory, Briefcase, Plane, Ship, Bus} from 'lucide-react';
import AppLayout from '../Layout/AppLayout';
import './cotizaciones.css'; 

const TipoServicioDisplay = { MARITIMO: 'Marítimo', AEREO: 'Aéreo', TERRESTRE: 'Terrestre' };
const TipoCargaDisplay = { FCL: 'Cont. Completo (FCL)', LCL: 'Cont. Parcial (LCL)', CARGA_SUELTA: 'Carga Suelta' };
const IncotermDisplay = { FOB: 'FOB', CIF: 'CIF', DDP: 'DDP', EXW: 'EXW' };
const getServiceIcon = (tipo) => {
    switch (tipo) {
        case 'MARITIMO': return <Ship size={14} style={{ color: 'var(--primary)' }} />;
        case 'AEREO': return <Plane size={14} style={{ color: 'var(--info)' }} />;
        case 'TERRESTRE': return <Bus size={14} style={{ color: 'var(--secondary)' }} />;
        default: return <Truck size={14} />;
    }
};

const mockCotizacionesData = [
    {
        id_cotizacion: 9001,
        id_cliente: 1, cliente_nombre: "Cliente Alfa S.A. (Ana Ruiz)",
        usuario_ventas_nombre: "Juan Pérez (Ventas)",
        tipo_servicio: 'MARITIMO', tipo_carga: 'FCL', incoterm: 'FOB',
        origen_nombre: "Shenzhen, CN", destino_nombre: "Veracruz, MX",
        proveedor_nombre: "Maersk Lines", id_proveedor: 10,
        agente_nombre: "Agente Aduanal S.C.", id_agente: 101,
        precio_final: 15000.00, moneda: 'USD',
        fecha_vigencia: '2025-11-25', 
        fecha_creacion: '2025-10-15',
        fecha_estimada_arribo: '2025-12-30',
        estatus: 'enviada', 
        total_actividades_pendientes: 2,
    },
    {
        id_cotizacion: 9002,
        id_cliente: 2, cliente_nombre: "Distribuidora Beta (Luis Torres)",
        usuario_ventas_nombre: "Ana García (Ventas)",
        tipo_servicio: 'AEREO', tipo_carga: 'CARGA_SUELTA', incoterm: 'DDP',
        origen_nombre: "Miami, US", destino_nombre: "Ciudad de México",
        proveedor_nombre: "DHL Cargo", id_proveedor: 20,
        agente_nombre: null, id_agente: null,
        precio_final: 850.50, moneda: 'USD',
        fecha_vigencia: '2026-03-10',
        fecha_creacion: '2025-08-01',
        fecha_estimada_arribo: '2025-08-15',
        estatus: 'aprobada',
        total_actividades_pendientes: 0,
    },
    {
        id_cotizacion: 9003,
        id_cliente: 1, cliente_nombre: "Cliente Alfa S.A. (Ana Ruiz)",
        usuario_ventas_nombre: "Luis Martínez (Ventas)",
        tipo_servicio: 'TERRESTRE', tipo_carga: 'LCL', incoterm: 'EXW',
        origen_nombre: "Monterrey, MX", destino_nombre: "Laredo, US",
        proveedor_nombre: "Transportes MX", id_proveedor: 30,
        agente_nombre: "Agente Aduanal S.C.", id_agente: 101,
        precio_final: 4500.00, moneda: 'MXN',
        fecha_vigencia: '2025-10-17',
        fecha_creacion: '2025-10-10',
        fecha_estimada_arribo: '2025-10-12',
        estatus: 'rechazada',
        motivo_rechazo: 'Precio excedido',
        total_actividades_pendientes: 0,
    },
];

const getStatusDisplay = (status) => {
    switch (status) {
        case 'aprobada':
            return { text: 'Aprobada', color: 'var(--success)', icon: <List size={16} /> };
        case 'rechazada':
            return { text: 'Rechazada', color: 'var(--danger)', icon: <Clock size={16} /> };
        case 'enviada':
            return { text: 'Enviada', color: 'var(--info)', icon: <Activity size={16} /> };
        case 'caducada':
            return { text: 'Caducada', color: 'var(--danger)', icon: <Clock size={16} /> };
        case 'pendiente':
        default:
            return { text: 'Pendiente', color: '#f59e0b', icon: <Activity size={16} /> };
    }
};

const CotizacionCard = ({ cotizacion, onAction }) => {
    const status = getStatusDisplay(cotizacion.estatus);

    return (
        <div
            className="client-form-card"
            style={{
                padding: '0',
                marginBottom: '1.5rem',
                boxShadow: 'var(--shadow-lg)',
                borderLeft: `6px solid ${status.color}`,
                display: 'grid',
                gridTemplateColumns: '3fr 1fr',
            }}
        >
            <div style={{ padding: '1.5rem', borderRight: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                        <FileText size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                        Cotización **#{cotizacion.id_cotizacion}**
                    </h4>
                    <span
                        style={{
                            fontSize: '0.85rem',
                            color: status.color,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        {status.icon} {status.text.toUpperCase()}
                    </span>
                </div>
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Cliente (Creada: {cotizacion.fecha_creacion})</label>
                        <p style={{ margin: 0, fontWeight: 600 }}><Building2 size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />{cotizacion.cliente_nombre}</p>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Vendedor</label>
                        <p style={{ margin: 0, fontSize: '0.95rem' }}><User size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />{cotizacion.usuario_ventas_nombre}</p>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Servicio ({cotizacion.incoterm})</label>
                        <p style={{ margin: 0 }}>
                            {getServiceIcon(cotizacion.tipo_servicio)}
                            **{TipoServicioDisplay[cotizacion.tipo_servicio]}**
                            <span style={{ marginLeft: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <Box size={14} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                                {TipoCargaDisplay[cotizacion.tipo_carga]}
                            </span>
                        </p>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Ruta</label>
                        <p style={{ margin: 0, fontWeight: 600 }}><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '5px', color: 'var(--primary)' }} />{cotizacion.origen_nombre} → {cotizacion.destino_nombre}</p>
                    </div>
                    <div className="form-group" style={{ margin: 0, marginTop: '1rem' }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Proveedor</label>
                        <p style={{ margin: 0, fontSize: '0.95rem' }}><Factory size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />{cotizacion.proveedor_nombre}</p>
                    </div>
                    <div className="form-group" style={{ margin: 0, marginTop: '1rem' }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Agente Aduanal</label>
                        <p style={{ margin: 0, fontSize: '0.95rem', color: cotizacion.agente_nombre ? 'var(--text-primary)' : 'var(--danger)' }}><Briefcase size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />{cotizacion.agente_nombre || 'No Asignado'}</p>
                    </div>

                </div>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', width: '100%', marginBottom: '1rem' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Total Cotizado</label>
                    <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)', margin: '0.2rem 0 0.5rem' }}>
                        {cotizacion.moneda} {cotizacion.precio_final.toFixed(2)}
                    </p>
                    <div style={{ fontSize: '0.9rem', color: 'var(--danger)', fontWeight: 600 }}>
                        <Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                        Vence: {cotizacion.fecha_vigencia}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.5rem' }}>
                        <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                        ETA: {cotizacion.fecha_estimada_arribo || 'N/A'}
                    </div>
                </div>
                <div className="form-actions" style={{ paddingTop: '0', borderTop: 'none', justifyContent: 'center', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" onClick={() => onAction('view', cotizacion)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        <List size={18} /> Ver Detalle
                    </button>
                    <button className="btn btn-primary" onClick={() => onAction('edit', cotizacion)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        <Edit size={18} /> Editar
                    </button>
                </div>

            </div>
        </div>
    );
};

const Cotizaciones = () => {
    const [cotizaciones] = useState(mockCotizacionesData);
    const [searchTerm, setSearchTerm] = useState("");
    const filteredCotizaciones = useMemo(() => {
        if (!searchTerm) return cotizaciones;
        return cotizaciones.filter((c) =>
            `${c.id_cotizacion} ${c.cliente_nombre} ${c.usuario_ventas_nombre} ${TipoServicioDisplay[c.tipo_servicio]} ${c.origen_nombre} ${c.destino_nombre} ${c.proveedor_nombre} ${c.agente_nombre}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [cotizaciones, searchTerm]);

    const handleAction = (action, cotizacion) => {
        if (action === 'new') {
            alert('Abriendo formulario para Nueva Cotización...');
        } else if (action === 'view') {
            alert(`Navegando a la vista de DETALLE de Cotización #${cotizacion.id_cotizacion}`);
        } else if (action === 'edit') {
            alert(`Abriendo el formulario de EDICIÓN para Cotización #${cotizacion.id_cotizacion}`);
        }
    };

    return (
        <AppLayout activeLink="/cotizaciones">
            <div className="agents-container">
                <h1 className="agents-title">
                    Listado General de Cotizaciones
                </h1>
                <p className="agents-subtitle">
                    Administra y da seguimiento a todas las cotizaciones creadas.
                </p>

                <div className="agents-controls" style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem' }}>
                    <div className="search-bar-wrapper">
                        <div className="search-icon-left">
                            <Search className="search-icon" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por ID, Cliente, Vendedor, Ruta..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <button
                        onClick={() => handleAction('new', null)}
                        className="btn btn-primary"
                    >
                        <Plus size={20} />
                        Crear Nueva Cotización
                    </button>
                </div>

                {/* LISTADO DE TARJETAS */}
                <div
                    className="cotizaciones-list-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '1.5rem',
                    }}
                >
                    {filteredCotizaciones.length > 0 ? (
                        filteredCotizaciones.map((c) => (
                            <CotizacionCard
                                key={c.id_cotizacion}
                                cotizacion={c}
                                onAction={handleAction}
                            />
                        ))
                    ) : (
                        <div className="table-empty-state" style={{ padding: '3rem', fontSize: '1.1rem', textAlign: 'center' }}>
                            No se encontraron cotizaciones que coincidan con la búsqueda.
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
};

export default Cotizaciones;