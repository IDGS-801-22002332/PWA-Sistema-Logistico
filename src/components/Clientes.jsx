import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, User, Mail, Phone, MapPin, XCircle, Save, X, AlertTriangle } from 'lucide-react';
import AppLayout from '../Layout/AppLayout';
import './clientes.css'; 

export const ClientForm = ({ selectedClient, formData, handleFormChange, handleFormSubmit, closeForm }) => (
    <div className="client-form-card">
        <h2 className="form-card-title">
            {selectedClient ? "Editar Cliente" : "Nuevo Cliente"}
        </h2>

        <form onSubmit={handleFormSubmit} className="form-content">
            <div className="form-grid">

                {/* Nombre */}
                <div className="form-group">
                    <label className="form-label" htmlFor="nombre">Nombre Completo*</label>
                    <div className="input-field-wrapper">
                        <span className="input-icon-left"><User size={20} className="input-icon"/></span>
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

                {/* Teléfono */}
                <div className="form-group">
                    <label className="form-label" htmlFor="telefono">Teléfono*</label>
                    <div className="input-field-wrapper">
                        <span className="input-icon-left"><Phone size={20} className="input-icon"/></span>
                        <input 
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleFormChange}
                            className="form-input with-icon"
                            required
                        />
                    </div>
                </div>

                {/* Correo */}
                <div className="form-group">
                    <label className="form-label" htmlFor="correo">Correo Electrónico</label>
                    <div className="input-field-wrapper">
                        <span className="input-icon-left"><Mail size={20} className="input-icon"/></span>
                        <input 
                            type="email"
                            id="correo"
                            name="correo"
                            value={formData.correo}
                            onChange={handleFormChange}
                            className="form-input with-icon"
                        />
                    </div>
                </div>

                {/* Dirección */}
                <div className="form-group">
                    <label className="form-label" htmlFor="direccion">Dirección</label>
                    <div className="input-field-wrapper">
                        <span className="input-icon-left"><MapPin size={20} className="input-icon"/></span>
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
                ¿Seguro que deseas eliminar a <strong>{selectedClient?.nombre}</strong>? 
                Esta acción no se puede deshacer.
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
    nombre: '',
    telefono: '',
    correo: '',
    direccion: '',
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

    const fetchClientes = () => {
        const data = [
            { id_cliente: 101, nombre: "Distribuidora Alfa S.A.", telefono: "55-1234-5678", correo: "contacto@alfa.com", direccion: "Calle Falsa 123", fecha_registro: new Date(2023, 8, 10) },
            { id_cliente: 102, nombre: "Servicios Beta Ltda.", telefono: "33-9876-5432", correo: "soporte@beta.com", direccion: "Av. Principal 456", fecha_registro: new Date(2024, 1, 5) },
            { id_cliente: 103, nombre: "Gama Global C.V.", telefono: "81-1122-3344", correo: "ventas@gama.mx", direccion: "Blvd. Industrial 789", fecha_registro: new Date(2024, 6, 1) }
        ];
        setClientes(data);
    };

    const filteredClients = clientes.filter((client) =>
        `${client.nombre} ${client.telefono} ${client.correo} ${client.direccion} ${client.id_cliente}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (selectedClient) {
            setClientes(clientes.map(c =>
                c.id_cliente === selectedClient.id_cliente ? { ...c, ...formData } : c
            ));
        } else {
            const newClient = {
                ...formData,
                id_cliente: clientes.length > 0 ? Math.max(...clientes.map(c => c.id_cliente)) + 1 : 1,
                fecha_registro: new Date(),
            };
            setClientes([...clientes, newClient]);
        }

        setIsFormOpen(false);
        setFormData(initialFormData);
        setSelectedClient(null);
    };

    const openFormForNew = () => {
        setSelectedClient(null);
        setFormData(initialFormData);
        setIsFormOpen(true);
        setIsDeleteConfirmOpen(false);
    };

    const openFormForEdit = (client) => {
        setSelectedClient(client);
        setFormData({
            nombre: client.nombre,
            telefono: client.telefono,
            correo: client.correo,
            direccion: client.direccion,
        });
        setIsFormOpen(true);
        setIsDeleteConfirmOpen(false);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setFormData(initialFormData);
        setSelectedClient(null);
    };

    const openDeleteConfirm = (client) => {
        setSelectedClient(client);
        setIsDeleteConfirmOpen(true);
        setIsFormOpen(false);
    };

    const deleteClient = () => {
        setClientes(clientes.filter(c => c.id_cliente !== selectedClient.id_cliente));
        setIsDeleteConfirmOpen(false);
        setSelectedClient(null);
    };

    return (
        <AppLayout activeLink="/clientes">
            <div className="agents-container"> {/* Reutilizo la clase principal para el layout */}
                <h1 className="agents-title">Gestión de Clientes</h1>
                <p className="agents-subtitle">
                    Administración de la información de contacto y ubicación de los clientes.
                </p>

                {/* Controles */}
                <div className="agents-controls">
                    <div className="search-bar-wrapper">
                        <div className="search-icon-left">
                            <Search className="search-icon" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por ID, nombre, teléfono, o correo..."
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
                        Nuevo Cliente
                    </button>
                </div>

                {/* Formulario */}
                {isFormOpen && (
                    <ClientForm
                        selectedClient={selectedClient}
                        formData={formData}
                        handleFormChange={handleFormChange}
                        handleFormSubmit={handleFormSubmit}
                        closeForm={closeForm}
                    />
                )}

                {/* Confirmación eliminar */}
                {isDeleteConfirmOpen && (
                    <DeleteConfirmBanner
                        selectedClient={selectedClient}
                        deleteClient={deleteClient}
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
                                    <th className="table-th">Nombre</th>
                                    <th className="table-th">Teléfono</th>
                                    <th className="table-th table-th-email">Correo</th>
                                    <th className="table-th table-th-address">Dirección</th>
                                    <th className="table-th table-th-actions">Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="table-body">
                                {filteredClients.length > 0 ? (
                                    filteredClients.map((client) => (
                                        <tr key={client.id_cliente} className="table-row">
                                            <td className="table-td table-td-id" data-label="ID:">{client.id_cliente}</td>
                                            <td className="table-td table-td-name" data-label="Nombre:">{client.nombre}</td>
                                            <td className="table-td" data-label="Teléfono:">
                                                <Phone size={14} className="date-icon" /> {client.telefono}
                                            </td>
                                            <td className="table-td table-td-email" data-label="Correo:">{client.correo}</td>
                                            <td className="table-td" data-label="Dirección:">{client.direccion}</td>
                                            
                                            <td className="table-td table-td-actions">
                                                <div className="actions-container">
                                                    <button
                                                        onClick={() => openFormForEdit(client)}
                                                        className="action-btn action-btn-edit"
                                                        title="Editar"
                                                    >
                                                        <Edit size={18} />
                                                    </button>

                                                    <button
                                                        onClick={() => openDeleteConfirm(client)}
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
                                        <td colSpan="6" className="table-empty-state">
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