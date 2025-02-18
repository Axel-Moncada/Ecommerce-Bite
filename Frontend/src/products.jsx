
import { useState, useEffect } from "react";


const Products = () => {
    const [productos, setProductos] = useState([]);

    // Cargar datos del JSON
    useEffect(() => {
        fetch("/src/assets/products-json.json")
            .then((res) => res.json())
            .then((data) => setProductos(data))
            .catch((error) => console.error("Error cargando los productos:", error));
    }, []);

    return (
        <>
            <section className="max-w-7xl mx-auto py-10">
                <h2 className="text-3xl font-bold text-center text-sky-900 mb-8">
                    Nuestros Productos
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                    {productos.map((producto) => (
                        <div key={producto.id} className="bg-white rounded-lg shadow-lg p-5">
                            <img
                                src={producto.imagen}
                                alt={producto.nombre}
                                className="w-full h-40 object-contain rounded-lg"
                            />
                            <h3 className="text-lg font-semibold mt-3">{producto.nombre}</h3>
                            <p className="text-sm text-gray-500">{producto.categoria}</p>
                            <p className="text-gray-700 mt-2">{producto.descripcion}</p>
                            <p className="text-xl font-bold text-blue-600 mt-3">
                                ${producto.precio.toLocaleString("es-CO")} COP
                            </p>
                            <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
                                Agregar al carrito
                            </button>
                        </div>
                    ))}
                </div>
            </section>

        </>

    )
}

export default Products