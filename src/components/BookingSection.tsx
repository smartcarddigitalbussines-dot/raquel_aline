import { useState, useEffect } from 'react';
import { supabase, Service, ServiceCategory } from '../lib/supabase';
import { Calendar, Clock, User, Phone, CreditCard, MessageSquare, Check } from 'lucide-react';

export default function BookingSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    service_id: '',
    appointment_date: '',
    appointment_time: '',
    payment_method: 'cash' as 'pix' | 'card' | 'cash',
    notes: '',
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        supabase.from('services').select('*').eq('is_active', true),
        supabase.from('service_categories').select('*'),
      ]);

      if (servicesRes.data) setServices(servicesRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.from('appointments').insert([
        {
          ...formData,
          status: 'pending',
        },
      ]).select();

      if (error) throw error;

      setSuccess(true);

      const service = services.find((s) => s.id === formData.service_id);
      const message = `Olá! Gostaria de confirmar meu agendamento:\n\n` +
        `👤 Nome: ${formData.customer_name}\n` +
        `💅 Serviço: ${service?.name}\n` +
        `📅 Data: ${new Date(formData.appointment_date).toLocaleDateString('pt-BR')}\n` +
        `⏰ Horário: ${formData.appointment_time}\n` +
        `💳 Pagamento: ${formData.payment_method === 'pix' ? 'PIX' : formData.payment_method === 'card' ? 'Cartão' : 'Dinheiro'}`;

      setTimeout(() => {
        window.open(
          `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`,
          '_blank'
        );
      }, 1500);

      setFormData({
        customer_name: '',
        customer_phone: '',
        service_id: '',
        appointment_date: '',
        appointment_time: '',
        payment_method: 'cash',
        notes: '',
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Erro ao criar agendamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const groupedServices = categories.map((category) => ({
    category,
    services: services.filter((s) => s.category_id === category.id),
  }));

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-pink-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Agende seu Horário
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Preencha o formulário abaixo e confirme pelo WhatsApp
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {success ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Agendamento Realizado!</h3>
              <p className="text-gray-600 mb-6">
                Você será redirecionado para o WhatsApp para confirmar seu horário.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <User className="w-5 h-5 text-pink-500" />
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Phone className="w-5 h-5 text-pink-500" />
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <MessageSquare className="w-5 h-5 text-pink-500" />
                    Serviço Desejado
                  </label>
                  <select
                    required
                    value={formData.service_id}
                    onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                  >
                    <option value="">Selecione um serviço</option>
                    {groupedServices.map(({ category, services }) =>
                      services.length > 0 ? (
                        <optgroup key={category.id} label={category.name}>
                          {services.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.name} - R$ {service.price.toFixed(2)} ({service.duration_minutes} min)
                            </option>
                          ))}
                        </optgroup>
                      ) : null
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <Calendar className="w-5 h-5 text-pink-500" />
                      Data
                    </label>
                    <input
                      type="date"
                      required
                      min={minDate}
                      value={formData.appointment_date}
                      onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <Clock className="w-5 h-5 text-pink-500" />
                      Horário
                    </label>
                    <select
                      required
                      value={formData.appointment_time}
                      onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                    >
                      <option value="">Selecione</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="12:00">12:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                      <option value="18:00">18:00</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <CreditCard className="w-5 h-5 text-pink-500" />
                    Forma de Pagamento
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, payment_method: 'pix' })}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        formData.payment_method === 'pix'
                          ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      PIX
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, payment_method: 'card' })}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        formData.payment_method === 'card'
                          ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Cartão
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, payment_method: 'cash' })}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        formData.payment_method === 'cash'
                          ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Dinheiro
                    </button>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <MessageSquare className="w-5 h-5 text-pink-500" />
                    Observações (opcional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors resize-none"
                    rows={3}
                    placeholder="Alguma observação sobre o serviço?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Agendando...' : 'Confirmar Agendamento'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
