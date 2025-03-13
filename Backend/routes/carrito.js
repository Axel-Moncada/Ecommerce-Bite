const express = require("express");
const db = require("../db");
const jwt = require("jsonwebtoken");

const router = express.Router();

// verifico el token
const verificarToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ error: "Token requerido" });

    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Token inválido" });

        req.user = decoded;
        next();
    });
};

//  Obtener el carrito del usuario
router.get("/", verificarToken, (req, res) => {
    const id_usuario = req.user.id;

    db.query(
        `SELECT c.id_producto, p.nombre, p.precio, c.cantidad
     FROM Carrito c
     JOIN Productos p ON c.id_producto = p.id_producto
     WHERE c.id_usuario = ?`,
        [id_usuario],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
});

// Agregar un producto al carrito
router.post("/", verificarToken, (req, res) => {
    const id_usuario = req.user.id;
    const { id_producto, cantidad } = req.body;

    // Verificar si el producto ya está en el carrito no se puede volver a agregar
    db.query(
        "SELECT * FROM Carrito WHERE id_usuario = ? AND id_producto = ?",
        [id_usuario, id_producto],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length > 0) {
                // Si ya está en el carrito, actualizar la cantidad
                db.query(
                    "UPDATE Carrito SET cantidad = cantidad + ? WHERE id_usuario = ? AND id_producto = ?",
                    [cantidad, id_usuario, id_producto],
                    (err, result) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ message: "Cantidad actualizada en el carrito" });
                    }
                );
            } else {
                // Si no está en el carrito, agregarlo
                db.query(
                    "INSERT INTO Carrito (id_usuario, id_producto, cantidad) VALUES (?, ?, ?)",
                    [id_usuario, id_producto, cantidad],
                    (err, result) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ message: "Producto agregado al carrito" });
                    }
                );
            }
        }
    );
});

//  Modificar la cantidad de un producto en el carrito
router.put("/", verificarToken, (req, res) => {
    const id_usuario = req.user.id;
    const { id_producto, cantidad } = req.body;

    db.query(
        "UPDATE Carrito SET cantidad = ? WHERE id_usuario = ? AND id_producto = ?",
        [cantidad, id_usuario, id_producto],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Cantidad actualizada en el carrito" });
        }
    );
});

//  Eliminar un producto del carrito
router.delete("/:id_producto", verificarToken, (req, res) => {
    const id_usuario = req.user.id;
    const { id_producto } = req.params;

    db.query(
        "DELETE FROM Carrito WHERE id_usuario = ? AND id_producto = ?",
        [id_usuario, id_producto],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Producto eliminado del carrito" });
        }
    );
});

module.exports = router;
