import { useState, useEffect, useContext } from "react";
import { getPedidos, actualizarEstadoPedido, getDetallesPedido } from "../api";
import { AuthContext } from "../context/AuthContext";

const estadosPermitidos = ["pendiente", "procesado", "enviado", "entregado", "cancelado"];

const GestionPedidos = () => {
    const { token } = useContext(AuthContext);
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [detallesPedido, setDetallesPedido] = useState([]);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const data = await getPedidos(token);
                setPedidos(data);
            } catch (error) {
                console.error("❌ Error al cargar pedidos:", error);
            } finally {
                setCargando(false);
            }
        };
        fetchPedidos();
    }, [token]);

    // 📌 Función para cambiar el estado del pedido
    const handleActualizarEstado = async (id_pedido, nuevoEstado) => {
        const actualizado = await actualizarEstadoPedido(id_pedido, nuevoEstado, token);
        if (actualizado) {
            setPedidos(pedidos.map((p) =>
                p.id_pedido === id_pedido ? { ...p, estado: nuevoEstado } : p
            ));
            console.log("✅ Estado actualizado correctamente");
        } else {
            console.error("❌ Error al actualizar estado.");
        }
    };

    // 📌 Obtener detalles de un pedido
    const handleVerDetalles = async (id_pedido) => {
        try {
            const data = await getDetallesPedido(id_pedido, token);
            setDetallesPedido(data);
            setPedidoSeleccionado(id_pedido);
        } catch (error) {
            console.error("❌ Error al obtener detalles del pedido:", error);
        }
    };

    return (
        <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-2xl font-semibold mb-2 text-sky-700">📦 Gestión de Pedidos</h3>
            <p className="text-sky-700 mb-4">Aquí puedes gestionar los pedidos de los clientes.</p>

            {cargando ? (
                <p className="text-gray-600">Cargando pedidos...</p>
            ) : pedidos.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-sky-700 text-white">
                            <th className="border border-gray-300 p-2">ID</th>
                            <th className="border border-gray-300 p-2">Fecha</th>
                            <th className="border border-gray-300 p-2">Total</th>
                            <th className="border border-gray-300 p-2">Estado</th>
                            <th className="border border-gray-300 p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map((pedido) => (
                            <tr key={pedido.id_pedido} className="text-center text-sky-900">
                                <td className="border border-gray-300 p-2">{pedido.id_pedido}</td>
                                <td className="border border-gray-300 p-2">
                                    {new Date(pedido.fecha_pedido).toLocaleString("es-CO", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        timeZone: "America/Bogota"
                                    })}
                                </td>
                                <td className="border border-gray-300 p-2 font-bold text-blue-600">

                                {new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                    minimumFractionDigits: 0,
                                }).format(pedido.total)}
                                    
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <select
                                        className="border p-1 rounded-lg"
                                        value={pedido.estado}
                                        onChange={(e) => handleActualizarEstado(pedido.id_pedido, e.target.value)}
                                    >
                                        {estadosPermitidos.map((estado) => (
                                            <option key={estado} value={estado}>{estado}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <button onClick={() => handleVerDetalles(pedido.id_pedido)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg">
                                        📄 Ver Detalles
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-600">No hay pedidos registrados.</p>
            )}

            {/* 📌 Modal para mostrar detalles del pedido */}
            {pedidoSeleccionado && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <h3 className="text-xl font-semibold mb-4 text-sky-700">
                            🛒 Detalles del Pedido #{pedidoSeleccionado}
                        </h3>
                        {detallesPedido.length > 0 ? (
                            <ul className="space-y-2">
                                {detallesPedido.map((detalle) => (
                                    <li key={detalle.id_detalle} className="flex justify-between border-b pb-2 text-sky-900">
                                        <span>{detalle.nombre} (x{detalle.cantidad})</span>
                                        <span className="font-bold">${detalle.precio_unitario.toLocaleString("es-CO")}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">No hay detalles disponibles.</p>
                        )}
                        <button
                            onClick={() => setPedidoSeleccionado(null)}
                            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full">
                            ❌ Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionPedidos;
