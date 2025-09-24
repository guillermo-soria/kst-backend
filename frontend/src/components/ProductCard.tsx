interface ProductCardProps {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
  categoria: string;
}

export default function ProductCard({ id, nombre, precio, descripcion, imagen, categoria }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'neón': return 'from-green-400 to-purple-500';
      case 'urbano': return 'from-purple-500 to-pink-500';
      case 'retro': return 'from-pink-500 to-green-400';
      case 'futurista': return 'from-green-400 to-cyan-400';
      case 'espacial': return 'from-purple-500 to-green-400';
      case 'animal': return 'from-pink-500 to-purple-500';
      default: return 'from-green-400 to-purple-500';
    }
  };

  return (
    <div className="bg-gradient-to-br from-dark-50 to-dark-100 rounded-xl shadow-lg overflow-hidden hover:shadow-neon-magenta transition-all duration-300 transform hover:-translate-y-2 group border border-gray-800 hover:border-kst-lime/50">
      <div className="relative h-64 bg-gradient-to-br from-black to-dark-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-32 h-32 bg-gradient-to-br ${getCategoryColor(categoria)} rounded-2xl flex items-center justify-center shadow-neon-lime group-hover:animate-neon-pulse`}>
            <svg className="w-16 h-16 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2z" />
            </svg>
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {categoria}
          </span>
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-black/80 text-pink-400 hover:text-green-400 p-2 rounded-full shadow-md transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
            {nombre}
          </h3>
          <div className="flex items-center space-x-1 text-purple-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {descripcion}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-purple-400">
              {formatPrice(precio)}
            </span>
            <span className="text-xs text-green-400">Envío gratis</span>
          </div>
          
          <div className="flex space-x-2">
            <button className="bg-black/80 text-kst-lime hover:bg-kst-lime/20 hover:text-kst-magenta border border-kst-lime/30 hover:border-kst-lime p-2 rounded-lg transition-all duration-300 hover:shadow-neon-lime">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button className="bg-green-400 text-black px-4 py-2 rounded-lg font-black hover:bg-purple-500 hover:shadow-lg transition-all duration-300 flex items-center space-x-2 transform hover:scale-105">
              <svg className="w-5 h-5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13M7 13l-2.58 10M15 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6M15 13V9a6 6 0 10-12 0v4" />
              </svg>
              <span className="font-black text-sm">COMPRAR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
