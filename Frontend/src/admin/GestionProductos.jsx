import { useState, useEffect, useContext } from "react";
import { getProductos, agregarProducto, eliminarProducto, actualizarProducto } from "../api";
import { AuthContext } from "../context/AuthContext";

// Lista de categorías predefinidas
const categoriasDisponibles = ["Computadores", "Celulares", "Audífonos", "Accesorios"];

const GestionProductos = () => {
    const { token } = useContext(AuthContext);
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [productoEditando, setProductoEditando] = useState(null);
    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria: "",
        imagen: "",
    });

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await getProductos();
                setProductos(data);
            } catch (error) {
                console.error("❌ Error al cargar productos:", error);
            } finally {
                setCargando(false);
            }
        };
        fetchProductos();
    }, []);

    const handleChange = (e) => {
        setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
    };

    // Manejo de carga de imagen
    const handleImagenChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setNuevoProducto({ ...nuevoProducto, imagen: reader.result });
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleGuardarProducto = async (e) => {
        e.preventDefault();
        if (!nuevoProducto.categoria) {
            alert("Por favor selecciona una categoría.");
            return;
        }

        if (productoEditando) {
            // 🛠️ Editar producto existente
            const actualizado = await actualizarProducto(productoEditando.id_producto, nuevoProducto, token);
            if (actualizado) {
                setProductos(productos.map(p => (p.id_producto === productoEditando.id_producto ? nuevoProducto : p)));
                setProductoEditando(null);
                setNuevoProducto({ nombre: "", descripcion: "", precio: "", stock: "", categoria: "", imagen: "" });
            }
        } else {
            // 🆕 Agregar nuevo producto
            const productoCreado = await agregarProducto(nuevoProducto, token);
            if (productoCreado) {
                setProductos([...productos, productoCreado]);
                setNuevoProducto({ nombre: "", descripcion: "", precio: "", stock: "", categoria: "", imagen: "" });
            }
        }
    };

    // 🚀 Cargar datos en formulario para editar
    const handleEditar = (producto) => {
        setProductoEditando(producto);
        setNuevoProducto({ ...producto });
    };

    // 🚮 Eliminar producto
    const handleEliminar = async (id_producto) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

        const eliminado = await eliminarProducto(id_producto, token);
        if (eliminado) {
            setProductos(productos.filter((p) => p.id_producto !== id_producto));
            console.log("✅ Producto eliminado");
        } else {
            console.error("❌ Error al eliminar producto.");
        }
    };

    return (
        <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-2xl font-semibold mb-2 text-sky-700">📦 Administración de Productos</h3>
            <p className="text-sky-700 mb-4">Aquí podrás agregar, editar y eliminar productos.</p>

            {/* 🚀 Formulario para agregar/editar productos */}
            <form onSubmit={handleGuardarProducto} className="bg-gray-100 p-4 rounded-lg mb-6 text-sky-700">
                <h4 className="text-lg font-semibold mb-3 text-gray-700">
                    {productoEditando ? "✏️ Editar Producto" : "➕ Agregar Nuevo Producto"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="nombre" value={nuevoProducto.nombre} onChange={handleChange} placeholder="Nombre del producto" required className="border p-2 rounded-lg w-full" />
                    <input type="text" name="descripcion" value={nuevoProducto.descripcion} onChange={handleChange} placeholder="Descripción" required className="border p-2 rounded-lg w-full" />
                    <input type="number" name="precio" value={nuevoProducto.precio} onChange={handleChange} placeholder="Precio" required className="border p-2 rounded-lg w-full" />
                    <input type="number" name="stock" value={nuevoProducto.stock} onChange={handleChange} placeholder="Stock" required className="border p-2 rounded-lg w-full" />

                    {/* 🚀 Select para categoría */}
                    <select name="categoria" value={nuevoProducto.categoria} onChange={handleChange} required className="border p-2 rounded-lg w-full">
                        <option value="">Seleccionar Categoría</option>
                        {categoriasDisponibles.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {/* 📸 Carga de Imagen */}
                    <input type="file" accept="image/*" onChange={handleImagenChange} className="border p-2 rounded-lg w-full" />
                    {nuevoProducto.imagen && <img src={nuevoProducto.imagen} alt="Vista previa" className="w-24 h-24 object-cover mt-2 rounded-lg" />}
                </div>

                <button className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg">
                    {productoEditando ? "Guardar Cambios" : "Agregar Producto"}
                </button>

                {/* 🔄 Botón para cancelar edición */}
                {productoEditando && (
                    <button
                        type="button"
                        onClick={() => {
                            setProductoEditando(null);
                            setNuevoProducto({ nombre: "", descripcion: "", precio: "", stock: "", categoria: "", imagen: "" });
                        }}
                        className="mt-4 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg ml-4"
                    >
                        Cancelar Edición
                    </button>
                )}
            </form>

            {/* 🚀 Tabla de productos */}
            {cargando ? (
                <p className="text-gray-600">Cargando productos...</p>
            ) : productos.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-sky-700 text-white">
                            <th className="border border-gray-300 p-2">Nombre</th>
                            <th className="border border-gray-300 p-2">Categoría</th>
                            <th className="border border-gray-300 p-2">Precio</th>
                            <th className="border border-gray-300 p-2">Stock</th>
                            <th className="border border-gray-300 p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.id_producto} className="text-center text-sky-900">
                                <td className="border border-gray-300 p-2">{producto.nombre}</td>
                                <td className="border border-gray-300 p-2">{producto.categoria || "Sin categoría"}</td>
                                <td className="border border-gray-300 p-2">${producto.precio}</td>
                                <td className="border border-gray-300 p-2">{producto.stock}</td>
                                <td className="border border-gray-300 p-2">
                                    <button onClick={() => handleEditar(producto)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg">
                                        ✏️ Editar
                                    </button>
                                    <button onClick={() => handleEliminar(producto.id_producto)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg ml-2">
                                        ❌ Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-600">No hay productos registrados.</p>
            )}
        </div>
    );
};

export default GestionProductos;
