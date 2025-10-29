import { Sparkles, Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">BeautyStudio</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Realce sua beleza com quem entende de cuidado. Serviços profissionais de beleza e estética.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-pink-400 transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-pink-400 transition-colors"
                >
                  Serviços
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-pink-400 transition-colors"
                >
                  Agendar
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('admin')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-pink-400 transition-colors"
                >
                  Admin
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-pink-400" />
                <span>Rua das Flores, 123<br />São Paulo - SP</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4 flex-shrink-0 text-pink-400" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4 flex-shrink-0 text-pink-400" />
                <span>contato@beautystudio.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Redes Sociais</h3>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Horário de Funcionamento</h4>
              <p className="text-gray-400 text-sm">
                Segunda a Sexta: 9h - 19h<br />
                Sábado: 9h - 17h<br />
                Domingo: Fechado
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 BeautyStudio. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
