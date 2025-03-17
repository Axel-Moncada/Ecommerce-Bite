import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CompraExitosa = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate("/");
        }, 5000);
    }, [navigate]);

    return (
        <section className="max-w-7xl mx-auto py-10 text-center">
            <h2 className="text-3xl font-bold text-green-600">¡Compra Exitosa! 🎉</h2>
            <p className="text-lg text-gray-700">Gracias por tu compra. Serás redirigido a la página principal.</p>
        </section>
    );
};

export default CompraExitosa;
