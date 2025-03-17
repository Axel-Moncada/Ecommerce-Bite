import { useState, useEffect, useContext } from "react";
import { getProductos, agregarAlCarrito } from "./api";
import { AuthContext } from "./context/AuthContext";

const Products = () => {
    const { usuario } = useContext(AuthContext);
    const [productos, setProductos] = useState([]);
    const [mensaje, setMensaje] = useState(""); 

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await getProductos();
                setProductos(data);
            } catch (error) {
                console.error("❌ Error cargando los productos:", error);
            }
        };
        fetchProductos();
    }, []);

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
            setTimeout(() => setMensaje(""), 3000);
        } else {
            setMensaje("❌ Error al agregar producto.");
            setTimeout(() => setMensaje(""), 3000);
        }
    };

    return (
        <section className="max-w-7xl mx-auto py-10">
            <h2 className="text-3xl font-bold text-center text-sky-900 mb-8">
                Nuestros Productos
            </h2>

            {/* 📌 Notificación de éxito/error */}
            {mensaje && (
                <div className="fixed bottom-10 right-5 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300">
                    {mensaje}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                {productos.length > 0 ? (
                    productos.map((producto) => (
                        <div key={producto.id_producto} className="bg-white rounded-lg shadow-lg p-5 text-sky-800 ">
                            <img
                                src={producto.imagen || "/src/assets/default-product.jpg"}
                                alt={producto.nombre}
                                className="w-full h-40 object-contain rounded-lg"

                            />
                            <h3 className="text-lg font-bold mt-3 ">{producto.nombre}</h3>
                            <p className="text-sm text-gray-500">{producto.categoria || "Sin categoría"}</p>
                            <p className="text-gray-600">
                                {producto.descripcion.length > 100
                                    ? producto.descripcion.substring(0, 100) + "..."
                                    : producto.descripcion}
                            </p>
                            <p className="text-xl font-bold text-sky-800 mt-3">
                                {new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                    minimumFractionDigits: 0,
                                }).format(producto.precio)}
                            </p>
                            <button
                                onClick={() => handleAgregarCarrito(producto.id_producto)}
                                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                            >
                                Agregar al carrito
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600 text-lg">Cargando productos...</p>
                )}
            </div>
        </section>
    );
};

export default Products;
