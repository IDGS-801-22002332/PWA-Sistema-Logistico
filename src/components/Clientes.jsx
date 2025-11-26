import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, User, Mail, Phone, MapPin, XCircle, Save, X, AlertTriangle } from 'lucide-react';
import AppLayout from '../Layout/AppLayout';
import './clientes.css';
import { apiGet, apiPost, apiPatch, apiDelete } from '../services/api';

export const ClientForm = ({
    selectedClient,
    formData,
    handleFormChange,
    handleFormSubmit,
    closeForm
}) => (
    <div className="client-form-card">
        <h2 className="form-card-title">
            {selectedClient ? "Editar Cliente" : "Nuevo Cliente"}
        </h2>

        <form onSubmit={handleFormSubmit} className="form-content">
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">Nombre Empresa*</label>
                    <div className="input-field-wrapper">
                        <span className="input-icon-left">
                            <User size={20} className="input-icon" />
                        </span>
                        <input
                            type="text"
                            name="nombre_empresa"
                            value={formData.nombre_empresa}
                            onChange={handleFormChange}
                            className="form-input with-icon"
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">RFC*</label>
                    <div className="input-field-wrapper">
                        <span className="input-icon-left">
                            <User size={20} className="input-icon" />
                        </span>
                        <input
                            type="text"
                            name="rfc"
                            value={formData.rfc}
                            onChange={handleFormChange}
                            className="form-input with-icon"
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <div className="input-field-wrapper">
                        <span className="input-icon-left">
                            <Phone size={20} className="input-icon" />
                        </span>
                        <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleFormChange}
                            className="form-input with-icon"
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Correo</label>
                    <div className="input-field-wrapper">
                        <span className="input-icon-left">
                            <Mail size={20} className="input-icon" />
                        </span>
                        <input
                            type="email"
                            name="email_contacto"
                            value={formData.email_contacto}
                            onChange={handleFormChange}
                            className="form-input with-icon"
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Nombre del Contacto</label>
                    <div className="input-field-wrapper">
                        <span className="input-icon-left">
                            <User size={20} className="input-icon" />
                        </span>
                        <input
                            type="text"
                            name="contacto_nombre"
                            value={formData.contacto_nombre}
                            onChange={handleFormChange}
                            className="form-input with-icon"
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Puesto del Contacto</label>
                    <div className="input-field-wrapper">
                        <span className="input-icon-left">
                            <MapPin size={20} className="input-icon" />
                        </span>
                        <input
                            type="text"
                            name="contacto_puesto"
                            value={formData.contacto_puesto}
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
                    {selectedClient ? "Actualizar Cliente" : "Guardar Cliente"}
                </button>
            </div>
        </form>
    </div>
);

export const DeleteConfirmBanner = ({ selectedClient, deleteClient, cancel }) => (
    <div className="delete-confirm-banner">
        <div className="banner-icon-message">
            <AlertTriangle size={24} className="banner-icon" />
            <p>
                ¿Seguro que deseas eliminar a <strong>{selectedClient?.nombre_empresa}</strong>?
            </p>
        </div>

        <div className="banner-actions">
            <button className="btn btn-secondary" onClick={cancel}>
                <XCircle size={18} /> Cancelar
            </button>

            <button className="btn btn-danger" onClick={deleteClient}>
                <Trash2 size={18} /> Confirmar Eliminación
            </button>
        </div>
    </div>
);

