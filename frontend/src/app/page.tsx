import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Header currentPage="home" />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-transparent to-pink-500/10 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Remeras que 
              <span className="text-green-400"> BRILLAN</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
              Diseños únicos y estampados de alta calidad que destacan en cualquier ocasión. 
              <span className="text-purple-400">Tu estilo, nuestra pasión.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/productos" className="bg-green-400 text-black px-8 py-4 rounded-lg font-black hover:bg-purple-500 hover:shadow-lg hover:shadow-green-400/50 transition-all duration-300 text-lg transform hover:scale-105 shadow-md border-2 border-green-400">
                VER REMERAS ✨
              </Link>
              <button className="border-2 border-pink-500 text-pink-500 px-8 py-4 rounded-lg font-bold hover:bg-pink-500 hover:text-black transition-all duration-300 text-lg">
                Diseños Personalizados
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-dark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              ¿Por qué elegir <span className="text-purple-400">KST Store</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Somos especialistas en remeras estampadas con diseños que marcan la diferencia
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg bg-gradient-to-br from-dark-50 to-dark-100 border border-green-400/20 hover:border-green-400/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Estampados de Calidad</h3>
              <p className="text-gray-400">Utilizamos técnicas de estampado de última generación que garantizan durabilidad y colores vibrantes</p>
            </div>

            <div className="text-center p-8 rounded-lg bg-gradient-to-br from-dark-50 to-dark-100 border border-purple-400/20 hover:border-purple-400/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Diseños Únicos</h3>
              <p className="text-gray-400">Creamos diseños exclusivos que no encontrarás en ningún otro lugar. Tu estilo, tu personalidad</p>
            </div>

            <div className="text-center p-8 rounded-lg bg-gradient-to-br from-dark-50 to-dark-100 border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Envío Express</h3>
              <p className="text-gray-400">Envío rápido y seguro. Recibe tus remeras en 24-48 horas en Bogotá</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview Section */}
      <section className="py-20 bg-gradient-to-b from-dark-100 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Remeras <span className="text-green-400">Destacadas</span>
            </h2>
            <p className="text-xl text-gray-400">
              Descubre nuestros diseños más populares
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { name: "Neon Vibes", price: 45000, design: "Retro" },
              { name: "Street Art", price: 48000, design: "Urbano" },
              { name: "Cyber Punk", price: 52000, design: "Futurista" }
            ].map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-dark-50 to-dark-100 rounded-xl shadow-lg overflow-hidden hover:shadow-neon-magenta transition-all duration-300 transform hover:-translate-y-2 group border border-gray-800">
                <div className="h-64 bg-gradient-to-br from-green-400/20 to-purple-500/20 flex items-center justify-center relative overflow-hidden">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-16 h-16 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {item.design}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">{item.name}</h3>
                  <p className="text-gray-400 mb-4">Diseño exclusivo con estampado de alta calidad en algodón premium.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-purple-400">${item.price.toLocaleString()}</span>
                    <button className="bg-green-400 text-black px-4 py-2 rounded-lg font-black hover:bg-purple-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      COMPRAR
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/productos" className="bg-gradient-to-r from-kst-magenta to-kst-pink text-white px-8 py-4 rounded-lg font-black hover:shadow-neon-magenta transition-all duration-300 inline-block transform hover:scale-105 shadow-lg">
              VER TODAS LAS REMERAS
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-transparent to-pink-500/10 animate-pulse"></div>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            ¿Listo para destacar con tu <span className="text-green-400">estilo único</span>?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Únete a miles de personas que ya visten remeras KST y marcan la diferencia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/productos" className="bg-green-400 text-black px-8 py-4 rounded-lg font-black hover:bg-purple-500 hover:shadow-lg hover:shadow-green-400/50 transition-all duration-300 inline-block transform hover:scale-105">
              EXPLORAR CATÁLOGO
            </Link>
            <Link href="/contacto" className="border-2 border-pink-400 text-pink-400 px-8 py-4 rounded-lg font-bold hover:bg-pink-400 hover:text-black transition-all duration-300 text-lg">
              Diseño Personalizado
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
