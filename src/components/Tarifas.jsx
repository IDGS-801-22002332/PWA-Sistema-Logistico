import React, { useEffect, useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Tag, Truck, Box, DollarSign, Calendar, MapPin, Map, XCircle, Save, X, AlertTriangle, ChevronsUpDown } from 'lucide-react';
import AppLayout from '../Layout/AppLayout';
import './tarifas.css';

const TipoServicio = {
    MARITIMO: 'Marítimo',
    AEREO: 'Aéreo',
    TERRESTRE: 'Terrestre',
};

const TipoCarga = {
    LCL: 'LCL (Less than Container Load)',
    FCL: 'FCL (Full Container Load)',
    CARGA_SUELTA: 'Carga Suelta',
};

const Incoterm = {
    EXW: 'EXW (Ex Works)',
    FOB: 'FOB (Free On Board)',
    CIF: 'CIF (Cost, Insurance and Freight)',
    DDP: 'DDP (Delivered Duty Paid)',
};

const mockProveedores = [
    { id: 501, nombre: "Materiales Súper S.A." },
    { id: 502, nombre: "Tecnología Global" },
    { id: 503, nombre: "Logística Rápida" },
];

const mockLocalizaciones = [
    { id: 101, nombre: "Puerto de Veracruz, MX" },
    { id: 102, nombre: "Aeropuerto JFK, US" },
    { id: 103, nombre: "Shenzhen, CN" },
    { id: 104, nombre: "Ciudad de México, MX" },
];

const initialFormData = {
    id_proveedor: '',
    tipo_servicio: '',
    tipo_carga: '',
    id_origen_localizacion: '',
    id_destino_localizacion: '',
    incoterm: '',
    precio_base: '',
    moneda: 'USD',
    fecha_vigencia_inicio: '',
    fecha_vigencia_fin: '',
};

