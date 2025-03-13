const express = require("express");
const db = require("../db");
const jwt = require("jsonwebtoken");

const router = express.Router();

// 📌 Middleware para verificar el token
const verificarToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ error: "Token requerido" });

    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Token inválido" });

        req.user = decoded;
        next();
    });
};

// 📌 Obtener los pedidos de un usuario
router.get("/", verificarToken, (req, res) => {
    const id_usuario = req.user.id;

    db.query(
        "SELECT * FROM Pedidos WHERE id_usuario = ? ORDER BY fecha_pedido DESC",
        [id_usuario],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
});

// 📌 Obtener los detalles de un pedido específico
router.get("/:id_pedido", verificarToken, (req, res) => {
    const { id_pedido } = req.params;

    db.query(
        `SELECT dp.id_detalle, p.nombre, dp.cantidad, dp.precio_unitario
     FROM Detalles_Pedido dp
     JOIN Productos p ON dp.id_producto = p.id_producto
     WHERE dp.id_pedido = ?`,
        [id_pedido],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
});

// 📌 Crear un nuevo pedido con los productos del carrito
router.post("/", verificarToken, (req, res) => {
    const id_usuario = req.user.id;

    // Obtener los productos del carrito con precios correctos
    db.query(
        `SELECT c.id_producto, c.cantidad, p.precio 
     FROM Carrito c 
     JOIN Productos p ON c.id_producto = p.id_producto 
     WHERE c.id_usuario = ?`,
        [id_usuario],
        (err, carrito) => {
            if (err) return res.status(500).json({ error: err.message });

            if (carrito.length === 0) {
                return res.status(400).json({ error: "El carrito está vacío" });
            }

            // Validar que todos los productos tengan precio válido
            let total = 0;
            for (const item of carrito) {
                if (!item.precio || isNaN(item.precio)) {
                    return res.status(400).json({ error: `El producto con ID ${item.id_producto} tiene un precio inválido` });
                }
                total += item.cantidad * item.precio;
            }

            // Crear el pedido
            db.query(
                "INSERT INTO Pedidos (id_usuario, total, estado) VALUES (?, ?, 'pendiente')",
                [id_usuario, total],
                (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });

                    const id_pedido = result.insertId;

                    // Insertar los detalles del pedido
                    const detalles = carrito.map((item) => [id_pedido, item.id_producto, item.cantidad, item.precio]);

                    db.query(
                        "INSERT INTO Detalles_Pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES ?",
                        [detalles],
                        (err) => {
                            if (err) return res.status(500).json({ error: err.message });

                            // Vaciar el carrito después del pedido
                            db.query("DELETE FROM Carrito WHERE id_usuario = ?", [id_usuario], (err) => {
                                if (err) return res.status(500).json({ error: err.message });

                                res.json({ message: "Pedido realizado exitosamente", id_pedido });
                            });
                        }
                    );
                }
            );
        }
    );
});

module.exports = router;
