import logoblanco from './assets/Logoblanco.png'

function Menu () {
    return (
        
        <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[80%] bg-sky-900/50 backdrop-blur-lg shadow-lg rounded-full py-4 px-8 flex items-center justify-between z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="text-xl font-bold mx-2xl">
                <img src={logoblanco} alt="Logo" className="w-[100px] mx-8" />
                </div>

                {/* Enlaces */}
                <ul className="hidden md:flex space-x-8 text-white flex-1 justify-center mx-8">
                    <li className="group relative cursor-pointer">
                        <a href="#" className="hover:text-blue-400">Inicio</a>
                    </li>
                    <li className="group relative cursor-pointer">
                        <a href="#" className="hover:text-blue-400">Computadores</a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-blue-400">Audifonos</a>
                    </li>
                    <li className="group relative cursor-pointer">
                        <a href="#" className="hover:text-blue-400">Celulares</a>
                    </li>
                    
                </ul>

                {/* Botones */}
                <div className="flex items-center space-x-4">
                    
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full">
                        Ingresar 
                    </button>
                </div>
            </div>
        </nav>
        
    );
};

export default Menu;
