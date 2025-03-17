import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import GestionProductos from "../admin/GestionProductos";
import GestionPedidos from "../admin/GestionPedidos";
import GestionUsuarios from "../admin/GestionUsuarios"; // 🔹 Importar nueva sección

const AdminDashboard = () => {
    const { usuario } = useContext(AuthContext);
    const navigate = useNavigate();
    const [seccion, setSeccion] = useState("productos"); // Estado para alternar entre secciones

    // 🚀 Redirigir si no es admin
    useEffect(() => {
        if (!usuario || usuario.rol !== "admin") {
            navigate("/");
        }
    }, [usuario, navigate]);

    return (
        <div className="flex h-screen">
            {/* 🚀 Menú Lateral */}
            <aside className="w-64 bg-sky-900 text-white p-5">
                <h2 className="text-2xl font-bold text-center mb-6">Admin Panel</h2>
                <nav className="space-y-4">
                    <button
                        className={`w-full text-left px-4 py-2 rounded-lg ${
                            seccion === "productos" ? "bg-blue-500" : "hover:bg-blue-600"
                        }`}
                        onClick={() => setSeccion("productos")}
                    >
                        📦 Gestionar Productos
                    </button>
                    <button
                        className={`w-full text-left px-4 py-2 rounded-lg ${
                            seccion === "pedidos" ? "bg-green-500" : "hover:bg-green-600"
                        }`}
                        onClick={() => setSeccion("pedidos")}
                    >
                        📜 Gestionar Pedidos
                    </button>
                    <button
                        className={`w-full text-left px-4 py-2 rounded-lg ${
                            seccion === "usuarios" ? "bg-yellow-500" : "hover:bg-yellow-600"
                        }`}
                        onClick={() => setSeccion("usuarios")}
                    >
                        👥 Gestionar Usuarios
                    </button>
                    <button
                        className="w-48 text-left px-4 py-2 rounded-lg hover:bg-red-800 fixed bottom-5 left-6"
                        onClick={() => navigate("/")}
                    >
                        🛒 Volver a la tienda
                    </button>
                </nav>
            </aside>

            {/* 🚀 Contenido Dinámico */}
            <main className="flex-1 p-10 bg-gray-100 mt-5 pb-5">
                <h2 className="text-3xl font-bold text-sky-900 mb-8">
                    {seccion === "productos"
                        ? "Gestión de Productos"
                        : seccion === "pedidos"
                        ? "Gestión de Pedidos"
                        : "Gestión de Usuarios"}
                </h2>
                {seccion === "productos" && <GestionProductos />}
                {seccion === "pedidos" && <GestionPedidos />}
                {seccion === "usuarios" && <GestionUsuarios />}
            </main>
        </div>
    );
};

export default AdminDashboard;
