import img1 from './assets/img-1.png'

function Slider() {

    return (
        <>

            <section className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-40">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">

                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-sm text-gray-300 max-w-sm">  Explora nuestra selección de dispositivos inteligentes diseñados para mejorar tu día a día.</p>
                        <h1 className="text-5xl font-bold leading-tight mt-2">
                            Innovación al Alcance de Tu Mano
                        </h1>
                        <button className="mt-6 border border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
                            🚀 Descubrir Ahora
                        </button>
                    </div>


                    <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
                        <img
                            src={img1} 
                            alt="Smart Device"
                            className="max-w-md drop-shadow-lg"
                        />
                    </div>
                </div>
            </section>


        </>
    )


}

export default Slider