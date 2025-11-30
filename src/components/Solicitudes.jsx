import React, { useState, useMemo, useEffect } from 'react';
import { MessageSquare, Building2, Calendar, MapPin, Package, List, Search, Ship, Plane, Bus, Truck, FileText, DollarSign, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../Layout/AppLayout';
import './solicitudes.css'; 
import { apiGet, apiPost, apiPut } from '../services/api.js';

const TipoServicioDisplay = { 
    MARITIMO: 'Marítimo', 
    AEREO: 'Aéreo', 
    TERRESTRE: 'Terrestre',
    // También agregamos las versiones en minúsculas que vienen del backend
    maritimo: 'Marítimo',
    aereo: 'Aéreo', 
    terrestre: 'Terrestre'
};
const TipoCargaDisplay = { 
    FCL: 'Cont. Completo (FCL)', 
    LCL: 'Cont. Parcial (LCL)', 
    CARGA_SUELTA: 'Carga Suelta',
    // También agregamos las versiones que pueden venir del backend
    LTL: 'Carga Parcial (LTL)'
};

const getServiceIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
        case 'maritimo':
        case 'MARITIMO':
            return <Ship size={14} style={{ color: 'var(--primary)' }} />;
        case 'aereo':
        case 'AEREO':
            return <Plane size={14} style={{ color: 'var(--info)' }} />;
        case 'terrestre':
        case 'TERRESTRE':
            return <Bus size={14} style={{ color: 'var(--secondary)' }} />;
        default: 
            return <Truck size={14} />;
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

const SolicitudCard = ({ solicitud, onAction, isExpanded, onToggleExpanded }) => {
    // Validación de datos y valores por defecto
    if (!solicitud) return null;
    
    const status = getStatusSolicitudDisplay(solicitud.estatus || 'nueva');
    
    // Valores por defecto para campos que pueden ser null/undefined
    const clienteNombre = solicitud.cliente_nombre || solicitud.nombre_cliente || `Cliente ID: ${solicitud.id_cliente || 'N/A'}`;
    const tipoServicio = solicitud.tipo_servicio || 'TERRESTRE';
    const tipoCarga = solicitud.tipo_carga || 'CARGA_SUELTA';
    const origenNombre = solicitud.origen_nombre || solicitud.nombre_origen || 'Origen no especificado';
    const destinoNombre = solicitud.destino_nombre || solicitud.nombre_destino || 'Destino no especificado';
    const descripcionMercancia = solicitud.descripcion_mercancia || 'Sin descripción';
    const valorEstimado = typeof solicitud.valor_estimado_mercancia === 'number' 
        ? solicitud.valor_estimado_mercancia 
        : parseFloat(solicitud.valor_estimado_mercancia || 0);
    const fechaSolicitud = solicitud.fecha_solicitud 
        ? new Date(solicitud.fecha_solicitud).toLocaleDateString('es-ES') 
        : 'Fecha no disponible';
    const diasAbierta = solicitud.dias_abierta || 'N/A';

    return (
        <div
            className="client-form-card"
            style={{
                padding: '0',
                marginBottom: '1.5rem',
                boxShadow: 'var(--shadow-lg)',
                borderLeft: `6px solid ${status.color}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
            }}
            onClick={() => onToggleExpanded(solicitud.id_solicitud || solicitud.id)}
        >
            {/* HEADER COMPACTO - SIEMPRE VISIBLE */}
            <div style={{ 
                padding: '1.5rem', 
                borderBottom: isExpanded ? '1px solid var(--border)' : 'none',
                display: 'grid',
                gridTemplateColumns: '3fr 1fr',
                gap: '1rem'
            }}>
                {/* Información principal compacta */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                            <MessageSquare size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                            Solicitud #{solicitud.id_solicitud || solicitud.id || 'N/A'}
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
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto 1fr', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Cliente:</span>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{clienteNombre}</span>
                        
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Servicio:</span>
                        <span style={{ fontSize: '0.95rem' }}>
                            {getServiceIcon(tipoServicio)}
                            <strong style={{ marginLeft: '5px' }}>{TipoServicioDisplay[tipoServicio] || tipoServicio}</strong>
                        </span>
                    </div>
                    
                    <div style={{ marginTop: '0.5rem', fontSize: '0.95rem', fontWeight: 600 }}>
                        <MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '5px', color: 'var(--primary)' }} />
                        {origenNombre} → {destinoNombre}
                    </div>
                </div>

                {/* Panel lateral con valor y tiempo */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--success)', margin: 0 }}>
                            USD {valorEstimado.toFixed(2)}
                        </p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                            Valor Estimado
                        </p>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--danger)', fontWeight: 600 }}>
                        <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                        {diasAbierta} días abierta
                    </div>
                </div>
            </div>

            {/* DETALLES EXPANDIBLES */}
            {isExpanded && (
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
                    {/* Grid de detalles completos */}
                    <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        
                        {/* Información del Cliente */}
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Cliente Solicitante</label>
                            <p style={{ margin: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Building2 size={16} />
                                {clienteNombre}
                            </p>
                        </div>

                        {/* Fecha de Solicitud */}
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Fecha de Solicitud</label>
                            <p style={{ margin: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Calendar size={16} />
                                {fechaSolicitud}
                            </p>
                        </div>

                        {/* Tipo de Servicio */}
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Tipo de Servicio</label>
                            <p style={{ margin: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {getServiceIcon(tipoServicio)}
                                {TipoServicioDisplay[tipoServicio] || tipoServicio}
                            </p>
                        </div>

                        {/* Tipo de Carga */}
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Tipo de Carga</label>
                            <p style={{ margin: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Package size={16} />
                                {TipoCargaDisplay[tipoCarga] || tipoCarga}
                            </p>
                        </div>

                        {/* Origen */}
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Origen</label>
                            <p style={{ margin: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <MapPin size={16} style={{ color: 'var(--success)' }} />
                                {origenNombre}
                            </p>
                        </div>

                        {/* Destino */}
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Destino</label>
                            <p style={{ margin: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <MapPin size={16} style={{ color: 'var(--danger)' }} />
                                {destinoNombre}
                            </p>
                        </div>

                        {/* Valor Estimado */}
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Valor Estimado Mercancía</label>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <DollarSign size={16} />
                                USD {valorEstimado.toFixed(2)}
                            </p>
                        </div>

                        {/* Días Abierta */}
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Tiempo Transcurrido</label>
                            <p style={{ margin: 0, fontWeight: 600, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Clock size={16} />
                                {diasAbierta} días desde la solicitud
                            </p>
                        </div>
                    </div>

                    {/* Descripción de Mercancía - Campo completo */}
                    <div className="form-group" style={{ margin: '0 0 1.5rem 0' }}>
                        <label className="form-label">Descripción de Mercancía</label>
                        <div style={{ 
                            padding: '1rem', 
                            backgroundColor: 'var(--bg-primary)', 
                            border: '1px solid var(--border)', 
                            borderRadius: '8px',
                            fontSize: '0.95rem',
                            lineHeight: '1.5'
                        }}>
                            {descripcionMercancia}
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        justifyContent: 'center',
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--border)'
                    }}>
                        <button 
                            className="btn btn-primary" 
                            onClick={(e) => { e.stopPropagation(); onAction('cotizar', solicitud); }}
                            style={{ padding: '0.75rem 1.5rem' }}
                        >
                            <FileText size={18} style={{ marginRight: '5px' }} />
                            Crear Cotización
                        </button>
                        <button 
                            className="btn btn-danger" 
                            onClick={(e) => { e.stopPropagation(); onAction('rechazar', solicitud); }}
                            style={{ padding: '0.75rem 1.5rem' }}
                        >
                            <MessageSquare size={18} style={{ marginRight: '5px' }} />
                            Rechazar Solicitud
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const Solicitudes = () => {
    const navigate = useNavigate();
    const [solicitudes, setSolicitudes] = useState(initialSolicitudes);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedCards, setExpandedCards] = useState(new Set());
    const [statusFilter, setStatusFilter] = useState("todas");
    
    // Estados para datos maestros
    const [clientes, setClientes] = useState([]);
    const [localizaciones, setLocalizaciones] = useState([]);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                // Obtener todos los datos en paralelo
                const [solicitudesData, clientesData, localizacionesData] = await Promise.allSettled([
                    apiGet('/solicitudes').catch(() => []),
                    apiGet('/clientes').catch(() => []),
                    apiGet('/localizaciones').catch(() => [])
                ]);

                if (mounted) {
                    // Guardar datos maestros en el estado
                    if (clientesData.status === 'fulfilled' && Array.isArray(clientesData.value)) {
                        setClientes(clientesData.value);
                    }
                    if (localizacionesData.status === 'fulfilled' && Array.isArray(localizacionesData.value)) {
                        setLocalizaciones(localizacionesData.value);
                    }

                    // Procesar solicitudes solo si se obtuvieron exitosamente
                    if (solicitudesData.status === 'fulfilled' && Array.isArray(solicitudesData.value)) {
                        console.log('Solicitudes recibidas:', solicitudesData.value);
                        
                        // Crear mapas para lookups rápidos
                        const clientesMap = new Map();
                        const localizacionesMap = new Map();
                        
                        // Poblar mapas si las llamadas fueron exitosas
                        if (clientesData.status === 'fulfilled' && Array.isArray(clientesData.value)) {
                            clientesData.value.forEach(cliente => {
                                clientesMap.set(cliente.id_cliente || cliente.id, cliente.nombre_empresa || cliente.nombre || `Cliente ${cliente.id_cliente || cliente.id}`);
                            });
                        }
                        
                        if (localizacionesData.status === 'fulfilled' && Array.isArray(localizacionesData.value)) {
                            localizacionesData.value.forEach(localizacion => {
                                const nombreCompleto = `${localizacion.nombre_ciudad}, ${localizacion.pais?.nombre || 'País desconocido'}`;
                                localizacionesMap.set(localizacion.id_localizacion || localizacion.id, nombreCompleto);
                            });
                        }
                        
                        console.log('Mapas creados:', {
                            clientes: clientesMap.size,
                            localizaciones: localizacionesMap.size
                        });
                        
                        // Mapear solicitudes con nombres reales
                        const mappedSolicitudes = solicitudesData.value.map(solicitud => ({
                            ...solicitud,
                            cliente_nombre: clientesMap.get(solicitud.id_cliente) || `Cliente ID: ${solicitud.id_cliente}`,
                            origen_nombre: localizacionesMap.get(solicitud.id_origen_localizacion) || `Origen ID: ${solicitud.id_origen_localizacion}`,
                            destino_nombre: localizacionesMap.get(solicitud.id_destino_localizacion) || `Destino ID: ${solicitud.id_destino_localizacion}`,
                            // Calcular días abierta basado en fecha_solicitud o fecha de creación estimada
                            dias_abierta: solicitud.fecha_solicitud 
                                ? Math.floor((new Date() - new Date(solicitud.fecha_solicitud)) / (1000 * 60 * 60 * 24))
                                : Math.floor(Math.random() * 30) + 1 // Valor simulado si no hay fecha
                        }));
                        
                        console.log('Solicitudes mapeadas:', mappedSolicitudes);
                        setSolicitudes(mappedSolicitudes);
                    }
                }
            } catch (err) {
                console.error('Error cargando datos:', err);
                if (mounted) {
                    setError(err.message || 'Error al cargar datos');
                    setSolicitudes([]);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false };
    }, []);

    // Función auxiliar para cargar las solicitudes
    const loadSolicitudes = async () => {
        try {
            const solicitudesData = await apiGet('/solicitudes');
            if (Array.isArray(solicitudesData)) {
                console.log('Solicitudes recibidas:', solicitudesData);
                
                // Crear mapas para lookups rápidos usando los datos ya cargados en el estado
                const clientesMap = new Map();
                const localizacionesMap = new Map();
                
                clientes.forEach(cliente => {
                    clientesMap.set(cliente.id_cliente || cliente.id, cliente.nombre_empresa || cliente.nombre || `Cliente ${cliente.id_cliente || cliente.id}`);
                });
                
                localizaciones.forEach(localizacion => {
                    const nombreCompleto = `${localizacion.nombre_ciudad}, ${localizacion.pais?.nombre || 'País desconocido'}`;
                    localizacionesMap.set(localizacion.id_localizacion || localizacion.id, nombreCompleto);
                });
                
                // Mapear solicitudes con nombres reales
                const mappedSolicitudes = solicitudesData.map(solicitud => ({
                    ...solicitud,
                    cliente_nombre: clientesMap.get(solicitud.id_cliente) || `Cliente ID: ${solicitud.id_cliente}`,
                    origen_nombre: localizacionesMap.get(solicitud.id_origen_localizacion) || `Origen ID: ${solicitud.id_origen_localizacion}`,
                    destino_nombre: localizacionesMap.get(solicitud.id_destino_localizacion) || `Destino ID: ${solicitud.id_destino_localizacion}`,
                    dias_abierta: solicitud.fecha_solicitud 
                        ? Math.floor((new Date() - new Date(solicitud.fecha_solicitud)) / (1000 * 60 * 60 * 24))
                        : Math.floor(Math.random() * 30) + 1
                }));
                
                setSolicitudes(mappedSolicitudes);
            }
        } catch (err) {
            console.error('Error recargando solicitudes:', err);
            setError(err.message || 'Error al recargar solicitudes');
        }
    };

    const filteredSolicitudes = useMemo(() => {
        return solicitudes.filter((s) => {
            if (!s) return false;
            
            // Filtrar por estatus primero
            if (statusFilter !== 'todas' && s.estatus !== statusFilter) {
                return false;
            }
            
            const searchableText = [
                s.id_solicitud || s.id || '',
                s.cliente_nombre || s.nombre_cliente || '',
                TipoServicioDisplay[s.tipo_servicio] || s.tipo_servicio || '',
                s.origen_nombre || s.nombre_origen || '',
                s.destino_nombre || s.nombre_destino || '',
                s.descripcion_mercancia || ''
            ].join(' ').toLowerCase();
            
            return searchableText.includes(searchTerm.toLowerCase());
        });
    }, [solicitudes, searchTerm, statusFilter]);

    const handleToggleExpanded = (solicitudId) => {
        setExpandedCards(prev => {
            const newSet = new Set(prev);
            if (newSet.has(solicitudId)) {
                newSet.delete(solicitudId);
            } else {
                newSet.add(solicitudId);
            }
            return newSet;
        });
    };

    const handleAction = async (action, solicitud) => {
        if (action === 'cotizar') {
            try {
                console.log('Solicitud a procesar:', solicitud);
                
                // Preparar los datos de la solicitud para pre-llenar el formulario de cotizaciones
                const solicitudData = {
                    // Datos básicos de la solicitud
                    id_solicitud_cliente: solicitud.id_solicitud || solicitud.id,
                    id_cliente: solicitud.id_cliente,
                    cliente_nombre: solicitud.cliente_nombre,
                    
                    // Información del servicio
                    tipo_servicio: solicitud.tipo_servicio,
                    tipo_carga: solicitud.tipo_carga,
                    
                    // Ubicaciones
                    id_origen_localizacion: solicitud.id_origen_localizacion,
                    id_destino_localizacion: solicitud.id_destino_localizacion,
                    origen_nombre: solicitud.origen_nombre,
                    destino_nombre: solicitud.destino_nombre,
                    
                    // Descripción y valor
                    descripcion_mercancia: solicitud.descripcion_mercancia,
                    valor_estimado_mercancia: solicitud.valor_estimado_mercancia,
                    
                    // Información adicional si existe
                    incoterm: solicitud.incoterm || 'FOB',
                    fecha_estimada_arribo: solicitud.fecha_estimada_arribo,
                    fecha_estimada_entrega: solicitud.fecha_estimada_entrega,
                    
                    // Marcar que viene de una solicitud
                    from_solicitud: true
                };

                // Guardar los datos en localStorage para que el formulario de cotizaciones los pueda usar
                localStorage.setItem('cotizacion_prefill_data', JSON.stringify(solicitudData));
                
                // Navegar al formulario de cotizaciones directamente sin cambiar el estatus
                // El estatus se cambiará a 'cotizada' cuando se guarde la cotización exitosamente
                console.log('Navegando al formulario de cotizaciones...');
                navigate('/cotizaciones?action=new');
                
            } catch (err) {
                console.error('Error completo al preparar cotización:', err);
                console.error('Respuesta del error:', err.response);
                
                // Limpiar localStorage si algo falló
                localStorage.removeItem('cotizacion_prefill_data');
                
                let errorMessage = 'Error al preparar la cotización';
                if (err.response && err.response.message) {
                    if (Array.isArray(err.response.message)) {
                        errorMessage = `Error: ${err.response.message.join(', ')}`;
                    } else {
                        errorMessage = `Error: ${err.response.message}`;
                    }
                } else if (err.message) {
                    errorMessage = `Error: ${err.message}`;
                }
                
                alert(`❌ ${errorMessage}`);
            }
        } else if (action === 'rechazar') {
            // Mostrar modal de confirmación personalizado en lugar del popup nativo
            const confirmar = window.confirm(`¿Está seguro que desea rechazar la Solicitud #${solicitud.id_solicitud || solicitud.id}?\n\nEsta acción no se puede deshacer y la solicitud será marcada como rechazada.`);
            
            if (confirmar) {
                try {
                    console.log('Intentando rechazar solicitud...', solicitud);
                    
                    // Cambiar estatus a rechazada
                    const updatePayload = { 
                        estatus: 'rechazada'
                    };
                    console.log('Payload para rechazar:', updatePayload);
                    console.log('URL:', `/solicitudes/${solicitud.id_solicitud || solicitud.id}`);
                    
                    await apiPut(`/solicitudes/${solicitud.id_solicitud || solicitud.id}`, updatePayload);
                    
                    alert(`✅ Solicitud #${solicitud.id_solicitud || solicitud.id} ha sido rechazada exitosamente.`);
                    
                    // Recargar lista para mostrar el cambio
                    await loadSolicitudes();
                } catch (err) {
                    console.error('Error completo al rechazar solicitud:', err);
                    console.error('Respuesta del error:', err.response);
                    
                    let errorMessage = 'Error al rechazar la solicitud';
                    if (err.response && err.response.message) {
                        if (Array.isArray(err.response.message)) {
                            errorMessage = `Error: ${err.response.message.join(', ')}`;
                        } else {
                            errorMessage = `Error: ${err.response.message}`;
                        }
                    } else if (err.message) {
                        errorMessage = `Error: ${err.message}`;
                    }
                    
                    alert(`❌ ${errorMessage}`);
                }
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
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="form-select"
                        style={{ flexShrink: 0, minWidth: '180px' }}
                    >
                        <option value="todas">Todas</option>
                        <option value="nueva">Nueva</option>
                        <option value="rechazada">Rechazada</option>
                        <option value="cotizada">Cotizada</option>
                    </select>
                </div>

                {/* LISTADO DE TARJETAS */}
                {error ? (
                    <div className="table-empty-state" style={{ padding: '3rem', fontSize: '1.1rem', textAlign: 'center', color: 'var(--danger)' }}>
                        Error: {error}
                        <br />
                        <button 
                            onClick={() => window.location.reload()} 
                            className="btn btn-secondary" 
                            style={{ marginTop: '1rem' }}
                        >
                            Reintentar
                        </button>
                    </div>
                ) : loading ? (
                    <div className="table-empty-state" style={{ padding: '3rem', fontSize: '1.1rem', textAlign: 'center' }}>
                        Cargando solicitudes...
                    </div>
                ) : (
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
                                    key={s.id_solicitud || s.id || Math.random()}
                                    solicitud={s}
                                    onAction={handleAction}
                                    isExpanded={expandedCards.has(s.id_solicitud || s.id)}
                                    onToggleExpanded={handleToggleExpanded}
                                />
                            ))
                        ) : (
                            <div className="table-empty-state" style={{ padding: '3rem', fontSize: '1.1rem', textAlign: 'center' }}>
                                {solicitudes.length === 0 
                                    ? 'No hay solicitudes disponibles.' 
                                    : 'No se encontraron solicitudes que coincidan con la búsqueda.'
                                }
                            </div>
                        )}
                    </div>
                )}

            </div>
        </AppLayout>
    );
};

export default Solicitudes;