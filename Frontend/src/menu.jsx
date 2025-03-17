import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logoblanco from "./assets/Logoblanco.png";

const Menu = () => {
    const { usuario, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // 🚀 Determinar la ruta según el rol del usuario
    const handlePerfil = () => {
        if (!usuario) {
            navigate("/login");
        } else if (usuario.rol === "admin") {
            navigate("/admin");
        } else {
            navigate("/cliente");
        }
    };

    return (
        <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[80%] bg-sky-900/50 backdrop-blur-lg shadow-lg rounded-full py-4 px-8 flex items-center justify-between z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
                {/* 🚀 Logo */}
                <Link to="/">
                    <img src={logoblanco} alt="Logo" className="w-[100px] mx-8" />
                </Link>

                {/* 🚀 Enlaces */}
                <ul className="hidden md:flex space-x-8 text-white flex-1 justify-center mx-8">
                    <li><Link to="/" className="hover:text-blue-400">Inicio</Link></li>
                    <li><Link to="/categoria/Computadores" className="hover:text-blue-400">Computadores</Link></li>
                    <li><Link to="/categoria/Audifonos" className="hover:text-blue-400">Audífonos</Link></li>
                    <li><Link to="/categoria/Celulares" className="hover:text-blue-400">Celulares</Link></li>
                    
                </ul>

                {/* 🚀 Botones de Usuario */}
                <div className="flex items-center space-x-4">
                <a className=" "><Link to="/carrito" className="hover:text-blue-400 text-3xl">🛒</Link></a>
                    {usuario ? (
                        <>
                            <button 
                                onClick={handlePerfil}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
                            >
                                Mi Perfil
                            </button>
                            <button 
                                onClick={logout} 
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full">
                            Ingresar
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Menu;
