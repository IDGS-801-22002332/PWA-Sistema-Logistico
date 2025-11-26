import React from 'react';
import AppLayout from "../Layout/AppLayout";
import { Users, Truck, Package, Activity } from 'lucide-react';

const PanelPrincipal = () => {
    const clientesActivos = 15;
    const proveedoresGlobales = 8;
    const pedidosEnCurso = 27; 

    return (
        <AppLayout activeLink="/panel">

            <h2 className="content-title">Indicadores Clave de Desempeño (KPIs)</h2>

            <div className="dashboard-grid">
                <div className="card-kpi">
                    <h3 className="card-title">Clientes Activos</h3>
                    <p className="card-value">{clientesActivos}</p>
                    <Users className="card-icon" />
                </div>
                <div className="card-kpi">
                    <h3 className="card-title">Proveedores Globales</h3>
                    <p className="card-value">{proveedoresGlobales}</p>
                    <Truck className="card-icon" />
                </div>
                <div className="card-kpi">
                    <h3 className="card-title">Pedidos en Curso</h3>
                    <p className="card-value">{pedidosEnCurso}</p>
                    <Package className="card-icon" />
                </div>

            </div>

            <hr />

            <h3 className="content-title">Resumen Operativo</h3>

            <div className="dashboard-grid">
                <div className="card-kpi" style={{ gridColumn: 'span 1' }}>
                    <h3 className="card-title">Distribución de Solicitudes (Gráfico)</h3>
                    <p className="card-value" style={{ fontSize: '1.5rem', marginTop: '10px' }}>
                        Pendientes: 12 | En Tránsito: 10 | Entregados: 5
                    </p>
                    <Activity className="card-icon" style={{ opacity: 0.1, width: '40px', height: '40px' }} />
                </div>
                <div className="card-kpi" style={{ gridColumn: 'span 1' }}>
                    <h3 className="card-title">Clientes vs. Proveedores (Gráfico)</h3>
                    <p className="card-value" style={{ fontSize: '1.5rem', marginTop: '10px' }}>
                        Ratio: 1.88 Clientes por Proveedor
                    </p>
                    <Users className="card-icon" style={{ opacity: 0.1, width: '40px', height: '40px' }} />
                </div>
            </div>

            <div className="content-area-placeholder">
                <p>Aquí se visualizarán gráficos y resúmenes operativos detallados como tendencia de pedidos, desempeño de proveedores o segmentación de clientes.</p>
            </div>

        </AppLayout>
    );
};
export default PanelPrincipal;