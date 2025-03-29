const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
require("dotenv").config();

const router = express.Router();

// 📌 Registrar un nuevo usuario
router.post("/registro", async (req, res) => {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
        console.error("❌ Error: Datos faltantes en el registro.");
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        //  Verificar si el usuario ya existe
        const [existingUser] = await db.promise().query(
            "SELECT id_usuario FROM Usuarios WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: "El usuario ya está registrado" });
        }

        //  Encriptar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //  Insertar usuario
        const [newUser] = await db.promise().query(
            "INSERT INTO Usuarios (nombre, email, contraseña, rol) VALUES (?, ?, ?, 'cliente')",
            [nombre, email, hashedPassword]
        );

        //  Obtener el usuario recién creado
        const [usuario] = await db.promise().query(
            "SELECT id_usuario, nombre, email, rol FROM Usuarios WHERE email = ?",
            [email]
        );

        //  Crear token JWT
        const token = jwt.sign(
            { id: usuario[0].id_usuario, email, rol: "cliente" },
            process.env.JWT_SECRET || "secreto",
            { expiresIn: "24h" }
        );

        console.log("✅ Usuario registrado correctamente:", usuario[0]);

        res.status(201).json({ usuario: usuario[0], token });
    } catch (error) {
        console.error("❌ Error en el registro:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 📌 Iniciar sesión
router.post("/login", async (req, res) => {
    console.log("🔍 Datos recibidos en el backend:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña son obligatorios" });
    }

    try {
        // 🔍 Buscar usuario
        const [rows] = await db.promise().query(
            "SELECT id_usuario, nombre, email, rol, contraseña FROM Usuarios WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        const usuario = rows[0];

        // 🔑 Verificar contraseña
        const contraseñaValida = await bcrypt.compare(password, usuario.contraseña);

        if (!contraseñaValida) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        // 🔐 Crear token JWT
        const token = jwt.sign(
            { id: usuario.id_usuario, rol: usuario.rol },
            process.env.JWT_SECRET || "secreto",
            { expiresIn: "2h" }
        );

        console.log("✅ Usuario autenticado:", usuario);
        res.json({
            token,
            usuario: { id_usuario: usuario.id_usuario, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
        });

    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 📌 Obtener todos los usuarios (solo admin)
router.get("/", async (req, res) => {
    try {
        const [usuarios] = await db.promise().query("SELECT id_usuario, nombre, email, rol FROM Usuarios");
        res.json(usuarios);
    } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 📌 Eliminar usuario (solo admin)
router.delete("/:id_usuario", async (req, res) => {
    const { id_usuario } = req.params;

    try {
        await db.promise().query("DELETE FROM Usuarios WHERE id_usuario = ?", [id_usuario]);
        res.json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        console.error("❌ Error al eliminar usuario:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 📌 Actualizar usuario (admin o el propio usuario)
router.put("/:id_usuario", async (req, res) => {
    const { id_usuario } = req.params;
    const { nombre, email, password } = req.body;

    if (!nombre && !email && !password) {
        return res.status(400).json({ error: "Debe proporcionar al menos un campo para actualizar" });
    }

    try {
        // Obtener el usuario actual
        const [result] = await db.promise().query("SELECT * FROM Usuarios WHERE id_usuario = ?", [id_usuario]);

        if (result.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const usuarioActual = result[0];

        // Si se envió password, encriptarla
        let hashedPassword = usuarioActual.contraseña;
        if (password) {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(password, saltRounds);
        }

        // Actualizar el usuario
        await db.promise().query(
            "UPDATE Usuarios SET nombre = ?, email = ?, contraseña = ? WHERE id_usuario = ?",
            [
                nombre || usuarioActual.nombre,
                email || usuarioActual.email,
                hashedPassword,
                id_usuario
            ]
        );

        res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        console.error("❌ Error al actualizar usuario:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = router;
