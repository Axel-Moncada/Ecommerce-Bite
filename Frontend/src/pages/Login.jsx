import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUsuario, registrarUsuario } from "../api";

import imagen1 from "../assets/img1.png"
import imagen2 from "../assets/img2.png"

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    // Estados para login y registro
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nombre, setNombre] = useState(""); // Solo para registro
    const [error, setError] = useState("");

    const handleAuth = async (e) => {
        e.preventDefault();
        setError("");

        if (isLogin) {

            // Iniciar sesión
            const data = await loginUsuario(email, password);
            if (data) {
                login(data.usuario, data.token);
                navigate(data.usuario.rol === "admin" ? "/admin" : "/cliente");
            } else {
                setError("Credenciales incorrectas");
            }
        } else {
            // Registrar usuario
            const data = await registrarUsuario(nombre, email, password);
            if (data) {
                login(data.usuario, data.token);
                navigate("/cliente");
            } else {
                setError("Error al registrar usuario.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-sky-900">
            <div className="bg-white shadow-lg rounded-lg p-10 flex w-full max-w-4xl">
                {/* Columna de Inicio de Sesión */}
                <div className={`w-1/2 p-6 ${isLogin ? "" : "opacity-100"}`}>
                    <h2 className="text-2xl font-bold text-center mb-4 text-sky-900">
                        {isLogin ? "Iniciar Sesión" : "Registro"}
                    </h2>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <form onSubmit={handleAuth} className="space-y-4">
                        {!isLogin && (
                            <input
                                type="text"
                                placeholder="Nombre completo"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg text-gray-700"
                                required
                            />
                        )}
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg text-gray-700"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg  text-gray-700"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
                        >
                            {isLogin ? "Iniciar Sesión" : "Registrarse"}
                        </button>
                    </form>
                    <p className="text-center mt-4 text-sky-800">
                        {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                        <br></br>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sky-800 hover:text-sky-600 font-bold text-xl"
                        >
                            {isLogin ? "Regístrate aquí" : "Inicia sesión aquí"}
                        </button>
                    </p>
                </div>

                {/* Imagen o diseño decorativo */}
                <div className="w-1/2 hidden md:flex items-center justify-center p-6 rounded-r-lg">
                    <h2 className="text-3xl font-bold text-center">
                        {isLogin ? (
                            <div>
                                <img
                                    src={imagen1}
                                    alt="Imagen de inicio de sesión"
                                    className="w-full h-50 object-contain rounded-lg"
                                />
                            </div>
                        ) : (
                            <div>
                                <img
                                    src={imagen2}
                                    alt="Imagen de inicio de sesión"
                                    className="w-full h-50 object-contain rounded-lg"
                                />
                            </div>
                        ) }
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default Login;
