const express = require("express");
const db = require("../db");
const jwt = require("jsonwebtoken");

const router = express.Router();

// verificar el token
const verificarToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ error: "Token requerido" });
    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Token inválido" });

        req.user = decoded;
        next();
    });
};

//  Obtener todos los productos
router.get("/", (req, res) => {
    db.query("SELECT * FROM Productos", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

//  Agregar un nuevo producto (Solo admins)
router.post("/", verificarToken, (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;

    db.query(
        "INSERT INTO Productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)",
        [nombre, descripcion, precio, stock],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Producto agregado exitosamente" });
        }
    );
});

//  Editar un producto (Solo admins)
router.put("/:id", verificarToken, (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;

    db.query(
        "UPDATE Productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id_producto = ?",
        [nombre, descripcion, precio, stock, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Producto actualizado exitosamente" });
        }
    );
});

//  Eliminar un producto (Solo admins)
router.delete("/:id", verificarToken, (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM Productos WHERE id_producto = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Producto eliminado exitosamente" });
    });
});

module.exports = router;
