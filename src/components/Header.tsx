import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BeautyStudio</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-gray-700 hover:text-pink-500 transition-colors font-medium"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-gray-700 hover:text-pink-500 transition-colors font-medium"
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection('booking')}
              className="text-gray-700 hover:text-pink-500 transition-colors font-medium"
            >
              Agendar
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-pink-500 transition-colors font-medium"
            >
              Contato
            </button>
            <button
              onClick={() => scrollToSection('admin')}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300"
            >
              Admin
            </button>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <button
              onClick={() => scrollToSection('home')}
              className="text-left text-gray-700 hover:text-pink-500 transition-colors font-medium py-2"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-left text-gray-700 hover:text-pink-500 transition-colors font-medium py-2"
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection('booking')}
              className="text-left text-gray-700 hover:text-pink-500 transition-colors font-medium py-2"
            >
              Agendar
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-left text-gray-700 hover:text-pink-500 transition-colors font-medium py-2"
            >
              Contato
            </button>
            <button
              onClick={() => scrollToSection('admin')}
              className="text-left px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300"
            >
              Admin
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
