const jwt = require("jsonwebtoken");
const db = require("../db");

const verificarToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "Token requerido" });

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token inválido" });

    req.user = decoded;
    next();
  });
};

const verificarAdmin = (req, res, next) => {
  const { id } = req.user;

  db.query("SELECT rol FROM Usuarios WHERE id_usuario = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(403).json({ error: "Usuario no encontrado" });

    if (results[0].rol !== "admin") {
      return res.status(403).json({ error: "Acceso denegado. Se requiere rol de administrador." });
    }

    next();
  });
};

module.exports = { verificarToken, verificarAdmin };
