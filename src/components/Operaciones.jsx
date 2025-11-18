import React, { useState, useMemo } from 'react';
import { 
    Truck, Building2, User, Clock, MapPin, DollarSign, 
    List, Plus, Search, CheckCircle, Package, Ship, Plane, Bus, Settings, Calendar 
} from 'lucide-react';
import AppLayout from '../Layout/AppLayout';
import './operaciones.css'; 

const TipoServicioDisplay = { MARITIMO: 'Marítimo', AEREO: 'Aéreo', TERRESTRE: 'Terrestre' };
const IncotermDisplay = { FOB: 'FOB', CIF: 'CIF', DDP: 'DDP', EXW: 'EXW' };

const getServiceIcon = (tipo) => {
    switch (tipo) {
        case 'MARITIMO': return <Ship size={14} style={{ color: 'var(--primary)' }} />;
        case 'AEREO': return <Plane size={14} style={{ color: 'var(--info)' }} />;
        case 'TERRESTRE': return <Bus size={14} style={{ color: 'var(--secondary)' }} />;
        default: return <Truck size={14} />;
    }
};

const mockOperacionesData = [
    {
        id_operacion: 1001, 
        id_cotizacion: 9001,
        referencia_booking: "MSK9001-25",
        cliente_nombre: "Cliente Alfa S.A. (Ana Ruiz)", 
        usuario_ventas_nombre: "Juan Pérez",
        usuario_operativo_nombre: "Marta López (Op)",
        tipo_servicio: 'MARITIMO', incoterm: 'FOB', 
        origen_nombre: "Shenzhen, CN", destino_nombre: "Veracruz, MX",
        total_venta: 15000.00, moneda: 'USD', 
        fecha_salida_estimada: '2025-11-20',
        fecha_llegada_estimada: '2025-12-30',
        estatus_operacion: 'TRANSITO', 
        documentos_pendientes: 3, 
    },
    {
        id_operacion: 1002, 
        id_cotizacion: 9002,
        referencia_booking: "DHL850-26",
        cliente_nombre: "Distribuidora Beta (Luis Torres)", 
        usuario_ventas_nombre: "Ana García",
        usuario_operativo_nombre: "Carlos Ruiz (Op)",
        tipo_servicio: 'AEREO', incoterm: 'DDP', 
        origen_nombre: "Miami, US", destino_nombre: "Ciudad de México",
        total_venta: 850.50, moneda: 'USD', 
        fecha_salida_estimada: '2025-08-05',
        fecha_llegada_estimada: '2025-08-15',
        estatus_operacion: 'ENTREGADA',
        documentos_pendientes: 0, 
    },
    {
        id_operacion: 1003, 
        id_cotizacion: 9003,
        referencia_booking: "TRMX-4500",
        cliente_nombre: "Cliente Alfa S.A. (Ana Ruiz)", 
        usuario_ventas_nombre: "Luis Martínez",
        usuario_operativo_nombre: "Marta López (Op)",
        tipo_servicio: 'TERRESTRE', incoterm: 'EXW', 
        origen_nombre: "Monterrey, MX", destino_nombre: "Laredo, US",
        total_venta: 4500.00, moneda: 'MXN', 
        fecha_salida_estimada: '2025-10-10',
        fecha_llegada_estimada: '2025-10-12',
        estatus_operacion: 'EN_ORIGEN',
        documentos_pendientes: 1, 
    },
];

const getStatusOperacionDisplay = (status) => {
    switch (status) {
        case 'ENTREGADA':
            return { text: 'Completada', color: 'var(--success)', icon: <CheckCircle size={16} /> };
        case 'TRANSITO':
            return { text: 'En Tránsito', color: 'var(--info)', icon: <Truck size={16} /> };
        case 'EN_ORIGEN':
            return { text: 'En Origen', color: '#f59e0b', icon: <MapPin size={16} /> }; 
        case 'PENDIENTE_DOC':
        default:
            return { text: 'Pend. Docs', color: 'var(--danger)', icon: <Package size={16} /> }; 
    }
};


