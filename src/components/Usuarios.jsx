import React, { useEffect, useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, User, Mail, Lock, Zap, CheckCircle, XCircle,  Save, X, AlertTriangle, ChevronsUpDown, Key, ToggleLeft, ToggleRight } from 'lucide-react';
import AppLayout from '../Layout/AppLayout';
import './usuarios.css'; 
import api from "../services/api";

const RolUsuario = {
    admin: "admin",
    ventas: "ventas",
    operaciones: "operaciones",
    cliente: "cliente"
};

const initialFormData = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: '',
    activo: true,
};

export const UsuarioForm = ({ selectedUsuario, formData, handleFormChange, handleFormSubmit, closeForm }) => {
    
    const renderRolOptions = () => (
        Object.entries(RolUsuario).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
        ))
    );
    
    const handleToggleActivo = () => {
        handleFormChange({ 
            target: { 
                name: 'activo', 
                value: !formData.activo 
            } 
        });
    };

    return (
        <div className="client-form-card">
            <h2 className="form-card-title">
                {selectedUsuario ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>

            <form onSubmit={handleFormSubmit} className="form-content">
                <div className="form-grid">
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
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Correo Electrónico*</label>
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
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">
                            Contraseña {selectedUsuario ? '(opcional)' : '*'}
                        </label>
                        <div className="input-field-wrapper">
                            <span className="input-icon-left"><Lock size={20} className="input-icon"/></span>
                            <input 
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleFormChange}
                                className="form-input with-icon"
                                required={!selectedUsuario}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="rol">Rol*</label>
                        <div className="select-wrapper">
                            <select 
                                id="rol"
                                name="rol"
                                value={formData.rol}
                                onChange={handleFormChange}
                                className="form-select"
                                required
                            >
                                <option value="" disabled>Seleccione...</option>
                                {renderRolOptions()}
                            </select>
                            <ChevronsUpDown size={20} className="select-arrow" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Estado</label>
                        <div className="input-field-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '0.4rem' }}>
                            <button
                                type="button"
                                onClick={handleToggleActivo}
                                className="action-btn"
                                style={{ backgroundColor: 'transparent', padding: 0 }}
                            >
                                {formData.activo ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                            </button>
                            <span style={{ fontWeight: 600 }}>
                                {formData.activo ? 'ACTIVO' : 'INACTIVO'}
                            </span>
                        </div>
                    </div>

                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={closeForm}>
                        <X size={20} /> Cancelar
                    </button>

                    <button type="submit" className="btn btn-primary">
                        <Save size={20} />
                        {selectedUsuario ? "Actualizar Usuario" : "Crear Usuario"}
                    </button>
                </div>
            </form>
        </div>
    );
};


