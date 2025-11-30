import React, { useEffect, useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Tag, Truck, DollarSign, Calendar, MapPin, XCircle, Save, X, AlertTriangle, ChevronsUpDown } from 'lucide-react';
import AppLayout from '../Layout/AppLayout';
import './tarifas.css';
import { apiGet, apiPost, apiPut, apiDelete } from '../services/api';
import { useProveedores } from '../hooks/useProveedores';

const TipoServicioBackend = {
    maritimo: 'Marítimo',
    aereo: 'Aéreo',
    terrestre: 'Terrestre',
    ultima_milla: 'Última Milla',
    domestico: 'Doméstico',
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

export const DeleteConfirmBanner = ({ selectedTarifa, deleteTarifa, cancel }) => (
    <div className="delete-confirm-banner">
        <div className="banner-icon-message">
            <AlertTriangle size={24} className="banner-icon" />
            <p>
                ¿Seguro que deseas eliminar a <strong>{selectedTarifa?.tipo_servicio}</strong>?  
                Esta acción no se puede deshacer.
            </p>
        </div>

        <div className="banner-actions">
            <button className="btn btn-secondary" onClick={cancel}>
                <XCircle size={18} /> Cancelar
            </button>

            <button className="btn btn-danger" onClick={deleteTarifa}>
                <Trash2 size={18} /> Confirmar Eliminación
            </button>
        </div>
    </div>
);
export const TarifaForm = ({
    selectedTarifa,
    formData,
    handleFormChange,
    handleFormSubmit,
    closeForm,
    proveedores,
    localizaciones,
}) => {

    const renderEnumOptions = (enumObject) => (
        Object.entries(enumObject).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
        ))
    );

    const renderMasterOptions = (data) => (
        data.map(item => (
            <option key={item.id || item.id_localizacion || item.id_proveedor} value={item.id || item.id_localizacion || item.id_proveedor}>
                {item.nombre_ciudad || item.nombre}
            </option>
        ))
    );

    return (
        <div className="client-form-card">
            <h2 className="form-card-title">
                {selectedTarifa ? "Editar Tarifa" : "Nueva Tarifa de Transporte"}
            </h2>

            <form onSubmit={handleFormSubmit} className="form-content">
                <div className="form-grid">
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
                                {renderMasterOptions(proveedores)}
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
                                {renderEnumOptions(TipoServicioBackend)}
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>
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
                                {renderMasterOptions(localizaciones)}
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
                                {renderMasterOptions(localizaciones)}
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>
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
    const [localizaciones, setLocalizaciones] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedTarifa, setSelectedTarifa] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [loadingTarifas, setLoadingTarifas] = useState(true);
    const [errorTarifas, setErrorTarifas] = useState(null);

    const { proveedores, loading: loadingProveedores, error: errorProveedores } = useProveedores();

    const TARIFA_ENDPOINT = '/tarifas';
    const ID_KEY = 'id_tarifa';

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchTarifas = async () => {
        setLoadingTarifas(true);
        setErrorTarifas(null);
        try {
            const data = await apiGet(TARIFA_ENDPOINT);
            setTarifas(data);
        } catch (err) {
            console.error("Error al obtener tarifas:", err);
            setErrorTarifas("Error al cargar las tarifas. Verifica tu conexión y la API.");
        } finally {
            setLoadingTarifas(false);
        }
    };

    const fetchLocalizaciones = async () => {
        try {
            const data = await apiGet('/localizaciones');
            setLocalizaciones(data || []);
        } catch (err) {
            console.error("Error al obtener localizaciones:", err);
        }
    };

    useEffect(() => {
        fetchTarifas();
        fetchLocalizaciones();
    }, []);

    const getProveedorName = (tarifa) => {
        // Varias formas en que el nombre puede venir desde la API: relación completa, campos planos o buscar en el hook de proveedores
        if (tarifa.proveedor?.nombre) return tarifa.proveedor.nombre;
        if (tarifa.proveedor?.nombre_empresa) return tarifa.proveedor.nombre_empresa;
        if (tarifa.proveedor_nombre) return tarifa.proveedor_nombre;
        // Buscar en el array de proveedores traído por el hook (puede existir como id o id_proveedor)
        const found = proveedores?.find(p => Number(p.id) === Number(tarifa.id_proveedor));
        if (found) return found.nombre;
        return 'N/A';
    };
    const getLocationName = (tarifa, field) => {
        if (field === 'origen') return tarifa.origen?.nombre_ciudad || 'N/A';
        if (field === 'destino') return tarifa.destino?.nombre_ciudad || 'N/A';
        return 'N/A';
    };

    const filteredTarifas = useMemo(() => {
        return tarifas.filter((tarifa) =>
            `${tarifa[ID_KEY]} ${getProveedorName(tarifa)} ${tarifa.tipo_servicio} ${tarifa.tipo_carga} ${tarifa.incoterm} ${tarifa.precio_base} ${tarifa.moneda}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [tarifas, searchTerm]);
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const proveedorId = parseInt(formData.id_proveedor, 10);
            const origenId = parseInt(formData.id_origen_localizacion, 10);
            const destinoId = parseInt(formData.id_destino_localizacion, 10);

            if (isNaN(proveedorId) || isNaN(origenId) || isNaN(destinoId)) {
                throw new Error("Debe seleccionar un Proveedor, Origen y Destino válidos.");
            }

            const dataToSend = {
                id_proveedor: proveedorId,
                id_origen_localizacion: origenId,
                id_destino_localizacion: destinoId,

                tipo_servicio: formData.tipo_servicio,
                tipo_carga: formData.tipo_carga,
                incoterm: formData.incoterm,
                precio_base: String(formData.precio_base),
                moneda: formData.moneda,
                fecha_vigencia_inicio: formData.fecha_vigencia_inicio,
                fecha_vigencia_fin: formData.fecha_vigencia_fin,
            };

            if (selectedTarifa) {
                await apiPut(`${TARIFA_ENDPOINT}/${selectedTarifa[ID_KEY]}`, dataToSend);
            } else {
                await apiPost(TARIFA_ENDPOINT, dataToSend);
            }

            closeForm();
            await fetchTarifas();
        } catch (err) {
            console.error("Error al guardar tarifa:", err);
            let errorMessage = "Ocurrió un error desconocido al guardar la tarifa.";
            if (err.response?.message) {
                errorMessage = Array.isArray(err.response.message) ? err.response.message.join(', ') : err.response.message;
            } else if (err.message) {
                errorMessage = `Error: ${err.message}`;
            }

            alert(`Error al guardar la tarifa: ${errorMessage}`);
        }
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
            id_proveedor: String(tarifa.id_proveedor),
            tipo_servicio: tarifa.tipo_servicio,
            tipo_carga: tarifa.tipo_carga,
            id_origen_localizacion: String(tarifa.id_origen_localizacion),
            id_destino_localizacion: String(tarifa.id_destino_localizacion),
            incoterm: tarifa.incoterm,
            precio_base: String(tarifa.precio_base),
            moneda: tarifa.moneda,
            fecha_vigencia_inicio: tarifa.fecha_vigencia_inicio.substring(0, 10),
            fecha_vigencia_fin: tarifa.fecha_vigencia_fin.substring(0, 10),
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
    const deleteTarifa = async () => {
        if (!selectedTarifa) return;

        try {
            await apiDelete(`${TARIFA_ENDPOINT}/${selectedTarifa[ID_KEY]}`);

            setIsDeleteConfirmOpen(false);
            setSelectedTarifa(null);
            await fetchTarifas();
        } catch (err) {
            console.error("Error al eliminar tarifa:", err);
            alert(`Error al eliminar la tarifa: ${err.response?.message || err.message}`);
        }
    };
    if (loadingTarifas || loadingProveedores) {
        return (
            <AppLayout activeLink="/tarifas">
                <div className="agents-container">
                    <h1 className="agents-title">Catálogo de Tarifas</h1>
                </div>
            </AppLayout>
        );
    }

    if (errorTarifas || errorProveedores) {
        return (
            <AppLayout activeLink="/tarifas">
                <div className="agents-container">
                    <h1 className="agents-title">Catálogo de Tarifas</h1>
                    <p className="error-message">Error al cargar datos: {errorTarifas || errorProveedores}</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout activeLink="/tarifas">
            <div className="agents-container">
                <h1 className="agents-title">Catálogo de Tarifas</h1>
                <p className="agents-subtitle">
                    Administración de tarifas base de transporte por proveedor, ruta y tipo de servicio.
                </p>
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
                {isFormOpen && (
                    <TarifaForm
                        selectedTarifa={selectedTarifa}
                        formData={formData}
                        handleFormChange={handleFormChange}
                        handleFormSubmit={handleFormSubmit}
                        closeForm={closeForm}
                        proveedores={proveedores}
                        localizaciones={localizaciones}
                    />
                )}
                {isDeleteConfirmOpen && (
                    <DeleteConfirmBanner
                        selectedTarifa={selectedTarifa}
                        deleteTarifa={deleteTarifa}
                        cancel={() => setIsDeleteConfirmOpen(false)}
                    />
                )}
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
                                        <tr key={tarifa[ID_KEY]} className="table-row">
                                            <td className="table-td table-td-id" data-label="ID:">{tarifa[ID_KEY]}</td>
                                            <td className="table-td table-td-name" data-label="Proveedor:"><strong>{getProveedorName(tarifa)}</strong></td>
                                            <td className="table-td" data-label="Ruta:">
                                                <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: '5px', color: '#6b7280' }} />
                                                {getLocationName(tarifa, 'origen')} - {getLocationName(tarifa, 'destino')}
                                            </td>
                                            <td className="table-td" data-label="Servicio/Carga:">
                                                <strong>{TipoServicioBackend[tarifa.tipo_servicio] || tarifa.tipo_servicio}</strong><br />
                                                <span className="table-td-email">{TipoCarga[tarifa.tipo_carga]}</span>
                                            </td>
                                            <td className="table-td" data-label="Incoterm:">{Incoterm[tarifa.incoterm]}</td>
                                            <td className="table-td" data-label="Precio Base:">
                                                {tarifa.precio_base} {tarifa.moneda}
                                            </td>
                                            <td className="table-td table-td-date" data-label="Vigencia:">
                                                {tarifa.fecha_vigencia_inicio.substring(0, 10)} a {tarifa.fecha_vigencia_fin.substring(0, 10)}
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