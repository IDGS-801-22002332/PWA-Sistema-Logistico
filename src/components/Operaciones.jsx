import React, { useState, useMemo, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
    Truck,
    Building2,
    User,
    Clock,
    MapPin,
    DollarSign,
    List,
    Plus,
    Search,
    CheckCircle,
    Package,
    Ship,
    Plane,
    Bus,
    Settings,
    Calendar,
    Save,
    X,
    Trash2,
    AlertCircle,
    Info,
    Eye,
    FileText,
    Factory,
    Box,
    Timer,
    AlertTriangle,
    Edit,
    BarChart3,
    CalendarClock,
    ClipboardList,
    Navigation,
    Map,
    Crosshair,
} from "lucide-react";
import AppLayout from "../Layout/AppLayout";
import "./operaciones.css";
import { apiGet, apiPost, apiPut, apiDelete } from "../services/api.js";

// Configurar iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Componente para notificaciones elegantes
const NotificationBanner = ({ type, message, onClose }) => {
    if (!type || !message) return null;

    const getStyle = () => {
        switch (type) {
            case "success":
                return {
                    backgroundColor: "#d1f2eb",
                    borderColor: "#27ae60",
                    color: "#1e8449",
                };
            case "error":
                return {
                    backgroundColor: "#fadbd8",
                    borderColor: "#e74c3c",
                    color: "#c0392b",
                };
            case "warning":
                return {
                    backgroundColor: "#fef9e7",
                    borderColor: "#f39c12",
                    color: "#d68910",
                };
            case "info":
                return {
                    backgroundColor: "#eaf2f8",
                    borderColor: "#3498db",
                    color: "#2980b9",
                };
            default:
                return {};
        }
    };

    const getIcon = () => {
        switch (type) {
            case "success":
                return <CheckCircle size={20} />;
            case "error":
                return <AlertCircle size={20} />;
            case "warning":
                return <AlertCircle size={20} />;
            case "info":
                return <Info size={20} />;
            default:
                return null;
        }
    };

    return (
        <div
            style={{
                ...getStyle(),
                border: "1px solid",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                animation: "fadeIn 0.3s ease-in-out",
            }}
        >
            <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
                {getIcon()}
                <span style={{ fontWeight: "500" }}>{message}</span>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.25rem",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

const TipoServicioDisplay = {
    maritimo: "Marítimo",
    aereo: "Aéreo",
    terrestre: "Terrestre",
};

const IncotermDisplay = {
    FOB: "FOB",
    CIF: "CIF",
    DDP: "DDP",
    EXW: "EXW",
    DAP: "DAP",
    CPT: "CPT",
    CIP: "CIP",
};

const TipoCargaDisplay = {
    FCL: "Full Container Load (FCL)",
    LTL: "Less Than Load (LTL)",
    CARGA_SUELTA: "Carga Suelta",
};

const EstatusOperacionDisplay = {
    pendiente_documentos: "Pendiente Documentos",
    en_transito: "En Tránsito",
    en_aduana: "En Aduana",
    entregado: "Entregado",
    cancelado: "Cancelado",
};

const getServiceIcon = (tipo) => {
    switch (tipo) {
        case "maritimo":
            return (
                <Ship
                    size={14}
                    style={{
                        color: "var(--primary)",
                        verticalAlign: "middle",
                        marginRight: 6,
                    }}
                />
            );
        case "aereo":
            return (
                <Plane
                    size={14}
                    style={{
                        color: "var(--secondary)",
                        verticalAlign: "middle",
                        marginRight: 6,
                    }}
                />
            );
        case "terrestre":
            return (
                <Bus
                    size={14}
                    style={{
                        color: "var(--primary)",
                        verticalAlign: "middle",
                        marginRight: 6,
                    }}
                />
            );
        default:
            return (
                <Truck
                    size={14}
                    style={{ verticalAlign: "middle", marginRight: 6 }}
                />
            );
    }
};

// Tipos de demora con sus íconos
const TipoDemoraDisplay = {
    climatica: {
        text: "Climática",
        icon: <Clock size={16} />,
        color: "var(--info)",
    },
    aduana: {
        text: "Aduanera",
        icon: <FileText size={16} />,
        color: "var(--warning)",
    },
    mecanica: {
        text: "Mecánica",
        icon: <Settings size={16} />,
        color: "var(--danger)",
    },
    documental: {
        text: "Documental",
        icon: <FileText size={16} />,
        color: "var(--secondary)",
    },
    trafico: {
        text: "Tráfico",
        icon: <Truck size={16} />,
        color: "var(--primary)",
    },
    otro: {
        text: "Otro",
        icon: <AlertCircle size={16} />,
        color: "var(--text-secondary)",
    },
};

// Tipos de incidencia con sus íconos
const TipoIncidenciaDisplay = {
    daño_mercancia: {
        text: "Daño de Mercancía",
        icon: <AlertTriangle size={16} />,
        color: "var(--danger)",
    },
    extravio_parcial: {
        text: "Extravío Parcial",
        icon: <Package size={16} />,
        color: "var(--warning)",
    },
    extravio_total: {
        text: "Extravío Total",
        icon: <X size={16} />,
        color: "var(--danger)",
    },
    robo: {
        text: "Robo",
        icon: <AlertTriangle size={16} />,
        color: "var(--danger)",
    },
    error_documentacion: {
        text: "Error Documentación",
        icon: <FileText size={16} />,
        color: "var(--warning)",
    },
    otro: {
        text: "Otro",
        icon: <AlertCircle size={16} />,
        color: "var(--text-secondary)",
    },
};

// Estados de incidencia con sus íconos
const EstatusIncidenciaDisplay = {
    reportada: {
        text: "Reportada",
        icon: <AlertTriangle size={16} />,
        color: "var(--warning)",
    },
    en_revision: {
        text: "En Revisión",
        icon: <Clock size={16} />,
        color: "var(--info)",
    },
    resuelta: {
        text: "Resuelta",
        icon: <CheckCircle size={16} />,
        color: "var(--success)",
    },
    escalada: {
        text: "Escalada",
        icon: <AlertCircle size={16} />,
        color: "var(--danger)",
    },
};

// Componente para la sección de demoras
const DemorasSection = ({
    operacion,
    demoras,
    isAddingDemora,
    setIsAddingDemora,
    editingDemora,
    setEditingDemora,
    createDemora,
    updateDemora,
    deleteDemora,
}) => {
    const [demoraForm, setDemoraForm] = useState({
        id_operacion: operacion.id_operacion,
        fecha_hora_demora: "",
        descripcion_demora: "",
        tipo_demora: "climatica",
        costo_asociado: "",
        moneda: "USD",
    });

    const operacionDemoras = demoras.filter(
        (d) => d.id_operacion === operacion.id_operacion
    );

    const handleDemoraChange = (e) => {
        const { name, value } = e.target;
        setDemoraForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateDemora = (e) => {
        e.preventDefault();
        const data = {
            ...demoraForm,
            costo_asociado: demoraForm.costo_asociado
                ? parseFloat(demoraForm.costo_asociado)
                : 0,
        };
        createDemora(data);
        setDemoraForm({
            id_operacion: operacion.id_operacion,
            fecha_hora_demora: "",
            descripcion_demora: "",
            tipo_demora: "climatica",
            costo_asociado: "",
            moneda: "USD",
        });
    };

    const handleEditDemora = (demora) => {
        setEditingDemora(demora);
        setDemoraForm({
            id_operacion: demora.id_operacion,
            fecha_hora_demora: new Date(demora.fecha_hora_demora)
                .toISOString()
                .slice(0, 16),
            descripcion_demora: demora.descripcion_demora || "",
            tipo_demora: demora.tipo_demora,
            costo_asociado: demora.costo_asociado || "",
            moneda: demora.moneda || "USD",
        });
    };

    const handleUpdateDemora = (e) => {
        e.preventDefault();
        const data = {
            ...demoraForm,
            costo_asociado: demoraForm.costo_asociado
                ? parseFloat(demoraForm.costo_asociado)
                : 0,
        };
        updateDemora(editingDemora.id_demora, data);
        setDemoraForm({
            id_operacion: operacion.id_operacion,
            fecha_hora_demora: "",
            descripcion_demora: "",
            tipo_demora: "climatica",
            costo_asociado: "",
            moneda: "USD",
        });
    };

    const cancelEdit = () => {
        setEditingDemora(null);
        setIsAddingDemora(false);
        setDemoraForm({
            id_operacion: operacion.id_operacion,
            fecha_hora_demora: "",
            descripcion_demora: "",
            tipo_demora: "climatica",
            costo_asociado: "",
            moneda: "USD",
        });
    };

    return (
        <div style={{ marginBottom: "2rem" }}>
            <div className="section-header">
                <h5 className="section-title warning">
                    <Timer size={18} /> Demoras
                </h5>
                <button
                    onClick={() => setIsAddingDemora(true)}
                    className="btn btn-primary"
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                >
                    <Plus size={14} /> Agregar Demora
                </button>
            </div>

            {(isAddingDemora || editingDemora) && (
                <form
                    onSubmit={
                        editingDemora ? handleUpdateDemora : handleCreateDemora
                    }
                    style={{
                        marginBottom: "1rem",
                        padding: "1rem",
                        backgroundColor: "var(--light-bg)",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <div
                        className="form-grid"
                        style={{
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1rem",
                            marginBottom: "1rem",
                        }}
                    >
                        <div>
                            <label className="form-label">Fecha y Hora</label>
                            <input
                                type="datetime-local"
                                name="fecha_hora_demora"
                                value={demoraForm.fecha_hora_demora}
                                onChange={handleDemoraChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label">Tipo de Demora</label>
                            <select
                                name="tipo_demora"
                                value={demoraForm.tipo_demora}
                                onChange={handleDemoraChange}
                                className="form-input"
                                required
                            >
                                {Object.entries(TipoDemoraDisplay).map(
                                    ([key, value]) => (
                                        <option key={key} value={key}>
                                            {value.text}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Costo Asociado</label>
                            <input
                                type="number"
                                name="costo_asociado"
                                value={demoraForm.costo_asociado}
                                onChange={handleDemoraChange}
                                className="form-input"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label className="form-label">Moneda</label>
                            <select
                                name="moneda"
                                value={demoraForm.moneda}
                                onChange={handleDemoraChange}
                                className="form-input"
                            >
                                <option value="USD">USD</option>
                                <option value="MXN">MXN</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <label className="form-label">Descripción</label>
                        <textarea
                            name="descripcion_demora"
                            value={demoraForm.descripcion_demora}
                            onChange={handleDemoraChange}
                            className="form-input"
                            rows="3"
                            placeholder="Descripción de la demora..."
                        />
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ padding: "0.4rem 0.8rem" }}
                        >
                            <Save size={14} />{" "}
                            {editingDemora ? "Actualizar" : "Guardar"} Demora
                        </button>
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className="btn btn-secondary"
                            style={{ padding: "0.4rem 0.8rem" }}
                        >
                            <X size={14} /> Cancelar
                        </button>
                    </div>
                </form>
            )}

            {operacionDemoras.length === 0 ? (
                <p
                    style={{
                        margin: 0,
                        padding: "1rem",
                        backgroundColor: "var(--light-bg)",
                        borderRadius: "8px",
                        textAlign: "center",
                        color: "var(--text-secondary)",
                        fontStyle: "italic",
                    }}
                >
                    No hay demoras registradas para esta operación
                </p>
            ) : (
                <div style={{ display: "grid", gap: "0.75rem" }}>
                    {operacionDemoras.map((demora) => {
                        const tipoInfo =
                            TipoDemoraDisplay[demora.tipo_demora] ||
                            TipoDemoraDisplay.otro;
                        return (
                            <div
                                key={demora.id_demora}
                                style={{
                                    padding: "1rem",
                                    backgroundColor: "var(--card-bg)",
                                    borderRadius: "8px",
                                    border: `1px solid var(--border-color)`,
                                    borderLeft: `4px solid ${tipoInfo.color}`
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                        }}
                                    >
                                        <span style={{ color: tipoInfo.color }}>
                                            {tipoInfo.icon}
                                        </span>
                                        <strong style={{ color: tipoInfo.color }}>
                                            {tipoInfo.text}
                                        </strong>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "0.5rem",
                                        }}
                                    >
                                        <button
                                            onClick={() =>
                                                handleEditDemora(demora)
                                            }
                                            className="action-btn action-btn-edit"
                                            style={{
                                                border: "1px solid var(--primary)",
                                                color: "var(--primary)",
                                                borderRadius: "4px",
                                                padding: "0.25rem 0.5rem",
                                                cursor: "pointer",
                                                fontSize: "0.75rem",
                                            }}
                                        >
                                            <Edit size={12} /> Editar
                                        </button>
                                        <button
                                            onClick={() =>
                                                deleteDemora(demora.id_demora)
                                            }
                                            className="action-btn action-btn-delete"
                                            style={{
                                                border: "1px solid var(--danger)",
                                                color: "var(--danger)",
                                                borderRadius: "4px",
                                                padding: "0.25rem 0.5rem",
                                                cursor: "pointer",
                                                fontSize: "0.75rem",
                                            }}
                                        >
                                            <Trash2 size={12} /> Eliminar
                                        </button>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        fontSize: "0.85rem",
                                        color: "var(--text-secondary)",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    <Clock
                                        size={14}
                                        style={{
                                            verticalAlign: "middle",
                                            marginRight: "0.25rem",
                                        }}
                                    />
                                    {new Date(
                                        demora.fecha_hora_demora
                                    ).toLocaleString()}
                                </div>
                                {demora.descripcion_demora && (
                                    <p
                                        style={{
                                            margin: "0.5rem 0",
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {demora.descripcion_demora}
                                    </p>
                                )}
                                {demora.costo_asociado > 0 && (
                                    <div
                                        style={{
                                            fontSize: "0.85rem",
                                            fontWeight: 600,
                                            color: "var(--danger)",
                                        }}
                                    >
                                        <DollarSign
                                            size={14}
                                            style={{
                                                verticalAlign: "middle",
                                                marginRight: "0.25rem",
                                            }}
                                        />
                                        Costo: {demora.moneda || "USD"}{" "}
                                        {demora.costo_asociado}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// Componente para la sección de incidencias
const IncidenciasSection = ({
    operacion,
    incidencias,
    isAddingIncidencia,
    setIsAddingIncidencia,
    editingIncidencia,
    setEditingIncidencia,
    createIncidencia,
    updateIncidencia,
    deleteIncidencia,
}) => {
    const [incidenciaForm, setIncidenciaForm] = useState({
        id_operacion: operacion.id_operacion,
        fecha_hora_incidencia: "",
        descripcion_incidencia: "",
        tipo_incidencia: "daño_mercancia",
        estatus: "reportada",
        fecha_resolucion: "",
        comentarios_resolucion: "",
    });

    const operacionIncidencias = incidencias.filter(
        (i) => i.id_operacion === operacion.id_operacion
    );

    const handleIncidenciaChange = (e) => {
        const { name, value } = e.target;
        setIncidenciaForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateIncidencia = (e) => {
        e.preventDefault();
        const data = { ...incidenciaForm };
        if (!data.fecha_resolucion) delete data.fecha_resolucion;
        createIncidencia(data);
        setIncidenciaForm({
            id_operacion: operacion.id_operacion,
            fecha_hora_incidencia: "",
            descripcion_incidencia: "",
            tipo_incidencia: "daño_mercancia",
            estatus: "reportada",
            fecha_resolucion: "",
            comentarios_resolucion: "",
        });
    };

    const handleEditIncidencia = (incidencia) => {
        setEditingIncidencia(incidencia);
        setIncidenciaForm({
            id_operacion: incidencia.id_operacion,
            fecha_hora_incidencia: new Date(incidencia.fecha_hora_incidencia)
                .toISOString()
                .slice(0, 16),
            descripcion_incidencia: incidencia.descripcion_incidencia || "",
            tipo_incidencia: incidencia.tipo_incidencia,
            estatus: incidencia.estatus,
            fecha_resolucion: incidencia.fecha_resolucion
                ? new Date(incidencia.fecha_resolucion)
                      .toISOString()
                      .slice(0, 16)
                : "",
            comentarios_resolucion: incidencia.comentarios_resolucion || "",
        });
    };

    const handleUpdateIncidencia = (e) => {
        e.preventDefault();
        const data = { ...incidenciaForm };
        if (!data.fecha_resolucion) delete data.fecha_resolucion;
        updateIncidencia(editingIncidencia.id_incidencia, data);
        setIncidenciaForm({
            id_operacion: operacion.id_operacion,
            fecha_hora_incidencia: "",
            descripcion_incidencia: "",
            tipo_incidencia: "daño_mercancia",
            estatus: "reportada",
            fecha_resolucion: "",
            comentarios_resolucion: "",
        });
    };

    const cancelEditIncidencia = () => {
        setEditingIncidencia(null);
        setIsAddingIncidencia(false);
        setIncidenciaForm({
            id_operacion: operacion.id_operacion,
            fecha_hora_incidencia: "",
            descripcion_incidencia: "",
            tipo_incidencia: "daño_mercancia",
            estatus: "reportada",
            fecha_resolucion: "",
            comentarios_resolucion: "",
        });
    };

    return (
        <div style={{ marginBottom: "2rem" }}>
            <div className="section-header">
                <h5 className="section-title danger">
                    <AlertTriangle size={18} /> Incidencias
                </h5>
                <button
                    onClick={() => setIsAddingIncidencia(true)}
                    className="btn btn-danger"
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                >
                    <Plus size={14} /> Reportar Incidencia
                </button>
            </div>

            {(isAddingIncidencia || editingIncidencia) && (
                <form
                    onSubmit={
                        editingIncidencia
                            ? handleUpdateIncidencia
                            : handleCreateIncidencia
                    }
                    style={{
                        marginBottom: "1rem",
                        padding: "1rem",
                        backgroundColor: "var(--light-bg)",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <div
                        className="form-grid"
                        style={{
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1rem",
                            marginBottom: "1rem",
                        }}
                    >
                        <div>
                            <label className="form-label">Fecha y Hora</label>
                            <input
                                type="datetime-local"
                                name="fecha_hora_incidencia"
                                value={incidenciaForm.fecha_hora_incidencia}
                                onChange={handleIncidenciaChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label">
                                Tipo de Incidencia
                            </label>
                            <select
                                name="tipo_incidencia"
                                value={incidenciaForm.tipo_incidencia}
                                onChange={handleIncidenciaChange}
                                className="form-input"
                                required
                            >
                                {Object.entries(TipoIncidenciaDisplay).map(
                                    ([key, value]) => (
                                        <option key={key} value={key}>
                                            {value.text}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Estatus</label>
                            <select
                                name="estatus"
                                value={incidenciaForm.estatus}
                                onChange={handleIncidenciaChange}
                                className="form-input"
                            >
                                {Object.entries(EstatusIncidenciaDisplay).map(
                                    ([key, value]) => (
                                        <option key={key} value={key}>
                                            {value.text}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">
                                Fecha de Resolución
                            </label>
                            <input
                                type="datetime-local"
                                name="fecha_resolucion"
                                value={incidenciaForm.fecha_resolucion}
                                onChange={handleIncidenciaChange}
                                className="form-input"
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <label className="form-label">
                            Descripción de la Incidencia *
                        </label>
                        <textarea
                            name="descripcion_incidencia"
                            value={incidenciaForm.descripcion_incidencia}
                            onChange={handleIncidenciaChange}
                            className="form-input"
                            rows="3"
                            placeholder="Describa la incidencia..."
                            required
                        />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <label className="form-label">
                            Comentarios de Resolución
                        </label>
                        <textarea
                            name="comentarios_resolucion"
                            value={incidenciaForm.comentarios_resolucion}
                            onChange={handleIncidenciaChange}
                            className="form-input"
                            rows="2"
                            placeholder="Acciones tomadas para resolver la incidencia..."
                        />
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                            type="submit"
                            className="btn btn-danger"
                            style={{ padding: "0.4rem 0.8rem" }}
                        >
                            <Save size={14} />{" "}
                            {editingIncidencia ? "Actualizar" : "Reportar"}{" "}
                            Incidencia
                        </button>
                        <button
                            type="button"
                            onClick={cancelEditIncidencia}
                            className="btn btn-secondary"
                            style={{ padding: "0.4rem 0.8rem" }}
                        >
                            <X size={14} /> Cancelar
                        </button>
                    </div>
                </form>
            )}

            {operacionIncidencias.length === 0 ? (
                <p
                    style={{
                        margin: 0,
                        padding: "1rem",
                        backgroundColor: "var(--light-bg)",
                        borderRadius: "8px",
                        textAlign: "center",
                        color: "var(--text-secondary)",
                        fontStyle: "italic",
                    }}
                >
                    No hay incidencias reportadas para esta operación
                </p>
            ) : (
                <div style={{ display: "grid", gap: "0.75rem" }}>
                    {operacionIncidencias.map((incidencia) => {
                        const tipoInfo =
                            TipoIncidenciaDisplay[incidencia.tipo_incidencia] ||
                            TipoIncidenciaDisplay.otro;
                        const estatusInfo =
                            EstatusIncidenciaDisplay[incidencia.estatus] ||
                            EstatusIncidenciaDisplay.reportada;
                        return (
                            <div
                                key={incidencia.id_incidencia}
                                style={{
                                    padding: "1rem",
                                    backgroundColor: "var(--card-bg)",
                                    borderRadius: "8px",
                                    border: `1px solid var(--border-color)`,
                                    borderLeft: `4px solid ${tipoInfo.color}`
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                        }}
                                    >
                                        <span style={{ color: tipoInfo.color }}>
                                            {tipoInfo.icon}
                                        </span>
                                        <strong style={{ color: tipoInfo.color }}>
                                            {tipoInfo.text}
                                        </strong>
                                        <span
                                            style={{
                                                padding: "0.25rem 0.5rem",
                                                backgroundColor:
                                                    estatusInfo.color,
                                                color: "white",
                                                borderRadius: "12px",
                                                fontSize: "0.75rem",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {estatusInfo.text}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "0.5rem",
                                        }}
                                    >
                                        <button
                                            onClick={() =>
                                                handleEditIncidencia(incidencia)
                                            }
                                            className="action-btn action-btn-edit"
                                            style={{
                                                border: "1px solid var(--primary)",
                                                color: "var(--primary)",
                                                borderRadius: "4px",
                                                padding: "0.25rem 0.5rem",
                                                cursor: "pointer",
                                                fontSize: "0.75rem",
                                            }}
                                        >
                                            <Edit size={12} /> Editar
                                        </button>
                                        <button
                                            onClick={() =>
                                                deleteIncidencia(
                                                    incidencia.id_incidencia
                                                )
                                            }
                                            className="action-btn action-btn-delete"
                                            style={{
                                                border: "1px solid var(--danger)",
                                                color: "var(--danger)",
                                                borderRadius: "4px",
                                                padding: "0.25rem 0.5rem",
                                                cursor: "pointer",
                                                fontSize: "0.75rem",
                                            }}
                                        >
                                            <Trash2 size={12} /> Eliminar
                                        </button>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        fontSize: "0.85rem",
                                        color: "var(--text-secondary)",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    <Clock
                                        size={14}
                                        style={{
                                            verticalAlign: "middle",
                                            marginRight: "0.25rem",
                                        }}
                                    />
                                    Reportada:{" "}
                                    {new Date(
                                        incidencia.fecha_hora_incidencia
                                    ).toLocaleString()}
                                    {incidencia.fecha_resolucion && (
                                        <span style={{ marginLeft: "1rem" }}>
                                            <CheckCircle
                                                size={14}
                                                style={{
                                                    verticalAlign: "middle",
                                                    marginRight: "0.25rem",
                                                    color: "var(--success)",
                                                }}
                                            />
                                            Resuelta:{" "}
                                            {new Date(
                                                incidencia.fecha_resolucion
                                            ).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                <p
                                    style={{
                                        margin: "0.5rem 0",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {incidencia.descripcion_incidencia}
                                </p>
                                {incidencia.comentarios_resolucion && (
                                    <div className="incidencia-resolution">
                                        <strong
                                            style={{
                                                fontSize: "0.8rem",
                                                color: "var(--text-secondary)",
                                            }}
                                        >
                                            Resolución:
                                        </strong>
                                        <p
                                            style={{
                                                margin: "0.25rem 0 0 0",
                                                fontSize: "0.85rem",
                                                color: "var(--text-primary)",
                                            }}
                                        >
                                            {incidencia.comentarios_resolucion}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const getStatusOperacionDisplay = (status) => {
    switch (status) {
        case "entregado":
            return {
                text: "Entregado",
                color: "var(--success)",
                icon: <CheckCircle size={16} />,
            };
        case "en_transito":
            return {
                text: "En Tránsito",
                color: "#06B6D4",
                icon: <Truck size={16} />,
            };
        case "en_aduana":
            return {
                text: "En Aduana",
                color: "#f59e0b",
                icon: <MapPin size={16} />,
            };
        case "cancelado":
            return {
                text: "Cancelado",
                color: "#6b7280",
                icon: <X size={16} />,
            };
        case "pendiente_documentos":
        default:
            return {
                text: "Pend. Docs",
                color: "var(--danger)",
                icon: <Package size={16} />,
            };
    }
};

// Simple client-side canvas 'map' renderer (no external APIs)
// It performs a linear equirectangular mapping of lat/lng to canvas coordinates.
// This is intentionally simple because tracking is simulated.

/* Operacion Form - agregar / editar */
export const OperacionForm = ({
    selectedOperacion,
    formData,
    handleFormChange,
    handleFormSubmit,
    closeForm,
    clientes = [],
    usuarios = [],
    proveedores = [],
    agentes = [],
    cotizaciones = [],
    localizaciones = [],
}) => (
    <div className="client-form-card">
        <h2 className="form-card-title">
            {selectedOperacion ? "Editar Operación" : "Nueva Operación"}
        </h2>

        {/* Banner informativo si viene de cotización */}
        {formData.cotizacion_origen && !selectedOperacion && (
            <div
                style={{
                    backgroundColor: "#e0f2fe",
                    border: "1px solid #0288d1",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <CheckCircle size={20} style={{ color: "#0288d1" }} />
                <div>
                    <strong style={{ color: "#0288d1" }}>
                        Operación generada desde Cotización #
                        {formData.id_cotizacion}
                    </strong>
                    <p
                        style={{
                            margin: "0.25rem 0 0 0",
                            fontSize: "0.9rem",
                            color: "#01579b",
                        }}
                    >
                        Cliente: {formData.cotizacion_origen.cliente} | Los
                        datos principales han sido pre-llenados automáticamente
                    </p>
                </div>
            </div>
        )}

        <form onSubmit={handleFormSubmit} className="form-content">
            <div className="form-grid">
                <div className="form-group">
                    <label
                        className="form-label"
                        htmlFor="numero_referencia_proveedor"
                    >
                        Referencia / Booking*
                    </label>
                    <input
                        id="numero_referencia_proveedor"
                        name="numero_referencia_proveedor"
                        value={formData.numero_referencia_proveedor || ""}
                        onChange={handleFormChange}
                        className="form-input"
                        required
                        placeholder="Ej: MSK9001-25, NAV-123456"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="id_cotizacion">
                        ID Cotización
                        {formData.cotizacion_origen ? " (Origen)" : ""}
                    </label>
                    {cotizaciones.length > 0 ? (
                        <select
                            id="id_cotizacion"
                            name="id_cotizacion"
                            value={formData.id_cotizacion || ""}
                            onChange={handleFormChange}
                            className="form-select"
                            disabled={!!formData.cotizacion_origen}
                            style={
                                formData.cotizacion_origen
                                    ? {
                                          backgroundColor: "#f3f4f6",
                                          cursor: "not-allowed",
                                      }
                                    : {}
                            }
                        >
                            <option value="">
                                Seleccionar cotización (opcional)
                            </option>
                            {cotizaciones.map((cot) => (
                                <option
                                    key={cot.id_cotizacion || cot.id}
                                    value={cot.id_cotizacion || cot.id}
                                >
                                    #{cot.id_cotizacion || cot.id} -{" "}
                                    {cot.cliente_nombre ||
                                        cot.nombre_cliente ||
                                        "Sin cliente"}{" "}
                                    - {cot.tipo_servicio}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            id="id_cotizacion"
                            name="id_cotizacion"
                            type="number"
                            value={formData.id_cotizacion || ""}
                            onChange={handleFormChange}
                            className="form-input"
                            readOnly={!!formData.cotizacion_origen}
                            style={
                                formData.cotizacion_origen
                                    ? {
                                          backgroundColor: "#f3f4f6",
                                          cursor: "not-allowed",
                                      }
                                    : {}
                            }
                            placeholder={
                                formData.cotizacion_origen
                                    ? "Generada automáticamente desde cotización"
                                    : "Opcional"
                            }
                        />
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="id_cliente">
                        Cliente*
                    </label>
                    {clientes.length > 0 ? (
                        <select
                            id="id_cliente"
                            name="id_cliente"
                            value={formData.id_cliente || ""}
                            onChange={handleFormChange}
                            className="form-select"
                            required
                        >
                            <option value="">Seleccionar cliente</option>
                            {clientes.map((cliente) => (
                                <option
                                    key={cliente.id_cliente || cliente.id}
                                    value={cliente.id_cliente || cliente.id}
                                >
                                    {cliente.nombre_empresa ||
                                        cliente.nombre ||
                                        `Cliente ${
                                            cliente.id_cliente || cliente.id
                                        }`}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            id="cliente_nombre"
                            name="cliente_nombre"
                            value={formData.cliente_nombre || ""}
                            onChange={handleFormChange}
                            className="form-input"
                            required
                            placeholder="Nombre del cliente"
                        />
                    )}
                </div>

                <div className="form-group">
                    <label
                        className="form-label"
                        htmlFor="id_usuario_operativo"
                    >
                        Encargado Operativo*
                    </label>
                    {usuarios.length > 0 ? (
                        <select
                            id="id_usuario_operativo"
                            name="id_usuario_operativo"
                            value={formData.id_usuario_operativo || ""}
                            onChange={handleFormChange}
                            className="form-select"
                            required
                        >
                            <option value="">Seleccionar operativo</option>
                            {usuarios
                                .filter(
                                    (usuario) => usuario.rol === "operaciones"
                                )
                                .map((usuario) => (
                                    <option
                                        key={usuario.id_usuario || usuario.id}
                                        value={usuario.id_usuario || usuario.id}
                                    >
                                        {usuario.nombre || "Usuario"}{" "}
                                        {usuario.apellido || ""} (
                                        {usuario.rol || "Sin rol"})
                                    </option>
                                ))}
                        </select>
                    ) : (
                        <input
                            id="usuario_operativo_nombre"
                            name="usuario_operativo_nombre"
                            value={formData.usuario_operativo_nombre || ""}
                            onChange={handleFormChange}
                            className="form-input"
                            required
                            placeholder="Nombre del operativo"
                        />
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="id_proveedor">
                        Proveedor*
                    </label>
                    {proveedores.length > 0 ? (
                        <select
                            id="id_proveedor"
                            name="id_proveedor"
                            value={formData.id_proveedor || ""}
                            onChange={handleFormChange}
                            className="form-select"
                            required
                        >
                            <option value="">Seleccionar proveedor</option>
                            {proveedores.map((proveedor) => (
                                <option
                                    key={proveedor.id_proveedor || proveedor.id}
                                    value={
                                        proveedor.id_proveedor || proveedor.id
                                    }
                                >
                                    {proveedor.nombre_empresa ||
                                        proveedor.nombre ||
                                        `Proveedor ${
                                            proveedor.id_proveedor ||
                                            proveedor.id
                                        }`}{" "}
                                    -{" "}
                                    {proveedor.tipo_servicio_ofrecido || "N/A"}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            id="proveedor_nombre"
                            name="proveedor_nombre"
                            value={formData.proveedor_nombre || ""}
                            onChange={handleFormChange}
                            className="form-input"
                            required
                            placeholder="Nombre del proveedor"
                        />
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="id_agente">
                        Agente Aduanal
                    </label>
                    {agentes.length > 0 ? (
                        <select
                            id="id_agente"
                            name="id_agente"
                            value={formData.id_agente || ""}
                            onChange={handleFormChange}
                            className="form-select"
                        >
                            <option value="">Sin agente asignado</option>
                            {agentes.map((agente) => (
                                <option
                                    key={agente.id_agente || agente.id}
                                    value={agente.id_agente || agente.id}
                                >
                                    {agente.nombre || "Agente"}{" "}
                                    {agente.apellido || ""} -{" "}
                                    {agente.tipo_agente || "General"}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            id="agente_nombre"
                            name="agente_nombre"
                            value={formData.agente_nombre || ""}
                            onChange={handleFormChange}
                            className="form-input"
                            placeholder="Opcional"
                        />
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="tipo_servicio">
                        Tipo Servicio*
                    </label>
                    <select
                        id="tipo_servicio"
                        name="tipo_servicio"
                        value={formData.tipo_servicio || "maritimo"}
                        onChange={handleFormChange}
                        className="form-select"
                        required
                    >
                        <option value="maritimo">Marítimo</option>
                        <option value="aereo">Aéreo</option>
                        <option value="terrestre">Terrestre</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="tipo_carga">
                        Tipo Carga*
                    </label>
                    <select
                        id="tipo_carga"
                        name="tipo_carga"
                        value={formData.tipo_carga || "FCL"}
                        onChange={handleFormChange}
                        className="form-select"
                        required
                    >
                        <option value="FCL">Full Container Load (FCL)</option>
                        <option value="LTL">Less Than Load (LTL)</option>
                        <option value="CARGA_SUELTA">Carga Suelta</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="incoterm">
                        Incoterm*
                    </label>
                    <select
                        id="incoterm"
                        name="incoterm"
                        value={formData.incoterm || "FOB"}
                        onChange={handleFormChange}
                        className="form-select"
                        required
                    >
                        <option value="FOB">FOB</option>
                        <option value="CIF">CIF</option>
                        <option value="DDP">DDP</option>
                        <option value="EXW">EXW</option>
                        <option value="DAP">DAP</option>
                        <option value="CPT">CPT</option>
                        <option value="CIP">CIP</option>
                    </select>
                </div>

                <div className="form-group">
                    <label
                        className="form-label"
                        htmlFor="fecha_estimada_arribo"
                    >
                        Fecha Estimada de Arribo
                    </label>
                    <input
                        type="date"
                        id="fecha_estimada_arribo"
                        name="fecha_estimada_arribo"
                        value={formData.fecha_estimada_arribo || ""}
                        onChange={handleFormChange}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label
                        className="form-label"
                        htmlFor="fecha_estimada_entrega"
                    >
                        Fecha Estimada de Entrega
                    </label>
                    <input
                        type="date"
                        id="fecha_estimada_entrega"
                        name="fecha_estimada_entrega"
                        value={formData.fecha_estimada_entrega || ""}
                        onChange={handleFormChange}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="estatus">
                        Estatus*
                    </label>
                    <select
                        id="estatus"
                        name="estatus"
                        value={formData.estatus || "pendiente_documentos"}
                        onChange={handleFormChange}
                        className="form-select"
                        required
                    >
                        <option value="pendiente_documentos">
                            Pendiente Documentos
                        </option>
                        <option value="en_transito">En Tránsito</option>
                        <option value="en_aduana">En Aduana</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label className="form-label" htmlFor="notas_operacion">
                        Notas de la Operación
                    </label>
                    <textarea
                        id="notas_operacion"
                        name="notas_operacion"
                        value={formData.notas_operacion || ""}
                        onChange={handleFormChange}
                        className="form-input"
                        rows="3"
                        placeholder="Observaciones adicionales sobre la operación..."
                    />
                </div>

                {/* Campo de descripción de mercancía si viene de cotización */}
                {formData.descripcion_mercancia && (
                    <div
                        className="form-group"
                        style={{ gridColumn: "1 / -1" }}
                    >
                        <label className="form-label">
                            Descripción de Mercancía (Referencia)
                        </label>
                        <div
                            style={{
                                padding: "0.75rem",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "6px",
                                fontSize: "0.9rem",
                                color: "#495057",
                                border: "1px solid #dee2e6",
                            }}
                        >
                            {formData.descripcion_mercancia}
                        </div>
                    </div>
                )}
            </div>

            <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                    <Save size={20} />
                    {selectedOperacion ? "Actualizar" : "Crear"} Operación
                </button>
                <button
                    type="button"
                    onClick={closeForm}
                    className="btn btn-secondary"
                >
                    <X size={20} />
                    Cancelar
                </button>
            </div>
        </form>
    </div>
);

/* Banner confirmación eliminar */
export const DeleteOperacionConfirm = ({
    selectedOperacion,
    deleteOperacion,
    cancel,
}) => (
    <div className="delete-confirm-banner">
        <div className="banner-icon-message">
            <Trash2 size={24} className="banner-icon" />
            <p>
                ¿Seguro que deseas eliminar la operación{" "}
                <strong>#{selectedOperacion?.id_operacion}</strong> (Booking:{" "}
                {selectedOperacion?.referencia_booking})?
            </p>
        </div>

        <div className="banner-actions">
            <button className="btn btn-secondary" onClick={cancel}>
                <X size={16} /> Cancelar
            </button>

            <button className="btn btn-danger" onClick={deleteOperacion}>
                <Trash2 size={16} /> Confirmar Eliminación
            </button>
        </div>
    </div>
);

const OperacionCard = ({
    operacion,
    onAction,
    isDetailOpen,
    demoras,
    incidencias,
    tracking,
    proveedores = [],
    showNotification,
    loadTracking,
    isAddingDemora,
    setIsAddingDemora,
    editingDemora,
    setEditingDemora,
    createDemora,
    updateDemora,
    deleteDemora,
    isAddingIncidencia,
    setIsAddingIncidencia,
    editingIncidencia,
    setEditingIncidencia,
    createIncidencia,
    updateIncidencia,
    deleteIncidencia,
    isAddingTracking,
    setIsAddingTracking,
    editingTracking,
    setEditingTracking,
    createTracking,
    updateTracking,
    deleteTracking,
}) => {
    const status = getStatusOperacionDisplay(operacion.estatus);

    return (
        <div
            className="client-form-card"
            style={{
                padding: "0",
                marginBottom: "1.5rem",
                boxShadow: "var(--shadow-lg)",
                borderLeft: `6px solid ${status.color}`,
            }}
        >
            <div
                style={{
                    padding: "1.5rem",
                    borderRight: isDetailOpen ? "none" : "1px solid #e5e7eb",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #e5e7eb",
                        paddingBottom: "0.5rem",
                        marginBottom: "1rem",
                    }}
                >
                    <h4
                        style={{
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            color: "var(--primary)",
                            margin: 0,
                        }}
                    >
                        <FileText
                            size={18}
                            style={{
                                verticalAlign: "middle",
                                marginRight: "5px",
                            }}
                        />
                        Operación #{operacion.id_operacion} | Booking:{" "}
                        {operacion.referencia_booking}
                    </h4>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "0.85rem",
                                color: status.color,
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                            }}
                        >
                            {status.icon} {status.text.toUpperCase()}
                        </span>
                        <button
                            onClick={() => onAction("view", operacion)}
                            className="btn"
                            style={{
                                padding: "0.3rem 0.6rem",
                                fontSize: "0.8rem",
                                border: "1px solid var(--primary)",
                                background: "transparent",
                                color: "var(--primary)",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            {isDetailOpen ? "Contraer" : "Ver Detalle"}
                        </button>
                    </div>
                </div>

                {/* Vista normal (contraída) */}
                {!isDetailOpen && (
                    <div
                        className="form-grid"
                        style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
                    >
                        <div className="form-group" style={{ margin: 0 }}>
                            <label
                                className="form-label"
                                style={{ fontSize: "0.85rem" }}
                            >
                                Cliente{" "}
                                {operacion.id_cotizacion &&
                                    `(Cot. #${operacion.id_cotizacion})`}
                            </label>
                            <p style={{ margin: 0, fontWeight: 600 }}>
                                <Building2
                                    size={14}
                                    style={{
                                        verticalAlign: "middle",
                                        marginRight: "5px",
                                    }}
                                />
                                {operacion.cliente_nombre}
                            </p>
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label
                                className="form-label"
                                style={{ fontSize: "0.85rem" }}
                            >
                                Encargado Operativo
                            </label>
                            <p style={{ margin: 0, fontSize: "0.95rem" }}>
                                <User
                                    size={14}
                                    style={{
                                        verticalAlign: "middle",
                                        marginRight: "5px",
                                    }}
                                />
                                {operacion.usuario_operativo_nombre}
                            </p>
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label
                                className="form-label"
                                style={{ fontSize: "0.85rem" }}
                            >
                                Servicio ({operacion.incoterm})
                            </label>
                            <p style={{ margin: 0 }}>
                                {getServiceIcon(operacion.tipo_servicio)}
                                <strong>
                                    {
                                        TipoServicioDisplay[
                                            operacion.tipo_servicio
                                        ]
                                    }
                                </strong>
                                <span
                                    style={{
                                        marginLeft: "10px",
                                        fontSize: "0.9rem",
                                        color: "var(--text-secondary)",
                                    }}
                                >
                                    <Package
                                        size={14}
                                        style={{
                                            verticalAlign: "middle",
                                            marginRight: "3px",
                                        }}
                                    />
                                    {operacion.tipo_carga}
                                </span>
                            </p>
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label
                                className="form-label"
                                style={{ fontSize: "0.85rem" }}
                            >
                                Proveedor
                            </label>
                            <p style={{ margin: 0, fontSize: "0.95rem" }}>
                                <Building2
                                    size={14}
                                    style={{
                                        verticalAlign: "middle",
                                        marginRight: "5px",
                                    }}
                                />
                                {operacion.proveedor_nombre}
                            </p>
                        </div>
                    </div>
                )}

                {/* Vista expandida (detallada) */}
                {isDetailOpen && (
                    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
                        {/* Información General */}
                        <div className="section-container">
                            <h5 className="section-title primary">
                                <BarChart3 size={18} /> Información General
                            </h5>
                            <div
                                className="form-grid"
                                style={{
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(250px, 1fr))",
                                    gap: "1.5rem",
                                }}
                            >
                                <div
                                    className="form-group"
                                    style={{ margin: 0 }}
                                >
                                    <label
                                        className="form-label"
                                        style={{ fontSize: "0.85rem" }}
                                    >
                                        Cliente
                                    </label>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontWeight: 600,
                                            fontSize: "1rem",
                                        }}
                                    >
                                        <Building2
                                            size={16}
                                            style={{
                                                verticalAlign: "middle",
                                                marginRight: "8px",
                                                color: "var(--primary)",
                                            }}
                                        />
                                        {operacion.cliente_nombre}
                                    </p>
                                    <small
                                        style={{
                                            color: "var(--text-secondary)",
                                        }}
                                    >
                                        ID Cliente: {operacion.id_cliente}
                                    </small>
                                </div>

                                <div
                                    className="form-group"
                                    style={{ margin: 0 }}
                                >
                                    <label
                                        className="form-label"
                                        style={{ fontSize: "0.85rem" }}
                                    >
                                        Encargado Operativo
                                    </label>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontWeight: 600,
                                            fontSize: "1rem",
                                        }}
                                    >
                                        <User
                                            size={16}
                                            style={{
                                                verticalAlign: "middle",
                                                marginRight: "8px",
                                                color: "var(--success)",
                                            }}
                                        />
                                        {operacion.usuario_operativo_nombre}
                                    </p>
                                    <small
                                        style={{
                                            color: "var(--text-secondary)",
                                        }}
                                    >
                                        ID Usuario:{" "}
                                        {operacion.id_usuario_operativo}
                                    </small>
                                </div>

                                <div
                                    className="form-group"
                                    style={{ margin: 0 }}
                                >
                                    <label
                                        className="form-label"
                                        style={{ fontSize: "0.85rem" }}
                                    >
                                        Proveedor
                                    </label>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontWeight: 600,
                                            fontSize: "1rem",
                                        }}
                                    >
                                        <Building2
                                            size={16}
                                            style={{
                                                verticalAlign: "middle",
                                                marginRight: "8px",
                                                color: "var(--info)",
                                            }}
                                        />
                                        {operacion.proveedor_nombre}
                                    </p>
                                    <small
                                        style={{
                                            color: "var(--text-secondary)",
                                        }}
                                    >
                                        ID Proveedor: {operacion.id_proveedor}
                                    </small>
                                </div>

                                {operacion.agente_nombre && (
                                    <div
                                        className="form-group"
                                        style={{ margin: 0 }}
                                    >
                                        <label
                                            className="form-label"
                                            style={{ fontSize: "0.85rem" }}
                                        >
                                            Agente Aduanal
                                        </label>
                                        <p
                                            style={{
                                                margin: 0,
                                                fontWeight: 600,
                                                fontSize: "1rem",
                                            }}
                                        >
                                            <User
                                                size={16}
                                                style={{
                                                    verticalAlign: "middle",
                                                    marginRight: "8px",
                                                    color: "var(--warning)",
                                                }}
                                            />
                                            {operacion.agente_nombre}
                                        </p>
                                        <small
                                            style={{
                                                color: "var(--text-secondary)",
                                            }}
                                        >
                                            ID Agente: {operacion.id_agente}
                                        </small>
                                    </div>
                                )}

                                {operacion.id_cotizacion && (
                                    <div
                                        className="form-group"
                                        style={{ margin: 0 }}
                                    >
                                        <label
                                            className="form-label"
                                            style={{ fontSize: "0.85rem" }}
                                        >
                                            Cotización Origen
                                        </label>
                                        <p
                                            style={{
                                                margin: 0,
                                                fontWeight: 600,
                                                fontSize: "1rem",
                                                color: "var(--info)",
                                            }}
                                        >
                                            <Settings
                                                size={16}
                                                style={{
                                                    verticalAlign: "middle",
                                                    marginRight: "8px",
                                                }}
                                            />
                                            Cotización #
                                            {operacion.id_cotizacion}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Información del Servicio */}
                        <div style={{ marginBottom: "2rem" }}>
                            <h5
                                style={{
                                    fontSize: "1rem",
                                    fontWeight: 600,
                                    color: "var(--info)",
                                    marginBottom: "1rem",
                                    borderBottom: "2px solid var(--info)",
                                    paddingBottom: "0.5rem",
                                }}
                            >
                                 Detalles del Servicio
                            </h5>
                            <div
                                className="form-grid"
                                style={{
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(200px, 1fr))",
                                    gap: "1.5rem",
                                }}
                            >
                                <div
                                    className="form-group"
                                    style={{ margin: 0 }}
                                >
                                    <label
                                        className="form-label"
                                        style={{ fontSize: "0.85rem" }}
                                    >
                                        Tipo de Servicio
                                    </label>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontWeight: 600,
                                            fontSize: "1rem",
                                        }}
                                    >
                                        {getServiceIcon(
                                            operacion.tipo_servicio
                                        )}
                                        <span style={{ marginLeft: "8px" }}>
                                            {
                                                TipoServicioDisplay[
                                                    operacion.tipo_servicio
                                                ]
                                            }
                                        </span>
                                    </p>
                                </div>

                                <div
                                    className="form-group"
                                    style={{ margin: 0 }}
                                >
                                    <label
                                        className="form-label"
                                        style={{ fontSize: "0.85rem" }}
                                    >
                                        Tipo de Carga
                                    </label>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontWeight: 600,
                                            fontSize: "1rem",
                                        }}
                                    >
                                        <Package
                                            size={16}
                                            style={{
                                                verticalAlign: "middle",
                                                marginRight: "8px",
                                                color: "var(--secondary)",
                                            }}
                                        />
                                        {operacion.tipo_carga}
                                    </p>
                                </div>

                                <div
                                    className="form-group"
                                    style={{ margin: 0 }}
                                >
                                    <label
                                        className="form-label"
                                        style={{ fontSize: "0.85rem" }}
                                    >
                                        Incoterm
                                    </label>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontWeight: 600,
                                            fontSize: "1rem",
                                        }}
                                    >
                                        <DollarSign
                                            size={16}
                                            style={{
                                                verticalAlign: "middle",
                                                marginRight: "8px",
                                                color: "var(--warning)",
                                            }}
                                        />
                                        {operacion.incoterm}
                                    </p>
                                </div>

                                <div
                                    className="form-group"
                                    style={{ margin: 0 }}
                                >
                                    <label
                                        className="form-label"
                                        style={{ fontSize: "0.85rem" }}
                                    >
                                        Booking/Referencia
                                    </label>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontWeight: 600,
                                            fontSize: "1rem",
                                        }}
                                    >
                                        <Settings
                                            size={16}
                                            style={{
                                                verticalAlign: "middle",
                                                marginRight: "8px",
                                                color: "var(--primary)",
                                            }}
                                        />
                                        {operacion.referencia_booking}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Fechas */}
                        {(operacion.fecha_estimada_arribo ||
                            operacion.fecha_estimada_entrega) && (
                            <div className="section-container">
                                <h5 className="section-title warning">
                                    <CalendarClock size={18} /> Fechas Estimadas
                                </h5>
                                <div
                                    className="form-grid"
                                    style={{
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "1.5rem",
                                    }}
                                >
                                    {operacion.fecha_estimada_arribo && (
                                        <div
                                            className="form-group"
                                            style={{
                                                margin: 0,
                                                textAlign: "center",
                                                padding: "1rem",
                                                backgroundColor:
                                                    "var(--light-bg)",
                                                borderRadius: "8px",
                                            }}
                                        >
                                            <label
                                                className="form-label"
                                                style={{
                                                    fontSize: "0.85rem",
                                                    color: "var(--primary)",
                                                }}
                                            >
                                                Fecha de Arribo
                                            </label>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontWeight: 600,
                                                    fontSize: "1.1rem",
                                                }}
                                            >
                                                <Calendar
                                                    size={18}
                                                    style={{
                                                        verticalAlign: "middle",
                                                        marginRight: "8px",
                                                        color: "var(--primary)",
                                                    }}
                                                />
                                                {new Date(
                                                    operacion.fecha_estimada_arribo
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}

                                    {operacion.fecha_estimada_entrega && (
                                        <div
                                            className="form-group"
                                            style={{
                                                margin: 0,
                                                textAlign: "center",
                                                padding: "1rem",
                                                backgroundColor:
                                                    "var(--light-bg)",
                                                borderRadius: "8px",
                                            }}
                                        >
                                            <label
                                                className="form-label"
                                                style={{
                                                    fontSize: "0.85rem",
                                                    color: "var(--danger)",
                                                }}
                                            >
                                                Fecha de Entrega
                                            </label>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontWeight: 600,
                                                    fontSize: "1.1rem",
                                                }}
                                            >
                                                <Clock
                                                    size={18}
                                                    style={{
                                                        verticalAlign: "middle",
                                                        marginRight: "8px",
                                                        color: "var(--danger)",
                                                    }}
                                                />
                                                {new Date(
                                                    operacion.fecha_estimada_entrega
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Notas */}
                        {operacion.notas_operacion && (
                            <div className="section-container">
                                <h5 className="section-title secondary">
                                    <ClipboardList size={18} /> Notas de la Operación
                                </h5>
                                <div
                                    style={{
                                        padding: "1rem",
                                        backgroundColor: "var(--light-bg)",
                                        borderRadius: "8px",
                                        border: "1px solid #e5e7eb",
                                    }}
                                >
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: "1rem",
                                            lineHeight: "1.5",
                                        }}
                                    >
                                        {operacion.notas_operacion}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Sección Demoras */}
                        <DemorasSection
                            operacion={operacion}
                            demoras={demoras}
                            isAddingDemora={isAddingDemora}
                            setIsAddingDemora={setIsAddingDemora}
                            editingDemora={editingDemora}
                            setEditingDemora={setEditingDemora}
                            createDemora={createDemora}
                            updateDemora={updateDemora}
                            deleteDemora={deleteDemora}
                        />

                        {/* Sección Incidencias */}
                        <IncidenciasSection
                            operacion={operacion}
                            incidencias={incidencias}
                            isAddingIncidencia={isAddingIncidencia}
                            setIsAddingIncidencia={setIsAddingIncidencia}
                            editingIncidencia={editingIncidencia}
                            setEditingIncidencia={setEditingIncidencia}
                            createIncidencia={createIncidencia}
                            updateIncidencia={updateIncidencia}
                            deleteIncidencia={deleteIncidencia}
                        />

                        {/* Sección Tracking */}
                        <TrackingSection
                            operacion={operacion}
                            tracking={tracking.filter(
                                (t) => t.id_operacion === operacion.id_operacion
                            )}
                            proveedores={proveedores}
                            showNotification={showNotification}
                            loadTracking={loadTracking}
                            isAddingTracking={isAddingTracking}
                            setIsAddingTracking={setIsAddingTracking}
                            editingTracking={editingTracking}
                            setEditingTracking={setEditingTracking}
                            createTracking={createTracking}
                            updateTracking={updateTracking}
                            deleteTracking={deleteTracking}
                        />

                        {/* Acciones en vista expandida */}
                        <div
                            style={{
                                display: "flex",
                                gap: "1rem",
                                justifyContent: "center",
                                paddingTop: "1rem",
                                borderTop: "1px solid #e5e7eb",
                            }}
                        >
                            <button
                                className="btn btn-secondary"
                                onClick={() => onAction("edit", operacion)}
                            >
                                <Settings size={16} /> Editar Operación
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => onAction("delete", operacion)}
                            >
                                <Trash2 size={16} /> Eliminar
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Panel derecho - Solo se muestra en vista contraída */}
            {!isDetailOpen && (
                <div
                    style={{
                        padding: "1.5rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            textAlign: "center",
                            width: "100%",
                            marginBottom: "1rem",
                        }}
                    >
                        <label
                            className="form-label"
                            style={{ fontSize: "0.8rem" }}
                        >
                            Fechas Estimadas
                        </label>
                        {operacion.fecha_estimada_arribo && (
                            <div
                                style={{
                                    fontSize: "0.9rem",
                                    color: "var(--primary)",
                                    fontWeight: 600,
                                    marginTop: "0.3rem",
                                }}
                            >
                                <Calendar
                                    size={14}
                                    style={{
                                        verticalAlign: "middle",
                                        marginRight: 6,
                                    }}
                                />
                                Arribo:{" "}
                                {new Date(
                                    operacion.fecha_estimada_arribo
                                ).toLocaleDateString()}
                            </div>
                        )}
                        {operacion.fecha_estimada_entrega && (
                            <div
                                style={{
                                    fontSize: "0.9rem",
                                    color: "var(--danger)",
                                    fontWeight: 600,
                                    marginTop: "0.3rem",
                                }}
                            >
                                <Clock
                                    size={14}
                                    style={{
                                        verticalAlign: "middle",
                                        marginRight: 6,
                                    }}
                                />
                                Entrega:{" "}
                                {new Date(
                                    operacion.fecha_estimada_entrega
                                ).toLocaleDateString()}
                            </div>
                        )}
                    </div>

                    <div
                        className="form-actions"
                        style={{
                            paddingTop: 0,
                            borderTop: "none",
                            justifyContent: "center",
                            gap: "0.5rem",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                flexDirection: "column",
                                width: "100%",
                            }}
                        >
                            <button
                                className="btn btn-secondary"
                                onClick={() => onAction("edit", operacion)}
                                style={{ padding: "0.45rem 0.8rem" }}
                            >
                                <Settings size={16} /> Editar
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => onAction("delete", operacion)}
                                style={{ padding: "0.45rem 0.8rem" }}
                            >
                                <Trash2 size={16} /> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente TrackingSection
const TrackingSection = ({
    operacion,
    tracking = [],
    proveedores = [],
    showNotification,
    loadTracking,
    isAddingTracking,
    setIsAddingTracking,
    editingTracking,
    setEditingTracking,
    createTracking,
    updateTracking,
    deleteTracking,
}) => {
    const [newTracking, setNewTracking] = useState({
        ubicacion_actual: "",
        latitud: "",
        longitud: "",
        estatus_seguimiento: "en_origen",
        referencia_transportista: "",
        nombre_transportista: "",
        notas_tracking: "",
    });

    // Obtener el tracking más reciente para mostrar en el mapa
    const latestTracking = tracking.length > 0 ? tracking[0] : null;

    // Coordenadas por defecto (Ciudad de México) si no hay tracking
    const defaultLat = 19.4326;
    const defaultLng = -99.1332;

    // Usar las coordenadas del tracking más reciente o las por defecto
    const mapLat = latestTracking?.latitud
        ? parseFloat(latestTracking.latitud)
        : defaultLat;
    const mapLng = latestTracking?.longitud
        ? parseFloat(latestTracking.longitud)
        : defaultLng;

    const resetForm = () => {
        setNewTracking({
            ubicacion_actual: "",
            latitud: "",
            longitud: "",
            estatus_seguimiento: "en_origen",
            referencia_transportista: "",
            nombre_transportista: "",
            notas_tracking: "",
        });
        setIsAddingTracking(false);
        setEditingTracking(null);
    };

    const handleSubmit = async () => {
        // Validaciones básicas
        if (!operacion.id_operacion) {
            showNotification("error", "Error: ID de operación no válido");
            return;
        }

        if (!newTracking.estatus_seguimiento) {
            showNotification("error", "Error: Estado del envío es requerido");
            return;
        }

        const payload = {
            id_operacion: parseInt(operacion.id_operacion), // Asegurar que sea number
            ubicacion_actual: newTracking.ubicacion_actual?.trim() || null,
            latitud:
                newTracking.latitud && newTracking.latitud !== ""
                    ? parseFloat(newTracking.latitud)
                    : null,
            longitud:
                newTracking.longitud && newTracking.longitud !== ""
                    ? parseFloat(newTracking.longitud)
                    : null,
            estatus_seguimiento: newTracking.estatus_seguimiento,
            referencia_transportista:
                newTracking.referencia_transportista?.trim() || null,
            nombre_transportista:
                newTracking.nombre_transportista?.trim() || null,
            notas_tracking: newTracking.notas_tracking?.trim() || null,
            fecha_hora_actualizacion: new Date().toISOString(),
        };

        console.log("Payload siendo enviado:", payload); // Debug

        try {
            if (editingTracking) {
                await updateTracking(editingTracking.id_tracking, payload);
            } else {
                await createTracking(payload);
            }
            resetForm();
        } catch (error) {
            console.error("Error en handleSubmit:", error);
            showNotification("error", "Error al procesar la solicitud");
        }
    };

    const handleEdit = (trackingItem) => {
        setNewTracking({
            ubicacion_actual: trackingItem.ubicacion_actual || "",
            latitud: trackingItem.latitud || "",
            longitud: trackingItem.longitud || "",
            estatus_seguimiento: trackingItem.estatus_seguimiento,
            referencia_transportista:
                trackingItem.referencia_transportista || "",
            nombre_transportista: trackingItem.nombre_transportista || "",
            notas_tracking: trackingItem.notas_tracking || "",
        });
        setEditingTracking(trackingItem);
        setIsAddingTracking(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "en_origen":
                return "#6c757d";
            case "en_transito":
                return "#007bff";
            case "en_destino":
                return "#ffc107";
            case "entregado":
                return "#28a745";
            case "aduana":
                return "#dc3545";
            default:
                return "#6c757d";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "en_origen":
                return "En Origen";
            case "en_transito":
                return "En Tránsito";
            case "en_destino":
                return "En Destino";
            case "entregado":
                return "Entregado";
            case "aduana":
                return "En Aduana";
            default:
                return status;
        }
    };

    return (
        <div style={{ marginBottom: "1.5rem" }}>
            <div
                className="section-header"
                style={{ marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid var(--primary)" }}
            >
                <h5 className="section-title primary">
                    <Navigation size={18} /> Seguimiento y Ubicación
                </h5>
                <button
                    onClick={() => setIsAddingTracking(!isAddingTracking)}
                    style={{
                        background: "var(--primary)",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    <Plus size={16} />
                    {editingTracking
                        ? "Cancelar Edición"
                        : "Actualizar Ubicación"}
                </button>
            </div>

            {/* Mapa */}
            <div
                style={{
                    marginBottom: "1rem",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                }}
            >
                <MapContainer
                    center={[mapLat, mapLng]}
                    zoom={latestTracking ? 10 : 6}
                    style={{ height: "300px", width: "100%" }}
                    key={`${mapLat}-${mapLng}`}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[mapLat, mapLng]}>
                        <Popup>
                            <div style={{ textAlign: "center" }}>
                                <h5 style={{ margin: "0 0 0.5rem 0" }}>
                                    {latestTracking
                                        ? latestTracking.ubicacion_actual ||
                                          "Ubicación Actual"
                                        : "Ubicación por Defecto"}
                                </h5>
                                {latestTracking && (
                                    <>
                                        <p
                                            style={{
                                                margin: "0.25rem 0",
                                                fontSize: "0.85rem",
                                            }}
                                        >
                                            <strong>Estado:</strong>{" "}
                                            {getStatusText(
                                                latestTracking.estatus_seguimiento
                                            )}
                                        </p>
                                        <p
                                            style={{
                                                margin: "0.25rem 0",
                                                fontSize: "0.85rem",
                                            }}
                                        >
                                            <strong>Actualizado:</strong>{" "}
                                            {new Date(
                                                latestTracking.fecha_hora_actualizacion
                                            ).toLocaleString()}
                                        </p>
                                    </>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>

            {/* Formulario para agregar/editar tracking */}
            {isAddingTracking && (
                <div className="tracking-form">
                    <h5>
                        {editingTracking
                            ? "Editar Ubicación"
                            : "Nueva Actualización de Tracking"}
                    </h5>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1rem",
                            marginBottom: "1rem",
                        }}
                    >
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    fontWeight: "500",
                                }}
                            >
                                Ubicación Actual
                            </label>
                            <input
                                type="text"
                                value={newTracking.ubicacion_actual}
                                onChange={(e) =>
                                    setNewTracking({
                                        ...newTracking,
                                        ubicacion_actual: e.target.value,
                                    })
                                }
                                placeholder="Ej: Puerto de Veracruz, México"
                                style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                }}
                            />
                        </div>
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    fontWeight: "500",
                                }}
                            >
                                Estado del Envío
                            </label>
                            <select
                                value={newTracking.estatus_seguimiento}
                                onChange={(e) =>
                                    setNewTracking({
                                        ...newTracking,
                                        estatus_seguimiento: e.target.value,
                                    })
                                }
                                style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                }}
                            >
                                <option value="en_origen">En Origen</option>
                                <option value="en_transito">En Tránsito</option>
                                <option value="aduana">En Aduana</option>
                                <option value="en_destino">En Destino</option>
                                <option value="entregado">Entregado</option>
                            </select>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1rem",
                            marginBottom: "1rem",
                        }}
                    >
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    fontWeight: "500",
                                }}
                            >
                                Latitud
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={newTracking.latitud}
                                onChange={(e) =>
                                    setNewTracking({
                                        ...newTracking,
                                        latitud: e.target.value,
                                    })
                                }
                                placeholder="Ej: 19.4326"
                                style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                }}
                            />
                        </div>
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    fontWeight: "500",
                                }}
                            >
                                Longitud
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={newTracking.longitud}
                                onChange={(e) =>
                                    setNewTracking({
                                        ...newTracking,
                                        longitud: e.target.value,
                                    })
                                }
                                placeholder="Ej: -99.1332"
                                style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                }}
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1rem",
                            marginBottom: "1rem",
                        }}
                    >
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    fontWeight: "500",
                                }}
                            >
                                Transportista
                            </label>
                            <select
                                value={newTracking.nombre_transportista}
                                onChange={(e) =>
                                    setNewTracking({
                                        ...newTracking,
                                        nombre_transportista: e.target.value,
                                    })
                                }
                                style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                }}
                            >
                                <option value="">
                                    Seleccionar transportista
                                </option>
                                {proveedores.map((proveedor) => (
                                    <option
                                        key={
                                            proveedor.id_proveedor ||
                                            proveedor.id
                                        }
                                        value={
                                            proveedor.nombre_empresa ||
                                            proveedor.nombre ||
                                            `Proveedor ${
                                                proveedor.id_proveedor ||
                                                proveedor.id
                                            }`
                                        }
                                    >
                                        {proveedor.nombre_empresa ||
                                            proveedor.nombre ||
                                            `Proveedor ${
                                                proveedor.id_proveedor ||
                                                proveedor.id
                                            }`}
                                        {proveedor.tipo_servicio_ofrecido &&
                                            ` - ${proveedor.tipo_servicio_ofrecido}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    fontWeight: "500",
                                }}
                            >
                                Referencia
                            </label>
                            <input
                                type="text"
                                value={newTracking.referencia_transportista}
                                onChange={(e) =>
                                    setNewTracking({
                                        ...newTracking,
                                        referencia_transportista:
                                            e.target.value,
                                    })
                                }
                                placeholder="Número de referencia"
                                style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.5rem",
                                fontWeight: "500",
                            }}
                        >
                            Notas Adicionales
                        </label>
                        <textarea
                            value={newTracking.notas_tracking}
                            onChange={(e) =>
                                setNewTracking({
                                    ...newTracking,
                                    notas_tracking: e.target.value,
                                })
                            }
                            placeholder="Comentarios o detalles adicionales..."
                            rows={3}
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                resize: "vertical",
                            }}
                        />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "0.5rem",
                            justifyContent: "flex-end",
                        }}
                    >
                        <button
                            onClick={resetForm}
                            style={{
                                background: "#6c757d",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "0.5rem 1rem",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                            }}
                        >
                            <X
                                size={16}
                                style={{
                                    verticalAlign: "middle",
                                    marginRight: "0.25rem",
                                }}
                            />
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            style={{
                                background: "var(--primary)",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "0.5rem 1rem",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                            }}
                        >
                            <Save
                                size={16}
                                style={{
                                    verticalAlign: "middle",
                                    marginRight: "0.25rem",
                                }}
                            />
                            {editingTracking ? "Actualizar" : "Guardar"}
                        </button>
                    </div>
                </div>
            )}

            {/* Lista de actualizaciones de tracking */}

            <div>
                <h5
                    style={{
                        margin: "0 0 1rem 0",
                        color: "var(--text-primary)",
                        fontSize: "1rem",
                        fontWeight: "500",
                    }}
                >
                    Historial de Seguimiento ({tracking.length})
                </h5>

                {tracking.length === 0 ? (
                    <div className="tracking-empty-state">
                        <Map
                            size={48}
                            style={{
                                color: "var(--text-secondary)",
                                marginBottom: "1rem",
                            }}
                        />
                        <p style={{ margin: 0, fontSize: "0.9rem" }}>
                            No hay actualizaciones de tracking para esta
                            operación.
                            <br />
                            Agrega la primera ubicación para comenzar el
                            seguimiento.
                        </p>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                        }}
                    >
                        {tracking.map((trackingItem, index) => (
                            <div
                                key={trackingItem.id_tracking}
                                className={`tracking-history-item ${
                                    index === 0 ? "tracking-current-item" : ""
                                }`}
                                style={{
                                    borderLeft: `4px solid ${getStatusColor(
                                        trackingItem.estatus_seguimiento
                                    )}`,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.5rem",
                                                marginBottom: "0.5rem",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    padding: "0.25rem 0.5rem",
                                                    backgroundColor:
                                                        getStatusColor(
                                                            trackingItem.estatus_seguimiento
                                                        ),
                                                    color: "white",
                                                    borderRadius: "12px",
                                                    fontSize: "0.75rem",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {getStatusText(
                                                    trackingItem.estatus_seguimiento
                                                )}
                                            </span>
                                            {index === 0 && (
                                                <span
                                                    style={{
                                                        padding:
                                                            "0.25rem 0.5rem",
                                                        backgroundColor:
                                                            "var(--success)",
                                                        color: "white",
                                                        borderRadius: "12px",
                                                        fontSize: "0.7rem",
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    ACTUAL
                                                </span>
                                            )}
                                        </div>

                                        <h6
                                            style={{
                                                margin: "0 0 0.5rem 0",
                                                fontSize: "1rem",
                                                color: "var(--text-primary)",
                                            }}
                                        >
                                            {trackingItem.ubicacion_actual ||
                                                "Ubicación no especificada"}
                                        </h6>

                                        <div
                                            style={{
                                                fontSize: "0.85rem",
                                                color: "var(--text-secondary)",
                                                marginBottom: "0.5rem",
                                            }}
                                        >
                                            <Clock
                                                size={14}
                                                style={{
                                                    verticalAlign: "middle",
                                                    marginRight: "0.25rem",
                                                }}
                                            />
                                            Actualizado:{" "}
                                            {new Date(
                                                trackingItem.fecha_hora_actualizacion
                                            ).toLocaleString()}
                                        </div>

                                        {trackingItem.latitud &&
                                            trackingItem.longitud && (
                                                <div
                                                    style={{
                                                        fontSize: "0.8rem",
                                                        color: "var(--text-secondary)",
                                                        marginBottom: "0.5rem",
                                                    }}
                                                >
                                                    <Crosshair
                                                        size={14}
                                                        style={{
                                                            verticalAlign:
                                                                "middle",
                                                            marginRight:
                                                                "0.25rem",
                                                        }}
                                                    />
                                                    Coordenadas:{" "}
                                                    {parseFloat(
                                                        trackingItem.latitud
                                                    ).toFixed(6)}
                                                    ,{" "}
                                                    {parseFloat(
                                                        trackingItem.longitud
                                                    ).toFixed(6)}
                                                </div>
                                            )}

                                        {(trackingItem.nombre_transportista ||
                                            trackingItem.referencia_transportista) && (
                                            <div
                                                style={{
                                                    fontSize: "0.85rem",
                                                    color: "var(--text-secondary)",
                                                    marginBottom: "0.5rem",
                                                    display: "flex",
                                                    gap: "1rem",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                {trackingItem.nombre_transportista && (
                                                    <span>
                                                        <Truck
                                                            size={14}
                                                            style={{
                                                                verticalAlign:
                                                                    "middle",
                                                                marginRight:
                                                                    "0.25rem",
                                                            }}
                                                        />
                                                        {
                                                            trackingItem.nombre_transportista
                                                        }
                                                    </span>
                                                )}
                                                {trackingItem.referencia_transportista && (
                                                    <span>
                                                        <FileText
                                                            size={14}
                                                            style={{
                                                                verticalAlign:
                                                                    "middle",
                                                                marginRight:
                                                                    "0.25rem",
                                                            }}
                                                        />
                                                        Ref:{" "}
                                                        {
                                                            trackingItem.referencia_transportista
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {trackingItem.notas_tracking && (
                                            <div className="tracking-notes">
                                                <strong
                                                    style={{
                                                        color: "var(--text-secondary)",
                                                    }}
                                                >
                                                    Notas:
                                                </strong>
                                                <p
                                                    style={{
                                                        margin: "0.25rem 0 0 0",
                                                        color: "var(--text-primary)",
                                                    }}
                                                >
                                                    {
                                                        trackingItem.notas_tracking
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "0.5rem",
                                        }}
                                    >
                                        <button
                                            onClick={() =>
                                                handleEdit(trackingItem)
                                            }
                                            className="action-btn action-btn-edit"
                                            style={{
                                                border: "1px solid var(--primary)",
                                                color: "var(--primary)",
                                                borderRadius: "4px",
                                                padding: "0.25rem 0.5rem",
                                                cursor: "pointer",
                                                fontSize: "0.75rem",
                                            }}
                                        >
                                            <Edit size={12} /> Editar
                                        </button>
                                        <button
                                            onClick={() =>
                                                deleteTracking(
                                                    trackingItem.id_tracking
                                                )
                                            }
                                            className="action-btn action-btn-delete"
                                            style={{
                                                border: "1px solid var(--danger)",
                                                color: "var(--danger)",
                                                borderRadius: "4px",
                                                padding: "0.25rem 0.5rem",
                                                cursor: "pointer",
                                                fontSize: "0.75rem",
                                            }}
                                        >
                                            <Trash2 size={12} /> Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const initialOperacionForm = {
    // Backend required fields
    id_cotizacion: "", // Optional
    id_cliente: "",
    id_usuario_operativo: "",
    id_proveedor: "",
    id_agente: "", // Optional
    tipo_servicio: "maritimo",
    tipo_carga: "FCL",
    incoterm: "FOB",
    fecha_estimada_arribo: "",
    fecha_estimada_entrega: "",
    numero_referencia_proveedor: "",
    notas_operacion: "",
    estatus: "pendiente_documentos",

    // Frontend helper fields for form display (not sent to backend)
    cliente_nombre: "",
    usuario_operativo_nombre: "",
    proveedor_nombre: "",
    agente_nombre: "",
    descripcion_mercancia: "",
    cotizacion_origen: null,
};

// Estado inicial para las operaciones
const initialOperaciones = [];

const Operaciones = () => {
    const [operaciones, setOperaciones] = useState(initialOperaciones);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("todas");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedOperacion, setSelectedOperacion] = useState(null);
    const [formData, setFormData] = useState(initialOperacionForm);

    // Estados para datos maestros
    const [clientes, setClientes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [agentes, setAgentes] = useState([]);
    const [cotizaciones, setCotizaciones] = useState([]);
    const [localizaciones, setLocalizaciones] = useState([]);

    // Estados para notificaciones
    const [notification, setNotification] = useState({ type: "", message: "" });

    // Estado para detalle expandido
    const [expandedOperacionId, setExpandedOperacionId] = useState(null);

    // Estados para demoras e incidencias
    const [demoras, setDemoras] = useState([]);
    const [incidencias, setIncidencias] = useState([]);
    const [isAddingDemora, setIsAddingDemora] = useState(false);
    const [isAddingIncidencia, setIsAddingIncidencia] = useState(false);
    const [editingDemora, setEditingDemora] = useState(null);
    const [editingIncidencia, setEditingIncidencia] = useState(null);

    // Estados para tracking
    const [tracking, setTracking] = useState([]);
    const [isAddingTracking, setIsAddingTracking] = useState(false);
    const [editingTracking, setEditingTracking] = useState(null);

    // Función para mostrar notificaciones
    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => {
            setNotification({ type: "", message: "" });
        }, 5000);
    };

    const closeNotification = () => {
        setNotification({ type: "", message: "" });
    };

    // Cargar datos iniciales
    useEffect(() => {
        let mounted = true;

        async function loadData() {
            try {
                // Cargar todos los datos en paralelo
                const [
                    opsData,
                    clientesData,
                    usuariosData,
                    proveedoresData,
                    agentesData,
                    cotizacionesData,
                    localizacionesData,
                    demorasData,
                    incidenciasData,
                    trackingData,
                ] = await Promise.allSettled([
                    apiGet("/operaciones").catch(() => []),
                    apiGet("/clientes").catch(() => []),
                    apiGet("/usuarios").catch(() => []),
                    apiGet("/proveedores").catch(() => []),
                    apiGet("/agentes").catch(() => []),
                    apiGet("/cotizaciones").catch(() => []),
                    apiGet("/localizaciones").catch(() => []),
                    fetch(
                        "https://pwa-sistema-logistico-backend.onrender.com/demoras"
                    )
                        .then((res) => (res.ok ? res.json() : []))
                        .catch(() => []),
                    fetch(
                        "https://pwa-sistema-logistico-backend.onrender.com/incidencias"
                    )
                        .then((res) => (res.ok ? res.json() : []))
                        .catch(() => []),
                    fetch(
                        "https://pwa-sistema-logistico-backend.onrender.com/tracking"
                    )
                        .then((res) => (res.ok ? res.json() : []))
                        .catch(() => []),
                ]);

                if (mounted) {
                    // Guardar datos maestros en el estado
                    if (
                        clientesData.status === "fulfilled" &&
                        Array.isArray(clientesData.value)
                    ) {
                        setClientes(clientesData.value);
                    }
                    if (
                        usuariosData.status === "fulfilled" &&
                        Array.isArray(usuariosData.value)
                    ) {
                        setUsuarios(usuariosData.value);
                    }
                    if (
                        proveedoresData.status === "fulfilled" &&
                        Array.isArray(proveedoresData.value)
                    ) {
                        setProveedores(proveedoresData.value);
                    }
                    if (
                        agentesData.status === "fulfilled" &&
                        Array.isArray(agentesData.value)
                    ) {
                        setAgentes(agentesData.value);
                    }
                    if (
                        cotizacionesData.status === "fulfilled" &&
                        Array.isArray(cotizacionesData.value)
                    ) {
                        setCotizaciones(cotizacionesData.value);
                    }
                    if (
                        localizacionesData.status === "fulfilled" &&
                        Array.isArray(localizacionesData.value)
                    ) {
                        setLocalizaciones(localizacionesData.value);
                    }
                    if (
                        demorasData.status === "fulfilled" &&
                        Array.isArray(demorasData.value)
                    ) {
                        setDemoras(demorasData.value);
                    }
                    if (
                        incidenciasData.status === "fulfilled" &&
                        Array.isArray(incidenciasData.value)
                    ) {
                        setIncidencias(incidenciasData.value);
                    }
                    if (
                        trackingData.status === "fulfilled" &&
                        Array.isArray(trackingData.value)
                    ) {
                        setTracking(trackingData.value);
                    }

                    // Procesar operaciones
                    if (
                        opsData.status === "fulfilled" &&
                        Array.isArray(opsData.value)
                    ) {
                        const enrichedOps = (opsData.value || []).map((op) => ({
                            ...op,
                            cliente_nombre: op.cliente?.nombre_empresa || "N/A",
                            usuario_operativo_nombre: `${
                                op.usuario_operativo?.nombre || "N/A"
                            } ${op.usuario_operativo?.apellido || ""}`.trim(),
                            proveedor_nombre:
                                op.proveedor?.nombre_empresa || "N/A",
                            agente_nombre: op.agente
                                ? `${op.agente.nombre || ""} ${
                                      op.agente.apellido || ""
                                  }`.trim()
                                : null,
                            // Corregir el campo booking
                            referencia_booking:
                                op.numero_referencia_proveedor || "",
                            estatus_operacion:
                                op.estatus || "pendiente_documentos",
                        }));

                        // Ordenar por ID ascendente (menor ID primero)
                        enrichedOps.sort(
                            (a, b) => a.id_operacion - b.id_operacion
                        );
                        setOperaciones(enrichedOps);
                    }
                }
            } catch (err) {
                console.error("Error cargando datos:", err);
                if (mounted) {
                    showNotification(
                        "error",
                        "Error al cargar datos del sistema"
                    );
                }
            }
        }

        loadData();
        return () => {
            mounted = false;
        };
    }, []);

    // useEffect para detectar si viene de cotizaciones y pre-llenar el formulario
    useEffect(() => {
        // Verificar si hay datos de pre-llenado en localStorage
        const prefillDataStr = localStorage.getItem("operacion_prefill_data");
        if (prefillDataStr) {
            try {
                const prefillData = JSON.parse(prefillDataStr);
                console.log(
                    "Datos de pre-llenado encontrados desde cotización:",
                    prefillData
                );

                // Pre-llenar el formulario con los datos de la cotización
                setFormData((prev) => ({
                    ...prev,
                    id_cotizacion: prefillData.id_cotizacion || "",
                    // Usar campos que coincidan con el formulario actual
                    cliente_nombre: prefillData.cliente_nombre || "",
                    usuario_operativo_nombre:
                        prefillData.usuario_operativo_nombre || "",
                    tipo_servicio:
                        prefillData.tipo_servicio?.toLowerCase() || "maritimo", // Convertir a minúsculas
                    incoterm: prefillData.incoterm || "FOB",
                    origen_nombre: prefillData.origen_nombre || "",
                    destino_nombre: prefillData.destino_nombre || "",
                    fecha_llegada_estimada:
                        prefillData.fecha_estimada_arribo || "", // Mapear a fecha_llegada_estimada
                    fecha_salida_estimada:
                        prefillData.fecha_estimada_entrega || "", // Mapear a fecha_salida_estimada
                    moneda: "USD",
                    estatus_operacion: "PENDIENTE_DOC",
                    documentos_pendientes: 0,

                    // Campos específicos del backend que no están en el formulario visual pero se necesitan para el API
                    id_cliente: prefillData.id_cliente,
                    id_usuario_operativo: prefillData.id_usuario_operativo,
                    id_proveedor: prefillData.id_proveedor,
                    id_agente: prefillData.id_agente,
                    tipo_carga: prefillData.tipo_carga || "FCL",

                    // Campos adicionales para referencia
                    cotizacion_origen: prefillData.cotizacion_origen || null,
                    descripcion_mercancia:
                        prefillData.descripcion_mercancia || "",
                }));

                // Abrir el formulario automáticamente
                setIsFormOpen(true);

                // Mostrar notificación
                console.log(
                    `Formulario pre-llenado con datos de la Cotización #${prefillData.id_cotizacion}`
                );

                // Limpiar los datos de localStorage después de usarlos
                localStorage.removeItem("operacion_prefill_data");
            } catch (err) {
                console.error("Error al procesar datos de pre-llenado:", err);
                localStorage.removeItem("operacion_prefill_data");
            }
        }
    }, []);

    const filteredOperaciones = useMemo(() => {
        return operaciones.filter((o) => {
            if (!o) return false;
            // Filtrar por estatus primero
            if (statusFilter !== "todas" && o.estatus !== statusFilter) {
                return false;
            }
            const searchableText = `${o.id_operacion} ${
                o.numero_referencia_proveedor || o.referencia_booking || ""
            } ${o.cliente_nombre} ${o.usuario_operativo_nombre} ${
                TipoServicioDisplay[o.tipo_servicio]
            } ${o.proveedor_nombre || ""} ${
                o.agente_nombre || ""
            }`.toLowerCase();
            return searchableText.includes(searchTerm.toLowerCase());
        });
    }, [operaciones, searchTerm, statusFilter]);

    const handleAction = (action, operacion) => {
        if (action === "new") {
            openFormForNew();
        } else if (action === "view") {
            // Toggle detail panel for this operación
            if (expandedOperacionId === operacion.id_operacion) {
                setExpandedOperacionId(null);
            } else {
                setExpandedOperacionId(operacion.id_operacion);
            }
        } else if (action === "edit") {
            openFormForEdit(operacion);
        } else if (action === "delete") {
            openDeleteConfirm(operacion);
        }
    };

    const handleFormChange = (e) => {
        const { name, value, type } = e.target;
        const parsed =
            type === "number" ? (value === "" ? "" : Number(value)) : value;
        setFormData((prev) => ({ ...prev, [name]: parsed }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Validaciones básicas
        if (
            !formData.id_cliente ||
            !formData.id_usuario_operativo ||
            !formData.id_proveedor
        ) {
            showNotification(
                "error",
                "Por favor complete todos los campos obligatorios (Cliente, Operativo, Proveedor)"
            );
            return;
        }

        if (!formData.numero_referencia_proveedor) {
            showNotification(
                "error",
                "El campo Booking/Referencia es obligatorio"
            );
            return;
        }

        // Build payload following backend DTO exactly
        const payload = {
            id_cotizacion: formData.id_cotizacion
                ? Number(formData.id_cotizacion)
                : undefined,
            id_cliente: Number(formData.id_cliente),
            id_usuario_operativo: Number(formData.id_usuario_operativo),
            id_proveedor: Number(formData.id_proveedor),
            id_agente: formData.id_agente
                ? Number(formData.id_agente)
                : undefined,
            tipo_servicio: formData.tipo_servicio || "maritimo",
            tipo_carga: formData.tipo_carga || "FCL",
            incoterm: formData.incoterm || "FOB",
            fecha_estimada_arribo: formData.fecha_estimada_arribo || undefined,
            fecha_estimada_entrega:
                formData.fecha_estimada_entrega || undefined,
            numero_referencia_proveedor: formData.numero_referencia_proveedor,
            notas_operacion: formData.notas_operacion || undefined,
            estatus: formData.estatus || "pendiente_documentos",
        };

        try {
            if (selectedOperacion) {
                await apiPut(
                    `/operaciones/${selectedOperacion.id_operacion}`,
                    payload
                );
                showNotification(
                    "success",
                    `Operación #${selectedOperacion.id_operacion} actualizada exitosamente`
                );
            } else {
                const created = await apiPost("/operaciones", payload);
                const cotizacionInfo = formData.cotizacion_origen
                    ? ` (generada desde Cotización #${formData.id_cotizacion})`
                    : "";
                showNotification(
                    "success",
                    `Operación creada exitosamente (ID: ${
                        created?.id_operacion || created?.id || "n/a"
                    })${cotizacionInfo}`
                );
            }

            // Recargar operaciones
            await loadOperaciones();

            // Cerrar formulario
            closeForm();
        } catch (err) {
            console.error("Error guardando operación:", err);
            let errorMessage = "Error al guardar la operación";
            if (err.response?.message) {
                errorMessage = Array.isArray(err.response.message)
                    ? err.response.message.join(", ")
                    : err.response.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            showNotification("error", errorMessage);
        }
    };

    // Función auxiliar para recargar operaciones
    const loadOperaciones = async () => {
        try {
            const opsData = await apiGet("/operaciones");
            const enrichedOps = (opsData || []).map((op) => ({
                ...op,
                cliente_nombre: op.cliente?.nombre_empresa || "N/A",
                usuario_operativo_nombre: `${
                    op.usuario_operativo?.nombre || "N/A"
                } ${op.usuario_operativo?.apellido || ""}`.trim(),
                proveedor_nombre: op.proveedor?.nombre_empresa || "N/A",
                agente_nombre: op.agente
                    ? `${op.agente.nombre || ""} ${
                          op.agente.apellido || ""
                      }`.trim()
                    : null,
                referencia_booking: op.numero_referencia_proveedor || "",
                estatus_operacion: op.estatus || "pendiente_documentos",
            }));

            enrichedOps.sort((a, b) => a.id_operacion - b.id_operacion);
            setOperaciones(enrichedOps);
        } catch (err) {
            console.error("Error recargando operaciones:", err);
            showNotification("error", "Error al recargar las operaciones");
        }
    };

    const openFormForNew = () => {
        setSelectedOperacion(null);
        setFormData(initialOperacionForm);
        setIsFormOpen(true);
        setIsDeleteOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const openFormForEdit = (operacion) => {
        setSelectedOperacion(operacion);
        setFormData({
            // Backend fields
            id_cotizacion: operacion.id_cotizacion || "",
            id_cliente: operacion.id_cliente || "",
            id_usuario_operativo: operacion.id_usuario_operativo || "",
            id_proveedor: operacion.id_proveedor || "",
            id_agente: operacion.id_agente || "",
            tipo_servicio: operacion.tipo_servicio || "maritimo",
            tipo_carga: operacion.tipo_carga || "FCL",
            incoterm: operacion.incoterm || "FOB",
            fecha_estimada_arribo: operacion.fecha_estimada_arribo
                ? operacion.fecha_estimada_arribo.substring(0, 10)
                : "",
            fecha_estimada_entrega: operacion.fecha_estimada_entrega
                ? operacion.fecha_estimada_entrega.substring(0, 10)
                : "",
            numero_referencia_proveedor:
                operacion.numero_referencia_proveedor || "",
            notas_operacion: operacion.notas_operacion || "",
            estatus: operacion.estatus || "pendiente_documentos",

            // Frontend helper fields
            cliente_nombre: operacion.cliente_nombre || "",
            usuario_operativo_nombre: operacion.usuario_operativo_nombre || "",
            proveedor_nombre: operacion.proveedor_nombre || "",
            agente_nombre: operacion.agente_nombre || "",
            descripcion_mercancia: operacion.descripcion_mercancia || "",
            cotizacion_origen: null,
        });
        setIsFormOpen(true);
        setIsDeleteOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const openDeleteConfirm = (operacion) => {
        setSelectedOperacion(operacion);
        setIsDeleteOpen(true);
        setIsFormOpen(false);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setFormData(initialOperacionForm);
        setSelectedOperacion(null);
    };

    const deleteOperacion = async () => {
        if (!selectedOperacion) return;

        try {
            await apiDelete(`/operaciones/${selectedOperacion.id_operacion}`);

            // Recargar operaciones
            await loadOperaciones();

            setIsDeleteOpen(false);
            setSelectedOperacion(null);

            showNotification(
                "success",
                `Operación #${selectedOperacion.id_operacion} eliminada exitosamente`
            );
        } catch (err) {
            console.error("Error eliminando operación:", err);
            showNotification(
                "error",
                "Error eliminando la operación: " + (err.message || err)
            );
        }
    };

    // Funciones CRUD para demoras
    const loadDemoras = async () => {
        try {
            const response = await fetch(
                "https://pwa-sistema-logistico-backend.onrender.com/demoras"
            );
            if (response.ok) {
                const data = await response.json();
                setDemoras(data);
            }
        } catch (error) {
            console.error("Error al cargar demoras:", error);
        }
    };

    const createDemora = async (demoraData) => {
        try {
            const response = await fetch(
                "https://pwa-sistema-logistico-backend.onrender.com/demoras",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(demoraData),
                }
            );

            if (response.ok) {
                await loadDemoras();
                setIsAddingDemora(false);
                showNotification("success", "Demora creada exitosamente");
            } else {
                showNotification("error", "Error al crear la demora");
            }
        } catch (error) {
            console.error("Error al crear demora:", error);
            showNotification("error", "Error al crear la demora");
        }
    };

    const updateDemora = async (id, demoraData) => {
        try {
            const response = await fetch(
                `https://pwa-sistema-logistico-backend.onrender.com/demoras/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(demoraData),
                }
            );

            if (response.ok) {
                await loadDemoras();
                setEditingDemora(null);
                showNotification("success", "Demora actualizada exitosamente");
            } else {
                showNotification("error", "Error al actualizar la demora");
            }
        } catch (error) {
            console.error("Error al actualizar demora:", error);
            showNotification("error", "Error al actualizar la demora");
        }
    };

    const deleteDemora = async (id) => {
        try {
            const response = await fetch(
                `https://pwa-sistema-logistico-backend.onrender.com/demoras/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                await loadDemoras();
                showNotification("success", "Demora eliminada exitosamente");
            } else {
                showNotification("error", "Error al eliminar la demora");
            }
        } catch (error) {
            console.error("Error al eliminar demora:", error);
            showNotification("error", "Error al eliminar la demora");
        }
    };

    // Funciones CRUD para incidencias
    const loadIncidencias = async () => {
        try {
            const response = await fetch(
                "https://pwa-sistema-logistico-backend.onrender.com/incidencias"
            );
            if (response.ok) {
                const data = await response.json();
                setIncidencias(data);
            }
        } catch (error) {
            console.error("Error al cargar incidencias:", error);
        }
    };

    const createIncidencia = async (incidenciaData) => {
        try {
            const response = await fetch(
                "https://pwa-sistema-logistico-backend.onrender.com/incidencias",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(incidenciaData),
                }
            );

            if (response.ok) {
                await loadIncidencias();
                setIsAddingIncidencia(false);
                showNotification("success", "Incidencia creada exitosamente");
            } else {
                showNotification("error", "Error al crear la incidencia");
            }
        } catch (error) {
            console.error("Error al crear incidencia:", error);
            showNotification("error", "Error al crear la incidencia");
        }
    };

    const updateIncidencia = async (id, incidenciaData) => {
        try {
            const response = await fetch(
                `https://pwa-sistema-logistico-backend.onrender.com/incidencias/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(incidenciaData),
                }
            );

            if (response.ok) {
                await loadIncidencias();
                setEditingIncidencia(null);
                showNotification(
                    "success",
                    "Incidencia actualizada exitosamente"
                );
            } else {
                showNotification("error", "Error al actualizar la incidencia");
            }
        } catch (error) {
            console.error("Error al actualizar incidencia:", error);
            showNotification("error", "Error al actualizar la incidencia");
        }
    };

    const deleteIncidencia = async (id) => {
        try {
            const response = await fetch(
                `https://pwa-sistema-logistico-backend.onrender.com/incidencias/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                await loadIncidencias();
                showNotification(
                    "success",
                    "Incidencia eliminada exitosamente"
                );
            } else {
                showNotification("error", "Error al eliminar la incidencia");
            }
        } catch (error) {
            console.error("Error al eliminar incidencia:", error);
            showNotification("error", "Error al eliminar la incidencia");
        }
    };

    // Funciones CRUD para tracking
    const loadTracking = async () => {
        try {
            const response = await fetch(
                "https://pwa-sistema-logistico-backend.onrender.com/tracking"
            );
            if (response.ok) {
                const data = await response.json();
                setTracking(data);
            }
        } catch (error) {
            console.error("Error al cargar tracking:", error);
        }
    };

    const createTracking = async (trackingData) => {
        try {
            console.log("Datos enviados al backend:", trackingData); // Debug

            const response = await fetch(
                "https://pwa-sistema-logistico-backend.onrender.com/tracking",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(trackingData),
                }
            );

            console.log(
                "Respuesta del servidor:",
                response.status,
                response.statusText
            ); // Debug

            if (response.ok) {
                const result = await response.json();
                console.log("Tracking creado exitosamente:", result); // Debug
                await loadTracking();
                showNotification(
                    "success",
                    "Ubicación registrada exitosamente"
                );
            } else {
                const errorData = await response
                    .json()
                    .catch(() => ({
                        message: "Error desconocido del servidor",
                    }));
                console.error("Error del servidor:", errorData); // Debug
                showNotification(
                    "error",
                    `Error: ${
                        errorData.message || "Error al registrar la ubicación"
                    }`
                );
            }
        } catch (error) {
            console.error("Error al crear tracking:", error);
            showNotification(
                "error",
                "Error de conexión al registrar la ubicación"
            );
        }
    };

    const updateTracking = async (id, trackingData) => {
        try {
            const response = await fetch(
                `https://pwa-sistema-logistico-backend.onrender.com/tracking/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(trackingData),
                }
            );

            if (response.ok) {
                await loadTracking();
                showNotification(
                    "success",
                    "Ubicación actualizada exitosamente"
                );
            } else {
                const errorData = await response.json();
                showNotification(
                    "error",
                    errorData.message || "Error al actualizar la ubicación"
                );
            }
        } catch (error) {
            console.error("Error al actualizar tracking:", error);
            showNotification("error", "Error al actualizar la ubicación");
        }
    };

    const deleteTracking = async (id) => {
        try {
            const response = await fetch(
                `https://pwa-sistema-logistico-backend.onrender.com/tracking/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                await loadTracking();
                showNotification("success", "Ubicación eliminada exitosamente");
            } else {
                showNotification("error", "Error al eliminar la ubicación");
            }
        } catch (error) {
            console.error("Error al eliminar tracking:", error);
            showNotification("error", "Error al eliminar la ubicación");
        }
    };

    return (
        <AppLayout activeLink="/operaciones">
            <div className="agents-container">
                <h1 className="agents-title">Listado General de Operaciones</h1>
                <p className="agents-subtitle">
                    Seguimiento en tiempo real y gestión de las operaciones
                    logísticas activas.
                </p>

                <div
                    className="agents-controls"
                    style={{
                        marginBottom: "1.5rem",
                        borderBottom: "1px solid #e5e7eb",
                        paddingBottom: "1.5rem",
                        flexWrap: 'nowrap',
                        gap: '1rem'
                    }}
                >
                    <div className="search-bar-wrapper" style={{ flex: '1 1 40%' }}>
                        <div className="search-icon-left">
                            <Search className="search-icon" />
                        </div>
                        <input
                            id="search-operaciones"
                            name="search"
                            type="text"
                            placeholder="Buscar por ID, Booking, Cliente, Operativo, Ruta..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="form-select"
                        style={{ flex: '0 1 180px' }}
                    >
                        <option value="todas">Todas</option>
                        <option value="pendiente_documentos">Pend. Docs</option>
                        <option value="en_transito">En Tránsito</option>
                        <option value="en_aduana">En Aduana</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>

                    <button
                        onClick={() => handleAction("new", null)}
                        className="btn btn-primary"
                        style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                    >
                        <Plus size={20} />
                        Crear Nueva Operación
                    </button>
                </div>

                {/* BANNER DE NOTIFICACIONES */}
                <NotificationBanner
                    type={notification.type}
                    message={notification.message}
                    onClose={closeNotification}
                />

                {isFormOpen && (
                    <OperacionForm
                        selectedOperacion={selectedOperacion}
                        formData={formData}
                        handleFormChange={handleFormChange}
                        handleFormSubmit={handleFormSubmit}
                        closeForm={closeForm}
                        clientes={clientes}
                        usuarios={usuarios}
                        proveedores={proveedores}
                        agentes={agentes}
                        cotizaciones={cotizaciones}
                        localizaciones={localizaciones}
                    />
                )}
                {isDeleteOpen && selectedOperacion && (
                    <DeleteOperacionConfirm
                        selectedOperacion={selectedOperacion}
                        deleteOperacion={deleteOperacion}
                        cancel={() => setIsDeleteOpen(false)}
                    />
                )}

                <div
                    className="cotizaciones-list-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: "1.5rem",
                    }}
                >
                    {filteredOperaciones.length > 0 ? (
                        filteredOperaciones.map((o) => (
                            <OperacionCard
                                key={o.id_operacion}
                                operacion={o}
                                onAction={handleAction}
                                isDetailOpen={
                                    expandedOperacionId === o.id_operacion
                                }
                                demoras={demoras}
                                incidencias={incidencias}
                                tracking={tracking}
                                proveedores={proveedores}
                                showNotification={showNotification}
                                loadTracking={loadTracking}
                                isAddingDemora={isAddingDemora}
                                setIsAddingDemora={setIsAddingDemora}
                                editingDemora={editingDemora}
                                setEditingDemora={setEditingDemora}
                                createDemora={createDemora}
                                updateDemora={updateDemora}
                                deleteDemora={deleteDemora}
                                isAddingIncidencia={isAddingIncidencia}
                                setIsAddingIncidencia={setIsAddingIncidencia}
                                editingIncidencia={editingIncidencia}
                                setEditingIncidencia={setEditingIncidencia}
                                createIncidencia={createIncidencia}
                                updateIncidencia={updateIncidencia}
                                deleteIncidencia={deleteIncidencia}
                                isAddingTracking={isAddingTracking}
                                setIsAddingTracking={setIsAddingTracking}
                                editingTracking={editingTracking}
                                setEditingTracking={setEditingTracking}
                                createTracking={createTracking}
                                updateTracking={updateTracking}
                                deleteTracking={deleteTracking}
                            />
                        ))
                    ) : (
                        <div
                            className="table-empty-state"
                            style={{
                                padding: "3rem",
                                fontSize: "0.9rem",
                                textAlign: "center",
                            }}
                        >
                            No se encontraron operaciones que coincidan con la
                            búsqueda.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Operaciones;
