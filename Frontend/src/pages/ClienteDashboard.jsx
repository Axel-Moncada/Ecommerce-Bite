import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

const  ClienteDashboard = () => {
    const { usuario } = useContext(AuthContext);

    return (
        <div className="max-w-4xl mx-auto py-10 mt-32">
            <h2 className="text-3xl font-bold text-center text-sky-900 mb-8">
                Mi Perfil
            </h2>
            {usuario ? (
                <div className="bg-white p-6 shadow-lg rounded-lg text-sky-800">
                    <p className="text-lg font-semibold">👤 Nombre: {usuario.nombre}</p>
                    <p className="text-lg">📧 Email: {usuario.email}</p>
                    
                    <p className="text-lg">🔑 Rol: {usuario.rol}</p>
                </div>
            ) : (
                <p className="text-center text-red-500">Debes iniciar sesión para ver tu perfil.</p>
            )}
        </div>
    );
};

export default ClienteDashboard;
