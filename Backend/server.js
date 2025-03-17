const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");


const app = express();

const middlewares = require("./routes/middlewares"); 
const pedidosRoutes = require("./routes/pedidos");
const usuariosRoutes = require("./routes/usuarios"); 
const productosRoutes = require("./routes/productos");
const carritoRoutes = require("./routes/carrito");  




app.use(cors());
app.use(express.json());


app.use("/api/usuarios", usuariosRoutes);
app.use("/api/productos", productosRoutes); 
app.use("/api/carrito", carritoRoutes);
app.use("/api/pedidos", pedidosRoutes); 




// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente 🚀");
});



// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
