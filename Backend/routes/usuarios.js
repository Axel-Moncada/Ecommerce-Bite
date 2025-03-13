const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
require("dotenv").config();

const router = express.Router();




//  Registrar un nuevo usuario
router.post("/registro", async (req, res) => {
    const { nombre, email, contraseña } = req.body;




    // Verificar si el usuario ya existe
    db.query("SELECT * FROM Usuarios WHERE email = ?", [email], async (err, users) => {
        if (err) return res.status(500).json({ error: err.message });
        if (users.length > 0) return res.status(400).json({ error: "El usuario ya está registrado" });



        // Encriptar contraseña
        const hashPassword = await bcrypt.hash(contraseña, 10);




        // Insertar usuario en la base de datos
        db.query(
            "INSERT INTO Usuarios (nombre, email, contraseña) VALUES (?, ?, ?)",
            [nombre, email, hashPassword],
            (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Usuario registrado exitosamente" });
            }
        );
    });
});




// 📌 Iniciar sesión
router.post("/login", (req, res) => {
    const { email, contraseña } = req.body;



    // Buscar usuario en la base de datos
    db.query("SELECT * FROM Usuarios WHERE email = ?", [email], async (err, users) => {
        if (err) return res.status(500).json({ error: err.message });
        if (users.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });

        const user = users[0];



        // Verificar contraseña
        const validPassword = await bcrypt.compare(contraseña, user.contraseña);
        if (!validPassword) return res.status(401).json({ error: "Contraseña incorrecta" });



        // Generar token JWT
        const token = jwt.sign({ id: user.id_usuario, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "2h",
        });

        res.json({ token, usuario: { id: user.id_usuario, nombre: user.nombre, email: user.email } });
    });
});

module.exports = router;
