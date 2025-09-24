import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage = "" }: HeaderProps) {
  return (
    <header className="bg-black shadow-lg border-b border-primary-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <Image 
                    src="/logo.svg" 
                    alt="KST Store Logo" 
                    width={40} 
                    height={40}
                    className="group-hover:animate-neon-pulse transition-all duration-300"
                  />
                </div>
                <h1 className="text-2xl font-bold text-white group-hover:text-kst-lime transition-colors duration-300">
                  KST Store
                </h1>
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className={`hover:text-kst-lime transition-colors duration-300 ${
              currentPage === 'home' ? 'text-kst-lime font-semibold' : 'text-gray-300'
            }`}>
              Inicio
            </Link>
            <Link href="/productos" className={`hover:text-kst-magenta transition-colors duration-300 ${
              currentPage === 'productos' ? 'text-kst-magenta font-semibold' : 'text-gray-300'
            }`}>
              Remeras
            </Link>
            <Link href="/contacto" className={`hover:text-kst-pink transition-colors duration-300 ${
              currentPage === 'contacto' ? 'text-kst-pink font-semibold' : 'text-gray-300'
            }`}>
              Contacto
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-gray-300 hover:text-kst-lime p-2 transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="text-gray-300 hover:text-kst-pink p-2 transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className="bg-gradient-to-r from-kst-lime to-kst-magenta text-black px-4 py-2 rounded-lg hover:shadow-neon-lime transition-all duration-300 relative font-semibold">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13M7 13l-2.58 10M15 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6M15 13V9a6 6 0 10-12 0v4" />
                </svg>
                <span>Carrito</span>
                <span className="bg-kst-pink text-white text-xs px-1.5 py-0.5 rounded-full font-bold shadow-neon-pink">0</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
