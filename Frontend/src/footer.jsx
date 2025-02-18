
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Logo y descripción */}
        <div>
          <h2 className="text-2xl font-bold">BiteStore</h2>
          <p className="text-sm text-gray-400 mt-2">
            Tu tienda de tecnología con los mejores productos al mejor precio.
          </p>
        </div>

        

        <div className="mx-auto">
          <h3 className="text-lg font-semibold">Síguenos</h3>
          <div className="flex space-x-4 mt-3">
            <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaFacebookF /></a>
            <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaTwitter /></a>
            <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaInstagram /></a>
            <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaYoutube /></a>
          </div>
        </div>
      </div>

      
    </footer>
  );
};

export default Footer;
