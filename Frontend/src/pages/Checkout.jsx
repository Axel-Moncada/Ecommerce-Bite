import { useState, useEffect, useContext } from "react";
import { getCarrito, realizarPedido } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";






const Checkout = () => {
    const { usuario, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [carrito, setCarrito] = useState([]);
    const [total, setTotal] = useState(0);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        if (!usuario) {
            navigate("/login");
            return;
        }

        const fetchCarrito = async () => {
            try {
                const data = await getCarrito(usuario.id_usuario);
                setCarrito(data);
                calcularTotal(data);
            } catch (error) {
                console.error("❌ Error al obtener el carrito:", error);
            }
        };
        fetchCarrito();
    }, [usuario, navigate]);

    const calcularTotal = (productos) => {
        if (!Array.isArray(productos)) return;
        const totalCalculado = productos.reduce((acc, item) => acc + item.cantidad * item.precio, 0);
        setTotal(totalCalculado);
    };

    const handleConfirmarCompra = async () => {
        if (carrito.length === 0) {
            setMensaje("⚠️ No tienes productos en el carrito.");
            setTimeout(() => setMensaje(""), 3000);
            return;
        }
    
        console.log("🛒 Enviando pedido con token:", token);
    
        const resultado = await realizarPedido(usuario.id_usuario, total, token); 
        if (resultado) {
            setMensaje("✅ Compra realizada con éxito. Redirigiendo...");
            setTimeout(() => {
                navigate("/compra-exitosa");
            }, 3000);
        } else {
            setMensaje("❌ Error al procesar la compra.");
        }
    };

    return (
        <section className="max-w-4xl mx-auto py-10 mt-28">
            <h2 className="text-3xl font-bold text-center text-sky-900 mb-8">Finalizar Compra</h2>

            {mensaje && (
                <div className="fixed bottom-5 right-5 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300">
                    {mensaje}
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-lg text-sky-900">
                <h3 className="text-xl font-semibold mb-4">Resumen de Compra</h3>
                {carrito.length > 0 ? (
                    <ul>
                        {carrito.map((item) => (
                            <li key={item.id_producto} className="flex justify-between border-b py-2">
                                <span>{item.nombre} x{item.cantidad}</span>
                                <span className="font-bold">${(item.cantidad * item.precio).toLocaleString("es-CO")} COP</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-600">Tu carrito está vacío.</p>
                )}

                <h3 className="text-2xl font-bold text-right mt-4">Total: ${total.toLocaleString("es-CO")} COP</h3>
                
                <button
                    onClick={handleConfirmarCompra}
                    className="mt-6 w-full bg-green-700 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-bold"
                >
                    Confirmar Compra
                </button>
            </div>
        </section>
    );
};

export default Checkout;
