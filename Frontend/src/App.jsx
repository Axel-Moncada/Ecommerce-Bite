import { Routes, Route } from "react-router-dom";
import Menu from "./menu.jsx";
import Slider from "./slider.jsx";
import Products from "./products.jsx";
import Footer from "./footer.jsx";
import Carrito from "./pages/carrito";
import Login from "./pages/Login";
import ClienteDashboard from "./pages/Clientedashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout.jsx";
import CompraExitosa from "./pages/CompraExitosa.jsx";
import CategoriaProductos from "./pages/CategoriaProductos";



const App = () => {
  return (
    <>
      
      <Routes>
        <Route path="/" element={<>
          <Menu />
          <Slider />
          <Products />
          <Footer />
        </>} />
        <Route path="/carrito" element={<>
          <Menu />
          <Menu />
          <Menu />
          <Carrito />
        </>
        } />

        <Route path="/login" element={<>
          <Menu />
          <Login />
        </>
        } />

        <Route path="/cliente" element={<>
          <Menu />
          <Menu />
          <Menu />
          <ClienteDashboard />
        </>
        } />

        <Route path="/admin" element={<>
          <AdminDashboard />
        </>
        } />

        <Route path="/Checkout" element={<>
          <Menu />
          <Menu />
          <Menu />
          <Checkout />
        </>
        } />

        <Route path="/compra-exitosa" element={<CompraExitosa />} />

        <Route path="/categoria/:categoria" element={<>
        <Menu />
        <Menu /><Menu />
          <CategoriaProductos />
          </>
          } />

      </Routes>

      
    </>
  );
};

export default App;