const OperacionCard = ({ operacion, onAction }) => {
    const status = getStatusOperacionDisplay(operacion.estatus_operacion);

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
            {/* COLUMNA PRINCIPAL (3/4) - DETALLES LOGÍSTICOS */}
            <div style={{ padding: '1.5rem', borderRight: '1px solid #e5e7eb' }}>
                
                {/* 1. HEADER DE LA TARJETA */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                        <Settings size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                        Operación **#{operacion.id_operacion}** | Booking: **{operacion.referencia_booking}**
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

                {/* 2. DETALLES CLAVE EN GRID INTERNO */}
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    
                    {/* Fila 1: Cliente y Encargado Operativo */}
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Cliente (Cotización #{operacion.id_cotizacion})</label>
                        <p style={{ margin: 0, fontWeight: 600 }}><Building2 size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />{operacion.cliente_nombre}</p>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Encargado Operativo</label>
                        <p style={{ margin: 0, fontSize: '0.95rem' }}><User size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />{operacion.usuario_operativo_nombre}</p>
                    </div>

                    {/* Fila 2: Servicio, Ruta */}
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Servicio ({operacion.incoterm})</label>
                        <p style={{ margin: 0 }}>
                            {getServiceIcon(operacion.tipo_servicio)}
                            **{TipoServicioDisplay[operacion.tipo_servicio]}**
                            <span style={{ marginLeft: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <Package size={14} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                                {operacion.documentos_pendientes} Docs Pendientes
                            </span>
                        </p>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Ruta</label>
                        <p style={{ margin: 0, fontWeight: 600 }}><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '5px', color: 'var(--primary)' }} />{operacion.origen_nombre} → {operacion.destino_nombre}</p>
                    </div>
                </div>
            </div>

            {/* COLUMNA LATERAL (1/4) - RESUMEN RÁPIDO Y ACCIONES */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                
                {/* Resumen Financiero Rápido */}
                <div style={{ textAlign: 'center', width: '100%', marginBottom: '1rem' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Total Venta</label>
                    <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)', margin: '0.2rem 0 0.5rem' }}>
                        {operacion.moneda} {operacion.total_venta.toFixed(2)}
                    </p>
                    
                    {/* Indicadores de Fechas */}
                    <div style={{ fontSize: '0.9rem', color: 'var(--info)', fontWeight: 600 }}>
                        <Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                        Salida Est: {operacion.fecha_salida_estimada}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--danger)', fontWeight: 600, marginTop: '0.5rem' }}>
                        <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                        Llegada Est: {operacion.fecha_llegada_estimada}
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="form-actions" style={{ paddingTop: '0', borderTop: 'none', justifyContent: 'center', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" onClick={() => onAction('view', operacion)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        <List size={18} /> Ver Tracking
                    </button>
                    <button className="btn btn-primary" onClick={() => onAction('update', operacion)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        <Settings size={18} /> Gestionar
                    </button>
                </div>

            </div>
        </div>
    );
};

const Operaciones = () => {
    const [operaciones] = useState(mockOperacionesData);
    const [searchTerm, setSearchTerm] = useState("");
    
    const filteredOperaciones = useMemo(() => {
        if (!searchTerm) return operaciones;
        return operaciones.filter((o) =>
            `${o.id_operacion} ${o.referencia_booking} ${o.cliente_nombre} ${o.usuario_operativo_nombre} ${TipoServicioDisplay[o.tipo_servicio]} ${o.origen_nombre} ${o.destino_nombre}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [operaciones, searchTerm]);

    const handleAction = (action, operacion) => {
        if (action === 'new') {
            alert('Abriendo formulario para crear Operación desde Cotización...');
        } else if (action === 'view') {
            alert(`Navegando a la vista de TRACKING de Operación #${operacion.id_operacion}`);
        } else if (action === 'update') {
            alert(`Abriendo el panel de GESTIÓN de Operación #${operacion.id_operacion}`);
        }
    };

    return (
        <AppLayout activeLink="/operaciones">
            <div className="agents-container"> 
                
                {/* HEADER Y CONTROLES */}
                <h1 className="agents-title">
                    Listado General de Operaciones
                </h1>
                <p className="agents-subtitle">
                    Seguimiento en tiempo real y gestión de las operaciones logísticas activas.
                </p>

                <div className="agents-controls" style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem' }}>
                    <div className="search-bar-wrapper">
                        <div className="search-icon-left">
                            <Search className="search-icon" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por ID, Booking, Cliente, Operativo, Ruta..."
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
                        Crear Nueva Operación
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
                    {filteredOperaciones.length > 0 ? (
                        filteredOperaciones.map((o) => (
                            <OperacionCard 
                                key={o.id_operacion} 
                                operacion={o} 
                                onAction={handleAction} 
                            />
                        ))
                    ) : (
                        <div className="table-empty-state" style={{ padding: '3rem', fontSize: '1.1rem', textAlign: 'center' }}>
                            No se encontraron operaciones que coincidan con la búsqueda.
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
};

export default Operaciones;