import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Building2, User, Truck, Calendar, DollarSign, MapPin, List, Plus, Search, Clock, Activity, Edit, Box, Factory, Briefcase, Plane, Ship, Bus, X, Save, AlertTriangle, ChevronsUpDown, Trash2, XCircle, CheckCircle, AlertCircle, Receipt, Eye, CreditCard, AlertOctagon, FileDown, ExternalLink, File, Upload, PlayCircle} from 'lucide-react';
import AppLayout from '../Layout/AppLayout';
import './cotizaciones.css'; 
import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from '../services/api.js';

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
const IncotermDisplay = { 
    FOB: 'FOB', 
    CIF: 'CIF', 
    DDP: 'DDP', 
    EXW: 'EXW',
    DAP: 'DAP' // Agregar DAP que viene en los datos
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

const initialCotizaciones = [];

// Datos iniciales del formulario
const initialFormData = {
    id_cliente: '',
    id_usuario_ventas: '',
    id_usuario_operativo: '',
    id_proveedor: '',
    id_agente: '',
    id_origen_localizacion: '',
    id_destino_localizacion: '',
    tipo_servicio: 'terrestre',
    tipo_carga: 'FCL',
    incoterm: 'FOB',
    descripcion_mercancia: '',
    fecha_estimada_arribo: '',
    fecha_estimada_entrega: '',
    estatus: 'pendiente',
    id_solicitud_cliente: '', // Referencia a la solicitud original
};

// Formulario para crear/editar cotización
const CotizacionForm = ({
    selectedCotizacion,
    formData,
    handleFormChange,
    handleFormSubmit,
    closeForm,
    clientes,
    usuarios,
    proveedores,
    agentes,
    localizaciones
}) => {
    const renderMasterOptions = (data, valueKey = 'id', labelKey = 'nombre') => (
        data.map(item => (
            <option key={item[valueKey]} value={item[valueKey]}>
                {item[labelKey]}
            </option>
        ))
    );

    const renderClienteOptions = () => (
        clientes.map(cliente => (
            <option key={cliente.id_cliente || cliente.id} value={cliente.id_cliente || cliente.id}>
                {cliente.nombre_empresa || cliente.nombre || `Cliente ${cliente.id_cliente || cliente.id}`}
            </option>
        ))
    );

    const renderUsuarioOptions = (rolFiltro = null) => (
        usuarios
            .filter(usuario => !rolFiltro || usuario.rol === rolFiltro)
            .map(usuario => (
                <option key={usuario.id_usuario || usuario.id} value={usuario.id_usuario || usuario.id}>
                    {`${usuario.nombre || 'Usuario'} ${usuario.apellido || ''} (${usuario.rol || 'sin rol'})`}
                </option>
            ))
    );

    const renderProveedorOptions = () => (
        proveedores.map(proveedor => (
            <option key={proveedor.id_proveedor || proveedor.id} value={proveedor.id_proveedor || proveedor.id}>
                {proveedor.nombre_empresa || proveedor.nombre || `Proveedor ${proveedor.id_proveedor || proveedor.id}`}
            </option>
        ))
    );

    const renderAgenteOptions = () => (
        agentes.map(agente => (
            <option key={agente.id_agente || agente.id} value={agente.id_agente || agente.id}>
                {`${agente.nombre || 'Agente'} ${agente.apellido || ''} (${agente.tipo_agente || 'sin tipo'})`}
            </option>
        ))
    );

    const renderLocalizacionOptions = () => (
        localizaciones.map(localizacion => (
            <option key={localizacion.id_localizacion || localizacion.id} value={localizacion.id_localizacion || localizacion.id}>
                {`${localizacion.nombre_ciudad}, ${localizacion.pais?.nombre || 'País desconocido'}`}
            </option>
        ))
    );

    const renderTipoServicioOptions = () => {
        const servicios = [
            { value: 'terrestre', label: 'Terrestre' },
            { value: 'maritimo', label: 'Marítimo' },
            { value: 'aereo', label: 'Aéreo' }
        ];
        return servicios.map(servicio => (
            <option key={servicio.value} value={servicio.value}>{servicio.label}</option>
        ));
    };

    const renderTipoCargaOptions = () => (
        Object.entries(TipoCargaDisplay).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
        ))
    );

    const renderIncotermOptions = () => (
        Object.entries(IncotermDisplay).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
        ))
    );

    return (
        <div className="client-form-card">
            <h2 className="form-card-title">
                <FileText size={24} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
                {selectedCotizacion ? "Editar Cotización" : "Nueva Cotización"}
            </h2>

            <form onSubmit={handleFormSubmit} className="form-content">
                <div className="form-grid">
                    
                    {/* Cliente */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="id_cliente">Cliente*</label>
                        <div className="select-wrapper">
                            <select
                                id="id_cliente"
                                name="id_cliente"
                                value={formData.id_cliente}
                                onChange={handleFormChange}
                                className="form-select"
                                required
                            >
                                <option value="" disabled>Seleccione cliente...</option>
                                {renderClienteOptions()}
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>

                    {/* Usuario de Ventas */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="id_usuario_ventas">Usuario de Ventas*</label>
                        <div className="select-wrapper">
                            <select
                                id="id_usuario_ventas"
                                name="id_usuario_ventas"
                                value={formData.id_usuario_ventas}
                                onChange={handleFormChange}
                                className="form-select"
                                required
                            >
                                <option value="" disabled>Seleccione usuario de ventas...</option>
                                {renderUsuarioOptions('ventas')}
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>

                    {/* Usuario Operativo */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="id_usuario_operativo">Usuario Operativo</label>
                        <div className="select-wrapper">
                            <select
                                id="id_usuario_operativo"
                                name="id_usuario_operativo"
                                value={formData.id_usuario_operativo}
                                onChange={handleFormChange}
                                className="form-select"
                            >
                                <option value="">Sin asignar</option>
                                {renderUsuarioOptions('operaciones')}
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>

                    {/* Proveedor */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="id_proveedor">Proveedor*</label>
                        <div className="select-wrapper">
                            <select
                                id="id_proveedor"
                                name="id_proveedor"
                                value={formData.id_proveedor}
                                onChange={handleFormChange}
                                className="form-select"
                                required
                            >
                                <option value="" disabled>Seleccione proveedor...</option>
                                {renderProveedorOptions()}
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>

                    {/* Agente Aduanal */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="id_agente">Agente Aduanal</label>
                        <div className="select-wrapper">
                            <select
                                id="id_agente"
                                name="id_agente"
                                value={formData.id_agente}
                                onChange={handleFormChange}
                                className="form-select"
                            >
                                <option value="">Sin asignar</option>
                                {renderAgenteOptions()}
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>

                    {/* Tipo de Servicio */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="tipo_servicio">Tipo de Servicio*</label>
                        <div className="select-wrapper">
                            <select
                                id="tipo_servicio"
                                name="tipo_servicio"
                                value={formData.tipo_servicio}
                                onChange={handleFormChange}
                                className="form-select"
                                required
                            >
                                {renderTipoServicioOptions()}
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>

                    {/* Tipo de Carga */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="tipo_carga">Tipo de Carga*</label>
                        <div className="select-wrapper">
                            <select
                                id="tipo_carga"
                                name="tipo_carga"
                                value={formData.tipo_carga}
                                onChange={handleFormChange}
                                className="form-select"
                                required
                            >
                                {renderTipoCargaOptions()}
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>

                    {/* Incoterm */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="incoterm">Incoterm*</label>
                        <div className="select-wrapper">
                            <select
                                id="incoterm"
                                name="incoterm"
                                value={formData.incoterm}
                                onChange={handleFormChange}
                                className="form-select"
                                required
                            >
                                {renderIncotermOptions()}
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>

                    {/* Origen */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="id_origen_localizacion">Origen*</label>
                        <div className="select-wrapper">
                            <select
                                id="id_origen_localizacion"
                                name="id_origen_localizacion"
                                value={formData.id_origen_localizacion}
                                onChange={handleFormChange}
                                className="form-select"
                                required
                            >
                                <option value="" disabled>Seleccione origen...</option>
                                {renderLocalizacionOptions()}
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>

                    {/* Destino */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="id_destino_localizacion">Destino*</label>
                        <div className="select-wrapper">
                            <select
                                id="id_destino_localizacion"
                                name="id_destino_localizacion"
                                value={formData.id_destino_localizacion}
                                onChange={handleFormChange}
                                className="form-select"
                                required
                            >
                                <option value="" disabled>Seleccione destino...</option>
                                {renderLocalizacionOptions()}
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>

                    {/* Fecha Estimada de Arribo */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="fecha_estimada_arribo">Fecha Estimada de Arribo</label>
                        <div className="input-field-wrapper">
                            <span className="input-icon-left"><Calendar size={20} className="input-icon" /></span>
                            <input
                                type="date"
                                id="fecha_estimada_arribo"
                                name="fecha_estimada_arribo"
                                value={formData.fecha_estimada_arribo}
                                onChange={handleFormChange}
                                className="form-input with-icon"
                            />
                        </div>
                    </div>

                    {/* Fecha Estimada de Entrega */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="fecha_estimada_entrega">Fecha Estimada de Entrega</label>
                        <div className="input-field-wrapper">
                            <span className="input-icon-left"><Calendar size={20} className="input-icon" /></span>
                            <input
                                type="date"
                                id="fecha_estimada_entrega"
                                name="fecha_estimada_entrega"
                                value={formData.fecha_estimada_entrega}
                                onChange={handleFormChange}
                                className="form-input with-icon"
                            />
                        </div>
                    </div>

                    {/* Estado */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="estatus">Estado*</label>
                        <div className="select-wrapper">
                            <select
                                id="estatus"
                                name="estatus"
                                value={formData.estatus}
                                onChange={handleFormChange}
                                className="form-select"
                                required
                            >
                                <option value="pendiente">Pendiente</option>
                                <option value="enviada">Enviada</option>
                                <option value="aprobada">Aprobada</option>
                                <option value="rechazada">Rechazada</option>
                                <option value="caducada">Caducada</option>
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>

                    {/* Descripción de la Mercancía (span full) */}
                    <div className="form-group span-full">
                        <label className="form-label" htmlFor="descripcion_mercancia">Descripción de la Mercancía</label>
                        <div className="input-field-wrapper">
                            <span className="input-icon-left"><Box size={20} className="input-icon" /></span>
                            <textarea
                                id="descripcion_mercancia"
                                name="descripcion_mercancia"
                                value={formData.descripcion_mercancia}
                                onChange={handleFormChange}
                                className="form-input with-icon"
                                rows="4"
                                placeholder="Describa la mercancía a transportar..."
                            />
                        </div>
                    </div>

                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={closeForm}>
                        <X size={20} /> Cancelar
                    </button>

                    <button type="submit" className="btn btn-primary">
                        <Save size={20} />
                        {selectedCotizacion ? "Actualizar Cotización" : "Guardar Cotización"}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Banner de confirmación de eliminación
const DeleteConfirmBanner = ({ selectedCotizacion, deleteCotizacion, cancel }) => (
    <div className="delete-confirm-banner">
        <div className="banner-icon-message">
            <AlertTriangle size={24} className="banner-icon" />
            <p>
                ¿Seguro que deseas eliminar la <strong>Cotización #{selectedCotizacion?.id_cotizacion || selectedCotizacion?.id}</strong>? 
                Esta acción no se puede deshacer.
            </p>
        </div>

        <div className="banner-actions">
            <button className="btn btn-secondary" onClick={cancel}>
                <XCircle size={18} /> Cancelar
            </button>

            <button className="btn btn-danger" onClick={deleteCotizacion}>
                <Trash2 size={18} /> Confirmar Eliminación
            </button>
        </div>
    </div>
);

// Banner de notificaciones (éxito y error)
const NotificationBanner = ({ type, message, onClose }) => {
    if (!message) return null;

    const isSuccess = type === 'success';
    const bannerClass = isSuccess ? 'success-banner' : 'error-banner';
    const icon = isSuccess ? <CheckCircle size={24} className="banner-icon" /> : <AlertCircle size={24} className="banner-icon" />;

    return (
        <div className={bannerClass}>
            <div className="banner-icon-message">
                {icon}
                <p>{message}</p>
            </div>
            <div className="banner-actions">
                <button className="btn btn-secondary" onClick={onClose}>
                    <X size={18} /> Cerrar
                </button>
            </div>
        </div>
    );
};

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

// Helper functions para facturas
const getFacturaStatusDisplay = (status) => {
    switch (status) {
        case 'pagada':
            return { text: 'Pagada', color: 'var(--success)', icon: <CheckCircle size={16} />, bgColor: 'var(--light-bg)' };
        case 'vencida':
            return { text: 'Vencida', color: 'var(--danger)', icon: <AlertOctagon size={16} />, bgColor: 'var(--light-bg)' };
        case 'cancelada':
            return { text: 'Cancelada', color: 'var(--text-secondary)', icon: <XCircle size={16} />, bgColor: 'var(--light-bg)' };
        case 'pendiente':
        default:
            return { text: 'Pendiente', color: '#f59e0b', icon: <Clock size={16} />, bgColor: 'var(--light-bg)' };
    }
};

const formatCurrency = (amount, currency = 'USD') => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `${currency} ${numAmount.toFixed(2)}`;
};

const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES');
};

// Helper functions para documentos
const getTipoDocumentoDisplay = (tipo) => {
    const tipos = {
        'BL': 'Bill of Lading',
        'AWB': 'Air Waybill',
        'carta_porte': 'Carta Porte',
        'packing_list': 'Packing List',
        'factura_comercial': 'Factura Comercial',
        'certificado_origen': 'Certificado de Origen',
        'pedimento': 'Pedimento',
        'otro': 'Otro'
    };
    return tipos[tipo] || tipo;
};

const getTipoDocumentoIcon = (tipo) => {
    switch (tipo) {
        case 'BL':
        case 'AWB':
            return <Ship size={16} />;
        case 'carta_porte':
            return <Truck size={16} />;
        case 'packing_list':
            return <Box size={16} />;
        case 'factura_comercial':
            return <Receipt size={16} />;
        case 'certificado_origen':
            return <FileText size={16} />;
        case 'pedimento':
            return <Building2 size={16} />;
        default:
            return <File size={16} />;
    }
};

// Componente para mostrar las facturas de una cotización
const FacturasSection = ({ cotizacionId, facturas, onRefreshFacturas, showNotification, cotizacion }) => {
    const [loadingFacturas, setLoadingFacturas] = useState(false);
    const [expandedFactura, setExpandedFactura] = useState(null);
    const [deletingFactura, setDeletingFactura] = useState(null);
    const [facturaToDelete, setFacturaToDelete] = useState(null);
    const [editingFactura, setEditingFactura] = useState(null);
    const [savingFactura, setSavingFactura] = useState(false);
    const [creatingFactura, setCreatingFactura] = useState(false);
    const [savingNewFactura, setSavingNewFactura] = useState(false);
    const [formDataFactura, setFormDataFactura] = useState({
        numero_factura: '',
        fecha_vencimiento: '',
        monto_total: '',
        monto_pagado: '',
        moneda: 'USD',
        estatus: 'pendiente',
        observaciones: '',
        fecha_pago: ''
    });

    const facturasRelacionadas = facturas.filter(factura => 
        factura.id_cotizacion === cotizacionId
    );

    // Función para mostrar confirmación de eliminación
    const handleDeleteFactura = (factura) => {
        setFacturaToDelete(factura);
    };

    // Función para confirmar eliminación
    const confirmDeleteFactura = async () => {
        if (!facturaToDelete) return;

        setDeletingFactura(facturaToDelete.id_factura_cliente);
        try {
            await apiDelete(`/facturas-cliente/${facturaToDelete.id_factura_cliente}`);
            showNotification('success', 'Factura eliminada exitosamente');
            onRefreshFacturas();
            setFacturaToDelete(null);
        } catch (err) {
            console.error('Error eliminando factura:', err);
            showNotification('error', 'Error eliminando la factura: ' + (err.message || err));
        } finally {
            setDeletingFactura(null);
        }
    };

    // Función para cancelar eliminación
    const cancelDeleteFactura = () => {
        setFacturaToDelete(null);
    };

    // Función para abrir formulario de edición
    const handleEditFactura = (factura) => {
        setEditingFactura(factura);
        setFormDataFactura({
            numero_factura: factura.numero_factura || '',
            fecha_vencimiento: factura.fecha_vencimiento ? factura.fecha_vencimiento.substring(0, 10) : '',
            monto_total: factura.monto_total || '',
            monto_pagado: factura.monto_pagado || '0',
            moneda: factura.moneda || 'USD',
            estatus: factura.estatus || 'pendiente',
            observaciones: factura.observaciones || '',
            fecha_pago: factura.fecha_pago ? factura.fecha_pago.substring(0, 10) : ''
        });
    };

    // Función para manejar cambios en el formulario
    const handleFormFacturaChange = (e) => {
        const { name, value } = e.target;
        setFormDataFactura(prev => ({ ...prev, [name]: value }));
    };

    // Función para guardar cambios en la factura
    const handleSaveFactura = async (e) => {
        e.preventDefault();
        
        setSavingFactura(true);
        try {
            const payload = {
                numero_factura: formDataFactura.numero_factura,
                fecha_vencimiento: formDataFactura.fecha_vencimiento,
                monto_total: parseFloat(formDataFactura.monto_total),
                monto_pagado: parseFloat(formDataFactura.monto_pagado || 0),
                moneda: formDataFactura.moneda,
                estatus: formDataFactura.estatus,
                observaciones: formDataFactura.observaciones || undefined,
                fecha_pago: formDataFactura.fecha_pago || undefined
            };
            
            await apiPatch(`/facturas-cliente/${editingFactura.id_factura_cliente}`, payload);
            
            showNotification('success', 'Factura actualizada correctamente');
            onRefreshFacturas();
            setEditingFactura(null);
        } catch (err) {
            console.error('Error actualizando factura:', err);
            showNotification('error', 'Error al actualizar la factura: ' + (err.message || err));
        } finally {
            setSavingFactura(false);
        }
    };

    // Función para cancelar edición
    const cancelEditFactura = () => {
        setEditingFactura(null);
        setFormDataFactura({
            numero_factura: '',
            fecha_vencimiento: '',
            monto_total: '',
            monto_pagado: '',
            moneda: 'USD',
            estatus: 'pendiente',
            observaciones: '',
            fecha_pago: ''
        });
    };

    // Función para abrir formulario de nueva factura
    const handleCreateFactura = () => {
        setCreatingFactura(true);
        setFormDataFactura({
            numero_factura: `FAC-${Date.now()}`, // Generar número automático
            fecha_vencimiento: '',
            monto_total: '',
            monto_pagado: '0',
            moneda: 'USD',
            estatus: 'pendiente',
            observaciones: '',
            fecha_pago: ''
        });
    };

    // Función para guardar nueva factura
    const handleSaveNewFactura = async (e) => {
        e.preventDefault();
        
        setSavingNewFactura(true);
        try {
            const payload = {
                id_cliente: cotizacion.id_cliente,
                id_cotizacion: cotizacionId,
                numero_factura: formDataFactura.numero_factura,
                fecha_vencimiento: formDataFactura.fecha_vencimiento,
                monto_total: parseFloat(formDataFactura.monto_total),
                monto_pagado: parseFloat(formDataFactura.monto_pagado || 0),
                moneda: formDataFactura.moneda,
                estatus: formDataFactura.estatus,
                observaciones: formDataFactura.observaciones || undefined,
                fecha_pago: formDataFactura.fecha_pago || undefined
            };
            
            await apiPost('/facturas-cliente', payload);
            
            showNotification('success', 'Factura creada exitosamente');
            onRefreshFacturas();
            setCreatingFactura(false);
            
            setFormDataFactura({
                numero_factura: '',
                fecha_vencimiento: '',
                monto_total: '',
                monto_pagado: '',
                moneda: 'USD',
                estatus: 'pendiente',
                observaciones: '',
                fecha_pago: ''
            });
        } catch (err) {
            console.error('Error creando factura:', err);
            showNotification('error', 'Error al crear la factura: ' + (err.message || err));
        } finally {
            setSavingNewFactura(false);
        }
    };

    // Función para cancelar creación
    const cancelCreateFactura = () => {
        setCreatingFactura(false);
        setFormDataFactura({
            numero_factura: '',
            fecha_vencimiento: '',
            monto_total: '',
            monto_pagado: '',
            moneda: 'USD',
            estatus: 'pendiente',
            observaciones: '',
            fecha_pago: ''
        });
    };

    // Mostrar encabezado incluso si no hay facturas, para mantener consistencia visual
    if (facturasRelacionadas.length === 0 && !creatingFactura) {
        return (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--light-bg)',
                    borderRadius: '8px',
                    border: '1px solid var(--text-secondary)'
                }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        0 Facturas
                    </span>
                    <button 
                        onClick={handleCreateFactura} 
                        className="btn btn-primary"
                        style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem' }}
                    >
                        <Plus size={18} /> Nueva Factura
                    </button>
                </div>

                <div style={{ 
                    padding: '1.25rem',
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px'
                }}>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        No hay facturas asociadas a esta cotización
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gap: '1rem' }}>
            {/* Encabezado con botón de agregar factura (solo cuando hay facturas existentes) */}
            {facturasRelacionadas.length > 0 && !creatingFactura && !editingFactura && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--light-bg)',
                    borderRadius: '8px',
                    border: '1px solid var(--text-secondary)'
                }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {facturasRelacionadas.length} Factura{facturasRelacionadas.length !== 1 ? 's' : ''}
                    </span>
                    <button 
                        onClick={handleCreateFactura} 
                        className="btn btn-primary"
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                    >
                        <Plus size={16} /> Nueva Factura
                    </button>
                </div>
            )}

            {/* Formulario de creación de nueva factura */}
            {creatingFactura && (
                <div className="client-form-card" style={{ marginBottom: '1rem' }}>
                    <h3 className="form-card-title">
                        <Receipt size={24} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
                        Nueva Factura para Cotización #{cotizacionId}
                    </h3>

                    <form onSubmit={handleSaveNewFactura} className="form-content">
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label" htmlFor="numero_factura_new">Número de Factura*</label>
                                <div className="input-field-wrapper">
                                    <span className="input-icon-left"><Receipt size={20} className="input-icon" /></span>
                                    <input
                                        type="text"
                                        id="numero_factura_new"
                                        name="numero_factura"
                                        value={formDataFactura.numero_factura}
                                        onChange={handleFormFacturaChange}
                                        className="form-input with-icon"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="fecha_vencimiento_new">Fecha de Vencimiento*</label>
                                <div className="input-field-wrapper">
                                    <span className="input-icon-left"><Calendar size={20} className="input-icon" /></span>
                                    <input
                                        type="date"
                                        id="fecha_vencimiento_new"
                                        name="fecha_vencimiento"
                                        value={formDataFactura.fecha_vencimiento}
                                        onChange={handleFormFacturaChange}
                                        className="form-input with-icon"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="monto_total_new">Monto Total*</label>
                                <div className="input-field-wrapper">
                                    <span className="input-icon-left"><DollarSign size={20} className="input-icon" /></span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        id="monto_total_new"
                                        name="monto_total"
                                        value={formDataFactura.monto_total}
                                        onChange={handleFormFacturaChange}
                                        className="form-input with-icon"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="monto_pagado_new">Monto Pagado</label>
                                <div className="input-field-wrapper">
                                    <span className="input-icon-left"><CreditCard size={20} className="input-icon" /></span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        id="monto_pagado_new"
                                        name="monto_pagado"
                                        value={formDataFactura.monto_pagado}
                                        onChange={handleFormFacturaChange}
                                        className="form-input with-icon"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="moneda_new">Moneda*</label>
                                <div className="select-wrapper">
                                    <select
                                        id="moneda_new"
                                        name="moneda"
                                        value={formDataFactura.moneda}
                                        onChange={handleFormFacturaChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="USD">USD</option>
                                        <option value="MXN">MXN</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                    <ChevronsUpDown size={20} className="select-arrow" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="estatus_new">Estado*</label>
                                <div className="select-wrapper">
                                    <select
                                        id="estatus_new"
                                        name="estatus"
                                        value={formDataFactura.estatus}
                                        onChange={handleFormFacturaChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="pagada">Pagada</option>
                                        <option value="vencida">Vencida</option>
                                        <option value="cancelada">Cancelada</option>
                                    </select>
                                    <ChevronsUpDown size={20} className="select-arrow" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="fecha_pago_new">Fecha de Pago</label>
                                <div className="input-field-wrapper">
                                    <span className="input-icon-left"><Calendar size={20} className="input-icon" /></span>
                                    <input
                                        type="date"
                                        id="fecha_pago_new"
                                        name="fecha_pago"
                                        value={formDataFactura.fecha_pago}
                                        onChange={handleFormFacturaChange}
                                        className="form-input with-icon"
                                    />
                                </div>
                            </div>

                            <div className="form-group span-full">
                                <label className="form-label" htmlFor="observaciones_new">Observaciones</label>
                                <div className="input-field-wrapper">
                                    <textarea
                                        id="observaciones_new"
                                        name="observaciones"
                                        value={formDataFactura.observaciones}
                                        onChange={handleFormFacturaChange}
                                        className="form-input"
                                        rows="3"
                                        placeholder="Observaciones adicionales sobre la factura..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={cancelCreateFactura} disabled={savingNewFactura}>
                                <X size={20} /> Cancelar
                            </button>

                            <button type="submit" className="btn btn-primary" disabled={savingNewFactura}>
                                <Save size={20} /> 
                                {savingNewFactura ? 'Creando...' : 'Crear Factura'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Formulario de edición de factura */}
            {editingFactura && (
                <div className="client-form-card" style={{ marginBottom: '1rem' }}>
                    <h3 className="form-card-title">
                        <Receipt size={24} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
                        Editar Factura: {editingFactura.numero_factura}
                    </h3>

                    <form onSubmit={handleSaveFactura} className="form-content">
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label" htmlFor="numero_factura">Número de Factura*</label>
                                <div className="input-field-wrapper">
                                    <span className="input-icon-left"><Receipt size={20} className="input-icon" /></span>
                                    <input
                                        type="text"
                                        id="numero_factura"
                                        name="numero_factura"
                                        value={formDataFactura.numero_factura}
                                        onChange={handleFormFacturaChange}
                                        className="form-input with-icon"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="fecha_vencimiento">Fecha de Vencimiento*</label>
                                <div className="input-field-wrapper">
                                    <span className="input-icon-left"><Calendar size={20} className="input-icon" /></span>
                                    <input
                                        type="date"
                                        id="fecha_vencimiento"
                                        name="fecha_vencimiento"
                                        value={formDataFactura.fecha_vencimiento}
                                        onChange={handleFormFacturaChange}
                                        className="form-input with-icon"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="monto_total">Monto Total*</label>
                                <div className="input-field-wrapper">
                                    <span className="input-icon-left"><DollarSign size={20} className="input-icon" /></span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        id="monto_total"
                                        name="monto_total"
                                        value={formDataFactura.monto_total}
                                        onChange={handleFormFacturaChange}
                                        className="form-input with-icon"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="monto_pagado">Monto Pagado</label>
                                <div className="input-field-wrapper">
                                    <span className="input-icon-left"><CreditCard size={20} className="input-icon" /></span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        id="monto_pagado"
                                        name="monto_pagado"
                                        value={formDataFactura.monto_pagado}
                                        onChange={handleFormFacturaChange}
                                        className="form-input with-icon"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="moneda">Moneda*</label>
                                <div className="select-wrapper">
                                    <select
                                        id="moneda"
                                        name="moneda"
                                        value={formDataFactura.moneda}
                                        onChange={handleFormFacturaChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="USD">USD</option>
                                        <option value="MXN">MXN</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                    <ChevronsUpDown size={20} className="select-arrow" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="estatus">Estado*</label>
                                <div className="select-wrapper">
                                    <select
                                        id="estatus"
                                        name="estatus"
                                        value={formDataFactura.estatus}
                                        onChange={handleFormFacturaChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="pagada">Pagada</option>
                                        <option value="vencida">Vencida</option>
                                        <option value="cancelada">Cancelada</option>
                                    </select>
                                    <ChevronsUpDown size={20} className="select-arrow" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="fecha_pago">Fecha de Pago</label>
                                <div className="input-field-wrapper">
                                    <span className="input-icon-left"><Calendar size={20} className="input-icon" /></span>
                                    <input
                                        type="date"
                                        id="fecha_pago"
                                        name="fecha_pago"
                                        value={formDataFactura.fecha_pago}
                                        onChange={handleFormFacturaChange}
                                        className="form-input with-icon"
                                    />
                                </div>
                            </div>

                            <div className="form-group span-full">
                                <label className="form-label" htmlFor="observaciones">Observaciones</label>
                                <div className="input-field-wrapper">
                                    <textarea
                                        id="observaciones"
                                        name="observaciones"
                                        value={formDataFactura.observaciones}
                                        onChange={handleFormFacturaChange}
                                        className="form-input"
                                        rows="3"
                                        placeholder="Observaciones adicionales sobre la factura..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={cancelEditFactura} disabled={savingFactura}>
                                <X size={20} /> Cancelar
                            </button>

                            <button type="submit" className="btn btn-primary" disabled={savingFactura}>
                                <Save size={20} /> 
                                {savingFactura ? 'Actualizando...' : 'Actualizar Factura'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Banner de confirmación de eliminación de factura */}
            {facturaToDelete && (
                <div className="delete-confirm-banner" style={{ marginBottom: '1rem' }}>
                    <div className="banner-icon-message">
                        <AlertTriangle size={24} className="banner-icon" />
                        <p>
                            ¿Seguro que deseas eliminar la factura <strong>{facturaToDelete.numero_factura}</strong>? 
                            Esta acción no se puede deshacer.
                        </p>
                    </div>

                    <div className="banner-actions">
                        <button className="btn btn-secondary" onClick={cancelDeleteFactura}>
                            <XCircle size={18} /> Cancelar
                        </button>

                        <button 
                            className="btn btn-danger" 
                            onClick={confirmDeleteFactura}
                            disabled={deletingFactura === facturaToDelete.id_factura_cliente}
                        >
                            <Trash2 size={18} /> 
                            {deletingFactura === facturaToDelete.id_factura_cliente ? 'Eliminando...' : 'Confirmar Eliminación'}
                        </button>
                    </div>
                </div>
            )}

            {facturasRelacionadas.map(factura => {
                const statusInfo = getFacturaStatusDisplay(factura.estatus);
                const isExpanded = expandedFactura === factura.id_factura_cliente;
                
                return (
                    <div 
                        key={factura.id_factura_cliente}
                        style={{
                            border: '1px solid var(--text-secondary)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: 'transparent'
                        }}
                    >
                        {/* Header de la factura */}
                        <div style={{
                            padding: '1rem',
                            backgroundColor: 'var(--light-bg)',
                            borderBottom: '1px solid var(--text-secondary)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Receipt size={20} style={{ color: statusInfo.color }} />
                                    <strong style={{ fontSize: '1rem' }}>
                                        {factura.numero_factura}
                                    </strong>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '4px',
                                    backgroundColor: 'transparent',
                                    border: `2px solid ${statusInfo.color}`,
                                    color: statusInfo.color,
                                    fontSize: '0.85rem',
                                    fontWeight: '600'
                                }}>
                                    {statusInfo.icon}
                                    {statusInfo.text}
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--success)' }}>
                                        {formatCurrency(factura.monto_total, factura.moneda)}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        Emitida: {formatDate(factura.fecha_emision)}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setExpandedFactura(isExpanded ? null : factura.id_factura_cliente)}
                                    className="btn btn-secondary"
                                    style={{
                                        fontSize: '0.8rem',
                                        padding: '0.4rem 0.8rem'
                                    }}
                                >
                                    <Eye size={16} />
                                    {isExpanded ? 'Ocultar' : 'Ver Detalle'}
                                </button>
                            </div>
                        </div>

                        {/* Detalle expandido de la factura */}
                        {isExpanded && (
                            <div style={{ padding: '1.5rem', backgroundColor: 'transparent', border: '1px solid var(--text-secondary)', borderTop: 'none' }}>
                                <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Cliente</label>
                                        <p style={{ margin: 0, fontWeight: 600 }}>
                                            <Building2 size={16} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }} />
                                            {factura.cliente?.nombre_empresa || `Cliente ID: ${factura.id_cliente}`}
                                        </p>
                                        <small style={{ color: 'var(--text-secondary)' }}>
                                            RFC: {factura.cliente?.rfc || 'N/A'}
                                        </small>
                                    </div>

                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Fecha de Vencimiento</label>
                                        <p style={{ margin: 0, fontWeight: 600, color: 'var(--danger)' }}>
                                            <Calendar size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                                            {formatDate(factura.fecha_vencimiento)}
                                        </p>
                                    </div>

                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Monto Pagado</label>
                                        <p style={{ margin: 0, fontWeight: 600, color: 'var(--success)' }}>
                                            <CreditCard size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                                            {formatCurrency(factura.monto_pagado || 0, factura.moneda)}
                                        </p>
                                        {factura.fecha_pago && (
                                            <small style={{ color: 'var(--text-secondary)' }}>
                                                Fecha de pago: {formatDate(factura.fecha_pago)}
                                            </small>
                                        )}
                                    </div>

                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Saldo Pendiente</label>
                                        <p style={{ 
                                            margin: 0, 
                                            fontWeight: 700, 
                                            fontSize: '1.1rem',
                                            color: (parseFloat(factura.monto_total) - parseFloat(factura.monto_pagado || 0)) > 0 ? 'var(--danger)' : 'var(--success)'
                                        }}>
                                            <DollarSign size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                                            {formatCurrency(
                                                parseFloat(factura.monto_total) - parseFloat(factura.monto_pagado || 0), 
                                                factura.moneda
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {factura.observaciones && (
                                    <div style={{ marginTop: '1.5rem' }}>
                                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Observaciones</label>
                                        <div style={{
                                            padding: '1rem',
                                            backgroundColor: 'var(--light-bg)',
                                            borderRadius: '6px',
                                            border: '1px solid var(--text-secondary)',
                                            marginTop: '0.5rem'
                                        }}>
                                            <p style={{ margin: 0, lineHeight: '1.5' }}>
                                                {factura.observaciones}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Botones de acción de la factura */}
                                <div style={{
                                    marginTop: '1.5rem',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid var(--text-secondary)',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '0.75rem'
                                }}>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                                        onClick={() => handleEditFactura(factura)}
                                        disabled={deletingFactura === factura.id_factura_cliente || editingFactura || facturaToDelete || creatingFactura}
                                    >
                                        <Edit size={16} /> Editar
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                                        onClick={() => handleDeleteFactura(factura)}
                                        disabled={deletingFactura === factura.id_factura_cliente || facturaToDelete || creatingFactura}
                                    >
                                        <Trash2 size={16} /> Eliminar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// Componente para mostrar los documentos de una cotización
const DocumentosSection = ({ cotizacionId, documentos, onRefreshDocumentos, showNotification, cotizacion }) => {
    const [loadingDocumentos, setLoadingDocumentos] = useState(false);
    const [documentoToDelete, setDocumentoToDelete] = useState(null);
    const [deletingDocumento, setDeletingDocumento] = useState(null);
    const [creatingDocumento, setCreatingDocumento] = useState(false);
    const [savingNewDocumento, setSavingNewDocumento] = useState(false);
    const [newDocumentoForm, setNewDocumentoForm] = useState({
        nombre_documento: '',
        tipo_documento: 'otro',
        url_archivo: '',
        id_usuario_carga: 1 // Valor por defecto temporal
    });

    // Filtrar documentos relacionados con esta cotización
    const documentosRelacionados = documentos.filter(documento => 
        documento.id_cotizacion === cotizacionId
    );

    const handleDeleteDocumento = (documento) => {
        setDocumentoToDelete(documento);
    };

    const confirmDeleteDocumento = async () => {
        if (!documentoToDelete) return;
        
        try {
            setDeletingDocumento(documentoToDelete.id_documento);
            await apiDelete(`/documentos-relacionados/${documentoToDelete.id_documento}`);
            
            onRefreshDocumentos();
            showNotification('Documento eliminado correctamente', 'success');
        } catch (error) {
            console.error('Error eliminando documento:', error);
            showNotification('Error al eliminar documento', 'error');
        } finally {
            setDeletingDocumento(null);
            setDocumentoToDelete(null);
        }
    };

    const cancelDeleteDocumento = () => {
        setDocumentoToDelete(null);
    };

    const handleCreateNewDocumento = () => {
        setCreatingDocumento(true);
    };

    const handleSaveNewDocumento = async () => {
        try {
            if (!newDocumentoForm.nombre_documento.trim() || !newDocumentoForm.url_archivo.trim()) {
                showNotification('Por favor complete todos los campos requeridos', 'error');
                return;
            }

            setSavingNewDocumento(true);

            const payload = {
                id_cotizacion: cotizacionId,
                nombre_documento: newDocumentoForm.nombre_documento.trim(),
                tipo_documento: newDocumentoForm.tipo_documento,
                url_archivo: newDocumentoForm.url_archivo.trim(),
                id_usuario_carga: newDocumentoForm.id_usuario_carga
            };

            console.log('Creando nuevo documento:', payload);
            await apiPost('/documentos-relacionados', payload);
            
            onRefreshDocumentos();
            showNotification('Documento creado correctamente', 'success');
            
            
            // Limpiar el formulario
            setNewDocumentoForm({
                nombre_documento: '',
                tipo_documento: 'otro',
                url_archivo: '',
                id_usuario_carga: 1
            });
            setCreatingDocumento(false);
        } catch (error) {
            console.error('Error creando documento:', error);
            showNotification('Error al crear documento', 'error');
        } finally {
            setSavingNewDocumento(false);
        }
    };

    const handleCancelNewDocumento = () => {
        setNewDocumentoForm({
            nombre_documento: '',
            tipo_documento: 'otro',
            url_archivo: '',
            id_usuario_carga: 1
        });
        setCreatingDocumento(false);
    };

    // Mostrar estado vacío cuando no hay documentos y no se está creando uno nuevo
    if (documentosRelacionados.length === 0 && !creatingDocumento) {
        return (
            <div style={{ 
                marginTop: '1rem',
                padding: '1.5rem',
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ 
                        margin: 0,
                        color: 'var(--text-primary)',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <FileDown size={20} /> Documentos
                    </h4>
                    <button 
                        className="btn btn-primary" 
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        onClick={handleCreateNewDocumento}
                    >
                        <Plus size={16} /> Agregar Documento
                    </button>
                </div>
                <p style={{ 
                    margin: 0, 
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic'
                }}>
                    No hay documentos asociados a esta cotización
                </p>
            </div>
        );
    }

    return (
        <div style={{ 
            marginTop: '1rem',
            padding: '1.5rem',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px'
        }}>
            {/* Banner de confirmación de eliminación */}
            {documentoToDelete && (
                <div style={{
                    backgroundColor: 'var(--danger-bg)',
                    border: '1px solid var(--danger)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertTriangle size={20} color="var(--danger)" />
                        <span style={{ color: 'var(--text-primary)' }}>¿Eliminar documento "{documentoToDelete.nombre_documento}"?</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                            className="btn btn-danger" 
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                            onClick={confirmDeleteDocumento}
                            disabled={deletingDocumento === documentoToDelete.id_documento}
                        >
                            {deletingDocumento === documentoToDelete.id_documento ? 'Eliminando...' : 'Sí, eliminar'}
                        </button>
                        <button 
                            className="btn btn-secondary" 
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                            onClick={cancelDeleteDocumento}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Encabezado con botón de agregar documento (solo cuando hay documentos existentes) */}
            {documentosRelacionados.length > 0 && !creatingDocumento && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h4 style={{ 
                        margin: 0,
                        color: 'var(--text-primary)',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <FileDown size={20} />
                        {documentosRelacionados.length} Documento{documentosRelacionados.length !== 1 ? 's' : ''}
                    </h4>
                    <button 
                        className="btn btn-primary" 
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        onClick={handleCreateNewDocumento}
                        disabled={documentoToDelete}
                    >
                        <Plus size={16} /> Agregar Documento
                    </button>
                </div>
            )}

            {/* Formulario para crear nuevo documento */}
            {creatingDocumento && (
                <div style={{
                    backgroundColor: 'var(--input-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '1rem'
                }}>
                    <h5 style={{ 
                        margin: '0 0 1rem 0',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Upload size={18} /> Nuevo Documento
                    </h5>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ 
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: 'var(--text-primary)'
                            }}>
                                Nombre del documento *
                            </label>
                            <input
                                type="text"
                                value={newDocumentoForm.nombre_documento}
                                onChange={(e) => setNewDocumentoForm(prev => ({ 
                                    ...prev, 
                                    nombre_documento: e.target.value 
                                }))}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    backgroundColor: 'var(--input-bg)',
                                    color: 'var(--text-primary)'
                                }}
                                placeholder="Ingrese el nombre del documento"
                            />
                        </div>

                        <div>
                            <label style={{ 
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: 'var(--text-primary)'
                            }}>
                                Tipo de documento
                            </label>
                            <select
                                value={newDocumentoForm.tipo_documento}
                                onChange={(e) => setNewDocumentoForm(prev => ({ 
                                    ...prev, 
                                    tipo_documento: e.target.value 
                                }))}
                                className="documento-select"
                            >
                                <option value="BL">Bill of Lading</option>
                                <option value="AWB">Air Waybill</option>
                                <option value="carta_porte">Carta Porte</option>
                                <option value="packing_list">Packing List</option>
                                <option value="factura_comercial">Factura Comercial</option>
                                <option value="certificado_origen">Certificado de Origen</option>
                                <option value="pedimento">Pedimento</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ 
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: 'var(--text-primary)'
                            }}>
                                URL del archivo *
                            </label>
                            <input
                                type="url"
                                value={newDocumentoForm.url_archivo}
                                onChange={(e) => setNewDocumentoForm(prev => ({ 
                                    ...prev, 
                                    url_archivo: e.target.value 
                                }))}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    backgroundColor: 'var(--input-bg)',
                                    color: 'var(--text-primary)'
                                }}
                                placeholder="https://ejemplo.com/documento.pdf"
                            />
                        </div>
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        gap: '0.75rem',
                        marginTop: '1.5rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--border-color)'
                    }}>
                        <button
                            className="btn btn-secondary"
                            onClick={handleCancelNewDocumento}
                            disabled={savingNewDocumento}
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        >
                            <X size={16} /> Cancelar
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSaveNewDocumento}
                            disabled={savingNewDocumento || !newDocumentoForm.nombre_documento.trim() || !newDocumentoForm.url_archivo.trim()}
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        >
                            {savingNewDocumento ? (
                                <>Guardando...</>
                            ) : (
                                <><Save size={16} /> Guardar Documento</>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Lista de documentos */}
            {documentosRelacionados.map((documento, index) => {
                return (
                    <div 
                        key={documento.id_documento}
                        style={{
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            padding: '1.5rem',
                            marginBottom: index < documentosRelacionados.length - 1 ? '1rem' : 0,
                            opacity: deletingDocumento === documento.id_documento ? 0.6 : 1,
                            transition: 'opacity 0.2s ease'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem'
                        }}>
                            {/* Icono del tipo de documento */}
                            <div style={{
                                padding: '0.75rem',
                                backgroundColor: 'var(--input-bg)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {getTipoDocumentoIcon(documento.tipo_documento)}
                            </div>

                            {/* Información del documento */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <h5 style={{ 
                                        margin: 0,
                                        color: 'var(--text-primary)',
                                        fontSize: '1.1rem'
                                    }}>
                                        {documento.nombre_documento}
                                    </h5>
                                </div>

                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '1rem',
                                    marginTop: '1rem'
                                }}>
                                    <div>
                                        <span style={{ 
                                            fontWeight: '500',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.85rem'
                                        }}>
                                            Tipo:
                                        </span>
                                        <p style={{ 
                                            margin: '0.25rem 0 0 0',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.9rem'
                                        }}>
                                            {getTipoDocumentoDisplay(documento.tipo_documento)}
                                        </p>
                                    </div>

                                    <div>
                                        <span style={{ 
                                            fontWeight: '500',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.85rem'
                                        }}>
                                            Fecha de carga:
                                        </span>
                                        <p style={{ 
                                            margin: '0.25rem 0 0 0',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.9rem'
                                        }}>
                                            {formatDate(documento.fecha_carga)}
                                        </p>
                                    </div>

                                    <div>
                                        <span style={{ 
                                            fontWeight: '500',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.85rem'
                                        }}>
                                            Archivo:
                                        </span>
                                        <div style={{ 
                                            margin: '0.25rem 0 0 0',
                                        }}>
                                            <a 
                                                href={documento.url_archivo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    color: 'var(--primary)',
                                                    textDecoration: 'none',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                    fontSize: '0.9rem'
                                                }}
                                                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                            >
                                                <ExternalLink size={14} />
                                                Ver documento
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Botones de acción del documento */}
                                <div style={{
                                    marginTop: '1.5rem',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid var(--border-color)',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '0.75rem'
                                }}>
                                    <button
                                        className="btn btn-danger"
                                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                                        onClick={() => handleDeleteDocumento(documento)}
                                        disabled={deletingDocumento === documento.id_documento || documentoToDelete || creatingDocumento}
                                    >
                                        <Trash2 size={16} /> Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// DEMORAS SECTION COMPONENT
const DemorasSection = ({ cotizacionId, operacionId, demoras = [], onRefreshDemoras, showNotification, cotizacion }) => {
    const [creatingDemora, setCreatingDemora] = useState(false);
    const [savingNewDemora, setSavingNewDemora] = useState(false);
    const [demoraToDelete, setDemoraToDelete] = useState(null);
    const [deletingDemora, setDeletingDemora] = useState(null);
    const [newDemoraForm, setNewDemoraForm] = useState({
        tipo_demora: 'climatica',
        fecha_hora_demora: '',
        descripcion_demora: '',
        costo_asociado: '',
        moneda: 'USD'
    });

    // Filtrar demoras para esta operación (demoras están vinculadas a operación, no a cotización)
    // Usar coerción numérica para evitar mismatches entre strings y números devueltos por el API
    const demorasRelacionadas = demoras.filter(demora => 
        Number(demora.id_operacion) === Number(operacionId)
    );

    const handleDeleteDemora = (demora) => {
        setDemoraToDelete(demora);
    };

    const confirmDeleteDemora = async () => {
        if (!demoraToDelete) return;
        
            try {
            setDeletingDemora(demoraToDelete.id_demora);
            await apiDelete(`/demoras/${demoraToDelete.id_demora}`);
            
            onRefreshDemoras();
            showNotification('success', 'Demora eliminada correctamente');
        } catch (error) {
            console.error('Error eliminando demora:', error);
            showNotification('error', 'Error al eliminar demora');
        } finally {
            setDeletingDemora(null);
            setDemoraToDelete(null);
        }
    };

    const cancelDeleteDemora = () => {
        setDemoraToDelete(null);
    };

    const handleCreateNewDemora = () => {
        setCreatingDemora(true);
    };

    const handleSaveNewDemora = async () => {
        try {
            if (!newDemoraForm.fecha_hora_demora.trim() || !newDemoraForm.descripcion_demora.trim()) {
                showNotification('error', 'Por favor complete todos los campos requeridos');
                return;
            }

            // Validación: requiere operación asociada
            if (!operacionId) {
                showNotification('error', 'No hay operación asociada a esta cotización. Genera la operación antes de registrar demoras.');
                return;
            }

            setSavingNewDemora(true);

            const payload = {
                id_operacion: operacionId,
                tipo_demora: newDemoraForm.tipo_demora,
                fecha_hora_demora: newDemoraForm.fecha_hora_demora.trim(),
                descripcion_demora: newDemoraForm.descripcion_demora.trim(),
                costo_asociado: newDemoraForm.costo_asociado ? parseFloat(newDemoraForm.costo_asociado) : 0,
                moneda: newDemoraForm.moneda
            };

            console.log('Creando nueva demora:', payload);
            await apiPost('/demoras', payload);
            
            onRefreshDemoras();
            showNotification('success', 'Demora registrada correctamente');
            
            setNewDemoraForm({
                tipo_demora: 'climatica',
                fecha_hora_demora: '',
                descripcion_demora: '',
                costo_asociado: '',
                moneda: 'USD'
            });
            setCreatingDemora(false);
        } catch (error) {
            console.error('Error creando demora:', error);
            showNotification('error', 'Error al registrar demora');
        } finally {
            setSavingNewDemora(false);
        }
    };

    const handleCancelNewDemora = () => {
        setNewDemoraForm({
            tipo_demora: 'climatica',
            fecha_hora_demora: '',
            descripcion_demora: '',
            costo_asociado: '',
            moneda: 'USD'
        });
        setCreatingDemora(false);
    };

    // Mostrar estado vacío cuando no hay demoras y no se está creando una nueva
    if (demorasRelacionadas.length === 0 && !creatingDemora) {
        return (
            <div style={{ 
                marginTop: '0.5rem',
                padding: '0',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0'
            }}>
                <div style={{ 
                    marginTop: '0.5rem',
                    padding: '1.5rem',
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <p style={{ 
                        margin: 0, 
                        color: 'var(--text-secondary)',
                        fontStyle: 'italic',
                        flex: 1
                    }}>
                        {operacionId ? 'No hay demoras registradas para esta operación' : 'No hay operación asociada a esta cotización'}
                    </p>
                    <button 
                        className="btn btn-primary" 
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', marginLeft: '1rem', whiteSpace: 'nowrap' }}
                        onClick={handleCreateNewDemora}
                    >
                        <Plus size={16} /> Registrar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            marginTop: '0.5rem',
            padding: '0',
            backgroundColor: 'transparent',
            border: 'none'
        }}>
            {/* Banner de confirmación de eliminación */}
            {demoraToDelete && (
                <div style={{
                    backgroundColor: 'var(--danger-bg)',
                    border: '1px solid var(--danger)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertTriangle size={20} color="var(--danger)" />
                        <span style={{ color: 'var(--text-primary)' }}>¿Eliminar demora del {formatDate(demoraToDelete.fecha_hora_demora)}?</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                            className="btn btn-danger" 
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                            onClick={confirmDeleteDemora}
                            disabled={deletingDemora === demoraToDelete.id_demora}
                        >
                            {deletingDemora === demoraToDelete.id_demora ? 'Eliminando...' : 'Sí, eliminar'}
                        </button>
                        <button 
                            className="btn btn-secondary" 
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                            onClick={cancelDeleteDemora}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Encabezado con botón de agregar demora */}
            {demorasRelacionadas.length > 0 && !creatingDemora && (
                <div style={{ 
                    marginTop: '0.5rem',
                    padding: '1rem 1.5rem',
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px 8px 0 0',
                    borderBottom: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h4 style={{ 
                        margin: 0,
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        {demorasRelacionadas.length} Demora{demorasRelacionadas.length !== 1 ? 's' : ''}
                    </h4>
                    <button 
                        className="btn btn-primary" 
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        onClick={handleCreateNewDemora}
                        disabled={demoraToDelete}
                    >
                        <Plus size={16} /> Agregar
                    </button>
                </div>
            )}

            {/* Formulario para crear nueva demora */}
            {creatingDemora && (
                <div style={{
                    backgroundColor: 'var(--input-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginTop: '0.5rem'
                }}>
                    <h5 style={{ 
                        margin: '0 0 1rem 0',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        ⏱ Nueva Demora
                    </h5>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ 
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: 'var(--text-primary)'
                            }}>
                                Tipo de demora *
                            </label>
                            <select
                                value={newDemoraForm.tipo_demora}
                                onChange={(e) => setNewDemoraForm(prev => ({ 
                                    ...prev, 
                                    tipo_demora: e.target.value 
                                }))}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    backgroundColor: 'var(--input-bg)',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                <option value="climatica">Climática</option>
                                <option value="aduana">Aduana</option>
                                <option value="mecanica">Mecánica</option>
                                <option value="documental">Documental</option>
                                <option value="trafico">Tráfico</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ 
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: 'var(--text-primary)'
                            }}>
                                Fecha y hora de demora *
                            </label>
                            <input
                                type="datetime-local"
                                value={newDemoraForm.fecha_hora_demora}
                                onChange={(e) => setNewDemoraForm(prev => ({ 
                                    ...prev, 
                                    fecha_hora_demora: e.target.value 
                                }))}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    backgroundColor: 'var(--input-bg)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ 
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: 'var(--text-primary)'
                            }}>
                                Descripción de la demora *
                            </label>
                            <textarea
                                value={newDemoraForm.descripcion_demora}
                                onChange={(e) => setNewDemoraForm(prev => ({ 
                                    ...prev, 
                                    descripcion_demora: e.target.value 
                                }))}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    backgroundColor: 'var(--input-bg)',
                                    color: 'var(--text-primary)',
                                    minHeight: '80px',
                                    fontFamily: 'inherit'
                                }}
                                placeholder="Detalle la razón y los detalles de la demora"
                            />
                        </div>

                        <div>
                            <label style={{ 
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: 'var(--text-primary)'
                            }}>
                                Costo asociado
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={newDemoraForm.costo_asociado}
                                onChange={(e) => setNewDemoraForm(prev => ({ 
                                    ...prev, 
                                    costo_asociado: e.target.value 
                                }))}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    backgroundColor: 'var(--input-bg)',
                                    color: 'var(--text-primary)'
                                }}
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label style={{ 
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: 'var(--text-primary)'
                            }}>
                                Moneda
                            </label>
                            <select
                                value={newDemoraForm.moneda}
                                onChange={(e) => setNewDemoraForm(prev => ({ 
                                    ...prev, 
                                    moneda: e.target.value 
                                }))}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    backgroundColor: 'var(--input-bg)',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="MXN">MXN</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        gap: '0.75rem',
                        marginTop: '1.5rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--border-color)'
                    }}>
                        <button
                            className="btn btn-secondary"
                            onClick={handleCancelNewDemora}
                            disabled={savingNewDemora}
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        >
                            <X size={16} /> Cancelar
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSaveNewDemora}
                            disabled={savingNewDemora || !newDemoraForm.fecha_hora_demora.trim() || !newDemoraForm.descripcion_demora.trim()}
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        >
                            {savingNewDemora ? (
                                <>Guardando...</>
                            ) : (
                                <><Save size={16} /> Registrar Demora</>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Lista de demoras */}
            <div style={{
                marginTop: '0.5rem',
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: demorasRelacionadas.length > 0 && !creatingDemora ? '0 0 8px 8px' : '8px',
                overflow: 'hidden'
            }}>
            {demorasRelacionadas.map((demora, index) => {
                return (
                    <div 
                        key={demora.id_demora}
                        style={{
                            backgroundColor: 'var(--card-bg)',
                            border: 'none',
                            borderBottom: index < demorasRelacionadas.length - 1 ? '1px solid var(--border-color)' : 'none',
                            borderRadius: '0',
                            padding: '1.5rem',
                            marginBottom: 0,
                            opacity: deletingDemora === demora.id_demora ? 0.6 : 1,
                            transition: 'opacity 0.2s ease'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem'
                        }}>
                            <div style={{
                                padding: '0.75rem',
                                backgroundColor: 'var(--input-bg)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                ⏱
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <h5 style={{ 
                                        margin: 0,
                                        color: 'var(--text-primary)',
                                        fontSize: '1.1rem',
                                        textTransform: 'capitalize'
                                    }}>
                                        {demora.tipo_demora || 'Demora'}
                                    </h5>
                                </div>

                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '1rem',
                                    marginTop: '1rem'
                                }}>
                                    <div>
                                        <span style={{ 
                                            fontWeight: '500',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.85rem'
                                        }}>
                                            Fecha y hora:
                                        </span>
                                        <p style={{ 
                                            margin: '0.25rem 0 0 0',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.9rem'
                                        }}>
                                            {formatDate(demora.fecha_hora_demora)}
                                        </p>
                                    </div>

                                    <div>
                                        <span style={{ 
                                            fontWeight: '500',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.85rem'
                                        }}>
                                            Tipo:
                                        </span>
                                        <p style={{ 
                                            margin: '0.25rem 0 0 0',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.9rem',
                                            textTransform: 'capitalize'
                                        }}>
                                            {demora.tipo_demora || 'No especificado'}
                                        </p>
                                    </div>

                                    {demora.costo_asociado > 0 && (
                                        <div>
                                            <span style={{ 
                                                fontWeight: '500',
                                                color: 'var(--text-secondary)',
                                                fontSize: '0.85rem'
                                            }}>
                                                Costo:
                                            </span>
                                            <p style={{ 
                                                margin: '0.25rem 0 0 0',
                                                color: 'var(--danger)',
                                                fontSize: '0.9rem',
                                                fontWeight: 600
                                            }}>
                                                {demora.moneda || 'USD'} {demora.costo_asociado?.toFixed(2) || '0.00'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div style={{ marginTop: '1rem' }}>
                                    <span style={{ 
                                        fontWeight: '500',
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.85rem'
                                    }}>
                                        Descripción:
                                    </span>
                                    <p style={{ 
                                        margin: '0.25rem 0 0 0',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.5
                                    }}>
                                        {demora.descripcion_demora}
                                    </p>
                                </div>

                                <div style={{
                                    marginTop: '1.5rem',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid var(--border-color)',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '0.75rem'
                                }}>
                                    <button
                                        className="btn btn-danger"
                                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                                        onClick={() => handleDeleteDemora(demora)}
                                        disabled={deletingDemora === demora.id_demora || demoraToDelete || creatingDemora}
                                    >
                                        <Trash2 size={16} /> Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            </div>
        </div>
    );
};

// INCIDENCIAS SECTION COMPONENT
const IncidenciasSection = ({ cotizacionId, operacionId, incidencias = [], onRefreshIncidencias, showNotification, cotizacion }) => {
    const [creatingIncidencia, setCreatingIncidencia] = useState(false);
    const [savingNewIncidencia, setSavingNewIncidencia] = useState(false);
    const [incidenciaToDelete, setIncidenciaToDelete] = useState(null);
    const [deletingIncidencia, setDeletingIncidencia] = useState(null);
    const [newIncidenciaForm, setNewIncidenciaForm] = useState({
        tipo_incidencia: 'daño_mercancia',
        estatus: 'reportada',
        fecha_hora_incidencia: '',
        fecha_resolucion: '',
        comentarios_resolucion: ''
    });

    const incidenciasRelacionadas = incidencias.filter(incidencia => 
        Number(incidencia.id_operacion) === Number(operacionId)
    );

    const handleDeleteIncidencia = (incidencia) => {
        setIncidenciaToDelete(incidencia);
    };

    const confirmDeleteIncidencia = async () => {
        if (!incidenciaToDelete) return;
        
        try {
            setDeletingIncidencia(incidenciaToDelete.id_incidencia);
            await apiDelete(`/incidencias/${incidenciaToDelete.id_incidencia}`);
            
            onRefreshIncidencias();
            showNotification('success', 'Incidencia eliminada correctamente');
        } catch (error) {
            console.error('Error eliminando incidencia:', error);
            showNotification('error', 'Error al eliminar incidencia');
        } finally {
            setDeletingIncidencia(null);
            setIncidenciaToDelete(null);
        }
    };

    const cancelDeleteIncidencia = () => {
        setIncidenciaToDelete(null);
    };

    const handleCreateNewIncidencia = () => {
        setCreatingIncidencia(true);
    };

    const handleSaveNewIncidencia = async () => {
        try {
            if (!newIncidenciaForm.fecha_hora_incidencia.trim()) {
                showNotification('error', 'Por favor complete la fecha de la incidencia');
                return;
            }

            // Validación: requiere operación asociada
            if (!operacionId) {
                showNotification('error', 'No hay operación asociada a esta cotización. Genera la operación antes de reportar incidencias.');
                return;
            }

            setSavingNewIncidencia(true);

            const payload = {
                id_operacion: operacionId,
                tipo_incidencia: newIncidenciaForm.tipo_incidencia,
                estatus: newIncidenciaForm.estatus,
                fecha_hora_incidencia: newIncidenciaForm.fecha_hora_incidencia.trim(),
                fecha_resolucion: newIncidenciaForm.fecha_resolucion.trim() || null,
                comentarios_resolucion: newIncidenciaForm.comentarios_resolucion.trim() || null
            };

            console.log('Creando nueva incidencia:', payload);
            await apiPost('/incidencias', payload);
            
            onRefreshIncidencias();
            showNotification('success', 'Incidencia registrada correctamente');
            
            setNewIncidenciaForm({
                tipo_incidencia: 'daño_mercancia',
                estatus: 'reportada',
                fecha_hora_incidencia: '',
                fecha_resolucion: '',
                comentarios_resolucion: ''
            });
            setCreatingIncidencia(false);
        } catch (error) {
            console.error('Error creando incidencia:', error);
            showNotification('error', 'Error al registrar incidencia');
        } finally {
            setSavingNewIncidencia(false);
        }
    };

    const handleCancelNewIncidencia = () => {
        setNewIncidenciaForm({
            tipo_incidencia: 'daño_mercancia',
            estatus: 'reportada',
            fecha_hora_incidencia: '',
            fecha_resolucion: '',
            comentarios_resolucion: ''
        });
        setCreatingIncidencia(false);
    };

    if (incidenciasRelacionadas.length === 0 && !creatingIncidencia) {
        return (
            <div style={{ 
                marginTop: '0.5rem',
                padding: '0',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0'
            }}>
                <div style={{ 
                    marginTop: '0.5rem',
                    padding: '1.5rem',
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <p style={{ 
                        margin: 0, 
                        color: 'var(--text-secondary)',
                        fontStyle: 'italic',
                        flex: 1
                    }}>
                        {operacionId ? 'No hay incidencias registradas para esta operación' : 'No hay operación asociada a esta cotización'}
                    </p>
                    <button 
                        className="btn btn-primary" 
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', marginLeft: '1rem', whiteSpace: 'nowrap' }}
                        onClick={handleCreateNewIncidencia}
                    >
                        <Plus size={16} /> Reportar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            marginTop: '0.5rem',
            padding: '0',
            backgroundColor: 'transparent',
            border: 'none'
        }}>
            {/* Banner de confirmación de eliminación */}
            {incidenciaToDelete && (
                <div style={{
                    backgroundColor: 'var(--danger-bg)',
                    border: '1px solid var(--danger)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertTriangle size={20} color="var(--danger)" />
                        <span style={{ color: 'var(--text-primary)' }}>¿Eliminar incidencia del {formatDate(incidenciaToDelete.fecha_hora_incidencia)}?</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                            className="btn btn-danger" 
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                            onClick={confirmDeleteIncidencia}
                            disabled={deletingIncidencia === incidenciaToDelete.id_incidencia}
                        >
                            {deletingIncidencia === incidenciaToDelete.id_incidencia ? 'Eliminando...' : 'Sí, eliminar'}
                        </button>
                        <button 
                            className="btn btn-secondary" 
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                            onClick={cancelDeleteIncidencia}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Encabezado con botón de agregar incidencia */}
            {incidenciasRelacionadas.length > 0 && !creatingIncidencia && (
                <div style={{ 
                    marginTop: '0.5rem',
                    padding: '1rem 1.5rem',
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px 8px 0 0',
                    borderBottom: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h4 style={{ 
                        margin: 0,
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        {incidenciasRelacionadas.length} Incidencia{incidenciasRelacionadas.length !== 1 ? 's' : ''}
                    </h4>
                    {operacionId && (
                        <button 
                            className="btn btn-primary" 
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                            onClick={handleCreateNewIncidencia}
                            disabled={incidenciaToDelete}
                        >
                            <Plus size={16} /> Agregar
                        </button>
                    )}
                </div>
            )}

            {/* Formulario para crear nueva incidencia */}
            {creatingIncidencia && (
                <div style={{
                    backgroundColor: 'var(--input-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginTop: '0.5rem'
                }}>
                    <h5 style={{ 
                        margin: '0 0 1rem 0',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        ⚠ Nueva Incidencia
                    </h5>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ 
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: 'var(--text-primary)'
                            }}>
                                Tipo de incidencia *
                            </label>
                            <select
                                value={newIncidenciaForm.tipo_incidencia}
                                onChange={(e) => setNewIncidenciaForm(prev => ({ 
                                    ...prev, 
                                    tipo_incidencia: e.target.value 
                                }))}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    backgroundColor: 'var(--input-bg)',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                <option value="daño_mercancia">Daño de Mercancía</option>
                                <option value="extravio_parcial">Extravío Parcial</option>
                                <option value="extravio_total">Extravío Total</option>
                                <option value="robo">Robo</option>
                                <option value="error_documentacion">Error en Documentación</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ 
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: 'var(--text-primary)'
                            }}>
                                Estatus *
                            </label>
                            <select
                                value={newIncidenciaForm.estatus}
                                onChange={(e) => setNewIncidenciaForm(prev => ({ 
                                    ...prev, 
                                    estatus: e.target.value 
                                }))}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    backgroundColor: 'var(--input-bg)',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                <option value="reportada">Reportada</option>
                                <option value="en_revision">En Revisión</option>
                                <option value="resuelta">Resuelta</option>
                                <option value="escalada">Escalada</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ 
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: 'var(--text-primary)'
                            }}>
                                Fecha y hora de incidencia *
                            </label>
                            <input
                                type="datetime-local"
                                value={newIncidenciaForm.fecha_hora_incidencia}
                                onChange={(e) => setNewIncidenciaForm(prev => ({ 
                                    ...prev, 
                                    fecha_hora_incidencia: e.target.value 
                                }))}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    backgroundColor: 'var(--input-bg)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ 
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: 'var(--text-primary)'
                            }}>
                                Fecha de resolución
                            </label>
                            <input
                                type="datetime-local"
                                value={newIncidenciaForm.fecha_resolucion}
                                onChange={(e) => setNewIncidenciaForm(prev => ({ 
                                    ...prev, 
                                    fecha_resolucion: e.target.value 
                                }))}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    backgroundColor: 'var(--input-bg)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ 
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: 'var(--text-primary)'
                            }}>
                                Comentarios de resolución
                            </label>
                            <textarea
                                value={newIncidenciaForm.comentarios_resolucion}
                                onChange={(e) => setNewIncidenciaForm(prev => ({ 
                                    ...prev, 
                                    comentarios_resolucion: e.target.value 
                                }))}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    backgroundColor: 'var(--input-bg)',
                                    color: 'var(--text-primary)',
                                    minHeight: '80px',
                                    fontFamily: 'inherit'
                                }}
                                placeholder="Describa cómo se resolvió o se está resolviendo la incidencia"
                            />
                        </div>
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        gap: '0.75rem',
                        marginTop: '1.5rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--border-color)'
                    }}>
                        <button
                            className="btn btn-secondary"
                            onClick={handleCancelNewIncidencia}
                            disabled={savingNewIncidencia}
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        >
                            <X size={16} /> Cancelar
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSaveNewIncidencia}
                            disabled={savingNewIncidencia || !newIncidenciaForm.fecha_hora_incidencia.trim()}
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        >
                            {savingNewIncidencia ? (
                                <>Guardando...</>
                            ) : (
                                <><Save size={16} /> Reportar Incidencia</>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Lista de incidencias */}
            <div style={{
                marginTop: '0.5rem',
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: incidenciasRelacionadas.length > 0 && !creatingIncidencia ? '0 0 8px 8px' : '8px',
                overflow: 'hidden'
            }}>
            {incidenciasRelacionadas.map((incidencia, index) => {
                const getEstatusColor = (estatus) => {
                    switch(estatus) {
                        case 'reportada': return 'var(--warning)';
                        case 'en_revision': return 'var(--info)';
                        case 'resuelta': return 'var(--success)';
                        case 'escalada': return 'var(--danger)';
                        default: return 'var(--text-secondary)';
                    }
                };

                const getEstatusDisplay = (estatus) => {
                    switch(estatus) {
                        case 'reportada': return 'Reportada';
                        case 'en_revision': return 'En Revisión';
                        case 'resuelta': return 'Resuelta';
                        case 'escalada': return 'Escalada';
                        default: return estatus;
                    }
                };

                return (
                    <div 
                        key={incidencia.id_incidencia}
                        style={{
                            backgroundColor: 'var(--card-bg)',
                            border: 'none',
                            borderBottom: index < incidenciasRelacionadas.length - 1 ? '1px solid var(--border-color)' : 'none',
                            borderRadius: '0',
                            padding: '1.5rem',
                            marginBottom: 0,
                            opacity: deletingIncidencia === incidencia.id_incidencia ? 0.6 : 1,
                            transition: 'opacity 0.2s ease'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem'
                        }}>
                            <div style={{
                                padding: '0.75rem',
                                backgroundColor: 'var(--input-bg)',
                                borderRadius: '8px',
                                color: getEstatusColor(incidencia.estatus),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem'
                            }}>
                                ⚠
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <h5 style={{ 
                                        margin: 0,
                                        color: 'var(--text-primary)',
                                        fontSize: '1.1rem',
                                        textTransform: 'capitalize'
                                    }}>
                                        {incidencia.tipo_incidencia || 'Incidencia'}
                                    </h5>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.75rem',
                                        backgroundColor: getEstatusColor(incidencia.estatus),
                                        color: '#fff',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        textTransform: 'uppercase'
                                    }}>
                                        {getEstatusDisplay(incidencia.estatus)}
                                    </span>
                                </div>

                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '1rem',
                                    marginTop: '1rem'
                                }}>
                                    <div>
                                        <span style={{ 
                                            fontWeight: '500',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.85rem'
                                        }}>
                                            Fecha de incidencia:
                                        </span>
                                        <p style={{ 
                                            margin: '0.25rem 0 0 0',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.9rem'
                                        }}>
                                            {formatDate(incidencia.fecha_hora_incidencia)}
                                        </p>
                                    </div>

                                    <div>
                                        <span style={{ 
                                            fontWeight: '500',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.85rem'
                                        }}>
                                            Tipo:
                                        </span>
                                        <p style={{ 
                                            margin: '0.25rem 0 0 0',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.9rem',
                                            textTransform: 'capitalize'
                                        }}>
                                            {incidencia.tipo_incidencia || 'No especificado'}
                                        </p>
                                    </div>

                                    {incidencia.fecha_resolucion && (
                                        <div>
                                            <span style={{ 
                                                fontWeight: '500',
                                                color: 'var(--text-secondary)',
                                                fontSize: '0.85rem'
                                            }}>
                                                Fecha de resolución:
                                            </span>
                                            <p style={{ 
                                                margin: '0.25rem 0 0 0',
                                                color: 'var(--text-primary)',
                                                fontSize: '0.9rem'
                                            }}>
                                                {formatDate(incidencia.fecha_resolucion)}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {incidencia.comentarios_resolucion && (
                                    <div style={{ marginTop: '1rem' }}>
                                        <span style={{ 
                                            fontWeight: '500',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.85rem'
                                        }}>
                                            Comentarios:
                                        </span>
                                        <p style={{ 
                                            margin: '0.25rem 0 0 0',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.9rem',
                                            lineHeight: 1.5
                                        }}>
                                            {incidencia.comentarios_resolucion}
                                        </p>
                                    </div>
                                )}

                                <div style={{
                                    marginTop: '1.5rem',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid var(--border-color)',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '0.75rem'
                                }}>
                                    <button
                                        className="btn btn-danger"
                                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                                        onClick={() => handleDeleteIncidencia(incidencia)}
                                        disabled={deletingIncidencia === incidencia.id_incidencia || incidenciaToDelete || creatingIncidencia}
                                    >
                                        <Trash2 size={16} /> Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            </div>
        </div>
    );
};

const CotizacionCard = ({ cotizacion, onAction, isExpanded, onToggleExpand, facturas = [], loadFacturas, documentos = [], loadDocumentos, demoras = [], loadDemoras, incidencias = [], loadIncidencias, showNotification }) => {
    // Validación de datos y valores por defecto
    if (!cotizacion) return null;
    
    const status = getStatusDisplay(cotizacion.estatus || 'pendiente');
    
    // Valores por defecto para campos que pueden ser null/undefined
    const clienteNombre = cotizacion.cliente_nombre || 'Cliente no especificado';
    const vendedorNombre = cotizacion.usuario_ventas_nombre || 'Vendedor no asignado';
    const proveedorNombre = cotizacion.proveedor_nombre || 'Proveedor no especificado';
    const agenteNombre = cotizacion.agente_nombre || null;
    const origenNombre = cotizacion.origen_nombre || 'Origen no especificado';
    const destinoNombre = cotizacion.destino_nombre || 'Destino no especificado';
    const fechaCreacion = cotizacion.fecha_creacion ? new Date(cotizacion.fecha_creacion).toLocaleDateString('es-ES') : 'Fecha no disponible';
    const fechaVigencia = cotizacion.fecha_vigencia || 'No especificada';
    const fechaETA = cotizacion.fecha_estimada_arribo ? new Date(cotizacion.fecha_estimada_arribo).toLocaleDateString('es-ES') : null;
    const fechaEntrega = cotizacion.fecha_estimada_entrega ? new Date(cotizacion.fecha_estimada_entrega).toLocaleDateString('es-ES') : null;
    const fechaAprobacionRechazo = cotizacion.fecha_aprobacion_rechazo ? new Date(cotizacion.fecha_aprobacion_rechazo).toLocaleDateString('es-ES') : null;
    const precioFinal = typeof cotizacion.precio_final === 'number' ? cotizacion.precio_final : 0;
    const moneda = cotizacion.moneda || 'USD';
    const tipoServicio = cotizacion.tipo_servicio || 'terrestre';
    const tipoCarga = cotizacion.tipo_carga || 'CARGA_SUELTA';
    const incoterm = cotizacion.incoterm || 'FOB';

    return (
        <div
            className={`client-form-card cotizacion-card ${isExpanded ? 'expanded' : ''}`}
            style={{
                padding: '0',
                marginBottom: '1.5rem',
                boxShadow: 'var(--shadow-lg)',
                borderLeft: `6px solid ${status.color}`,
                display: 'grid',
                gridTemplateColumns: isExpanded ? '1fr' : '3fr 1fr',
                transition: 'all 0.3s ease-in-out',
                transform: isExpanded ? 'scale(1.02)' : 'scale(1)',
            }}
        >
            <div style={{ padding: '1.5rem', borderRight: isExpanded ? 'none' : '1px solid #e5e7eb' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                        <FileText size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                        Cotización #{cotizacion.id_cotizacion || cotizacion.id || 'N/A'}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                        <button 
                            onClick={onToggleExpand}
                            className="btn"
                            style={{ 
                                padding: '0.3rem 0.6rem', 
                                fontSize: '0.8rem',
                                border: '1px solid var(--primary)',
                                background: 'transparent',
                                color: 'var(--primary)',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            {isExpanded ? 'Contraer' : 'Ver Detalle'}
                        </button>
                    </div>
                </div>

                {/* Vista normal (contraída) */}
                {!isExpanded && (
                    <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.85rem' }}>Cliente (Creada: {fechaCreacion})</label>
                            <p style={{ margin: 0, fontWeight: 600 }}><Building2 size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />{clienteNombre}</p>
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.85rem' }}>Vendedor</label>
                            <p style={{ margin: 0, fontSize: '0.95rem' }}><User size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />{vendedorNombre}</p>
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.85rem' }}>Servicio ({incoterm})</label>
                            <p style={{ margin: 0 }}>
                                {getServiceIcon(tipoServicio)}
                                <strong>{TipoServicioDisplay[tipoServicio] || 'Servicio no especificado'}</strong>
                                <span style={{ marginLeft: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    <Box size={14} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                                    {TipoCargaDisplay[tipoCarga] || 'Tipo de carga no especificado'}
                                </span>
                            </p>
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.85rem' }}>Ruta</label>
                            <p style={{ margin: 0, fontWeight: 600 }}><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '5px', color: 'var(--primary)' }} />{origenNombre} → {destinoNombre}</p>
                        </div>
                        <div className="form-group" style={{ margin: 0, marginTop: '1rem' }}>
                            <label className="form-label" style={{ fontSize: '0.85rem' }}>Proveedor</label>
                            <p style={{ margin: 0, fontSize: '0.95rem' }}><Factory size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />{proveedorNombre}</p>
                        </div>
                        <div className="form-group" style={{ margin: 0, marginTop: '1rem' }}>
                            <label className="form-label" style={{ fontSize: '0.85rem' }}>Agente Aduanal</label>
                            <p style={{ margin: 0, fontSize: '0.95rem', color: agenteNombre ? 'var(--text-primary)' : 'var(--danger)' }}><Briefcase size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />{agenteNombre || 'No Asignado'}</p>
                        </div>
                    </div>
                )}

                {/* Vista expandida (detallada) */}
                {isExpanded && (
                    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                        {/* Información General */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h5 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem' }}>
                                📊 Información General
                            </h5>
                            <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Cliente</label>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>
                                        <Building2 size={16} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }} />
                                        {clienteNombre}
                                    </p>
                                    <small style={{ color: 'var(--text-secondary)' }}>ID Cliente: {cotizacion.id_cliente}</small>
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Vendedor</label>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>
                                        <User size={16} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--success)' }} />
                                        {vendedorNombre}
                                    </p>
                                    <small style={{ color: 'var(--text-secondary)' }}>ID Vendedor: {cotizacion.id_usuario_ventas}</small>
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Usuario Operativo</label>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem', color: cotizacion.id_usuario_operativo ? 'var(--text-primary)' : 'var(--danger)' }}>
                                        <User size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                                        {cotizacion.id_usuario_operativo ? `Usuario ID: ${cotizacion.id_usuario_operativo}` : 'No Asignado'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Descripción de la Mercancía */}
                        {cotizacion.descripcion_mercancia && (
                            <div style={{ marginBottom: '2rem' }}>
                                <h5 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem' }}>
                                    📦 Descripción de la Mercancía
                                </h5>
                                <div style={{ 
                                    padding: '1rem', 
                                    backgroundColor: 'var(--light-bg)', 
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb'
                                }}>
                                    <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.5' }}>
                                        {cotizacion.descripcion_mercancia}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Información del Servicio */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h5 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--info)', marginBottom: '1rem', borderBottom: '2px solid var(--info)', paddingBottom: '0.5rem' }}>
                                🚚 Detalles del Servicio
                            </h5>
                            <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Tipo de Servicio</label>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>
                                        {getServiceIcon(tipoServicio)}
                                        <span style={{ marginLeft: '8px' }}>{TipoServicioDisplay[tipoServicio] || 'Servicio no especificado'}</span>
                                    </p>
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Tipo de Carga</label>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>
                                        <Box size={16} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--secondary)' }} />
                                        {TipoCargaDisplay[tipoCarga] || 'Tipo de carga no especificado'}
                                    </p>
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Incoterm</label>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>
                                        <DollarSign size={16} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--warning)' }} />
                                        {IncotermDisplay[incoterm] || incoterm}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Información de Ubicaciones */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h5 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--warning)', marginBottom: '1rem', borderBottom: '2px solid var(--warning)', paddingBottom: '0.5rem' }}>
                                📍 Ruta y Ubicaciones
                            </h5>
                            <div className="form-grid" style={{ gridTemplateColumns: '1fr auto 1fr', gap: '1.5rem', alignItems: 'center' }}>
                                <div className="form-group" style={{ margin: 0, textAlign: 'center', padding: '1rem', backgroundColor: 'var(--light-bg)', borderRadius: '8px' }}>
                                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Origen</label>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '1.1rem', color: 'var(--primary)' }}>
                                        <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                                        {origenNombre}
                                    </p>
                                    <small style={{ color: 'var(--text-secondary)' }}>ID: {cotizacion.id_origen_localizacion}</small>
                                </div>

                                <div style={{ fontSize: '2rem', color: 'var(--primary)' }}>→</div>

                                <div className="form-group" style={{ margin: 0, textAlign: 'center', padding: '1rem', backgroundColor: 'var(--light-bg)', borderRadius: '8px' }}>
                                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Destino</label>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '1.1rem', color: 'var(--success)' }}>
                                        <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                                        {destinoNombre}
                                    </p>
                                    <small style={{ color: 'var(--text-secondary)' }}>ID: {cotizacion.id_destino_localizacion}</small>
                                </div>
                            </div>
                        </div>

                        {/* Fechas y Cronograma */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h5 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--danger)', marginBottom: '1rem', borderBottom: '2px solid var(--danger)', paddingBottom: '0.5rem' }}>
                                📅 Fechas y Cronograma
                            </h5>
                            <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Fecha de Creación</label>
                                    <p style={{ margin: 0, fontWeight: 600 }}>
                                        <Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                        {fechaCreacion}
                                    </p>
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.85rem' }}>ETA (Fecha Estimada de Arribo)</label>
                                    <p style={{ margin: 0, fontWeight: 600, color: fechaETA ? 'var(--info)' : 'var(--text-secondary)' }}>
                                        <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                        {fechaETA || 'No especificada'}
                                    </p>
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Fecha Estimada de Entrega</label>
                                    <p style={{ margin: 0, fontWeight: 600, color: fechaEntrega ? 'var(--success)' : 'var(--text-secondary)' }}>
                                        <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                        {fechaEntrega || 'No especificada'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sección de Facturas Asociadas */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h5 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--success)', marginBottom: '1rem', borderBottom: '2px solid var(--success)', paddingBottom: '0.5rem' }}>
                                💰 Facturas Asociadas
                            </h5>
                            <FacturasSection 
                                cotizacionId={cotizacion.id_cotizacion || cotizacion.id}
                                facturas={facturas || []}
                                onRefreshFacturas={loadFacturas}
                                showNotification={showNotification}
                                cotizacion={cotizacion}
                            />
                        </div>

                        {/* Sección de Documentos Relacionados */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h5 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--info)', marginBottom: '1rem', borderBottom: '2px solid var(--info)', paddingBottom: '0.5rem' }}>
                                📄 Documentos Relacionados
                            </h5>
                            <DocumentosSection 
                                cotizacionId={cotizacion.id_cotizacion || cotizacion.id}
                                documentos={documentos || []}
                                onRefreshDocumentos={loadDocumentos}
                                showNotification={showNotification}
                                cotizacion={cotizacion}
                            />
                        </div>

                        {/* Sección de Demoras */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h5 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--warning)', marginBottom: '1rem', borderBottom: '2px solid var(--warning)', paddingBottom: '0.5rem' }}>
                                ⏱ Demoras
                            </h5>
                            <DemorasSection 
                                cotizacionId={cotizacion.id_cotizacion || cotizacion.id}
                                operacionId={cotizacion.id_operacion}
                                demoras={demoras || []}
                                onRefreshDemoras={loadDemoras}
                                showNotification={showNotification}
                                cotizacion={cotizacion}
                            />
                        </div>

                        {/* Sección de Incidencias */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h5 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--danger)', marginBottom: '1rem', borderBottom: '2px solid var(--danger)', paddingBottom: '0.5rem' }}>
                                ⚠ Incidencias
                            </h5>
                            <IncidenciasSection 
                                cotizacionId={cotizacion.id_cotizacion || cotizacion.id}
                                operacionId={cotizacion.id_operacion}
                                incidencias={incidencias || []}
                                onRefreshIncidencias={loadIncidencias}
                                showNotification={showNotification}
                                cotizacion={cotizacion}
                            />
                        </div>

                        {/* Botones de acción en vista expandida */}
                        <div style={{ 
                            padding: '1rem', 
                            borderTop: '1px solid #e5e7eb', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            gap: '1rem',
                            backgroundColor: 'var(--light-bg)',
                            marginTop: '1rem'
                        }}>
                            <button 
                                className="btn btn-secondary" 
                                onClick={() => onAction('edit', cotizacion)} 
                                style={{ padding: '0.7rem 1.5rem', fontSize: '1rem' }}
                            >
                                <Edit size={20} /> Editar Cotización
                            </button>
                            
                            {/* Botón Generar Operación - solo visible si estatus es aprobada */}
                            {(cotizacion.estatus === 'aprobada' || cotizacion.estatus === 'APROBADA' || cotizacion.estatus?.toLowerCase() === 'aprobada') && (
                                <button 
                                    className="btn btn-success" 
                                    onClick={() => onAction('generar_operacion', cotizacion)} 
                                    style={{ padding: '0.7rem 1.5rem', fontSize: '1rem' }}
                                >
                                    <PlayCircle size={20} /> Generar Operación
                                </button>
                            )}
                            
                            <button 
                                className="btn btn-danger" 
                                onClick={() => onAction('delete', cotizacion)} 
                                style={{ padding: '0.7rem 1.5rem', fontSize: '1rem' }}
                            >
                                <Trash2 size={20} /> Eliminar
                            </button>
                            
                            {/* Botón temporal de debug - QUITAR DESPUÉS */}
                            <button 
                                className="btn btn-warning" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('🔍 Botón debug presionado. Estatus cotización:', cotizacion.estatus);
                                    console.log('🔍 Cotización completa:', cotizacion);
                                    onAction('generar_operacion', cotizacion);
                                }} 
                                style={{ padding: '0.7rem 1.5rem', fontSize: '1rem', marginLeft: '0.5rem' }}
                                type="button"
                            >
                                  TEST: Crear Operación
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Panel lateral (solo visible en vista normal) */}
            {!isExpanded && (
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', width: '100%', marginBottom: '1rem' }}>
                        <label className="form-label" style={{ fontSize: '0.8rem' }}>Total Cotizado</label>
                        <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)', margin: '0.2rem 0 0.5rem' }}>
                            {moneda} {precioFinal.toFixed(2)}
                        </p>
                        <div style={{ fontSize: '0.9rem', color: 'var(--danger)', fontWeight: 600 }}>
                            <Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                            Vence: {fechaVigencia}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.5rem' }}>
                            <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                            ETA: {fechaETA || 'N/A'}
                        </div>
                    </div>
                    <div className="form-actions" style={{ paddingTop: '0', borderTop: 'none', justifyContent: 'center', gap: '0.5rem' }}>
                        <button className="btn btn-primary" onClick={() => onAction('edit', cotizacion)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                            <Edit size={18} /> Editar
                        </button>
                        
                        {/* Botón Generar Operación - solo visible si estatus es aprobada */}
                        {(cotizacion.estatus === 'aprobada' || cotizacion.estatus === 'APROBADA' || cotizacion.estatus?.toLowerCase() === 'aprobada') && (
                            <button 
                                className="btn btn-success" 
                                onClick={() => onAction('generar_operacion', cotizacion)} 
                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            >
                                <PlayCircle size={18} /> Operación
                            </button>
                        )}
                        
                        <button className="btn btn-danger" onClick={() => onAction('delete', cotizacion)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                            <Trash2 size={18} /> Eliminar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const Cotizaciones = () => {
    const navigate = useNavigate();
    
    const [cotizaciones, setCotizaciones] = useState(initialCotizaciones);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("todas");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedCard, setExpandedCard] = useState(null);
    
    // Estados para el formulario
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedCotizacion, setSelectedCotizacion] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    
    // Estados para notificaciones
    const [notification, setNotification] = useState({ type: '', message: '' });
    
    // Estados para facturas
    const [facturas, setFacturas] = useState([]);
    const [loadingFacturas, setLoadingFacturas] = useState(false);
    
    // Estados para documentos
    const [documentos, setDocumentos] = useState([]);
    const [loadingDocumentos, setLoadingDocumentos] = useState(false);
    
    // Estados para demoras
    const [demoras, setDemoras] = useState([]);
    const [loadingDemoras, setLoadingDemoras] = useState(false);
    
    // Estados para incidencias
    const [incidencias, setIncidencias] = useState([]);
    const [loadingIncidencias, setLoadingIncidencias] = useState(false);
    
    // Funciones para mostrar notificaciones
    const showNotification = (type, message) => {
        setNotification({ type, message });
        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            setNotification({ type: '', message: '' });
        }, 5000);
    };

    const closeNotification = () => {
        setNotification({ type: '', message: '' });
    };

    // Función para cargar facturas
    const loadFacturas = async () => {
        setLoadingFacturas(true);
        try {
            const facturasData = await apiGet('/facturas-cliente');
            if (Array.isArray(facturasData)) {
                setFacturas(facturasData);
            }
        } catch (err) {
            console.error('Error cargando facturas:', err);
            setFacturas([]);
        } finally {
            setLoadingFacturas(false);
        }
    };

    // Función para cargar documentos
    const loadDocumentos = async () => {
        setLoadingDocumentos(true);
        try {
            const documentosData = await apiGet('/documentos-relacionados');
            if (Array.isArray(documentosData)) {
                setDocumentos(documentosData);
            }
        } catch (err) {
            console.error('Error cargando documentos:', err);
            setDocumentos([]);
        } finally {
            setLoadingDocumentos(false);
        }
    };

    // Función para cargar demoras
    const loadDemoras = async () => {
        setLoadingDemoras(true);
        try {
            const demorasData = await apiGet('/demoras');
            if (Array.isArray(demorasData)) {
                setDemoras(demorasData);
            }
        } catch (err) {
            console.error('Error cargando demoras:', err);
            setDemoras([]);
        } finally {
            setLoadingDemoras(false);
        }
    };

    // Función para cargar incidencias
    const loadIncidencias = async () => {
        setLoadingIncidencias(true);
        try {
            const incidenciasData = await apiGet('/incidencias');
            if (Array.isArray(incidenciasData)) {
                setIncidencias(incidenciasData);
            }
        } catch (err) {
            console.error('Error cargando incidencias:', err);
            setIncidencias([]);
        } finally {
            setLoadingIncidencias(false);
        }
    };


    
    // Estados para datos maestros
    const [clientes, setClientes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [agentes, setAgentes] = useState([]);
    const [localizaciones, setLocalizaciones] = useState([]);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                // Obtener todos los datos en paralelo
                const [cotizacionesData, clientesData, usuariosData, proveedoresData, agentesData, localizacionesData, facturasData, documentosData, demorasData, incidenciasData] = await Promise.allSettled([
                    apiGet('/cotizaciones').catch(() => []),
                    apiGet('/clientes').catch(() => []),
                    apiGet('/usuarios').catch(() => []),
                    apiGet('/proveedores').catch(() => []),
                    apiGet('/agentes').catch(() => []),
                    apiGet('/localizaciones').catch(() => []),
                    apiGet('/facturas-cliente').catch(() => []),
                    apiGet('/documentos-relacionados').catch(() => []),
                    apiGet('/demoras').catch(() => []),
                    apiGet('/incidencias').catch(() => [])
                ]);

                if (mounted) {
                    // Guardar datos maestros en el estado
                    if (clientesData.status === 'fulfilled' && Array.isArray(clientesData.value)) {
                        setClientes(clientesData.value);
                    }
                    if (usuariosData.status === 'fulfilled' && Array.isArray(usuariosData.value)) {
                        setUsuarios(usuariosData.value);
                    }
                    if (proveedoresData.status === 'fulfilled' && Array.isArray(proveedoresData.value)) {
                        setProveedores(proveedoresData.value);
                    }
                    if (agentesData.status === 'fulfilled' && Array.isArray(agentesData.value)) {
                        setAgentes(agentesData.value);
                    }
                    if (localizacionesData.status === 'fulfilled' && Array.isArray(localizacionesData.value)) {
                        setLocalizaciones(localizacionesData.value);
                    }
                    if (facturasData.status === 'fulfilled' && Array.isArray(facturasData.value)) {
                        setFacturas(facturasData.value);
                    }
                    if (documentosData.status === 'fulfilled' && Array.isArray(documentosData.value)) {
                        setDocumentos(documentosData.value);
                    }
                    if (demorasData.status === 'fulfilled' && Array.isArray(demorasData.value)) {
                        setDemoras(demorasData.value);
                    }
                    if (incidenciasData.status === 'fulfilled' && Array.isArray(incidenciasData.value)) {
                        setIncidencias(incidenciasData.value);
                    }

                    // Procesar cotizaciones solo si se obtuvieron exitosamente
                    if (cotizacionesData.status === 'fulfilled' && Array.isArray(cotizacionesData.value)) {
                        console.log('Cotizaciones recibidas:', cotizacionesData.value);
                        
                        // Crear mapas para lookups rápidos
                        const clientesMap = new Map();
                        const usuariosMap = new Map();
                        const proveedoresMap = new Map();
                        const agentesMap = new Map();
                        const localizacionesMap = new Map();
                        
                        // Poblar mapas si las llamadas fueron exitosas
                        if (clientesData.status === 'fulfilled' && Array.isArray(clientesData.value)) {
                            clientesData.value.forEach(cliente => {
                                clientesMap.set(cliente.id_cliente || cliente.id, cliente.nombre_empresa || cliente.nombre || `Cliente ${cliente.id_cliente || cliente.id}`);
                            });
                        }
                        
                        if (usuariosData.status === 'fulfilled' && Array.isArray(usuariosData.value)) {
                            usuariosData.value.forEach(usuario => {
                                usuariosMap.set(usuario.id_usuario || usuario.id, `${usuario.nombre || 'Usuario'} ${usuario.apellido || ''}`);
                            });
                        }
                        
                        if (proveedoresData.status === 'fulfilled' && Array.isArray(proveedoresData.value)) {
                            proveedoresData.value.forEach(proveedor => {
                                proveedoresMap.set(proveedor.id_proveedor || proveedor.id, proveedor.nombre_empresa || proveedor.nombre || `Proveedor ${proveedor.id_proveedor || proveedor.id}`);
                            });
                        }
                        
                        if (agentesData.status === 'fulfilled' && Array.isArray(agentesData.value)) {
                            agentesData.value.forEach(agente => {
                                agentesMap.set(agente.id_agente || agente.id, `${agente.nombre || 'Agente'} ${agente.apellido || ''}`);
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
                            usuarios: usuariosMap.size,
                            proveedores: proveedoresMap.size,
                            agentes: agentesMap.size,
                            localizaciones: localizacionesMap.size
                        });
                        
                        // Mapear cotizaciones con nombres reales
                        const mappedCotizaciones = cotizacionesData.value.map(cotizacion => ({
                            ...cotizacion,
                            cliente_nombre: clientesMap.get(cotizacion.id_cliente) || `Cliente ID: ${cotizacion.id_cliente}`,
                            usuario_ventas_nombre: usuariosMap.get(cotizacion.id_usuario_ventas) || `Vendedor ID: ${cotizacion.id_usuario_ventas}`,
                            proveedor_nombre: proveedoresMap.get(cotizacion.id_proveedor) || `Proveedor ID: ${cotizacion.id_proveedor}`,
                            agente_nombre: cotizacion.id_agente ? agentesMap.get(cotizacion.id_agente) : null,
                            origen_nombre: localizacionesMap.get(cotizacion.id_origen_localizacion) || `Origen ID: ${cotizacion.id_origen_localizacion}`,
                            destino_nombre: localizacionesMap.get(cotizacion.id_destino_localizacion) || `Destino ID: ${cotizacion.id_destino_localizacion}`,
                            fecha_vigencia: cotizacion.fecha_estimada_entrega || 'No especificada',
                            precio_final: Math.random() * 10000 + 5000, // Precio simulado hasta que se agregue al backend
                            moneda: 'USD',
                            tipo_servicio: cotizacion.tipo_servicio || 'terrestre'
                        }));
                        
                        console.log('Cotizaciones mapeadas:', mappedCotizaciones);
                        setCotizaciones(mappedCotizaciones);
                    }
                }
            } catch (err) {
                console.error('Error cargando datos:', err);
                if (mounted) {
                    setError(err.message || 'Error al cargar datos');
                    setCotizaciones([]);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false };
    }, []);

    // useEffect para detectar si viene de solicitudes y pre-llenar el formulario
    useEffect(() => {
        // Verificar si hay datos de pre-llenado en localStorage
        const prefillDataStr = localStorage.getItem('cotizacion_prefill_data');
        if (prefillDataStr) {
            try {
                const prefillData = JSON.parse(prefillDataStr);
                console.log('Datos de pre-llenado encontrados:', prefillData);
                
                // Pre-llenar el formulario con los datos de la solicitud
                setFormData(prev => ({
                    ...prev,
                    id_cliente: prefillData.id_cliente || '',
                    id_origen_localizacion: prefillData.id_origen_localizacion || '',
                    id_destino_localizacion: prefillData.id_destino_localizacion || '',
                    tipo_servicio: prefillData.tipo_servicio || 'terrestre',
                    tipo_carga: prefillData.tipo_carga || 'FCL',
                    incoterm: prefillData.incoterm || 'FOB',
                    descripcion_mercancia: prefillData.descripcion_mercancia || '',
                    fecha_estimada_arribo: prefillData.fecha_estimada_arribo || '',
                    fecha_estimada_entrega: prefillData.fecha_estimada_entrega || '',
                    // Agregar referencia a la solicitud original
                    id_solicitud_cliente: prefillData.id_solicitud_cliente || ''
                }));
                
                // Abrir el formulario automáticamente
                setIsFormOpen(true);
                
                // Mostrar notificación
                showNotification('info', `Formulario pre-llenado con datos de la Solicitud #${prefillData.id_solicitud_cliente}`);
                
                // Limpiar los datos de localStorage después de usarlos
                localStorage.removeItem('cotizacion_prefill_data');
                
            } catch (err) {
                console.error('Error al procesar datos de pre-llenado:', err);
                localStorage.removeItem('cotizacion_prefill_data');
            }
        }
        
        // También verificar si hay parámetro en la URL para abrir nuevo formulario
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');
        if (action === 'new' && !isFormOpen) {
            setIsFormOpen(true);
        }
    }, [isFormOpen]);

    // Funciones del formulario
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Construir el payload según el DTO del backend
            const payload = {
                id_cliente: Number(formData.id_cliente),
                id_usuario_ventas: Number(formData.id_usuario_ventas),
                id_usuario_operativo: formData.id_usuario_operativo ? Number(formData.id_usuario_operativo) : undefined,
                id_proveedor: Number(formData.id_proveedor),
                id_agente: formData.id_agente ? Number(formData.id_agente) : undefined,
                id_origen_localizacion: Number(formData.id_origen_localizacion),
                id_destino_localizacion: Number(formData.id_destino_localizacion),
                tipo_servicio: formData.tipo_servicio,
                tipo_carga: formData.tipo_carga,
                incoterm: formData.incoterm,
                descripcion_mercancia: formData.descripcion_mercancia || undefined,
                fecha_estimada_arribo: formData.fecha_estimada_arribo || undefined,
                fecha_estimada_entrega: formData.fecha_estimada_entrega || undefined,
                estatus: formData.estatus,
                // Incluir referencia a solicitud si existe
                id_solicitud_cliente: formData.id_solicitud_cliente || undefined,
            };

            if (selectedCotizacion) {
                await apiPut(`/cotizaciones/${selectedCotizacion.id_cotizacion || selectedCotizacion.id}`, payload);
                showNotification('success', 'Cotización actualizada correctamente');
            } else {
                const created = await apiPost('/cotizaciones', payload);
                
                // Si la cotización fue creada desde una solicitud, marcar la solicitud como "cotizada"
                if (formData.id_solicitud_cliente) {
                    try {
                        console.log('Actualizando estatus de solicitud a cotizada:', formData.id_solicitud_cliente);
                        const updatePayload = { estatus: 'cotizada' };
                        console.log('Payload para actualizar solicitud:', updatePayload);
                        
                        await apiPut(`/solicitudes/${formData.id_solicitud_cliente}`, updatePayload);
                        showNotification('success', `Cotización creada exitosamente (ID: ${created?.id_cotizacion || created?.id || 'N/A'}) y solicitud marcada como cotizada`);
                    } catch (solicitudErr) {
                        console.error('Error actualizando estatus de solicitud:', solicitudErr);
                        console.error('Respuesta del error:', solicitudErr.response);
                        
                        let errorDetail = '';
                        if (solicitudErr.response && solicitudErr.response.message) {
                            if (Array.isArray(solicitudErr.response.message)) {
                                errorDetail = ` - ${solicitudErr.response.message.join(', ')}`;
                            } else {
                                errorDetail = ` - ${solicitudErr.response.message}`;
                            }
                        }
                        
                        showNotification('warning', `Cotización creada (ID: ${created?.id_cotizacion || created?.id || 'N/A'}) pero no se pudo actualizar el estatus de la solicitud${errorDetail}`);
                    }
                } else {
                    showNotification('success', `Cotización creada exitosamente (ID: ${created?.id_cotizacion || created?.id || 'N/A'})`);
                }
            }

            // Recargar datos
            await loadCotizaciones();
            closeForm();
        } catch (err) {
            console.error('Error guardando cotización:', err);
            let errorMessage = "Ocurrió un error al guardar la cotización.";
            if (err.response?.message) {
                errorMessage = Array.isArray(err.response.message) ? err.response.message.join(', ') : err.response.message;
            } else if (err.message) {
                errorMessage = `Error: ${err.message}`;
            }
            showNotification('error', errorMessage);
        }
    };

    const openFormForNew = () => {
        setSelectedCotizacion(null);
        setFormData(initialFormData);
        setIsFormOpen(true);
        setIsDeleteConfirmOpen(false);
        setExpandedCard(null);
    };

    const openFormForEdit = (cotizacion) => {
        setSelectedCotizacion(cotizacion);
        setFormData({
            id_cliente: cotizacion.id_cliente || '',
            id_usuario_ventas: cotizacion.id_usuario_ventas || '',
            id_usuario_operativo: cotizacion.id_usuario_operativo || '',
            id_proveedor: cotizacion.id_proveedor || '',
            id_agente: cotizacion.id_agente || '',
            id_origen_localizacion: cotizacion.id_origen_localizacion || '',
            id_destino_localizacion: cotizacion.id_destino_localizacion || '',
            tipo_servicio: cotizacion.tipo_servicio || 'terrestre',
            tipo_carga: cotizacion.tipo_carga || 'FCL',
            incoterm: cotizacion.incoterm || 'FOB',
            descripcion_mercancia: cotizacion.descripcion_mercancia || '',
            fecha_estimada_arribo: cotizacion.fecha_estimada_arribo ? cotizacion.fecha_estimada_arribo.substring(0, 10) : '',
            fecha_estimada_entrega: cotizacion.fecha_estimada_entrega ? cotizacion.fecha_estimada_entrega.substring(0, 10) : '',
            estatus: cotizacion.estatus || 'pendiente',
        });
        setIsFormOpen(true);
        setIsDeleteConfirmOpen(false);
        setExpandedCard(null);
    };

    const openDeleteConfirm = (cotizacion) => {
        setSelectedCotizacion(cotizacion);
        setIsDeleteConfirmOpen(true);
        setIsFormOpen(false);
        setExpandedCard(null);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setFormData(initialFormData);
        setSelectedCotizacion(null);
    };

    const deleteCotizacion = async () => {
        if (!selectedCotizacion) return;
        
        try {
            await apiDelete(`/cotizaciones/${selectedCotizacion.id_cotizacion || selectedCotizacion.id}`);
            await loadCotizaciones();
            setIsDeleteConfirmOpen(false);
            setSelectedCotizacion(null);
            showNotification('success', 'Cotización eliminada exitosamente');
        } catch (err) {
            console.error('Error eliminando cotización:', err);
            showNotification('error', 'Error eliminando la cotización: ' + (err.message || err));
        }
    };

    // Función auxiliar para cargar las cotizaciones
    const loadCotizaciones = async () => {
        try {
            const cotizacionesData = await apiGet('/cotizaciones');
            if (Array.isArray(cotizacionesData)) {
                console.log('Cotizaciones recibidas:', cotizacionesData);
                
                // Crear mapas para lookups rápidos
                const clientesMap = new Map();
                const usuariosMap = new Map();
                const proveedoresMap = new Map();
                const agentesMap = new Map();
                const localizacionesMap = new Map();
                
                // Poblar mapas usando los datos ya cargados en el estado
                clientes.forEach(cliente => {
                    clientesMap.set(cliente.id_cliente || cliente.id, cliente.nombre_empresa || cliente.nombre || `Cliente ${cliente.id_cliente || cliente.id}`);
                });
                
                usuarios.forEach(usuario => {
                    usuariosMap.set(usuario.id_usuario || usuario.id, `${usuario.nombre || 'Usuario'} ${usuario.apellido || ''}`);
                });
                
                proveedores.forEach(proveedor => {
                    proveedoresMap.set(proveedor.id_proveedor || proveedor.id, proveedor.nombre_empresa || proveedor.nombre || `Proveedor ${proveedor.id_proveedor || proveedor.id}`);
                });
                
                agentes.forEach(agente => {
                    agentesMap.set(agente.id_agente || agente.id, `${agente.nombre || 'Agente'} ${agente.apellido || ''}`);
                });
                
                localizaciones.forEach(localizacion => {
                    const nombreCompleto = `${localizacion.nombre_ciudad}, ${localizacion.pais?.nombre || 'País desconocido'}`;
                    localizacionesMap.set(localizacion.id_localizacion || localizacion.id, nombreCompleto);
                });
                
                // Mapear cotizaciones con nombres reales
                const mappedCotizaciones = cotizacionesData.map(cotizacion => ({
                    ...cotizacion,
                    cliente_nombre: clientesMap.get(cotizacion.id_cliente) || `Cliente ID: ${cotizacion.id_cliente}`,
                    usuario_ventas_nombre: usuariosMap.get(cotizacion.id_usuario_ventas) || `Vendedor ID: ${cotizacion.id_usuario_ventas}`,
                    proveedor_nombre: proveedoresMap.get(cotizacion.id_proveedor) || `Proveedor ID: ${cotizacion.id_proveedor}`,
                    agente_nombre: cotizacion.id_agente ? agentesMap.get(cotizacion.id_agente) : null,
                    origen_nombre: localizacionesMap.get(cotizacion.id_origen_localizacion) || `Origen ID: ${cotizacion.id_origen_localizacion}`,
                    destino_nombre: localizacionesMap.get(cotizacion.id_destino_localizacion) || `Destino ID: ${cotizacion.id_destino_localizacion}`,
                    fecha_vigencia: cotizacion.fecha_estimada_entrega || 'No especificada',
                    precio_final: Math.random() * 10000 + 5000, // Precio simulado hasta que se agregue al backend
                    moneda: 'USD',
                    tipo_servicio: cotizacion.tipo_servicio || 'terrestre'
                }));
                
                setCotizaciones(mappedCotizaciones);
            }
            
            // También recargar facturas y documentos
            await loadFacturas();
            await loadDocumentos();
        } catch (err) {
            console.error('Error recargando cotizaciones:', err);
            setError(err.message || 'Error al recargar cotizaciones');
        }
    };

    const filteredCotizaciones = useMemo(() => {
        return cotizaciones.filter((c) => {
            if (!c) return false;
            
            // Filtrar por estatus primero
            if (statusFilter !== 'todas' && c.estatus !== statusFilter) {
                return false;
            }
            
            const searchableText = [
                c.id_cotizacion || c.id || '',
                c.cliente_nombre || c.nombre_cliente || '',
                c.usuario_ventas_nombre || c.vendedor_nombre || '',
                TipoServicioDisplay[c.tipo_servicio] || c.tipo_servicio || '',
                c.origen_nombre || c.nombre_origen || '',
                c.destino_nombre || c.nombre_destino || '',
                c.proveedor_nombre || c.nombre_proveedor || '',
                c.agente_nombre || c.nombre_agente || ''
            ].join(' ').toLowerCase();
            
            return searchableText.includes(searchTerm.toLowerCase());
        });
    }, [cotizaciones, searchTerm, statusFilter]);

    const handleAction = async (action, cotizacion) => {
        if (action === 'new') {
            openFormForNew();
        } else if (action === 'edit') {
            openFormForEdit(cotizacion);
        } else if (action === 'delete') {
            openDeleteConfirm(cotizacion);
        } else if (action === 'generar_operacion') {
            // Lógica para generar operación desde cotización (igual que en solicitudes)
            console.log('🚀 Generando operación desde cotización:', cotizacion);
            
            // Verificar que tenemos una cotización válida
            if (!cotizacion) {
                console.error('❌ No se recibió una cotización válida');
                showNotification('error', 'Error: No se encontró información de la cotización');
                return;
            }
            
            try {
                // Preparar los datos de la cotización para el formulario de operación
                const operacionPrefillData = {
                    // Datos básicos de la cotización
                    id_cotizacion: cotizacion.id_cotizacion || cotizacion.id,
                    id_cliente: cotizacion.id_cliente,
                    id_usuario_operativo: cotizacion.id_usuario_operativo || cotizacion.id_usuario_ventas, // usar ventas si no hay operativo
                    id_proveedor: cotizacion.id_proveedor,
                    id_agente: cotizacion.id_agente,
                    
                    // Información del servicio
                    tipo_servicio: cotizacion.tipo_servicio,
                    tipo_carga: cotizacion.tipo_carga,
                    incoterm: cotizacion.incoterm,
                    
                    // Fechas
                    fecha_estimada_arribo: cotizacion.fecha_estimada_arribo ? cotizacion.fecha_estimada_arribo.substring(0, 10) : '',
                    fecha_estimada_entrega: cotizacion.fecha_estimada_entrega ? cotizacion.fecha_estimada_entrega.substring(0, 10) : '',
                    
                    // Información adicional para mostrar en el formulario (no enviada al backend)
                    cliente_nombre: cotizacion.cliente_nombre,
                    usuario_operativo_nombre: cotizacion.usuario_ventas_nombre, // temporal hasta que haya operativo
                    proveedor_nombre: cotizacion.proveedor_nombre,
                    agente_nombre: cotizacion.agente_nombre,
                    origen_nombre: cotizacion.origen_nombre,
                    destino_nombre: cotizacion.destino_nombre,
                    descripcion_mercancia: cotizacion.descripcion_mercancia,
                    
                    // Referencia a la cotización original
                    cotizacion_origen: {
                        id: cotizacion.id_cotizacion || cotizacion.id,
                        cliente: cotizacion.cliente_nombre
                    }
                };

                console.log('✅ Datos preparados para operación:', operacionPrefillData);
                
                // Guardar los datos en localStorage
                localStorage.setItem('operacion_prefill_data', JSON.stringify(operacionPrefillData));
                
                // Verificar que se guardaron correctamente
                const verificacion = localStorage.getItem('operacion_prefill_data');
                console.log('💾 Datos guardados en localStorage:', !!verificacion);
                
                // Mostrar notificación de éxito
                showNotification('success', `✅ Preparando operación desde Cotización #${cotizacion.id_cotizacion || cotizacion.id}...`);
                
                // Navegar a operaciones usando React Router (más directo)
                console.log('🔗 Navegando a /operaciones...');
                navigate('/operaciones?action=new');
                
            } catch (err) {
                console.error('❌ Error preparando datos para operación:', err);
                showNotification('error', 'Error al preparar los datos para la operación: ' + err.message);
            }
        }
    };

    const handleToggleExpand = (cotizacionId) => {
        setExpandedCard(prevId => prevId === cotizacionId ? null : cotizacionId);
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
                            id="search-cotizaciones"
                            name="search"
                            type="text"
                            placeholder="Buscar por ID, Cliente, Vendedor, Ruta..."
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
                        <option value="pendiente">Pendiente</option>
                        <option value="enviada">Enviada</option>
                        <option value="aprobada">Aprobada</option>
                        <option value="rechazada">Rechazada</option>
                        <option value="caducada">Caducada</option>
                    </select>

                    <button
                        onClick={() => handleAction('new', null)}
                        className="btn btn-primary"
                        disabled={isFormOpen}
                    >
                        <Plus size={20} />
                        Crear Nueva Cotización
                    </button>
                </div>

                {/* BANNER DE NOTIFICACIONES */}
                <NotificationBanner
                    type={notification.type}
                    message={notification.message}
                    onClose={closeNotification}
                />

                {/* FORMULARIO DE COTIZACIÓN */}
                {isFormOpen && (
                    <CotizacionForm
                        selectedCotizacion={selectedCotizacion}
                        formData={formData}
                        handleFormChange={handleFormChange}
                        handleFormSubmit={handleFormSubmit}
                        closeForm={closeForm}
                        clientes={clientes}
                        usuarios={usuarios}
                        proveedores={proveedores}
                        agentes={agentes}
                        localizaciones={localizaciones}
                    />
                )}

                {/* BANNER DE CONFIRMACIÓN DE ELIMINACIÓN */}
                {isDeleteConfirmOpen && (
                    <DeleteConfirmBanner
                        selectedCotizacion={selectedCotizacion}
                        deleteCotizacion={deleteCotizacion}
                        cancel={() => setIsDeleteConfirmOpen(false)}
                    />
                )}

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
                        Cargando cotizaciones...
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
                        {filteredCotizaciones.length > 0 ? (
                            filteredCotizaciones.map((c) => (
                                <CotizacionCard
                                    key={c.id_cotizacion || c.id || Math.random()}
                                    cotizacion={c}
                                    onAction={handleAction}
                                    isExpanded={expandedCard === (c.id_cotizacion || c.id)}
                                    onToggleExpand={() => handleToggleExpand(c.id_cotizacion || c.id)}
                                    facturas={facturas}
                                    loadFacturas={loadFacturas}
                                    documentos={documentos}
                                    loadDocumentos={loadDocumentos}
                                    demoras={demoras}
                                    loadDemoras={loadDemoras}
                                    incidencias={incidencias}
                                    loadIncidencias={loadIncidencias}
                                    showNotification={showNotification}
                                />
                            ))
                        ) : (
                            <div className="table-empty-state" style={{ padding: '3rem', fontSize: '1.1rem', textAlign: 'center' }}>
                                {cotizaciones.length === 0 
                                    ? 'No hay cotizaciones disponibles. Crea tu primera cotización.' 
                                    : 'No se encontraron cotizaciones que coincidan con la búsqueda.'
                                }
                            </div>
                        )}
                    </div>
                )}

            </div>
        </AppLayout>
    );
};

export default Cotizaciones;
