// src/components/Clientes.jsx

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, X, Users, MapPin, Globe } from 'lucide-react';
import './clientes.css'; // Nuevo archivo CSS para el módulo

// Datos estáticos de simulación (simulan la tabla de clientes)
const initialClientes = [
];

// Opciones estáticas para simular las tablas relacionadas
const paises = [{ id: 1, nombre: 'México' }, { id: 2, nombre: 'USA' }, { id: 3, nombre: 'Colombia' }];
const localizaciones = [{ id: 1, nombre: 'Puerto de Veracruz' }, { id: 2, nombre: 'Aeropuerto JFK' }, { id: 3, nombre: 'Bogotá Almacén' }];

const Clientes = () => {
    const [clientes, setClientes] = useState(initialClientes);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [currentCliente, setCurrentCliente] = useState(null);
    const [form, setForm] = useState({});

    // --- MANEJO DE ESTADO DEL FORMULARIO ---
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // --- CREAR / EDITAR CLIENTE ---
    const handleSubmit = (e) => {
        e.preventDefault();

        if (currentCliente) {
            // Lógica de edición
            setClientes(clientes.map(c => c.id === currentCliente.id ? { ...c, ...form } : c));
            alert('Cliente editado con éxito (Simulado)');
        } else {
            // Lógica de creación
            const newCliente = {
                id: clientes.length + 1,
                ...form,
                pais: paises.find(p => p.id === parseInt(form.id_pais))?.nombre || 'N/A',
                localizacion: localizaciones.find(l => l.id === parseInt(form.id_localizacion))?.nombre || 'N/A',
            };
            setClientes([...clientes, newCliente]);
            alert('Cliente creado con éxito (Simulado)');
        }
        
        setIsModalOpen(false);
        setIsDetailOpen(false);
        setForm({});
        setCurrentCliente(null);
    };

    // --- MODAL Y DETALLES ---
    const openCreateModal = () => {
        setForm({ nombre: '', rfc: '', id_pais: '', id_localizacion: '', contacto: '', email: '', telefono: '' });
        setCurrentCliente(null);
        setIsModalOpen(true);
    };

    const viewDetail = (cliente) => {
        setCurrentCliente(cliente);
        setForm({ ...cliente, id_pais: paises.find(p => p.nombre === cliente.pais)?.id || '', id_localizacion: localizaciones.find(l => l.nombre === cliente.localizacion)?.id || '' });
        setIsDetailOpen(true);
    };

    const startEdit = () => {
        setIsDetailOpen(false);
        setIsModalOpen(true);
    };

    const deleteCliente = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este cliente (Simulado)?')) {
            setClientes(clientes.filter(c => c.id !== id));
        }
    };
    
    // --- Renderizado del Formulario (Usado en Modal y Detalle) ---
    const renderForm = (isReadOnly = false) => (
        <form onSubmit={handleSubmit} className="cliente-form">
            <div className="form-grid">
                
                {/* Nombre */}
                <div className="form-group">
                    <label>Nombre de la Empresa</label>
                    <input name="nombre" value={form.nombre || ''} onChange={handleChange} required readOnly={isReadOnly} />
                </div>
                
                {/* RFC */}
                <div className="form-group">
                    <label>RFC/Identificación Fiscal</label>
                    <input name="rfc" value={form.rfc || ''} onChange={handleChange} required readOnly={isReadOnly} />
                </div>

                {/* País (FK) */}
                <div className="form-group">
                    <label><Globe size={14} /> País</label>
                    <select name="id_pais" value={form.id_pais || ''} onChange={handleChange} required disabled={isReadOnly}>
                        <option value="">Seleccione un país</option>
                        {paises.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                </div>
                
                {/* Localización (FK) */}
                <div className="form-group">
                    <label><MapPin size={14} /> Localización</label>
                    <select name="id_localizacion" value={form.id_localizacion || ''} onChange={handleChange} required disabled={isReadOnly}>
                        <option value="">Seleccione una localización</option>
                        {localizaciones.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                    </select>
                </div>
                
                {/* Contacto */}
                <div className="form-group">
                    <label>Nombre de Contacto</label>
                    <input name="contacto" value={form.contacto || ''} onChange={handleChange} readOnly={isReadOnly} />
                </div>

                {/* Email */}
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={form.email || ''} onChange={handleChange} readOnly={isReadOnly} />
                </div>

                {/* Teléfono */}
                <div className="form-group">
                    <label>Teléfono</label>
                    <input name="telefono" value={form.telefono || ''} onChange={handleChange} readOnly={isReadOnly} />
                </div>
                
            </div>
            {!isReadOnly && (
                <button type="submit" className="action-button primary">
                    {currentCliente ? 'Guardar Cambios' : 'Registrar Cliente'}
                </button>
            )}
        </form>
    );

    return (
        <div className="clientes-module">
            <header className="module-header">
                <Users size={24} />
                <h1>Gestión de Clientes</h1>
                <button onClick={openCreateModal} className="action-button secondary">
                    <Plus size={18} /> Nuevo Cliente
                </button>
            </header>
            
            {/* Barra de Búsqueda */}
            <div className="search-bar">
                <Search size={18} className="search-icon" />
                <input type="text" placeholder="Buscar por nombre, RFC o contacto..." className="search-input" />
            </div>

            {/* Listado de Clientes (Tabla) */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Empresa</th>
                            <th>RFC</th>
                            <th>País</th>
                            <th>Contacto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(cliente => (
                            <tr key={cliente.id}>
                                <td>{cliente.id}</td>
                                <td className="font-bold">{cliente.nombre}</td>
                                <td>{cliente.rfc}</td>
                                <td>{cliente.pais}</td>
                                <td>{cliente.contacto}</td>
                                <td className="actions-cell">
                                    <button onClick={() => viewDetail(cliente)} className="action-icon edit">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => deleteCliente(cliente.id)} className="action-icon delete">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL DE REGISTRO/EDICIÓN --- */}
            {isModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{currentCliente ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        </div>
                        <div className="modal-body">
                            {renderForm()}
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL DE DETALLE/VISUALIZACIÓN --- */}
            {isDetailOpen && currentCliente && (
                <div className="modal-backdrop">
                    <div className="modal-content detail-modal">
                        <div className="modal-header">
                            <h2>Detalle de Cliente: {currentCliente.nombre}</h2>
                            <button onClick={() => setIsDetailOpen(false)}><X size={24} /></button>
                        </div>
                        <div className="modal-body">
                            {renderForm(true)} {/* True para solo lectura */}
                            <div className="detail-actions">
                                <button onClick={startEdit} className="action-button primary">
                                    <Edit size={16} /> Editar
                                </button>
                                <button onClick={() => deleteCliente(currentCliente.id)} className="action-button delete">
                                    <Trash2 size={16} /> Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clientes;