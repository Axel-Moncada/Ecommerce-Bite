import axios from "axios";

const API_URL = "http://localhost:3001/api";

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


// 📌 Obtener productos
export const getProductos = async () => {
    try {
        const response = await api.get("/productos");
        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener productos:", error);
        return [];
    }
};

// 📌 Obtener carrito de un usuario
export const getCarrito = async (id_usuario) => {
    try {
        const response = await api.get(`/carrito/${id_usuario}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener el carrito:", error);
        return [];
    }
};

// 📌 Agregar producto al carrito
export const agregarAlCarrito = async (id_usuario, id_producto, cantidad) => {
    try {
        const response = await api.post("/carrito/agregar", { id_usuario, id_producto, cantidad });
        return response.data;
    } catch (error) {
        console.error("❌ Error al agregar al carrito:", error);
        return null;
    }
};

//  Eliminar producto del carrito
export const eliminarDelCarrito = async (id_usuario, id_producto) => {
    try {
        const response = await api.delete("/carrito/eliminar", { data: { id_usuario, id_producto } });
        return response.data;
    } catch (error) {
        console.error("❌ Error al eliminar del carrito:", error);
        return null;
    }
};

//  Realizar pedido
export const realizarPedido = async (nombre, total, token) => {
    try {
        const response = await fetch(`http://localhost:3001/api/pedidos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ nombre, total }),
        });

        if (!response.ok) {
            throw new Error("Error al realizar el pedido.");
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Error al realizar el pedido:", error);
        return null;
    }
};



// 📌 Iniciar sesión
export const loginUsuario = async (email, password) => {
    try {

        const response = await axios.post("http://localhost:3001/api/usuarios/login", { email, password });

        return response.data;
    } catch (error) {
        console.error("❌ Error en loginUsuario:", error);
        throw error;
    }
};

// 📌 Registrar usuario
export const registrarUsuario = async (nombre, email, password) => {
    try {
        const response = await api.post("/usuarios/registro", { nombre, email, password });
        return response.data;
    } catch (error) {
        console.error("❌ Error en registrarUsuario:", error);
        return null;
    }
};

// 📌 Obtener detalles del usuario
export const getUsuario = async (token) => {
    try {
        const response = await api.get("/usuarios/perfil", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener usuario:", error);
        return null;
    }
};

// 📌 Cerrar sesión (solo para limpiar localStorage en frontend)
export const logoutUsuario = () => {
    localStorage.removeItem("token");
};


// 📌 Obtener usuarios
export const getUsuarios = async (token) => {
    try {
        const response = await fetch("http://localhost:3001/api/usuarios", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return await response.json();
    } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);
        return [];
    }
};

// 📌 Eliminar usuario
export const eliminarUsuario = async (id_usuario, token) => {
    try {
        const response = await fetch(`http://localhost:3001/api/usuarios/${id_usuario}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.ok;
    } catch (error) {
        console.error("❌ Error al eliminar usuario:", error);
        return false;
    }
};
export default api;



export const agregarProducto = async (producto, token) => {
    try {
        const respuesta = await fetch("http://localhost:3001/api/productos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(producto),
        });

        if (!respuesta.ok) {
            throw new Error("Error al agregar el producto");
        }

        return await respuesta.json();
    } catch (error) {
        console.error("❌ Error en agregarProducto:", error);
        return null;
    }
};

export const eliminarProducto = async (id_producto) => {
    try {
        const respuesta = await fetch(`http://localhost:3001/api/productos/${id_producto}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!respuesta.ok) {
            throw new Error("Error al eliminar el producto");
        }

        return true;
    } catch (error) {
        console.error("❌ Error en eliminarProducto:", error);
        return false;
    }
};

export const actualizarProducto = async (id, producto, token) => {
    try {
        const res = await axios.put(`http://localhost:3001/api/productos/${id}`, producto, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (error) {
        console.error("❌ Error al actualizar producto:", error);
        return null;
    }
};








export const getDetallesPedido = async (id_pedido, token) => {
    try {
        const response = await fetch(`http://localhost:3001/api/pedidos/${id_pedido}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener los detalles del pedido.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("❌ Error en getDetallesPedido:", error);
        return null;
    }
};


export const actualizarEstadoPedido = async (id_pedido, nuevoEstado, token) => {
    try {
        const response = await fetch(`http://localhost:3001/api/pedidos/${id_pedido}/estado`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ estado: nuevoEstado }),
        });

        if (!response.ok) {
            throw new Error("Error al actualizar el estado del pedido.");
        }

        return true;
    } catch (error) {
        console.error("❌ Error en actualizarEstadoPedido:", error);
        return false;
    }
};


export const getPedidos = async (token) => {
    console.log("🔍 Token antes de obtener pedidos:", token);
    try {
        const response = await fetch("http://localhost:3001/api/pedidos/admin/todos", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error("Error al obtener los pedidos");
        return await response.json();
    } catch (error) {
        console.error("❌ Error en getPedidos:", error);
        return [];
    }
};



export const getProductosPorCategoria = async (categoria) => {
    try {
        const response = await fetch(`http://localhost:3001/api/productos/categoria/${categoria}`);
        if (!response.ok) {
            throw new Error("Error al obtener productos por categoría");
        }
        return await response.json();
    } catch (error) {
        console.error("❌ Error en getProductosPorCategoria:", error);
        return [];
    }
};