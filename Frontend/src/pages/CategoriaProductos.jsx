import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getProductosPorCategoria, agregarAlCarrito } from "../api";
import { AuthContext } from "../context/AuthContext";

const CategoriaProductos = () => {
    const { usuario } = useContext(AuthContext);
    const { categoria } = useParams();
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await getProductosPorCategoria(categoria);
                setProductos(data);
            } catch (error) {
                console.error("❌ Error al cargar productos por categoría:", error);
            } finally {
                setCargando(false);
            }
        };
        fetchProductos();
    }, [categoria]);

    const handleAgregarCarrito = async (id_producto) => {
        if (!usuario) {
            setMensaje("⚠️ Debes iniciar sesión para agregar productos al carrito.");
            setTimeout(() => setMensaje(""), 3000);
            return;
        }

        console.log("🛒 Agregando producto:", { id_producto, usuario: usuario.id_usuario, cantidad: 1 });

        const resultado = await agregarAlCarrito(usuario.id_usuario, id_producto, 1);
        if (resultado) {
            setMensaje("✅ Producto agregado al carrito.");
        } else {
            setMensaje("❌ Error al agregar producto.");
        }
        setTimeout(() => setMensaje(""), 3000);
    };

    return (
        <div className="max-w-6xl mx-auto py-10 mt-28">
            <h2 className="text-3xl font-bold text-sky-900 text-center mb-8">
                {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
            </h2>

            {/* 📌 Notificación de éxito/error */}
            {mensaje && (
                <div className="fixed bottom-10 right-5 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300">
                    {mensaje}
                </div>
            )}

            {cargando ? (
                <p className="text-gray-600 text-center">Cargando productos...</p>
            ) : productos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {productos.map((producto) => (
                        <div key={producto.id_producto} className="bg-white p-6 rounded-lg shadow-lg flex">
                            <img
                                src={producto.imagen}
                                alt={producto.nombre}
                                className="w-48 h-48 object-contain rounded-lg"
                            />
                            <div className="ml-6 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-sky-900">{producto.nombre}</h3>
                                    <p className="text-gray-700 mt-2">{producto.descripcion}</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-blue-600 mt-4">
                                        {new Intl.NumberFormat("es-CO", {
                                            style: "currency",
                                            currency: "COP",
                                            minimumFractionDigits: 0,
                                        }).format(producto.precio)}
                                    </p>
                                    <button
                                        onClick={() => handleAgregarCarrito(producto.id_producto)}
                                        className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
                                    >
                                        🛒 Agregar al carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-center">No hay productos disponibles en esta categoría.</p>
            )}
        </div>
    );
};

export default CategoriaProductos;
