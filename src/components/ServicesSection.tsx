import { useEffect, useState } from 'react';
import { supabase, Service, ServiceCategory } from '../lib/supabase';
import { Scissors, Hand, Eye, Palette, Zap, Sparkles, Clock, DollarSign } from 'lucide-react';

const iconMap: Record<string, any> = {
  Scissors,
  Hand,
  Eye,
  Palette,
  Zap,
  Sparkles,
};

export default function ServicesSection() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesRes, servicesRes] = await Promise.all([
        supabase.from('service_categories').select('*').order('display_order'),
        supabase.from('services').select('*').eq('is_active', true),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = selectedCategory
    ? services.filter((s) => s.category_id === selectedCategory)
    : services;

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nossos Serviços
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Oferecemos uma gama completa de serviços de beleza para você se sentir incrível
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Sparkles;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const category = categories.find((c) => c.id === service.category_id);
            const Icon = category ? iconMap[category.icon] || Sparkles : Sparkles;

            return (
              <div
                key={service.id}
                className="bg-gradient-to-br from-white to-pink-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
              >
                <div className="h-48 bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                  <Icon className="w-20 h-20 text-white opacity-90 group-hover:scale-110 transition-transform duration-300" />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                    <span className="text-2xl font-bold text-pink-500">
                      R$ {service.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration_minutes} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>A partir de</span>
                    </div>
                  </div>

                  <button
                    onClick={scrollToBooking}
                    className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Agendar Agora
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum serviço encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
