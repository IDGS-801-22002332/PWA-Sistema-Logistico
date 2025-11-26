import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../services/api'; // Asegúrate que la ruta sea correcta

/**
 * Hook para obtener la lista de proveedores desde la API.
 * @returns {{proveedores: Array<{id: number, nombre: string}>, loading: boolean, error: string|null, fetchProveedores: Function}}
 */
export const useProveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProveedores = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiGet('/proveedores');
            // Mapeamos la respuesta para adaptarla al formato {id: number, nombre: string} que necesita la UI de Tarifas
            const mappedProveedores = data.map(p => ({
                id: p.id_proveedor, // ID numérico
                nombre: p.nombre_empresa, // Nombre de la empresa
                // Puedes agregar más campos si son necesarios en el futuro
            }));
            setProveedores(mappedProveedores);
        } catch (err) {
            console.error("Error al obtener la lista de proveedores:", err);
            setError("No se pudo cargar la lista de proveedores desde la API.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProveedores();
    }, [fetchProveedores]);

    return { proveedores, loading, error, fetchProveedores };
};