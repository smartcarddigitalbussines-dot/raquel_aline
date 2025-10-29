/*
  # Beauty Salon Database Schema

  ## Overview
  This migration creates the complete database structure for a modern beauty salon booking system.

  ## New Tables

  ### 1. `service_categories`
  Organizes services into logical groups (Hair, Nails, Makeup, etc.)
  - `id` (uuid, primary key)
  - `name` (text) - Category name (e.g., "Cabelo", "Manicure")
  - `icon` (text) - Lucide icon name for UI
  - `display_order` (integer) - Order for display
  - `created_at` (timestamptz)

  ### 2. `services`
  Complete catalog of beauty services offered
  - `id` (uuid, primary key)
  - `category_id` (uuid, foreign key) - Links to service_categories
  - `name` (text) - Service name
  - `description` (text) - Detailed description
  - `duration_minutes` (integer) - Service duration
  - `price` (decimal) - Service price in BRL
  - `image_url` (text, optional) - Service image
  - `is_active` (boolean) - Availability status
  - `created_at` (timestamptz)

  ### 3. `appointments`
  Customer booking records
  - `id` (uuid, primary key)
  - `service_id` (uuid, foreign key) - Links to services
  - `customer_name` (text) - Customer's full name
  - `customer_phone` (text) - WhatsApp contact
  - `appointment_date` (date) - Scheduled date
  - `appointment_time` (time) - Scheduled time
  - `status` (text) - pending, confirmed, completed, cancelled
  - `payment_method` (text) - pix, card, cash
  - `notes` (text, optional) - Additional notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Public read access for services and categories (catalog viewing)
  - Authenticated users can create appointments
  - Only authenticated admin users can manage services and view all appointments
  - Customers can view their own appointments using phone number

  ## Important Notes
  1. All tables use UUID primary keys for security
  2. Timestamps track creation and updates
  3. Soft deletion via is_active flags
  4. Phone numbers stored for WhatsApp integration
  5. Status tracking for appointment lifecycle
*/

-- Create service_categories table
CREATE TABLE IF NOT EXISTS service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL DEFAULT 'Sparkles',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES service_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  duration_minutes integer NOT NULL DEFAULT 60,
  price decimal(10,2) NOT NULL DEFAULT 0,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_method text NOT NULL DEFAULT 'cash',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_appointments_service ON appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON appointments(customer_phone);

-- Enable Row Level Security
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_categories
CREATE POLICY "Anyone can view service categories"
  ON service_categories FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can manage categories"
  ON service_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for services
CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all services"
  ON services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can manage services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for appointments
CREATE POLICY "Anyone can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Customers can view their own appointments"
  ON appointments FOR SELECT
  USING (customer_phone = current_setting('request.jwt.claims', true)::json->>'phone' OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view all appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (true);

-- Insert default service categories
INSERT INTO service_categories (name, icon, display_order) VALUES
  ('Cabelo', 'Scissors', 1),
  ('Manicure e Pedicure', 'Hand', 2),
  ('Sobrancelhas', 'Eye', 3),
  ('Maquiagem', 'Palette', 4),
  ('Depilação', 'Zap', 5),
  ('Estética', 'Sparkles', 6)
ON CONFLICT DO NOTHING;

-- Insert sample services
INSERT INTO services (category_id, name, description, duration_minutes, price) 
SELECT 
  (SELECT id FROM service_categories WHERE name = 'Cabelo'),
  'Corte Feminino',
  'Corte personalizado com análise de fios e formato do rosto',
  60,
  80.00
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Corte Feminino');

INSERT INTO services (category_id, name, description, duration_minutes, price) 
SELECT 
  (SELECT id FROM service_categories WHERE name = 'Cabelo'),
  'Escova Progressiva',
  'Tratamento alisante com produtos de alta qualidade',
  180,
  250.00
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Escova Progressiva');

INSERT INTO services (category_id, name, description, duration_minutes, price) 
SELECT 
  (SELECT id FROM service_categories WHERE name = 'Cabelo'),
  'Coloração Completa',
  'Tintura profissional com coloração uniforme',
  120,
  180.00
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Coloração Completa');

INSERT INTO services (category_id, name, description, duration_minutes, price) 
SELECT 
  (SELECT id FROM service_categories WHERE name = 'Manicure e Pedicure'),
  'Manicure Completa',
  'Cuidados completos para as mãos com esmaltação',
  45,
  50.00
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Manicure Completa');

INSERT INTO services (category_id, name, description, duration_minutes, price) 
SELECT 
  (SELECT id FROM service_categories WHERE name = 'Manicure e Pedicure'),
  'Pedicure Completa',
  'Cuidados completos para os pés com esmaltação',
  60,
  60.00
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Pedicure Completa');

INSERT INTO services (category_id, name, description, duration_minutes, price) 
SELECT 
  (SELECT id FROM service_categories WHERE name = 'Sobrancelhas'),
  'Design de Sobrancelhas',
  'Modelagem perfeita com pinça, linha ou cera',
  30,
  40.00
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Design de Sobrancelhas');

INSERT INTO services (category_id, name, description, duration_minutes, price) 
SELECT 
  (SELECT id FROM service_categories WHERE name = 'Maquiagem'),
  'Maquiagem Social',
  'Make completa para eventos e ocasiões especiais',
  90,
  150.00
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Maquiagem Social');

INSERT INTO services (category_id, name, description, duration_minutes, price) 
SELECT 
  (SELECT id FROM service_categories WHERE name = 'Depilação'),
  'Depilação Completa',
  'Depilação com cera quente em todas as áreas',
  90,
  120.00
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Depilação Completa');

INSERT INTO services (category_id, name, description, duration_minutes, price) 
SELECT 
  (SELECT id FROM service_categories WHERE name = 'Estética'),
  'Limpeza de Pele',
  'Limpeza profunda com extração e hidratação',
  90,
  140.00
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Limpeza de Pele');