const Usuarios = () => {

    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const fetchUsuarios = async () => {
        try {
            const data = await api.apiGet("/usuarios");
            setUsuarios(data);
        } catch (err) {
            console.error("Error cargando usuarios:", err);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const getRolName = (rolKey) => RolUsuario[rolKey] || 'Desconocido';

    const filteredUsuarios = useMemo(() => {
        return usuarios.filter((usuario) =>
            `${usuario.nombre} ${usuario.apellido} ${usuario.email} ${getRolName(usuario.rol)}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [usuarios, searchTerm]);


    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            if (selectedUsuario) {
                await api.apiPut(`/usuarios/${selectedUsuario.id_usuario}`, formData);
            } else {
                await api.apiPost("/usuarios", formData);
            }

            fetchUsuarios();
            setIsFormOpen(false);
            setSelectedUsuario(null);
            setFormData(initialFormData);

        } catch (err) {
            console.error("Error guardando usuario:", err);
        }
    };

    const openFormForNew = () => {
        setSelectedUsuario(null);
        setFormData(initialFormData);
        setIsFormOpen(true);
        setIsDeleteConfirmOpen(false);
    };

    const openFormForEdit = (usuario) => {
        setSelectedUsuario(usuario);
        setFormData({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            password: "",
            rol: usuario.rol,
            activo: usuario.activo,
        });
        setIsFormOpen(true);
        setIsDeleteConfirmOpen(false);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setFormData(initialFormData);
        setSelectedUsuario(null);
    };
    const deleteUsuario = async () => {
        try {
            await api.apiDelete(`/usuarios/${selectedUsuario.id_usuario}`);

            fetchUsuarios();
            setIsDeleteConfirmOpen(false);
            setSelectedUsuario(null);
        } catch (err) {
            console.error("Error eliminando usuario:", err);
        }
    };

    const openDeleteConfirm = (usuario) => {
        setSelectedUsuario(usuario);
        setIsDeleteConfirmOpen(true);
        setIsFormOpen(false);
    };

    const DeleteConfirmBanner = ({ selectedUsuario, deleteUsuario, cancel }) => (
        <div className="delete-confirm-banner">
            <div className="banner-icon-message">
                <AlertTriangle size={24} className="banner-icon" />
                <p>
                    ¿Seguro que deseas eliminar a <strong>{selectedUsuario?.nombre} {selectedUsuario?.apellido}</strong>? 
                </p>
            </div>

            <div className="banner-actions">
                <button className="btn btn-secondary" onClick={cancel}>
                    <XCircle size={18} /> Cancelar
                </button>

                <button className="btn btn-danger" onClick={deleteUsuario}>
                    <Trash2 size={18} /> Confirmar Eliminación
                </button>
            </div>
        </div>
    );

    return (
        <AppLayout activeLink="/usuarios">
            <div className="agents-container"> 
                <h1 className="agents-title">Gestión de Usuarios</h1>
                <p className="agents-subtitle">
                    Administración de credenciales y roles.
                </p>
                <div className="agents-controls">
                    <div className="search-bar-wrapper">
                        <div className="search-icon-left">
                            <Search className="search-icon" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por nombre, apellido, o email..."
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
                        Nuevo Usuario
                    </button>
                </div>
                {isFormOpen && (
                    <UsuarioForm
                        selectedUsuario={selectedUsuario}
                        formData={formData}
                        handleFormChange={handleFormChange}
                        handleFormSubmit={handleFormSubmit}
                        closeForm={closeForm}
                    />
                )}
                {isDeleteConfirmOpen && (
                    <DeleteConfirmBanner
                        selectedUsuario={selectedUsuario}
                        deleteUsuario={deleteUsuario}
                        cancel={() => setIsDeleteConfirmOpen(false)}
                    />
                )}
                <div className="agents-table-wrapper">
                    <div className="table-responsive">
                        <table className="agents-table">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-th table-th-id">ID</th>
                                    <th className="table-th">Nombre Completo</th>
                                    <th className="table-th table-th-email">Email</th>
                                    <th className="table-th">Rol</th>
                                    <th className="table-th">Estado</th>
                                    <th className="table-th table-th-actions">Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="table-body">
                                {filteredUsuarios.length > 0 ? (
                                    filteredUsuarios.map((usuario) => (
                                        <tr key={usuario.id_usuario} className="table-row">
                                            <td className="table-td table-td-id">{usuario.id_usuario}</td>
                                            <td className="table-td">
                                                {usuario.nombre} {usuario.apellido}
                                            </td>
                                            <td className="table-td">{usuario.email}</td>
                                            <td className="table-td">
                                                <Zap size={16} style={{ marginRight: '5px' }} />
                                                {getRolName(usuario.rol)}
                                            </td>
                                            <td className="table-td">
                                                <span style={{ 
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem'
                                                }}>
                                                    {usuario.activo ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                                    {usuario.activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            
                                            <td className="table-td table-td-actions">
                                                <div className="actions-container">
                                                    <button
                                                        onClick={() => openFormForEdit(usuario)}
                                                        className="action-btn action-btn-edit"
                                                        title="Editar"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteConfirm(usuario)}
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
                                            No se encontraron usuarios.
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

export default Usuarios;
