# 🛒 Ecommerce **Bite** - Tienda Online

Este es un **proyecto universitario** desarrollado para la materia de **Backend** en la **Universidad Compensar**. Se trata de un **Ecommerce funcional**, que permite gestionar productos, realizar compras y administrar pedidos.

## 🚀 Tecnologías utilizadas

### 🔹 **Frontend**
- **React** ⚛️ - Para la construcción de la interfaz de usuario  
- **Vite** ⚡ - Para un desarrollo rápido y optimizado  
- **Tailwind CSS** 🎨 - Para el diseño y estilos  
- **React Router** 🔀 - Para la navegación entre páginas  
- **Axios** 🔄 - Para realizar peticiones al backend  

### 🔹 **Backend**
- **Node.js** 🟢 - Para la lógica del servidor  
- **Express.js** 🚀 - Para la creación de API REST  
- **MySQL / MariaDB** 🛢️ - Para la base de datos  
- **bcryptjs** 🔑 - Para el cifrado de contraseñas  
- **jsonwebtoken (JWT)** 🛡️ - Para la autenticación segura  

## 📌 Funcionalidades del Proyecto

✅ **Página de inicio con productos destacados**  
✅ **Registro e inicio de sesión de usuarios con JWT**  
✅ **Carrito de compras funcional**  
✅ **Gestión de productos (admin)**  
✅ **Gestión de pedidos (admin)**  
✅ **Cambio de estado de pedidos**  
✅ **Carga y visualización de imágenes de productos**  
✅ **Filtrado de productos por categorías**  
✅ **Notificaciones de productos agregados al carrito**  

## 🛠 Instalación y ejecución

Si quieres probar el proyecto en tu computadora, sigue estos pasos:

### **1️⃣ Clonar el repositorio**
```bash
git clone https://github.com/Axel-Moncada/Ecommerce-Bite.git
```

### **2️⃣ Entrar en la carpeta del proyecto**
```bash
cd Ecommerce-Bite
```

### **3️⃣ Configurar el backend**
#### 📌 Variables de entorno
Crea un archivo `.env` en la carpeta del backend con las siguientes variables:
```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=ecommerce
JWT_SECRET=tu_secreto
```

#### 📌 Instalar dependencias del backend
```bash
cd backend
npm install
```

#### 📌 Ejecutar el servidor backend
```bash
npm start
```

### **4️⃣ Configurar el frontend**
#### 📌 Instalar dependencias del frontend
```bash
cd ../frontend
npm install
```

#### 📌 Ejecutar el proyecto frontend
```bash
npm run dev
```

## 🔥 Próximos pasos

- 🛍️ **Optimización del carrito de compras**  
- 📦 **Implementación de pagos online (PayPal/Stripe)**  
- 📊 **Dashboard para visualizar estadísticas de ventas**  
- 🔄 **Optimización de la gestión de productos e imágenes**  

---

📌 **Desarrollado por:** Axel Moncada🚀

