import { Sparkles } from 'lucide-react';

export default function Hero() {
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre os serviços.', '_blank');
  };

  return (
    <div className="relative bg-gradient-to-br from-pink-50 via-white to-pink-50 min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2YwNjI5MiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mb-6 shadow-lg animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Realce sua beleza<br />
            <span className="text-pink-500">com quem entende de cuidado</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transforme sua experiência de beleza com nossos serviços premium de cabelo, unhas, estética e muito mais.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={scrollToServices}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Ver Serviços
            </button>

            <button
              onClick={scrollToBooking}
              className="w-full sm:w-auto px-8 py-4 bg-white text-pink-600 border-2 border-pink-500 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-pink-50 hover:scale-105 transition-all duration-300"
            >
              📅 Agendar Agora
            </button>

            <button
              onClick={openWhatsApp}
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-gray-800 hover:scale-105 transition-all duration-300"
            >
              💬 WhatsApp
            </button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-500 mb-1">5+</div>
              <div className="text-sm text-gray-600">Anos de experiência</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-500 mb-1">2k+</div>
              <div className="text-sm text-gray-600">Clientes satisfeitas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-500 mb-1">15+</div>
              <div className="text-sm text-gray-600">Serviços premium</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-pink-500 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-pink-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
