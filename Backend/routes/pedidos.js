const express = require("express");
const db = require("../db");
const { verificarToken, verificarAdmin } = require("./middlewares");

const router = express.Router();

// 📌 Obtener todos los pedidos de un usuario autenticado
router.get("/", verificarToken, async (req, res) => {
    const id_usuario = req.user.id;

    try {
        const [pedidos] = await db.promise().query(
            `SELECT p.id_pedido, p.total, p.estado, p.fecha_pedido 
             FROM Pedidos p 
             WHERE p.id_usuario = ? 
             ORDER BY p.fecha_pedido DESC`,
            [id_usuario]
        );

        res.json(pedidos);
    } catch (error) {
        console.error("❌ Error al obtener los pedidos:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 📌 Obtener los detalles de un pedido específico
router.get("/:id_pedido", verificarToken, async (req, res) => {
    const { id_pedido } = req.params;

    try {
        const [detalles] = await db.promise().query(
            `SELECT dp.id_detalle, p.nombre, dp.cantidad, dp.precio_unitario
             FROM Detalles_Pedido dp
             JOIN Productos p ON dp.id_producto = p.id_producto
             WHERE dp.id_pedido = ?`,
            [id_pedido]
        );

        res.json(detalles);
    } catch (error) {
        console.error("❌ Error al obtener los detalles del pedido:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 📌 Crear un nuevo pedido con los productos del carrito
router.post("/", verificarToken, async (req, res) => {
    const id_usuario = req.user.id;

    try {
        // Obtener productos del carrito
        const [carrito] = await db.promise().query(
            `SELECT c.id_producto, c.cantidad, p.precio 
             FROM Carrito c 
             JOIN Productos p ON c.id_producto = p.id_producto 
             WHERE c.id_usuario = ?`,
            [id_usuario]
        );

        if (carrito.length === 0) {
            return res.status(400).json({ error: "El carrito está vacío" });
        }

        // Calcular total
        const total = carrito.reduce((acc, item) => acc + item.cantidad * item.precio, 0);

        // Insertar el pedido
        const [pedidoResult] = await db.promise().query(
            "INSERT INTO Pedidos (id_usuario, total, estado) VALUES (?, ?, 'pendiente')",
            [id_usuario, total]
        );

        const id_pedido = pedidoResult.insertId;

        // Insertar detalles del pedido
        const detalleQuery = `INSERT INTO Detalles_Pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)`;
        for (const item of carrito) {
            await db.promise().query(detalleQuery, [id_pedido, item.id_producto, item.cantidad, item.precio]);
        }

        // Vaciar el carrito después del pedido
        await db.promise().query("DELETE FROM Carrito WHERE id_usuario = ?", [id_usuario]);

        res.json({ message: "Pedido realizado exitosamente", id_pedido });
    } catch (error) {
        console.error("❌ Error al procesar el pedido:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 📌 Cambiar estado de un pedido (solo admin)
router.put("/:id_pedido/estado", verificarToken, verificarAdmin, async (req, res) => {
    const { id_pedido } = req.params;
    const { estado } = req.body;

    if (!estado) {
        return res.status(400).json({ error: "El campo 'estado' es requerido" });
    }

    const estadosPermitidos = ["pendiente", "procesado", "enviado", "entregado", "cancelado"];
    if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({ error: "Estado no válido" });
    }

    try {
        await db.promise().query("UPDATE Pedidos SET estado = ? WHERE id_pedido = ?", [estado, id_pedido]);
        res.json({ message: "Estado del pedido actualizado" });
    } catch (error) {
        console.error("❌ Error al actualizar estado del pedido:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 📌 Obtener todos los pedidos (solo admin)
router.get("/admin/todos", verificarToken, verificarAdmin, async (req, res) => {
    try {
        const [pedidos] = await db.promise().query(
            `SELECT p.id_pedido, u.nombre AS usuario, p.total, p.estado, p.fecha_pedido 
             FROM Pedidos p 
             JOIN Usuarios u ON p.id_usuario = u.id_usuario 
             ORDER BY p.fecha_pedido DESC`
        );

        res.json(pedidos);
    } catch (error) {
        console.error("❌ Error al obtener los pedidos:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = router;
