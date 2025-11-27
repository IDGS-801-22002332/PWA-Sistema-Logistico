import React, { useState, useMemo, useEffect } from 'react';
import { FileText, Building2, User, Truck, Calendar, DollarSign, MapPin, List, Plus, Search, Clock, Activity, Edit, Box, Factory, Briefcase, Plane, Ship, Bus} from 'lucide-react';
import AppLayout from '../Layout/AppLayout';
import './cotizaciones.css'; 
import { apiGet, apiPost } from '../services/api.js';

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

const initialCotizaciones = [];

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
    const [cotizaciones, setCotizaciones] = useState(initialCotizaciones);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                const data = await apiGet('/cotizaciones');
                if (mounted) setCotizaciones(data || []);
            } catch (err) {
                console.error('Error cargando cotizaciones', err);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false };
    }, []);
    const filteredCotizaciones = useMemo(() => {
        if (!searchTerm) return cotizaciones;
        return cotizaciones.filter((c) =>
            `${c.id_cotizacion} ${c.cliente_nombre} ${c.usuario_ventas_nombre} ${TipoServicioDisplay[c.tipo_servicio]} ${c.origen_nombre} ${c.destino_nombre} ${c.proveedor_nombre} ${c.agente_nombre}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [cotizaciones, searchTerm]);

    const handleAction = async (action, cotizacion) => {
        if (action === 'new') {
            // Minimal creation flow: ask for required minimal fields
            try {
                const id_cliente = Number(prompt('ID cliente (num):', '1'));
                const id_proveedor = Number(prompt('ID proveedor (num):', '1'));
                if (!id_cliente || !id_proveedor) return alert('ID cliente/proveedor requeridos');
                const dto = {
                    id_cliente,
                    id_usuario_ventas: Number(localStorage.getItem('user_id') || 1),
                    id_origen_localizacion: Number(prompt('ID origen localizacion:', '1')) || 1,
                    id_destino_localizacion: Number(prompt('ID destino localizacion:', '1')) || 1,
                    id_proveedor,
                    tipo_servicio: prompt('Tipo servicio (MARITIMO/AEREO/TERRESTRE):', 'MARITIMO') || 'MARITIMO',
                    tipo_carga: prompt('Tipo carga (FCL/LCL/CARGA_SUELTA):', 'FCL') || 'FCL',
                    incoterm: prompt('Incoterm (FOB/CIF/DDP/EXW):', 'FOB') || 'FOB',
                    descripcion_mercancia: prompt('Descripción mercancia:', '') || undefined,
                    estatus: 'pendiente',
                };
                const created = await apiPost('/cotizaciones', dto);
                alert(`Cotización creada: ID ${created?.id_cotizacion || created?.id || 'n/a'}`);
                const latest = await apiGet('/cotizaciones');
                setCotizaciones(latest || []);
            } catch (err) {
                console.error(err);
                alert('Error creando cotización');
            }
        } else if (action === 'view') {
            alert(`Detalle de Cotización #${cotizacion.id_cotizacion} (abrir vista)`);
        } else if (action === 'edit') {
            alert(`Editar Cotización #${cotizacion.id_cotizacion} (abrir formulario)`);
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