export const TarifaForm = ({ selectedTarifa, formData, handleFormChange, handleFormSubmit, closeForm }) => {

    const renderEnumOptions = (enumObject) => (
        Object.entries(enumObject).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
        ))
    );

    const renderMasterOptions = (data) => (
        data.map(item => (
            <option key={item.id} value={item.id}>{item.nombre}</option>
        ))
    );

    return (
        <div className="client-form-card">
            <h2 className="form-card-title">
                {selectedTarifa ? "Editar Tarifa" : "Nueva Tarifa de Transporte"}
            </h2>

            <form onSubmit={handleFormSubmit} className="form-content">
                <div className="form-grid">

                    {/* Fila 1: Proveedor y Servicio */}
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
                                {renderMasterOptions(mockProveedores)}
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>

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
                                <option value="" disabled>Seleccione servicio...</option>
                                {renderEnumOptions(TipoServicio)}
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>

                    {/* Fila 2: Origen y Destino */}
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
                                {renderMasterOptions(mockLocalizaciones)}
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>

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
                                {renderMasterOptions(mockLocalizaciones)}
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>

                    {/* Fila 3: Carga e Incoterm */}
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
                                <option value="" disabled>Seleccione tipo de carga...</option>
                                {renderEnumOptions(TipoCarga)}
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>

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
                                <option value="" disabled>Seleccione Incoterm...</option>
                                {renderEnumOptions(Incoterm)}
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>

                    {/* Fila 4: Precio y Moneda */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="precio_base">Precio Base*</label>
                        <div className="input-field-wrapper">
                            <span className="input-icon-left"><DollarSign size={20} className="input-icon" /></span>
                            <input
                                type="number"
                                step="0.01"
                                id="precio_base"
                                name="precio_base"
                                value={formData.precio_base}
                                onChange={handleFormChange}
                                className="form-input with-icon"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="moneda">Moneda*</label>
                        <div className="input-field-wrapper">
                            <span className="input-icon-left"><Tag size={20} className="input-icon" /></span>
                            <input
                                type="text"
                                id="moneda"
                                name="moneda"
                                value={formData.moneda}
                                onChange={handleFormChange}
                                className="form-input with-icon"
                                required
                            />
                        </div>
                    </div>

                    {/* Fila 5: Vigencia (Full width en móvil, 2 columnas en desktop) */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="fecha_vigencia_inicio">Vigencia Inicio*</label>
                        <div className="input-field-wrapper">
                            <span className="input-icon-left"><Calendar size={20} className="input-icon" /></span>
                            <input
                                type="date"
                                id="fecha_vigencia_inicio"
                                name="fecha_vigencia_inicio"
                                value={formData.fecha_vigencia_inicio}
                                onChange={handleFormChange}
                                className="form-input with-icon"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="fecha_vigencia_fin">Vigencia Fin*</label>
                        <div className="input-field-wrapper">
                            <span className="input-icon-left"><Calendar size={20} className="input-icon" /></span>
                            <input
                                type="date"
                                id="fecha_vigencia_fin"
                                name="fecha_vigencia_fin"
                                value={formData.fecha_vigencia_fin}
                                onChange={handleFormChange}
                                className="form-input with-icon"
                                required
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
                        {selectedTarifa ? "Actualizar Tarifa" : "Guardar Tarifa"}
                    </button>
                </div>
            </form>
        </div>
    );
};


const Tarifas = () => {
    const [tarifas, setTarifas] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedTarifa, setSelectedTarifa] = useState(null);
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        fetchTarifas();
    }, []);

    const fetchTarifas = () => {
        const data = [
            { id_tarifa: 1001, id_proveedor: 501, tipo_servicio: 'MARITIMO', tipo_carga: 'FCL', id_origen_localizacion: 103, id_destino_localizacion: 101, incoterm: 'FOB', precio_base: '1500.00', moneda: 'USD', fecha_vigencia_inicio: '2025-01-01', fecha_vigencia_fin: '2025-12-31' },
            { id_tarifa: 1002, id_proveedor: 503, tipo_servicio: 'AEREO', tipo_carga: 'CARGA_SUELTA', id_origen_localizacion: 102, id_destino_localizacion: 104, incoterm: 'DDP', precio_base: '0.85', moneda: 'USD/Kg', fecha_vigencia_inicio: '2025-03-01', fecha_vigencia_fin: '2025-06-30' },
        ];
        setTarifas(data);
    };

    const getProveedorName = (id) => mockProveedores.find(p => p.id === parseInt(id))?.nombre || 'N/A';
    const getLocationName = (id) => mockLocalizaciones.find(l => l.id === parseInt(id))?.nombre || 'N/A';

    const filteredTarifas = useMemo(() => {
        return tarifas.filter((tarifa) =>
            `${tarifa.id_tarifa} ${getProveedorName(tarifa.id_proveedor)} ${tarifa.tipo_servicio} ${tarifa.tipo_carga} ${tarifa.incoterm} ${tarifa.precio_base} ${tarifa.moneda}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [tarifas, searchTerm]);


    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        setIsFormOpen(false);
        setFormData(initialFormData);
        setSelectedTarifa(null);
        fetchTarifas();
    };

    const openFormForNew = () => {
        setSelectedTarifa(null);
        setFormData(initialFormData);
        setIsFormOpen(true);
        setIsDeleteConfirmOpen(false);
    };

    const openFormForEdit = (tarifa) => {
        setSelectedTarifa(tarifa);
        setFormData({
            id_proveedor: tarifa.id_proveedor,
            tipo_servicio: tarifa.tipo_servicio,
            tipo_carga: tarifa.tipo_carga,
            id_origen_localizacion: tarifa.id_origen_localizacion,
            id_destino_localizacion: tarifa.id_destino_localizacion,
            incoterm: tarifa.incoterm,
            precio_base: tarifa.precio_base,
            moneda: tarifa.moneda,
            fecha_vigencia_inicio: tarifa.fecha_vigencia_inicio,
            fecha_vigencia_fin: tarifa.fecha_vigencia_fin,
        });
        setIsFormOpen(true);
        setIsDeleteConfirmOpen(false);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setFormData(initialFormData);
        setSelectedTarifa(null);
    };

    const openDeleteConfirm = (tarifa) => {
        setSelectedTarifa(tarifa);
        setIsDeleteConfirmOpen(true);
        setIsFormOpen(false);
    };

    const deleteTarifa = () => {
        setTarifas(tarifas.filter(t => t.id_tarifa !== selectedTarifa.id_tarifa));
        setIsDeleteConfirmOpen(false);
        setSelectedTarifa(null);
    };

    return (
        <AppLayout activeLink="/tarifas">
            <div className="agents-container">
                <h1 className="agents-title">Catálogo de Tarifas</h1>
                <p className="agents-subtitle">
                    Administración de tarifas base de transporte por proveedor, ruta y tipo de servicio.
                </p>

                {/* Controles */}
                <div className="agents-controls">
                    <div className="search-bar-wrapper">
                        <div className="search-icon-left">
                            <Search className="search-icon" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por ID, proveedor, incoterm o servicio..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <button
                        onClick={openFormForNew}
                        className="btn btn-new-agent"
                        disabled={isFormOpen}
                    >
                        <Plus size={20} />
                        Nueva Tarifa
                    </button>
                </div>

                {/* Formulario */}
                {isFormOpen && (
                    <TarifaForm
                        selectedTarifa={selectedTarifa}
                        formData={formData}
                        handleFormChange={handleFormChange}
                        handleFormSubmit={handleFormSubmit}
                        closeForm={closeForm}
                    />
                )}

                {/* Confirmación eliminar */}
                {isDeleteConfirmOpen && (
                    <DeleteConfirmBanner
                        selectedProveedor={selectedTarifa}
                        deleteProveedor={deleteTarifa}
                        cancel={() => setIsDeleteConfirmOpen(false)}
                    />
                )}

                {/* Tabla */}
                <div className="agents-table-wrapper">
                    <div className="table-responsive">
                        <table className="agents-table">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-th table-th-id">ID</th>
                                    <th className="table-th">Proveedor</th>
                                    <th className="table-th">Ruta (Origen-Destino)</th>
                                    <th className="table-th">Servicio/Carga</th>
                                    <th className="table-th">Incoterm</th>
                                    <th className="table-th">Precio Base</th>
                                    <th className="table-th">Vigencia</th>
                                    <th className="table-th table-th-actions">Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="table-body">
                                {filteredTarifas.length > 0 ? (
                                    filteredTarifas.map((tarifa) => (
                                        <tr key={tarifa.id_tarifa} className="table-row">
                                            <td className="table-td table-td-id" data-label="ID:">{tarifa.id_tarifa}</td>
                                            <td className="table-td table-td-name" data-label="Proveedor:">{getProveedorName(tarifa.id_proveedor)}</td>
                                            <td className="table-td" data-label="Ruta:">
                                                <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: '5px', color: '#6b7280' }} />
                                                {getLocationName(tarifa.id_origen_localizacion)} - {getLocationName(tarifa.id_destino_localizacion)}
                                            </td>
                                            <td className="table-td" data-label="Servicio/Carga:">
                                                **{TipoServicio[tarifa.tipo_servicio]}**<br />
                                                <span className="table-td-email">{TipoCarga[tarifa.tipo_carga]}</span>
                                            </td>
                                            <td className="table-td" data-label="Incoterm:">{Incoterm[tarifa.incoterm]}</td>
                                            <td className="table-td" data-label="Precio Base:">
                                                **{tarifa.precio_base}** {tarifa.moneda}
                                            </td>
                                            <td className="table-td table-td-date" data-label="Vigencia:">
                                                {tarifa.fecha_vigencia_inicio} a {tarifa.fecha_vigencia_fin}
                                            </td>

                                            <td className="table-td table-td-actions">
                                                <div className="actions-container">
                                                    <button
                                                        onClick={() => openFormForEdit(tarifa)}
                                                        className="action-btn action-btn-edit"
                                                        title="Editar"
                                                    >
                                                        <Edit size={18} />
                                                    </button>

                                                    <button
                                                        onClick={() => openDeleteConfirm(tarifa)}
                                                        className="action-btn action-btn-delete"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="table-empty-state">
                                            No se encontraron tarifas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
};

export default Tarifas;