import React from 'react';
import AppLayout from "../Layout/AppLayout";
import { Users, Truck, Package } from 'lucide-react';

const PanelPrincipal = () => {
    return (
        <AppLayout activeLink="/panel">

            <h2 className="content-title">Indicadores Clave de Desempeño (KPIs)</h2>

            <div className="dashboard-grid">

                <div className="card-kpi">
                    <h3 className="card-title">Clientes Activos</h3>
                    <p className="card-value">0</p>
                    <Users className="card-icon" />
                </div>

                <div className="card-kpi">
                    <h3 className="card-title">Proveedores Globales</h3>
                    <p className="card-value">0</p>
                    <Truck className="card-icon" />
                </div>

                <div className="card-kpi">
                    <h3 className="card-title">Pedidos en Curso</h3>
                    <p className="card-value">0</p>
                    <Package className="card-icon" />
                </div>

            </div>

            <div className="content-area-placeholder">
                <p>Aquí se visualizarán gráficos y resúmenes operativos detallados.</p>
            </div>

        </AppLayout>
    );
};

export default PanelPrincipal;
