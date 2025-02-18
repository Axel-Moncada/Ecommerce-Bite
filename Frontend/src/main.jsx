import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Menu from './menu.jsx'
import Slider from './slider.jsx'
import Products from './products.jsx'
import Footer from './footer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Menu />
    <Slider />
    <Products />
    <Footer />
  </StrictMode>,
)
