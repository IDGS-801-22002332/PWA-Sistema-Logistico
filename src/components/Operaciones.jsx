import React, { useState, useMemo } from 'react';
import {
    Truck, Building2, User, Clock, MapPin, DollarSign, List, Plus, Search,
    CheckCircle, Package, Ship, Plane, Bus, Settings, Calendar, Save, X, Trash2
} from 'lucide-react';
import AppLayout from '../Layout/AppLayout';
import './operaciones.css';

const TipoServicioDisplay = { MARITIMO: 'Marítimo', AEREO: 'Aéreo', TERRESTRE: 'Terrestre' };
const IncotermDisplay = { FOB: 'FOB', CIF: 'CIF', DDP: 'DDP', EXW: 'EXW' };

const getServiceIcon = (tipo) => {
    switch (tipo) {
        case 'MARITIMO': return <Ship size={14} style={{ color: 'var(--primary)', verticalAlign: 'middle', marginRight: 6 }} />;
        case 'AEREO': return <Plane size={14} style={{ color: 'var(--secondary)', verticalAlign: 'middle', marginRight: 6 }} />;
        case 'TERRESTRE': return <Bus size={14} style={{ color: 'var(--primary)', verticalAlign: 'middle', marginRight: 6 }} />;
        default: return <Truck size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />;
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
            return { text: 'En Tránsito', color: '#06B6D4', icon: <Truck size={16} /> };
        case 'EN_ORIGEN':
            return { text: 'En Origen', color: '#f59e0b', icon: <MapPin size={16} /> };
        case 'PENDIENTE_DOC':
        default:
            return { text: 'Pend. Docs', color: 'var(--danger)', icon: <Package size={16} /> };
    }
};

