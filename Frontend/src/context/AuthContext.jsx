import { createContext, useState, useEffect } from "react";
import { loginUsuario } from "../api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    const login = (usuario, token) => {
        setUsuario(usuario);
        setToken(token);
        localStorage.setItem("token", token);
    };
    

    const logout = () => {
        setUsuario(null);
        setToken("");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ usuario, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider; // ✅ Exportación corregida
