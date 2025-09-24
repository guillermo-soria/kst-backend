import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t border-kst-lime/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image 
                src="/logo.svg" 
                alt="KST Store Logo" 
                width={32} 
                height={32}
                className="hover:animate-neon-pulse"
              />
              <h3 className="text-xl font-bold text-white">KST Store</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Especialistas en remeras estampadas desde 2025. Diseños únicos que expresan tu personalidad con la mejor calidad.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-kst-lime transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-kst-magenta transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.161-1.499-.69-2.436-2.878-2.436-4.632 0-3.78 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.840-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-kst-pink transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg text-kst-lime">Enlaces Rápidos</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors duration-300">Inicio</Link></li>
              <li><Link href="/productos" className="hover:text-kst-magenta transition-colors duration-300">Remeras</Link></li>
              <li><Link href="/contacto" className="hover:text-kst-pink transition-colors duration-300">Contacto</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors duration-300">Sobre Nosotros</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg text-kst-magenta">Soporte</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/ayuda" className="hover:text-white transition-colors duration-300">Centro de Ayuda</Link></li>
              <li><Link href="/envios" className="hover:text-kst-lime transition-colors duration-300">Información de Envíos</Link></li>
              <li><Link href="/devoluciones" className="hover:text-kst-pink transition-colors duration-300">Devoluciones</Link></li>
              <li><Link href="/tallas" className="hover:text-white transition-colors duration-300">Guía de Tallas</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg text-kst-pink">Contacto</h4>
            <div className="text-gray-400 space-y-3">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-kst-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@kststore.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-kst-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+57 300 123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-kst-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Bogotá, Colombia</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-kst-lime/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; 2025 KST Store. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
            <Link href="/privacidad" className="hover:text-kst-lime transition-colors duration-300">Política de Privacidad</Link>
            <Link href="/terminos" className="hover:text-kst-magenta transition-colors duration-300">Términos de Uso</Link>
            <Link href="/cookies" className="hover:text-kst-pink transition-colors duration-300">Política de Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
