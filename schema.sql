-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ROLES table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed basic roles
INSERT INTO roles (name) VALUES ('Super Admin'), ('Verifier'), ('Operator'), ('Support') ON CONFLICT DO NOTHING;

-- INTERNAL_USERS table
CREATE TABLE IF NOT EXISTS internal_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed an admin user for initial access
INSERT INTO internal_users (email, role, is_active) VALUES ('admin@doctorportal.com', 'Super Admin', true) ON CONFLICT DO NOTHING;

-- QUALIFICATIONS table
CREATE TABLE IF NOT EXISTS qualifications (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Seed qualifications
INSERT INTO qualifications (id, name) VALUES 
('q1', 'MBBS'),
('q2', 'MD'),
('q3', 'DO'),
('q4', 'MS')
ON CONFLICT (id) DO NOTHING;

-- SPECIALIZATIONS table
CREATE TABLE IF NOT EXISTS specializations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Seed specializations
INSERT INTO specializations (id, name) VALUES 
('s1', 'Cardiology'),
('s2', 'Pediatrics'),
('s3', 'Dermatology'),
('s4', 'Orthopedics'),
('s5', 'General Medicine')
ON CONFLICT (id) DO NOTHING;

-- HOSPITALS table
CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    hospital_type VARCHAR(100) NOT NULL,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    year_established INTEGER,
    number_of_beds INTEGER,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    website VARCHAR(255),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    admin_name VARCHAR(255) NOT NULL,
    admin_email VARCHAR(255) NOT NULL,
    admin_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- DOCTORS table
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    dob DATE,
    gender VARCHAR(20),
    qualification_id VARCHAR(50) REFERENCES qualifications(id),
    specialization_id VARCHAR(50) REFERENCES specializations(id),
    experience_years INTEGER DEFAULT 0 NOT NULL,
    consultation_fee NUMERIC DEFAULT 0.00 NOT NULL,
    hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT false NOT NULL,
    image VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- APPOINTMENTS table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    patient_name VARCHAR(255) NOT NULL,
    patient_email VARCHAR(255),
    patient_phone VARCHAR(20),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' NOT NULL, -- Pending, Completed, Cancelled, No Show
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- AUDIT_LOGS table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    user_role VARCHAR(50),
    action VARCHAR(255) NOT NULL,
    affected_table VARCHAR(100),
    affected_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- NOTIFICATIONS table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TICKETS (Support) table
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    ticket_type VARCHAR(50) NOT NULL, -- Bug, Technical Issue, Authentication, Hospital, Doctor, General
    priority VARCHAR(20) DEFAULT 'Medium' NOT NULL, -- Low, Medium, High, Critical
    status VARCHAR(20) DEFAULT 'Open' NOT NULL, -- Open, Resolved, Closed, Reopened
    user_email VARCHAR(255) NOT NULL,
    assigned_to VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TICKET_COMMENTS table
CREATE TABLE IF NOT EXISTS ticket_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    commenter VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SETTINGS table
CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL
);

-- Seed default settings
INSERT INTO settings (key, value) VALUES 
('branding', '{"organization_name": "QuickCheck", "support_email": "support@quickcheck.com"}'::jsonb),
('regional', '{"timezone": "Asia/Kolkata", "language": "en"}'::jsonb),
('security', '{"session_timeout_minutes": 30, "two_factor_auth": false}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON hospitals FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS (Row Level Security) on tables
ALTER TABLE internal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Setup basic RLS Policies (allows authenticated/public client read-write for this verifier admin workflow)
CREATE POLICY "Public Read Access" ON internal_users FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON internal_users FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON hospitals FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON hospitals FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON doctors FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON doctors FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON appointments FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON appointments FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON audit_logs FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON audit_logs FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON notifications FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON notifications FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON tickets FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON tickets FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON ticket_comments FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON ticket_comments FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON settings FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON settings FOR ALL USING (true);
