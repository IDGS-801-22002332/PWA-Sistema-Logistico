import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, Clock, User, Mail, Briefcase, XCircle, Save, X, AlertTriangle } from 'lucide-react';
import AppLayout from '../Layout/AppLayout';
import './agentes.css';

export const AgentForm = ({ selectedAgent, formData, handleFormChange, handleFormSubmit, closeForm }) => (
    <div className="agent-form-card">
        <h2 className="form-card-title">
            {selectedAgent ? "Editar Agente" : "Nuevo Agente"}
        </h2>

        <form onSubmit={handleFormSubmit} className="form-content">
            <div className="form-grid">

                {/* Nombre */}
                <div className="form-group">
                    <label className="form-label" htmlFor="nombre">Nombre*</label>
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

                {/* Apellido */}
                <div className="form-group">
                    <label className="form-label" htmlFor="apellido">Apellido*</label>
                    <div className="input-field-wrapper">
                        <span className="input-icon-left"><User size={20} className="input-icon"/></span>
                        <input 
                            type="text"
                            id="apellido"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleFormChange}
                            className="form-input with-icon"
                            required
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="form-group">
                    <label className="form-label" htmlFor="email">Email*</label>
                    <div className="input-field-wrapper">
                        <span className="input-icon-left"><Mail size={20} className="input-icon"/></span>
                        <input 
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            className="form-input with-icon"
                            required
                        />
                    </div>
                </div>

                {/* Tipo */}
                <div className="form-group">
                    <label className="form-label" htmlFor="tipo_agente">Tipo de Agente*</label>
                    <div className="select-wrapper">
                        <select 
                            id="tipo_agente"
                            name="tipo_agente"
                            value={formData.tipo_agente}
                            onChange={handleFormChange}
                            className="form-select"
                            required
                        >
                            <option value="vendedor">Vendedor</option>
                            <option value="logistica">Logística</option>
                            <option value="administrativo">Administrativo</option>
                        </select>
                        <Briefcase size={20} className="select-arrow" />
                    </div>
                </div>

            </div>

            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeForm}>
                    <X size={20} /> Cancelar
                </button>

                <button type="submit" className="btn btn-primary">
                    <Save size={20} />
                    {selectedAgent ? "Actualizar Agente" : "Guardar Agente"}
                </button>
            </div>
        </form>
    </div>
);

export const DeleteConfirmBanner = ({ selectedAgent, deleteAgent, cancel }) => (
    <div className="delete-confirm-banner">
        <div className="banner-icon-message">
            <AlertTriangle size={24} className="banner-icon" />
            <p>
                ¿Seguro que deseas eliminar a <strong>{selectedAgent?.nombre} {selectedAgent?.apellido}</strong>?  
                Esta acción no se puede deshacer.
            </p>
        </div>

        <div className="banner-actions">
            <button className="btn btn-secondary" onClick={cancel}>
                <XCircle size={18} /> Cancelar
            </button>

            <button className="btn btn-danger" onClick={deleteAgent}>
                <Trash2 size={18} /> Confirmar Eliminación
            </button>
        </div>
    </div>
);

const initialFormData = {
    nombre: '',
    apellido: '',
    email: '',
    tipo_agente: 'vendedor',
};

