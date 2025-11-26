import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, Box, Mail, Phone, MapPin, XCircle, Save, X, AlertTriangle, Hash } from 'lucide-react';
import AppLayout from '../Layout/AppLayout';
import './proveedores.css';
import { apiGet, apiPost } from '../services/api';

export const ProveedorForm = ({ selectedProveedor, formData, handleFormChange, handleFormSubmit, closeForm }) => (
    <div className="proveedor-form-card">
        <h2 className="form-card-title">
            {selectedProveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
        </h2>

        <form onSubmit={handleFormSubmit} className="form-content">
            <div className="form-grid">

                <div className="form-group">
                    <label className="form-label" htmlFor="nombre">Razón Social/Nombre*</label>
                    <div className="input-field-wrapper">
                        <span className="input-icon-left"><Box size={20} className="input-icon" /></span>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleFormChange}
                            className="form-input with-icon"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="rfc">RFC/ID Fiscal*</label>
                    <div className="input-field-wrapper">
                        <span className="input-icon-left"><Hash size={20} className="input-icon" /></span>
                        <input
                            type="text"
                            id="rfc"
                            name="rfc"
                            value={formData.rfc}
                            onChange={handleFormChange}
                            className="form-input with-icon"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="telefono">Teléfono</label>
                    <div className="input-field-wrapper">
                        <span className="input-icon-left"><Phone size={20} className="input-icon" /></span>
                        <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleFormChange}
                            className="form-input with-icon"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="correo">Correo de Contacto*</label>
                    <div className="input-field-wrapper">
                        <span className="input-icon-left"><Mail size={20} className="input-icon" /></span>
                        <input
                            type="email"
                            id="correo"
                            name="correo"
                            value={formData.correo}
                            onChange={handleFormChange}
                            className="form-input with-icon"
                            required
                        />
                    </div>
                </div>

                <div className="form-group span-full">
                    <label className="form-label" htmlFor="direccion">Dirección Fiscal/Principal</label>
                    <div className="input-field-wrapper">
                        <span className="input-icon-left"><MapPin size={20} className="input-icon" /></span>
                        <input
                            type="text"
                            id="direccion"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleFormChange}
                            className="form-input with-icon"
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
                    {selectedProveedor ? "Actualizar Proveedor" : "Guardar Proveedor"}
                </button>
            </div>
        </form>
    </div>
);

export const DeleteConfirmBanner = ({ selectedProveedor, deleteProveedor, cancel }) => (
    <div className="delete-confirm-banner">
        <div className="banner-icon-message">
            <AlertTriangle size={24} className="banner-icon" />
            <p>
                ¿Seguro que deseas eliminar a <strong>{selectedProveedor?.nombre}</strong> (ID: {selectedProveedor?.id_proveedor})?
                Esta acción no se puede deshacer.
            </p>
        </div>

        <div className="banner-actions">
            <button className="btn btn-secondary" onClick={cancel}>
                <XCircle size={18} /> Cancelar
            </button>

            <button className="btn btn-danger" onClick={deleteProveedor}>
                <Trash2 size={18} /> Confirmar Eliminación
            </button>
        </div>
    </div>
);

