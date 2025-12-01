import React, { useEffect, useState } from 'react';
import AppLayout from '../Layout/AppLayout';
import { MapPin, Flag, Plus, Edit, Trash2, Save, X, AlertTriangle } from 'lucide-react';
import { apiGet, apiPost, apiPatch, apiDelete } from '../services/api.js';
import './localizaciones.css';

const initialPais = { nombre: '', iso2: '' };
const initialLocal = { id_pais: '', nombre_ciudad: '', tipo_ubicacion: 'puerto' };


const PaisesTab = () => {
    const [paises, setPaises] = useState([]);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState(initialPais);

    const fetch = async () => {
        try {
            const data = await apiGet('/paises');
            console.log('Paises fetched:', data);
            setPaises(data || []);
        } catch (err) {
            console.error('Error fetching paises:', err);
        }
    };

    useEffect(() => { fetch(); }, []);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        try {
            const payload = { nombre: form.nombre, iso2: form.iso2 };
            if (selected) await apiPatch(`/paises/${selected.id}`, payload);
            else await apiPost('/paises', payload);
            setForm(initialPais);
            setSelected(null);
            await fetch();
        } catch (err) {
            console.error(err);
            alert('Error guardando país');
        }
    };

    const edit = (p) => { setSelected(p); setForm({ nombre: p.nombre_pais || p.nombre, iso2: p.iso2 || '' }); };

    const remove = async (p) => {
        if (!window.confirm(`Eliminar país ${p.nombre_pais}?`)) return;
        try { await apiDelete(`/paises/${p.id}`); await fetch(); } catch (err) { console.error(err); alert('Error eliminando país'); }
    };

    return (
        <div>
            <h3 className="form-card-title" style={{ display: 'flex', gap: 8, alignItems: 'center', borderBottom: 'none', paddingBottom: 0 }}>
                <Flag /> Paises
            </h3>

            <form onSubmit={submit} className="agents-controls" style={{ padding: '1rem', marginBottom: '1.5rem', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap' }}>
                
                <div style={{ display: 'flex', gap: '1rem', flexGrow: 1 }}>
                    <input 
                        name="nombre" 
                        value={form.nombre} 
                        onChange={handleChange} 
                        placeholder="Nombre País" 
                        className="form-input" 
                        style={{ flex: '1 1 200px' }}
                        required 
                    />
                    <input 
                        name="iso2" 
                        value={form.iso2} 
                        onChange={handleChange} 
                        placeholder="ISO2 (ej: MX)" 
                        maxLength="2" 
                        className="form-input" 
                        style={{ flex: '0 0 100px' }}
                        required 
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                    <button className="btn btn-primary" type="submit" style={{ flexShrink: 0 }}>
                        <Save className="w-5 h-5" /> Guardar
                    </button>
                    {selected && (
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => { setSelected(null); setForm(initialPais); }}
                            style={{ flexShrink: 0 }}
                        >
                            <X className="w-5 h-5" /> Cancelar
                        </button>
                    )}
                </div>
            </form>

            <div className="agents-table-wrapper" style={{ boxShadow: 'none' }}>
                <div className="table-responsive">
                    <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', borderRadius: '0.75rem 0.75rem 0 0' }}>
                        <div className="table-th" style={{ flexGrow: 1, borderBottom: 'none' }}>País</div>
                        <div className="table-th table-th-actions" style={{ width: '120px', borderBottom: 'none' }}>Acciones</div>
                    </div>
                
                    {paises.map(p => (
                        <div 
                            key={p.id} 
                            className="table-row"
                            style={{ display:'flex', justifyContent:'space-between', alignItems: 'center', padding:'0.7rem 1.5rem' }}
                        >
                            <div className="table-td" style={{ flexGrow: 1, borderBottom: 'none', padding: 0 }}>
                                {p.nombre_pais || p.nombre} 
                                <small className="table-td-email">({p.iso2})</small>
                            </div>
                            
                            <div className="table-td table-td-actions" style={{ display:'flex', gap:8, borderBottom: 'none', padding: 0, width: '120px' }}>
                                <div className="actions-container">
                                    <button onClick={() => edit(p)} className="action-btn action-btn-edit"><Edit className="w-5 h-5" /></button>
                                    <button onClick={() => remove(p)} className="action-btn action-btn-delete"><Trash2 className="w-5 h-5" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const LocalizacionesTab = () => {
    const [localizaciones, setLocalizaciones] = useState([]);
    const [paises, setPaises] = useState([]);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState(initialLocal);

    const fetch = async () => {
        try {
            const [locs, ps] = await Promise.all([apiGet('/localizaciones'), apiGet('/paises')]);
            console.log('Localizaciones fetched:', locs);
            console.log('Paises fetched:', ps);
            setLocalizaciones(locs || []);
            setPaises(ps || []);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    useEffect(() => { fetch(); }, []);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id_pais: Number(form.id_pais),
                nombre_ciudad: form.nombre_ciudad,
                tipo_ubicacion: form.tipo_ubicacion,
            };
            if (selected) await apiPatch(`/localizaciones/${selected.id_localizacion}`, payload);
            else await apiPost('/localizaciones', payload);
            setForm(initialLocal);
            setSelected(null);
            await fetch();
        } catch (err) { console.error(err); alert('Error guardando localización'); }
    };

    const edit = (l) => setSelected(l) || setForm({ id_pais: String(l.id_pais), nombre_ciudad: l.nombre_ciudad, tipo_ubicacion: l.tipo_ubicacion });

    const remove = async (l) => { if (!window.confirm(`Eliminar ${l.nombre_ciudad}?`)) return; try { await apiDelete(`/localizaciones/${l.id_localizacion}`); await fetch(); } catch (err) { console.error(err); alert('Error eliminando localización'); } };

    return (
        <div style={{ marginTop: 12 }}>
            <h3 className="form-card-title" style={{ display: 'flex', gap: 8, alignItems: 'center', borderBottom: 'none', paddingBottom: 0 }}>
                <MapPin /> Localizaciones
            </h3>

            <form onSubmit={submit} className="agents-controls" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 8, padding: '1rem', marginBottom: '1.5rem' }}>
                
                <select name="id_pais" value={form.id_pais} onChange={handleChange} className="form-select" required>
                    <option value="">Seleccione país...</option>
                    {paises.map(p => <option key={p.id} value={p.id}>{p.nombre_pais || p.nombre}</option>)}
                </select>
                
                <input name="nombre_ciudad" value={form.nombre_ciudad} onChange={handleChange} placeholder="Ciudad / Puerto" className="form-input" required />
                
                <select name="tipo_ubicacion" value={form.tipo_ubicacion} onChange={handleChange} className="form-select" required>
                    <option value="puerto">Puerto</option>
                    <option value="aeropuerto">Aeropuerto</option>
                    <option value="almacen">Almacén</option>
                    <option value="domicilio">Domicilio</option>
                    <option value="centro_distribucion">Centro Distribución</option>
                </select>
                
                <div className="form-actions" style={{ gridColumn: '1 / -1', paddingTop: 0, borderTop: 'none', justifyContent: 'flex-start' }}>
                    <button className="btn btn-primary" type="submit" style={{ flexShrink: 0 }}>
                        <Save className="w-5 h-5" /> Guardar
                    </button>
                    {selected && (
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={() => { setSelected(null); setForm(initialLocal); }}
                            style={{ flexShrink: 0 }}
                        >
                            <X className="w-5 h-5" /> Cancelar
                        </button>
                    )}
                </div>
            </form>

            <div className="agents-table-wrapper" style={{ boxShadow: 'none' }}>
                <div className="table-responsive">
                    <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', borderRadius: '0.75rem 0.75rem 0 0' }}>
                        <div className="table-th" style={{ flexGrow: 1, borderBottom: 'none' }}>Localización</div>
                        <div className="table-th table-th-actions" style={{ width: '120px', borderBottom: 'none' }}>Acciones</div>
                    </div>
                    
                    {localizaciones.map(l => (
                        <div 
                            key={l.id_localizacion} 
                            className="table-row" 
                            style={{ display:'flex', justifyContent:'space-between', alignItems: 'center', padding:'0.7rem 1.5rem' }}
                        >
                            {/* Celda de contenido */}
                            <div className="table-td" style={{ flexGrow: 1, borderBottom: 'none', padding: 0 }}>
                                {l.nombre_ciudad} 
                                <small className="table-td-email">({paises.find(p=>p.id===l.id_pais)?.nombre_pais || 'N/A'}) - {l.tipo_ubicacion}</small>
                            </div>
                            
                            {/* Celda de acciones */}
                            <div className="table-td table-td-actions" style={{ display:'flex', gap:8, borderBottom: 'none', padding: 0, width: '120px' }}>
                                <div className="actions-container">
                                    <button 
                                        onClick={() => { setSelected(l); setForm({ id_pais: String(l.id_pais), nombre_ciudad: l.nombre_ciudad, tipo_ubicacion: l.tipo_ubicacion }); }} 
                                        className="action-btn action-btn-edit"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => remove(l)} className="action-btn action-btn-delete"><Trash2 className="w-5 h-5" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const Localizaciones = () => {
    const [tab, setTab] = useState('paises');

    return (
        <AppLayout activeLink="/localizaciones">
            <div className="agents-container">
                <h1 className="agents-title">Localizaciones</h1>
                <p className="agents-subtitle">Administra países y localizaciones (puertos/ciudades).</p>

                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <button className={`btn ${tab==='paises'?'btn-primary':'btn-secondary'}`} onClick={() => setTab('paises')}>
                        <Flag className="w-5 h-5" /> Paises
                    </button>
                    <button className={`btn ${tab==='localizaciones'?'btn-primary':'btn-secondary'}`} onClick={() => setTab('localizaciones')}>
                        <MapPin className="w-5 h-5" /> Localizaciones
                    </button>
                </div>

                {tab === 'paises' ? <PaisesTab /> : <LocalizacionesTab />}

            </div>
        </AppLayout>
    );
};

export default Localizaciones;