import React, { useState, useMemo, useEffect } from 'react';
import { MessageSquare, Building2, Calendar, MapPin, Package, List, Plus, Search, Ship, Plane, Bus, FileText, DollarSign, Clock } from 'lucide-react';
import AppLayout from '../Layout/AppLayout';
import './solicitudes.css'; 
import { apiGet, apiPost, apiPut } from '../services/api.js';

const TipoServicioDisplay = { MARITIMO: 'Marítimo', AEREO: 'Aéreo', TERRESTRE: 'Terrestre' };
const TipoCargaDisplay = { FCL: 'Cont. Completo (FCL)', LCL: 'Cont. Parcial (LCL)', CARGA_SUELTA: 'Carga Suelta' };

const getServiceIcon = (tipo) => {
    switch (tipo) {
        case 'MARITIMO': return <Ship size={14} style={{ color: 'var(--primary)' }} />;
        case 'AEREO': return <Plane size={14} style={{ color: 'var(--info)' }} />;
        case 'TERRESTRE': return <Bus size={14} style={{ color: 'var(--secondary)' }} />;
        default: return <Truck size={14} />;
    }
};

const initialSolicitudes = [];

const getStatusSolicitudDisplay = (status) => {
    switch (status) {
        case 'cotizada':
            return { text: 'Cotizada', color: 'var(--success)', icon: <FileText size={16} /> };
        case 'en_proceso':
            return { text: 'En Proceso', color: 'var(--info)', icon: <Clock size={16} /> }; // Azul para proceso
        case 'rechazada':
            return { text: 'Rechazada', color: 'var(--danger)', icon: <Clock size={16} /> };
        case 'nueva':
        default:
            return { text: 'Nueva', color: '#f59e0b', icon: <MessageSquare size={16} /> }; // Naranja para nueva
    }
};