/* Operacion Form - agregar / editar */
export const OperacionForm = ({ selectedOperacion, formData, handleFormChange, handleFormSubmit, closeForm }) => (
    <div className="client-form-card">
        <h2 className="form-card-title">
            {selectedOperacion ? "Editar Operación" : "Nueva Operación"}
        </h2>

        <form onSubmit={handleFormSubmit} className="form-content">
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label" htmlFor="referencia_booking">Referencia / Booking*</label>
                    <input id="referencia_booking" name="referencia_booking" value={formData.referencia_booking} onChange={handleFormChange} className="form-input" required />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="id_cotizacion">ID Cotización</label>
                    <input id="id_cotizacion" name="id_cotizacion" value={formData.id_cotizacion} onChange={handleFormChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="cliente_nombre">Cliente*</label>
                    <input id="cliente_nombre" name="cliente_nombre" value={formData.cliente_nombre} onChange={handleFormChange} className="form-input" required />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="usuario_operativo_nombre">Encargado Operativo</label>
                    <input id="usuario_operativo_nombre" name="usuario_operativo_nombre" value={formData.usuario_operativo_nombre} onChange={handleFormChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="tipo_servicio">Tipo Servicio</label>
                    <select id="tipo_servicio" name="tipo_servicio" value={formData.tipo_servicio} onChange={handleFormChange} className="form-select">
                        <option value="MARITIMO">Marítimo</option>
                        <option value="AEREO">Aéreo</option>
                        <option value="TERRESTRE">Terrestre</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="incoterm">Incoterm</label>
                    <select id="incoterm" name="incoterm" value={formData.incoterm} onChange={handleFormChange} className="form-select">
                        <option value="FOB">FOB</option>
                        <option value="CIF">CIF</option>
                        <option value="DDP">DDP</option>
                        <option value="EXW">EXW</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="origen_nombre">Origen</label>
                    <input id="origen_nombre" name="origen_nombre" value={formData.origen_nombre} onChange={handleFormChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="destino_nombre">Destino</label>
                    <input id="destino_nombre" name="destino_nombre" value={formData.destino_nombre} onChange={handleFormChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="total_venta">Total Venta</label>
                    <input type="number" step="0.01" id="total_venta" name="total_venta" value={formData.total_venta} onChange={handleFormChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="moneda">Moneda</label>
                    <input id="moneda" name="moneda" value={formData.moneda} onChange={handleFormChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="fecha_salida_estimada">Fecha Salida Est.</label>
                    <input type="date" id="fecha_salida_estimada" name="fecha_salida_estimada" value={formData.fecha_salida_estimada} onChange={handleFormChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="fecha_llegada_estimada">Fecha Llegada Est.</label>
                    <input type="date" id="fecha_llegada_estimada" name="fecha_llegada_estimada" value={formData.fecha_llegada_estimada} onChange={handleFormChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="estatus_operacion">Estatus</label>
                    <select id="estatus_operacion" name="estatus_operacion" value={formData.estatus_operacion} onChange={handleFormChange} className="form-select">
                        <option value="PENDIENTE_DOC">Pend. Docs</option>
                        <option value="EN_ORIGEN">En Origen</option>
                        <option value="TRANSITO">En Tránsito</option>
                        <option value="ENTREGADA">Entregada</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="documentos_pendientes">Docs Pendientes</label>
                    <input type="number" id="documentos_pendientes" name="documentos_pendientes" value={formData.documentos_pendientes} onChange={handleFormChange} className="form-input" min="0" />
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeForm}>
                    <X size={18} /> Cancelar
                </button>

                <button type="submit" className="btn btn-primary">
                    <Save size={18} /> {selectedOperacion ? "Actualizar Operación" : "Guardar Operación"}
                </button>
            </div>
        </form>
    </div>
);

/* Banner confirmación eliminar */
export const DeleteOperacionConfirm = ({ selectedOperacion, deleteOperacion, cancel }) => (
    <div className="delete-confirm-banner">
        <div className="banner-icon-message">
            <Trash2 size={24} className="banner-icon" />
            <p>
                ¿Seguro que deseas eliminar la operación <strong>#{selectedOperacion?.id_operacion}</strong> (Booking: {selectedOperacion?.referencia_booking})?
            </p>
        </div>

        <div className="banner-actions">
            <button className="btn btn-secondary" onClick={cancel}>
                <X size={16} /> Cancelar
            </button>

            <button className="btn btn-danger" onClick={deleteOperacion}>
                <Trash2 size={16} /> Confirmar Eliminación
            </button>
        </div>
    </div>
);

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
            <div style={{ padding: '1.5rem', borderRight: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                        <Settings size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                        Operación <strong>#{operacion.id_operacion}</strong> | Booking: <strong>{operacion.referencia_booking}</strong>
                    </h4>
                    <span
                        style={{
                            fontSize: '0.85rem',
                            color: status.color,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        }}
                    >
                        {status.icon} {status.text.toUpperCase()}
                    </span>
                </div>

                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Cliente (Cotización #{operacion.id_cotizacion})</label>
                        <p style={{ margin: 0, fontWeight: 600 }}><Building2 size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />{operacion.cliente_nombre}</p>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Encargado Operativo</label>
                        <p style={{ margin: 0, fontSize: '0.95rem' }}><User size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />{operacion.usuario_operativo_nombre}</p>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Servicio ({operacion.incoterm})</label>
                        <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                            {getServiceIcon(operacion.tipo_servicio)}
                            <strong>{TipoServicioDisplay[operacion.tipo_servicio]}</strong>
                            <span style={{ marginLeft: 'auto', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Package size={14} /> {operacion.documentos_pendientes} Docs
                            </span>
                        </p>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Ruta</label>
                        <p style={{ margin: 0, fontWeight: 600 }}><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: 6, color: 'var(--primary)' }} />{operacion.origen_nombre} → {operacion.destino_nombre}</p>
                    </div>
                </div>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', width: '100%', marginBottom: '1rem' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Total Venta</label>
                    <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)', margin: '0.2rem 0 0.5rem' }}>
                        {operacion.moneda} {Number(operacion.total_venta).toFixed(2)}
                    </p>
                    <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>
                        <Calendar size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                        Salida Est: {operacion.fecha_salida_estimada}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--danger)', fontWeight: 600, marginTop: '0.5rem' }}>
                        <Clock size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                        Llegada Est: {operacion.fecha_llegada_estimada}
                    </div>
                </div>

                <div className="form-actions" style={{ paddingTop: 0, borderTop: 'none', justifyContent: 'center', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" onClick={() => onAction('view', operacion)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        <List size={18} /> Ver Tracking
                    </button>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary" onClick={() => onAction('edit', operacion)} style={{ padding: '0.45rem 0.8rem' }}>
                            <Settings size={16} /> Gestionar
                        </button>
                        <button className="btn btn-danger" onClick={() => onAction('delete', operacion)} style={{ padding: '0.45rem 0.8rem' }}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const initialOperacionForm = {
    id_cotizacion: '',
    referencia_booking: '',
    cliente_nombre: '',
    usuario_ventas_nombre: '',
    usuario_operativo_nombre: '',
    tipo_servicio: 'MARITIMO',
    incoterm: 'FOB',
    origen_nombre: '',
    destino_nombre: '',
    total_venta: 0,
    moneda: 'USD',
    fecha_salida_estimada: '',
    fecha_llegada_estimada: '',
    estatus_operacion: 'PENDIENTE_DOC',
    documentos_pendientes: 0,
};

const Operaciones = () => {
    const [operaciones, setOperaciones] = useState(mockOperacionesData);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedOperacion, setSelectedOperacion] = useState(null);
    const [formData, setFormData] = useState(initialOperacionForm);

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
            openFormForNew();
        } else if (action === 'view') {
            alert(`Navegando a la vista de TRACKING de Operación #${operacion.id_operacion}`);
        } else if (action === 'edit') {
            openFormForEdit(operacion);
        } else if (action === 'delete') {
            openDeleteConfirm(operacion);
        }
    };

    const handleFormChange = (e) => {
        const { name, value, type } = e.target;
        const parsed = type === 'number' ? (value === '' ? '' : Number(value)) : value;
        setFormData(prev => ({ ...prev, [name]: parsed }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (selectedOperacion) {
            setOperaciones(prev => prev.map(o => (o.id_operacion === selectedOperacion.id_operacion ? { ...o, ...formData, id_operacion: o.id_operacion } : o)));
        } else {
            const newId = Math.max(0, ...operaciones.map(op => op.id_operacion)) + 1;
            const nueva = { ...formData, id_operacion: newId };
            setOperaciones(prev => [nueva, ...prev]);
        }

        setIsFormOpen(false);
        setFormData(initialOperacionForm);
        setSelectedOperacion(null);
    };

    const openFormForNew = () => {
        setSelectedOperacion(null);
        setFormData(initialOperacionForm);
        setIsFormOpen(true);
        setIsDeleteOpen(false);
    };

    const openFormForEdit = (operacion) => {
        setSelectedOperacion(operacion);
        setFormData({
            id_cotizacion: operacion.id_cotizacion || '',
            referencia_booking: operacion.referencia_booking || '',
            cliente_nombre: operacion.cliente_nombre || '',
            usuario_ventas_nombre: operacion.usuario_ventas_nombre || '',
            usuario_operativo_nombre: operacion.usuario_operativo_nombre || '',
            tipo_servicio: operacion.tipo_servicio || 'MARITIMO',
            incoterm: operacion.incoterm || 'FOB',
            origen_nombre: operacion.origen_nombre || '',
            destino_nombre: operacion.destino_nombre || '',
            total_venta: operacion.total_venta || 0,
            moneda: operacion.moneda || 'USD',
            fecha_salida_estimada: operacion.fecha_salida_estimada || '',
            fecha_llegada_estimada: operacion.fecha_llegada_estimada || '',
            estatus_operacion: operacion.estatus_operacion || 'PENDIENTE_DOC',
            documentos_pendientes: operacion.documentos_pendientes || 0,
        });
        setIsFormOpen(true);
        setIsDeleteOpen(false);
    };

    const openDeleteConfirm = (operacion) => {
        setSelectedOperacion(operacion);
        setIsDeleteOpen(true);
        setIsFormOpen(false);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setFormData(initialOperacionForm);
        setSelectedOperacion(null);
    };

    const deleteOperacion = () => {
        if (!selectedOperacion) return;
        setOperaciones(prev => prev.filter(o => o.id_operacion !== selectedOperacion.id_operacion));
        setIsDeleteOpen(false);
        setSelectedOperacion(null);
    };

    return (
        <AppLayout activeLink="/operaciones">
            <div className="agents-container">
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

                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            onClick={() => handleAction('new', null)}
                            className="btn btn-primary"
                        >
                            <Plus size={20} />
                            Crear Nueva Operación
                        </button>
                    </div>
                </div>

                {isFormOpen && (
                    <OperacionForm
                        selectedOperacion={selectedOperacion}
                        formData={formData}
                        handleFormChange={handleFormChange}
                        handleFormSubmit={handleFormSubmit}
                        closeForm={closeForm}
                    />
                )}

                {isDeleteOpen && selectedOperacion && (
                    <DeleteOperacionConfirm
                        selectedOperacion={selectedOperacion}
                        deleteOperacion={deleteOperacion}
                        cancel={() => setIsDeleteOpen(false)}
                    />
                )}

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