const initialFormData = {
    nombre_empresa: "",
    rfc: "",
    id_pais: 1,
    id_localizacion: 1,
    telefono: "",
    email_contacto: "",
    contacto_nombre: "",
    contacto_puesto: ""
};

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const data = await apiGet('/clientes');
            setClientes(data);
        } catch (error) {
            console.error("Error cargando clientes:", error);
        }
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedClient) {
                await apiPatch(`/clientes/${selectedClient.id_cliente}`, formData);
            } else {
                await apiPost('/clientes', formData);
            }

            fetchClientes();
            closeForm();
        } catch (error) {
            console.error("Error guardando cliente", error);
        }
    };
    const deleteClient = async () => {
        try {
            await apiDelete(`/clientes/${selectedClient.id_cliente}`);
            fetchClientes();
        } catch (error) {
            console.error("Error eliminando cliente", error);
        }
        setIsDeleteConfirmOpen(false);
        setSelectedClient(null);
    };
    const filteredClients = clientes.filter((c) =>
        `${c.id_cliente} ${c.nombre_empresa} ${c.rfc} ${c.telefono} ${c.email_contacto}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openFormForNew = () => {
        setSelectedClient(null);
        setFormData(initialFormData);
        setIsFormOpen(true);
    };

    const openFormForEdit = (cl) => {
        setSelectedClient(cl);
        setFormData({
            nombre_empresa: cl.nombre_empresa,
            rfc: cl.rfc,
            id_pais: cl.id_pais ?? 1,
            id_localizacion: cl.id_localizacion ?? 1,
            telefono: cl.telefono ?? "",
            email_contacto: cl.email_contacto ?? "",
            contacto_nombre: cl.contacto_nombre ?? "",
            contacto_puesto: cl.contacto_puesto ?? "",
        });
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setFormData(initialFormData);
    };

    const openDeleteConfirm = (cl) => {
        setSelectedClient(cl);
        setIsDeleteConfirmOpen(true);
    };
    return (
        <AppLayout activeLink="/clientes">
            <div className="agents-container">
                <h1 className="agents-title">Gestión de Clientes</h1>
                <p className="agents-subtitle">Administración de la información de clientes.</p>

                {/* Controles */}
                <div className="agents-controls">
                    <div className="search-bar-wrapper">
                        <div className="search-icon-left">
                            <Search className="search-icon" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por ID, nombre, RFC, teléfono..."
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
                        <Plus size={20} /> Nuevo Cliente
                    </button>
                </div>

                {isFormOpen && (
                    <ClientForm
                        selectedClient={selectedClient}
                        formData={formData}
                        handleFormChange={handleFormChange}
                        handleFormSubmit={handleFormSubmit}
                        closeForm={closeForm}
                    />
                )}
                {isDeleteConfirmOpen && (
                    <DeleteConfirmBanner
                        selectedClient={selectedClient}
                        deleteClient={deleteClient}
                        cancel={() => setIsDeleteConfirmOpen(false)}
                    />
                )}
                <div className="agents-table-wrapper">
                    <div className="table-responsive">
                        <table className="agents-table">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-th table-th-id">ID</th>
                                    <th className="table-th">Empresa</th>
                                    <th className="table-th">RFC</th>
                                    <th className="table-th">Telefono</th>
                                    <th className="table-th">Contacto</th>
                                    <th className="table-th">Nombre</th>
                                    <th className="table-th">Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="table-body">
                                {filteredClients.length > 0 ? (
                                    filteredClients.map((c) => (
                                        <tr key={c.id_cliente}>
                                            <td className="table-td table-td-id" data-label="ID:">{c.id_cliente}</td>
                                            <td className="table-td table-td-name" data-label="Nombre:">{c.nombre_empresa}</td>
                                            <td className="table-td" data-label="Teléfono:"> {c.rfc}</td>
                                            <td className="table-td table-td-email" data-label="Correo:">{c.telefono}</td>
                                            <td className="table-td" data-label="Dirección:">{c.email_contacto}</td>
                                            <td>{c.contacto_nombre}</td>
                                            <td className="table-td-actions">
                                                <button
                                                    onClick={() => openFormForEdit(c)}
                                                    className="action-btn action-btn-edit"
                                                >
                                                    <Edit size={18} />
                                                </button>

                                                <button
                                                    onClick={() => openDeleteConfirm(c)}
                                                    className="action-btn action-btn-delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="table-empty-state">
                                            No se encontraron clientes.
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

export default Clientes;