const initialFormData = {
    nombre: '',
    rfc: '',
    telefono: '',
    correo: '',
    direccion: '',
};

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedProveedor, setSelectedProveedor] = useState(null);
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        fetchProveedores();
    }, []);
    const fetchProveedores = async () => {
        try {
            const data = await apiGet('/proveedores');
            const mapped = data.map(p => ({
                id_proveedor: p.id_proveedor,
                nombre: p.nombre_empresa,
                rfc: p.rfc,
                telefono: p.telefono,
                correo: p.email_contacto,
                direccion: p.contacto_nombre,
                fecha_registro: p.fecha_creacion,
            }));
            setProveedores(mapped);
        } catch (err) {
            console.error("Error obteniendo proveedores", err);
        }
    };

    const filteredProveedores = proveedores.filter((proveedor) =>
        `${proveedor.nombre} ${proveedor.rfc} ${proveedor.telefono} ${proveedor.correo} ${proveedor.direccion} ${proveedor.id_proveedor}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const body = {
            nombre_empresa: formData.nombre,
            rfc: formData.rfc,
            telefono: formData.telefono,
            email_contacto: formData.correo,
            contacto_nombre: formData.direccion,
            tipo_servicio_ofrecido: "terrestre"
        };

        try {
            if (selectedProveedor) {
                await apiPost(`/proveedores/${selectedProveedor.id_proveedor}`, body, { method: "PATCH" });
            } else {
                await apiPost('/proveedores', body);
            }

            fetchProveedores();
            setIsFormOpen(false);
            setFormData(initialFormData);
            setSelectedProveedor(null);
        } catch (err) {
            console.error("Error guardando proveedor:", err);
        }
    };

    const openFormForNew = () => {
        setSelectedProveedor(null);
        setFormData(initialFormData);
        setIsFormOpen(true);
        setIsDeleteConfirmOpen(false);
    };

    const openFormForEdit = (proveedor) => {
        setSelectedProveedor(proveedor);
        setFormData({
            nombre: proveedor.nombre,
            rfc: proveedor.rfc,
            telefono: proveedor.telefono,
            correo: proveedor.correo,
            direccion: proveedor.direccion,
        });
        setIsFormOpen(true);
        setIsDeleteConfirmOpen(false);
    };

    const openDeleteConfirm = (proveedor) => {
        setSelectedProveedor(proveedor);
        setIsDeleteConfirmOpen(true);
        setIsFormOpen(false);
    };


    const closeForm = () => {
        setIsFormOpen(false);
        setFormData(initialFormData);
        setSelectedProveedor(null);
    };
    const deleteProveedor = async () => {
        try {
            await apiPost(`/proveedores/${selectedProveedor.id_proveedor}`, {}, { method: "DELETE" });
            fetchProveedores();
        } catch (err) {
            console.error("Error eliminando proveedor", err);
        }
        setIsDeleteConfirmOpen(false);
        setSelectedProveedor(null);
    };

    return (
        <AppLayout activeLink="/proveedores">
            <div className="agents-container">
                <h1 className="agents-title">Gestión de Proveedores</h1>
                <p className="agents-subtitle">
                    Administración centralizada de datos y contactos de los proveedores.
                </p>

                <div className="agents-controls">
                    <div className="search-bar-wrapper">
                        <div className="search-icon-left">
                            <Search className="search-icon" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por ID, nombre, RFC, o correo..."
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
                        Nuevo Proveedor
                    </button>
                </div>

                {isFormOpen && (
                    <ProveedorForm
                        selectedProveedor={selectedProveedor}
                        formData={formData}
                        handleFormChange={handleFormChange}
                        handleFormSubmit={handleFormSubmit}
                        closeForm={closeForm}
                    />
                )}

                {isDeleteConfirmOpen && (
                    <DeleteConfirmBanner
                        selectedProveedor={selectedProveedor}
                        deleteProveedor={deleteProveedor}
                        cancel={() => setIsDeleteConfirmOpen(false)}
                    />
                )}

                <div className="agents-table-wrapper">
                    <div className="table-responsive">
                        <table className="agents-table">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-th table-th-id">ID</th>
                                    <th className="table-th">Razón Social</th>
                                    <th className="table-th">RFC/ID Fiscal</th>
                                    <th className="table-th">Teléfono</th>
                                    <th className="table-th table-th-email">Correo</th>
                                    <th className="table-th table-th-address">Dirección</th>
                                    <th className="table-th table-th-actions">Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="table-body">
                                {filteredProveedores.length > 0 ? (
                                    filteredProveedores.map((proveedor) => (
                                        <tr key={proveedor.id_proveedor} className="table-row">
                                            <td className="table-td table-td-id" data-label="ID:">{proveedor.id_proveedor}</td>
                                            <td className="table-td table-td-name" data-label="Razón Social:">{proveedor.nombre}</td>
                                            <td className="table-td" data-label="RFC/ID:">{proveedor.rfc}</td>
                                            <td className="table-td" data-label="Teléfono:">{proveedor.telefono}</td>
                                            <td className="table-td table-td-email" data-label="Correo:">{proveedor.correo}</td>
                                            <td className="table-td" data-label="Dirección:">{proveedor.direccion}</td>

                                            <td className="table-td table-td-actions">
                                                <div className="actions-container">
                                                    <button
                                                        onClick={() => openFormForEdit(proveedor)}
                                                        className="action-btn action-btn-edit"
                                                        title="Editar"
                                                    >
                                                        <Edit size={18} />
                                                    </button>

                                                    <button
                                                        onClick={() => openDeleteConfirm(proveedor)}
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
                                        <td colSpan="7" className="table-empty-state">
                                            No se encontraron proveedores.
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

export default Proveedores;
