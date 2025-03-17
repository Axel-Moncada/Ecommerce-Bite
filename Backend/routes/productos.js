const express = require("express");
const db = require("../db");
const { verificarToken, verificarAdmin } = require("./middlewares");

const router = express.Router();

router.post("/", verificarToken, verificarAdmin, async (req, res) => {
    const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;

    if (!nombre || !descripcion || !precio || !stock || !categoria || !imagen) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        const [result] = await db.promise().query(
            "INSERT INTO Productos (nombre, descripcion, precio, stock, categoria, imagen) VALUES (?, ?, ?, ?, ?, ?)",
            [nombre, descripcion, precio, stock, categoria, imagen]
        );

        const nuevoProducto = { id_producto: result.insertId, nombre, descripcion, precio, stock, categoria, imagen };
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error("❌ Error al agregar producto:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

router.get("/", (req, res) => {
    db.query("SELECT * FROM Productos", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


router.put("/:id", verificarToken, verificarAdmin, async (req, res) => {
    const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;
    const { id } = req.params;

    if (!nombre || !descripcion || !precio || !stock || !categoria) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        const precioFinal = parseFloat(precio);
        await db.promise().query(
            "UPDATE Productos SET nombre=?, descripcion=?, precio=?, stock=?, categoria=?, imagen=? WHERE id_producto=?",
            [nombre, descripcion, precioFinal, stock, categoria, imagen || "default.jpg", id]
        );

        res.json({ message: "Producto actualizado exitosamente" });
    } catch (error) {
        console.error("❌ Error al actualizar producto:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});


router.delete("/:id_producto", verificarToken, verificarAdmin, (req, res) => {
    const { id_producto } = req.params;

    db.query("DELETE FROM Productos WHERE id_producto = ?", [id_producto], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Producto no encontrado" });

        res.json({ message: "Producto eliminado correctamente" });
    });
});

// 📌 Obtener productos por categoría
router.get("/categoria/:categoria", async (req, res) => {
    const { categoria } = req.params;
    try {
        const [productos] = await db.promise().query(
            "SELECT * FROM Productos WHERE categoria = ?",
            [categoria]
        );
        res.json(productos);
    } catch (error) {
        console.error("❌ Error al obtener productos por categoría:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = router;
