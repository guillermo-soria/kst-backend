import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

export default function Productos() {
  // Datos de ejemplo de remeras - en el futuro conectaremos con la API de MedusaJS
  const productos = [
    {
      id: 1,
      nombre: "Neon Dreams",
      precio: 45000,
      descripcion: "Remera con estampado fluorescente que brilla en la oscuridad. Diseño exclusivo cyberpunk.",
      imagen: "/remera-neon.jpg",
      categoria: "Neón"
    },
    {
      id: 2,
      nombre: "Street Vibes", 
      precio: 48000,
      descripcion: "Diseño urbano inspirado en el arte callejero. Estampado de alta calidad en algodón premium.",
      imagen: "/remera-street.jpg",
      categoria: "Urbano"
    },
    {
      id: 3,
      nombre: "Retro Wave",
      precio: 42000,
      descripcion: "Estética retro de los 80s con colores vibrantes. Perfecta para destacar.",
      imagen: "/remera-retro.jpg",
      categoria: "Retro"
    },
    {
      id: 4,
      nombre: "Cyber Punk",
      precio: 52000,
      descripcion: "Diseño futurista con efectos holográficos. Edición limitada.",
      imagen: "/remera-cyber.jpg",
      categoria: "Futurista"
    },
    {
      id: 5,
      nombre: "Galaxy Print",
      precio: 46000,
      descripcion: "Estampado galáctico con efectos 3D. Tela ultra suave.",
      imagen: "/remera-galaxy.jpg",
      categoria: "Espacial"
    },
    {
      id: 6,
      nombre: "Neon Tiger",
      precio: 49000,
      descripcion: "Tigre estilizado con colores neón. Diseño que no pasa desapercibido.",
      imagen: "/remera-tiger.jpg",
      categoria: "Animal"
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header currentPage="productos" />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Nuestras <span className="text-green-400">Remeras</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Descubre nuestra colección de remeras con diseños únicos y estampados de alta calidad
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gradient-to-b from-black to-gray-900 border-b border-green-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-gradient-to-r from-green-400 to-purple-500 text-black rounded-full text-sm font-bold shadow-lg shadow-green-400/50 hover:shadow-purple-500/50 transition-all duration-300">
                Todas
              </button>
              <button className="px-4 py-2 bg-gray-800 text-gray-300 border border-green-400/20 rounded-full text-sm font-medium hover:border-green-400 hover:text-green-400 transition-all duration-300">
                Neón
              </button>
              <button className="px-4 py-2 bg-gray-800 text-gray-300 border border-purple-500/20 rounded-full text-sm font-medium hover:border-purple-500 hover:text-purple-400 transition-all duration-300">
                Urbano
              </button>
              <button className="px-4 py-2 bg-gray-800 text-gray-300 border border-pink-500/20 rounded-full text-sm font-medium hover:border-pink-500 hover:text-pink-400 transition-all duration-300">
                Retro
              </button>
              <button className="px-4 py-2 bg-gray-800 text-gray-300 border border-green-400/20 rounded-full text-sm font-medium hover:border-green-400 hover:text-green-400 transition-all duration-300">
                Futurista
              </button>
            </div>
            <select className="px-4 py-2 bg-gray-800 border border-purple-500/20 text-gray-300 rounded-lg text-sm hover:border-purple-500 focus:border-purple-500 focus:outline-none">
              <option value="newest">Más Recientes</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="popular">Más Populares</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productos.map((producto) => (
              <ProductCard
                key={producto.id}
                id={producto.id}
                nombre={producto.nombre}
                precio={producto.precio}
                descripcion={producto.descripcion}
                imagen={producto.imagen}
                categoria={producto.categoria}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Contáctanos y te ayudamos a encontrar el producto perfecto para ti
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacto" className="bg-green-400 text-black px-8 py-4 rounded-lg font-bold hover:bg-green-300 transition-colors text-lg inline-block shadow-lg hover:shadow-green-400/50">
              Contactar Ahora
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-purple-600 transition-colors text-lg">
              Ver Catálogo Completo
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
