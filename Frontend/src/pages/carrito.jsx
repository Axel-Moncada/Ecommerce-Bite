import { useState, useEffect, useContext } from "react";
import { getCarrito, eliminarDelCarrito } from "../api";
import { AuthContext } from "../context/AuthContext";
import carritoimg from "../assets/carritovacio.png";
import { useNavigate } from "react-router-dom";

const Carrito = () => {
    const navigate = useNavigate();
    const { usuario, token } = useContext(AuthContext);
    const [carrito, setCarrito] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        console.log("🛒 Componente Carrito montado");

        if (usuario?.id_usuario && token) {
            const fetchCarrito = async () => {
                try {
                    const data = await getCarrito(usuario.id_usuario);
                    console.log("📦 Datos recibidos del carrito:", data);

                    if (Array.isArray(data)) {
                        setCarrito(data);
                        calcularTotal(data);
                    } else {
                        console.error("⚠️ Error: la API no devolvió un array");
                        setCarrito([]);
                    }
                } catch (error) {
                    console.error("❌ Error al obtener el carrito:", error);
                }
            };
            fetchCarrito();
        }
    }, [usuario?.id_usuario, token]);

    // 📌 Función para calcular el total
    const calcularTotal = (productos) => {
        if (!Array.isArray(productos)) return;
        const totalCalculado = productos.reduce((acc, item) => acc + item.cantidad * item.precio, 0);
        setTotal(totalCalculado);
    };

    const handleEliminar = async (id_producto) => {
        console.log("🗑 Eliminando producto con ID:", id_producto);

        if (!usuario?.id_usuario) {
            console.warn("⚠️ No puedes eliminar productos sin estar autenticado.");
            return;
        }

        const resultado = await eliminarDelCarrito(usuario.id_usuario, id_producto);
        if (resultado) {
            const nuevoCarrito = carrito.filter((item) => item.id_producto !== id_producto);
            setCarrito(nuevoCarrito);
            calcularTotal(nuevoCarrito);
        }
    };

    return (
        <section className="max-w-7xl mx-auto py-10 mt-32">
            <h2 className="text-3xl font-bold text-center text-sky-900 mb-8">
                Mi Carrito
            </h2>

            {carrito.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {carrito.map((item) => (
                        <div key={item.id_producto} className="flex justify-between items-center bg-white p-5 shadow-lg rounded-lg">
                            <div>
                                <img src={item.imagen} alt="" width={100} />
                                <h3 className="text-lg font-semibold text-sky-800">{item.nombre}</h3>
                                <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                                <p className="text-xl font-bold text-blue-600 mt-2">
                                    ${item.precio.toLocaleString("es-CO")} COP
                                </p>
                            </div>
                            <button
                                onClick={() => handleEliminar(item.id_producto)}
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                    <div className="text-right mt-6">
                        <h3 className="text-2xl font-bold text-gray-800">
                            Total: ${total.toLocaleString("es-CO")} COP
                        </h3>
                    </div>

                    <button
                        onClick={() => navigate("/checkout")}
                        className="mt-6 w-100 bg-green-700 hover:bg-green-600 text-white py-2 px-4 text-2xl rounded-lg m-auto font-bold"
                    >
                        Finalizar Compra
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <div className="w-full max-w-md">
                        <img
                            className="w-full h-auto object-contain"
                            src={carritoimg}
                            alt="Carrito vacío"
                            width={500}
                        />
                    </div>
                    <p className="text-center text-gray-600 text-lg mt-4">
                        Tu carrito está vacío.
                    </p>
                </div>
            )}
        </section>
    );
};

export default Carrito;
