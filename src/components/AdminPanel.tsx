import { useEffect, useState } from 'react';
import { supabase, Appointment, Service } from '../lib/supabase';
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, Loader } from 'lucide-react';

export default function AdminPanel() {
  const [appointments, setAppointments] = useState<(Appointment & { service?: Service })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const { data: appointmentsData, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: false });

      if (error) throw error;

      if (appointmentsData) {
        const servicesIds = [...new Set(appointmentsData.map((a) => a.service_id))];
        const { data: servicesData } = await supabase
          .from('services')
          .select('*')
          .in('id', servicesIds);

        const appointmentsWithServices = appointmentsData.map((appointment) => ({
          ...appointment,
          service: servicesData?.find((s) => s.id === appointment.service_id),
        }));

        setAppointments(appointmentsWithServices);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Appointment['status']) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erro ao atualizar status');
    }
  };

  const filteredAppointments = appointments.filter((a) =>
    filter === 'all' ? true : a.status === filter
  );

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <section id="admin" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <Loader className="w-12 h-12 text-pink-500 animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section id="admin" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Painel do Administrador
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gerencie todos os agendamentos do salão
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-pink-500 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-yellow-500 mb-1">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-500 mb-1">{stats.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmados</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-500 mb-1">{stats.completed}</div>
            <div className="text-sm text-gray-600">Concluídos</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === 'pending'
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === 'confirmed'
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Confirmados
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === 'completed'
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Concluídos
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === 'cancelled'
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelados
            </button>
          </div>

          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Nenhum agendamento encontrado
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border-2 border-gray-100 rounded-xl p-6 hover:border-pink-200 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                        <span className="text-sm text-gray-500">
                          #{appointment.id.slice(0, 8)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <User className="w-4 h-4 text-pink-500" />
                          <span className="font-medium">{appointment.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4 text-pink-500" />
                          <span>{appointment.customer_phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-pink-500" />
                          <span>{new Date(appointment.appointment_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4 text-pink-500" />
                          <span>{appointment.appointment_time}</span>
                        </div>
                      </div>

                      <div className="mt-3 text-sm">
                        <span className="font-medium text-gray-900">Serviço: </span>
                        <span className="text-gray-700">{appointment.service?.name}</span>
                        <span className="text-pink-500 ml-2">
                          R$ {appointment.service?.price.toFixed(2)}
                        </span>
                      </div>

                      {appointment.notes && (
                        <div className="mt-2 text-sm text-gray-600 italic">
                          Obs: {appointment.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-row md:flex-col gap-2">
                      {appointment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(appointment.id, 'confirmed')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Confirmar
                          </button>
                          <button
                            onClick={() => updateStatus(appointment.id, 'cancelled')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancelar
                          </button>
                        </>
                      )}
                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => updateStatus(appointment.id, 'completed')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Concluir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
