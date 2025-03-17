import { useState, useEffect, useContext } from "react";
import { getUsuarios, eliminarUsuario } from "../api";
import { AuthContext } from "../context/AuthContext";

const GestionUsuarios = () => {
    const { token } = useContext(AuthContext);
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchUsuarios = async () => {
            const data = await getUsuarios(token);
            setUsuarios(data);
            setCargando(false);
        };
        fetchUsuarios();
    }, [token]);

    const handleEliminar = async (id_usuario) => {
        if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;

        const eliminado = await eliminarUsuario(id_usuario, token);
        if (eliminado) {
            setUsuarios(usuarios.filter((u) => u.id_usuario !== id_usuario));
            console.log("✅ Usuario eliminado");
        } else {
            console.error("❌ Error al eliminar usuario.");
        }
    };

    return (
        <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-2xl font-semibold mb-2 text-sky-700">👤 Gestión de Usuarios</h3>
            <p className="text-sky-700 mb-4">Aquí puedes ver y eliminar usuarios registrados.</p>

            {cargando ? (
                <p className="text-gray-600">Cargando usuarios...</p>
            ) : usuarios.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-sky-700 text-white">
                            <th className="border border-gray-300 p-2">ID</th>
                            <th className="border border-gray-300 p-2">Nombre</th>
                            <th className="border border-gray-300 p-2">Email</th>
                            <th className="border border-gray-300 p-2">Rol</th>
                            <th className="border border-gray-300 p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id_usuario} className="text-center text-sky-900">
                                <td className="border border-gray-300 p-2">{usuario.id_usuario}</td>
                                <td className="border border-gray-300 p-2">{usuario.nombre}</td>
                                <td className="border border-gray-300 p-2">{usuario.email}</td>
                                <td className="border border-gray-300 p-2">{usuario.rol}</td>
                                <td className="border border-gray-300 p-2">
                                    <button 
                                        onClick={() => handleEliminar(usuario.id_usuario)} 
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg">
                                        ❌ Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-600">No hay usuarios registrados.</p>
            )}
        </div>
    );
};

export default GestionUsuarios;
