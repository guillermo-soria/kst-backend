import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Contacto() {
  return (
    <div className="min-h-screen bg-black">
      <Header currentPage="contacto" />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contáctanos
          </h1>
          <p className="text-xl text-green-400 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Ponte en contacto con nuestro equipo
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl shadow-green-400/20 p-8 border border-green-400/20">
              <h2 className="text-2xl font-bold text-white mb-6">Envíanos un mensaje</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-green-400 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 bg-gray-800 border border-green-400/30 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white placeholder-gray-400"
                    placeholder="Tu nombre completo"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-green-400 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 bg-gray-800 border border-green-400/30 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white placeholder-gray-400"
                    placeholder="tu@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-green-400 mb-2">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 bg-gray-800 border border-green-400/30 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white placeholder-gray-400"
                    placeholder="+57 300 123 4567"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-green-400 mb-2">
                    Asunto
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 bg-gray-800 border border-green-400/30 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white"
                  >
                    <option value="" className="text-gray-400">Selecciona un asunto</option>
                    <option value="consulta-general">Consulta general</option>
                    <option value="diseño-personalizado">Diseño personalizado</option>
                    <option value="pedidos-mayoristas">Pedidos mayoristas</option>
                    <option value="soporte-tecnico">Soporte técnico</option>
                    <option value="reclamo">Reclamo o devolución</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-green-400 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-800 border border-green-400/30 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white placeholder-gray-400"
                    placeholder="Escribe tu mensaje aquí..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-400 to-purple-500 text-black px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-green-400/50 transition-all duration-300 transform hover:scale-105"
                >
                  Enviar mensaje
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl shadow-purple-500/20 p-8 border border-purple-500/20">
                <h2 className="text-2xl font-bold text-white mb-6">Información de contacto</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-400/50">
                      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-400">Dirección</h3>
                      <p className="text-gray-300">Carrera 15 #93-07, Chapinero<br />Bogotá, Colombia</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/50">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-400">Teléfono</h3>
                      <p className="text-gray-300">+57 (1) 234-5678<br />+57 300 123 4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-green-400 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-pink-500/50">
                      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-400">Email</h3>
                      <p className="text-gray-300">info@kststore.com<br />soporte@kststore.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-400/50">
                      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-400">Horarios</h3>
                      <p className="text-gray-300">Lunes a Viernes: 8:00 AM - 7:00 PM<br />Sábados: 9:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl shadow-pink-500/20 p-8 border border-pink-500/20">
                <h2 className="text-2xl font-bold text-white mb-6">Preguntas frecuentes</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-purple-400 mb-2">¿Cuál es el tiempo de entrega?</h3>
                    <p className="text-gray-300 text-sm">Los pedidos se entregan entre 1-3 días hábiles en Bogotá y 3-5 días en otras ciudades principales.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-purple-400 mb-2">¿Tienen garantía los productos?</h3>
                    <p className="text-gray-300 text-sm">Sí, todas nuestras remeras tienen garantía de 30 días desde la fecha de compra.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-purple-400 mb-2">¿Hacen diseños personalizados?</h3>
                    <p className="text-gray-300 text-sm">¡Por supuesto! Creamos diseños únicos para remeras personalizadas. Contáctanos para más detalles.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-purple-400 mb-2">¿Qué métodos de pago aceptan?</h3>
                    <p className="text-gray-300 text-sm">Aceptamos tarjetas de crédito/débito, PSE, Nequi, Daviplata y pago contra entrega.</p>
                  </div>
                </div>
              </div>
              
              {/* CTA Section */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                <div className="relative text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    ¿Necesitas un <span className="text-green-400">diseño personalizado</span>?
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Creamos remeras únicas con tus ideas. ¡Contactanos para presupuestos especiales!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/productos" className="bg-gradient-to-r from-green-400 to-purple-500 text-black px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-green-400/50 transition-all duration-300 transform hover:scale-105">
                      Ver Remeras
                    </Link>
                    <Link href="/" className="border-2 border-pink-400 text-pink-400 px-6 py-3 rounded-lg font-bold hover:bg-pink-400 hover:text-black transition-all duration-300">
                      Volver al Inicio
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
