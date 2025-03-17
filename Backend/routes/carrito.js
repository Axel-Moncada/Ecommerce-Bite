const express = require("express");
const db = require("../db");
const router = express.Router();

// 📌 Obtener el carrito de un usuario
router.get("/:id_usuario", async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const [carrito] = await db.promise().query(
            "SELECT Carrito.id_producto, Productos.nombre, Productos.precio, Carrito.cantidad " +
            "FROM Carrito INNER JOIN Productos ON Carrito.id_producto = Productos.id_producto " +
            "WHERE Carrito.id_usuario = ?",
            [id_usuario]
        );
        res.json(carrito);
    } catch (error) {
        console.error("❌ Error al obtener el carrito:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 📌 Agregar un producto al carrito
router.post("/agregar", async (req, res) => {
    const { id_usuario, id_producto, cantidad } = req.body;

    if (!id_usuario || !id_producto || cantidad <= 0) {
        return res.status(400).json({ error: "Todos los campos son requeridos y cantidad debe ser mayor a 0" });
    }

    try {
        // Verificar si el producto ya está en el carrito
        const [existe] = await db.promise().query(
            "SELECT * FROM Carrito WHERE id_usuario = ? AND id_producto = ?",
            [id_usuario, id_producto]
        );

        if (existe.length > 0) {
            // Si existe, actualizar cantidad
            await db.promise().query(
                "UPDATE Carrito SET cantidad = cantidad + ? WHERE id_usuario = ? AND id_producto = ?",
                [cantidad, id_usuario, id_producto]
            );
        } else {
            // Si no existe, agregar nuevo producto al carrito
            await db.promise().query(
                "INSERT INTO Carrito (id_usuario, id_producto, cantidad) VALUES (?, ?, ?)",
                [id_usuario, id_producto, cantidad]
            );
        }

        res.json({ mensaje: "Producto agregado al carrito" });
    } catch (error) {
        console.error("❌ Error al agregar al carrito:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 📌 Eliminar un producto del carrito
router.delete("/eliminar", async (req, res) => {
    const { id_usuario, id_producto } = req.body;

    if (!id_usuario || !id_producto) {
        return res.status(400).json({ error: "ID de usuario y producto requeridos" });
    }

    try {
        await db.promise().query(
            "DELETE FROM Carrito WHERE id_usuario = ? AND id_producto = ?",
            [id_usuario, id_producto]
        );
        res.json({ mensaje: "Producto eliminado del carrito" });
    } catch (error) {
        console.error("❌ Error al eliminar producto:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = router;