const Agentes = () => {
    const [agentes, setAgentes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        fetchAgentes();
    }, []);

    const fetchAgentes = () => {
        const data = [
            { id_agente: 1, nombre: "Carlos", apellido: "Ramírez", email: "carlos@empresa.com", tipo_agente: "vendedor", fecha_creacion: new Date(2023, 10, 15) },
            { id_agente: 2, nombre: "Laura", apellido: "Martínez", email: "laura@empresa.com", tipo_agente: "logistica", fecha_creacion: new Date(2024, 0, 2) },
            { id_agente: 3, nombre: "Pedro", apellido: "Sánchez", email: "pedro@empresa.com", tipo_agente: "administrativo", fecha_creacion: new Date(2024, 5, 20) }
        ];
        setAgentes(data);
    };

    const filteredAgents = agentes.filter((agent) =>
        `${agent.nombre} ${agent.apellido} ${agent.email} ${agent.tipo_agente} ${agent.id_agente}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (selectedAgent) {
            setAgentes(agentes.map(a =>
                a.id_agente === selectedAgent.id_agente ? { ...a, ...formData } : a
            ));
        } else {
            const newAgent = {
                ...formData,
                id_agente: agentes.length > 0 ? Math.max(...agentes.map(a => a.id_agente)) + 1 : 1,
                fecha_creacion: new Date(),
            };
            setAgentes([...agentes, newAgent]);
        }

        setIsFormOpen(false);
        setFormData(initialFormData);
        setSelectedAgent(null);
    };

    const openFormForNew = () => {
        setSelectedAgent(null);
        setFormData(initialFormData);
        setIsFormOpen(true);
        setIsDeleteConfirmOpen(false);
    };

    const openFormForEdit = (agent) => {
        setSelectedAgent(agent);
        setFormData({
            nombre: agent.nombre,
            apellido: agent.apellido,
            email: agent.email,
            tipo_agente: agent.tipo_agente,
        });
        setIsFormOpen(true);
        setIsDeleteConfirmOpen(false);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setFormData(initialFormData);
        setSelectedAgent(null);
    };

    const openDeleteConfirm = (agent) => {
        setSelectedAgent(agent);
        setIsDeleteConfirmOpen(true);
        setIsFormOpen(false);
    };

    const deleteAgent = () => {
        setAgentes(agentes.filter(a => a.id_agente !== selectedAgent.id_agente));
        setIsDeleteConfirmOpen(false);
        setSelectedAgent(null);
    };

    const getAgentTypeLabel = (tipo) => {
        switch (tipo) {
            case "vendedor": return "Vendedor";
            case "logistica": return "Logística";
            case "administrativo": return "Administrativo";
            default: return "Otro";
        }
    };

    const getTypeColorClass = (tipo) => {
        switch (tipo) {
            case "vendedor": return "agent-type-tag ventas";
            case "logistica": return "agent-type-tag logistica";
            case "administrativo": return "agent-type-tag administracion";
            default: return "agent-type-tag";
        }
    };

    return (
        <AppLayout activeLink="/agentes">
            <div className="agents-container">
                <h1 className="agents-title">Gestión de Agentes</h1>
                <p className="agents-subtitle">
                    Administración centralizada del personal de ventas, soporte, logística y administración.
                </p>

                {/* Controles */}
                <div className="agents-controls">
                    <div className="search-bar-wrapper">
                        <div className="search-icon-left">
                            <Search className="search-icon" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por ID, nombre, email o tipo..."
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
                        Nuevo Agente
                    </button>
                </div>

                {/* Formulario */}
                {isFormOpen && (
                    <AgentForm
                        selectedAgent={selectedAgent}
                        formData={formData}
                        handleFormChange={handleFormChange}
                        handleFormSubmit={handleFormSubmit}
                        closeForm={closeForm}
                    />
                )}

                {/* Confirmación eliminar */}
                {isDeleteConfirmOpen && (
                    <DeleteConfirmBanner
                        selectedAgent={selectedAgent}
                        deleteAgent={deleteAgent}
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
                                    <th className="table-th">Nombre Completo</th>
                                    <th className="table-th table-th-email">Email</th>
                                    <th className="table-th">Tipo</th>
                                    <th className="table-th table-th-date">Creado</th>
                                    <th className="table-th table-th-actions">Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="table-body">
                                {filteredAgents.length > 0 ? (
                                    filteredAgents.map((agent) => (
                                        <tr key={agent.id_agente} className="table-row">
                                            <td className="table-td table-td-id" data-label="ID:">{agent.id_agente}</td>
                                            <td className="table-td table-td-name" data-label="Nombre:">{agent.nombre} {agent.apellido}</td>
                                            <td className="table-td table-td-email" data-label="Email:">{agent.email}</td>
                                            <td className="table-td" data-label="Tipo:">
                                                <span className={getTypeColorClass(agent.tipo_agente)}>
                                                    {getAgentTypeLabel(agent.tipo_agente)}
                                                </span>
                                            </td>
                                            <td className="table-td table-td-date" data-label="Creado:">
                                                <Clock size={14} className="date-icon" />
                                                {agent.fecha_creacion.toLocaleDateString()}
                                            </td>
                                            <td className="table-td table-td-actions">
                                                <div className="actions-container">
                                                    <button
                                                        onClick={() => openFormForEdit(agent)}
                                                        className="action-btn action-btn-edit"
                                                        title="Editar"
                                                    >
                                                        <Edit size={18} />
                                                    </button>

                                                    <button
                                                        onClick={() => openDeleteConfirm(agent)}
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
                                            No se encontraron agentes.
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

export default Agentes;
