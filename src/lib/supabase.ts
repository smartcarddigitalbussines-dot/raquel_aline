import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  display_order: number;
  created_at: string;
}

export interface Service {
  id: string;
  category_id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  service_id: string;
  customer_name: string;
  customer_phone: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_method: 'pix' | 'card' | 'cash';
  notes?: string;
  created_at: string;
  updated_at: string;
}