const SolicitudCard = ({ solicitud, onAction }) => {
    const status = getStatusSolicitudDisplay(solicitud.estatus);

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
            {/* COLUMNA PRINCIPAL (3/4) - DETALLES DE LA SOLICITUD */}
            <div style={{ padding: '1.5rem', borderRight: '1px solid #e5e7eb' }}>

                {/* 1. HEADER DE LA TARJETA */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                        <MessageSquare size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                        Solicitud **#{solicitud.id_solicitud}**
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

                    {/* Fila 1: Cliente y Servicio */}
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Cliente Solicitante</label>
                        <p style={{ margin: 0, fontWeight: 600 }}><Building2 size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />{solicitud.cliente_nombre}</p>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Servicio Requerido</label>
                        <p style={{ margin: 0, fontSize: '0.95rem' }}>
                            {getServiceIcon(solicitud.tipo_servicio)}
                            **{TipoServicioDisplay[solicitud.tipo_servicio]}**
                        </p>
                    </div>

                    {/* Fila 2: Ruta y Tipo Carga */}
                    <div className="form-group" style={{ margin: 0, marginTop: '1rem' }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Ruta Solicitada</label>
                        <p style={{ margin: 0, fontWeight: 600 }}><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '5px', color: 'var(--primary)' }} />{solicitud.origen_nombre} → {solicitud.destino_nombre}</p>
                    </div>
                    <div className="form-group" style={{ margin: 0, marginTop: '1rem' }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Tipo de Carga</label>
                        <p style={{ margin: 0, fontSize: '0.95rem' }}>
                            <Package size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                            {TipoCargaDisplay[solicitud.tipo_carga]}
                        </p>
                    </div>

                    {/* Fila 3: Descripción (span-full) */}
                    <div className="form-group" style={{ margin: '1rem 0 0', gridColumn: 'span 2 / span 2' }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Descripción de Mercancía</label>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{solicitud.descripcion_mercancia}</p>
                    </div>

                </div>
            </div>

            {/* COLUMNA LATERAL (1/4) - RESUMEN RÁPIDO Y ACCIONES */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>

                {/* Resumen Financiero Rápido */}
                <div style={{ textAlign: 'center', width: '100%', marginBottom: '1rem' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Valor Estimado Mercancía</label>
                    <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--success)', margin: '0.2rem 0 0.5rem' }}>
                        USD {parseFloat(solicitud.valor_estimado_mercancia).toFixed(2)}
                    </p>

                    {/* Indicadores de Tiempos */}
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        <Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                        Recibida: {solicitud.fecha_solicitud}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--danger)', fontWeight: 600, marginTop: '0.5rem' }}>
                        <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                        {solicitud.dias_abierta} Días Abierta
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="form-actions" style={{ paddingTop: '0', borderTop: 'none', justifyContent: 'center', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" onClick={() => onAction('view', solicitud)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        <List size={18} /> Ver Detalle
                    </button>
                    <button className="btn btn-primary" onClick={() => onAction('cotizar', solicitud)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        <FileText size={18} /> Cotizar
                    </button>
                </div>

            </div>
        </div>
    );
};

const Solicitudes = () => {
    const [solicitudes, setSolicitudes] = useState(initialSolicitudes);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                const data = await apiGet('/solicitudes');
                if (mounted) setSolicitudes(data || []);
            } catch (err) {
                console.error('Error cargando solicitudes', err);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false };
    }, []);

    const filteredSolicitudes = useMemo(() => {
        if (!searchTerm) return solicitudes;
        return solicitudes.filter((s) =>
            `${s.id_solicitud} ${s.cliente_nombre} ${TipoServicioDisplay[s.tipo_servicio]} ${s.origen_nombre} ${s.destino_nombre} ${s.descripcion_mercancia}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [solicitudes, searchTerm]);

    const handleAction = async (action, solicitud) => {
        if (action === 'new') {
            alert('Abriendo formulario para registrar Solicitud Manual (no implementado en esta versión)...');
        } else if (action === 'view') {
            // Simple placeholder: could open modal o navegar a detalle
            alert(`Detalle de Solicitud #${solicitud.id_solicitud} (abrir vista detalle)`);
        } else if (action === 'cotizar') {
            // Crear una cotizacion incompleta basada en la solicitud y actualizar estatus
            try {
                const dto = {
                    id_cliente: solicitud.id_cliente,
                    id_usuario_ventas: Number(localStorage.getItem('user_id') || 1),
                    id_origen_localizacion: solicitud.id_origen_localizacion || solicitud.id_origen || 0,
                    id_destino_localizacion: solicitud.id_destino_localizacion || solicitud.id_destino || 0,
                    id_proveedor: solicitud.id_proveedor || 1,
                    id_agente: solicitud.id_agente || undefined,
                    tipo_servicio: solicitud.tipo_servicio,
                    tipo_carga: solicitud.tipo_carga,
                    incoterm: solicitud.incoterm || 'FOB',
                    fecha_estimada_arribo: solicitud.fecha_estimada_arribo || undefined,
                    fecha_estimada_entrega: solicitud.fecha_estimada_entrega || undefined,
                    descripcion_mercancia: solicitud.descripcion_mercancia || undefined,
                    estatus: 'incompleta',
                    id_solicitud_cliente: solicitud.id_solicitud || solicitud.id,
                };

                const created = await apiPost('/cotizaciones', dto);
                // marcar solicitud como cotizada
                await apiPut(`/solicitudes/${solicitud.id_solicitud || solicitud.id}`, { estatus: 'cotizada' });
                alert(`Cotización creada (ID: ${created?.id_cotizacion || created?.id || 'n/a'}) y solicitud marcada como cotizada.`);
                // refrescar lista
                const latest = await apiGet('/solicitudes');
                setSolicitudes(latest || []);
            } catch (err) {
                console.error(err);
                alert('Error al crear la cotización: ' + (err.message || err));
            }
        } else if (action === 'rechazar') {
            try {
                await apiPut(`/solicitudes/${solicitud.id_solicitud || solicitud.id}`, { estatus: 'rechazada' });
                alert(`Solicitud #${solicitud.id_solicitud || solicitud.id} rechazada.`);
                const latest = await apiGet('/solicitudes');
                setSolicitudes(latest || []);
            } catch (err) {
                console.error(err);
                alert('Error al rechazar la solicitud');
            }
        }
    };

    return (
        <AppLayout activeLink="/solicitudes">
            <div className="agents-container">

                {/* HEADER Y CONTROLES */}
                <h1 className="agents-title">
                    Bandeja de Solicitudes de Cotización
                </h1>
                <p className="agents-subtitle">
                    Lista de solicitudes de flete recibidas de los clientes para su procesamiento.
                </p>

                <div className="agents-controls" style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem' }}>
                    <div className="search-bar-wrapper">
                        <div className="search-icon-left">
                            <Search className="search-icon" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por ID, Cliente, Ruta o Mercancía..."
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
                        Registrar Solicitud Manual
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
                    {filteredSolicitudes.length > 0 ? (
                        filteredSolicitudes.map((s) => (
                            <SolicitudCard
                                key={s.id_solicitud}
                                solicitud={s}
                                onAction={handleAction}
                            />
                        ))
                    ) : (
                        <div className="table-empty-state" style={{ padding: '3rem', fontSize: '1.1rem', textAlign: 'center' }}>
                            No se encontraron solicitudes que coincidan con la búsqueda.
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
};

export default Solicitudes;