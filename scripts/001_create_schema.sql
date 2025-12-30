-- Tabela para armazenar empresas clientes
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para armazenar usuários (Guarda, Supervisor, Admin, Cliente)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('guard', 'supervisor', 'admin', 'client')),
    company_id UUID REFERENCES companies(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para armazenar dispositivos Bluetooth emparelhados
CREATE TABLE IF NOT EXISTS bluetooth_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    device_name TEXT NOT NULL,
    device_id TEXT, -- ID retornado pela Web Bluetooth API
    last_connected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    battery_level INTEGER,
    status TEXT DEFAULT 'connected',
    UNIQUE(user_id, device_id)
);

-- Tabela para logs de patrulha e ocorrências
CREATE TABLE IF NOT EXISTS patrol_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guard_id UUID REFERENCES users(id),
    action TEXT NOT NULL, -- 'start_patrol', 'sos', 'end_patrol'
    description TEXT,
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserindo dados iniciais para teste
INSERT INTO companies (name) VALUES ('GuardianGlass HQ') ON CONFLICT DO NOTHING;

INSERT INTO users (email, name, role, company_id) 
SELECT 'guard@guardianglass.mz', 'Guarda Exemplo', 'guard', id FROM companies WHERE name = 'GuardianGlass HQ'
ON CONFLICT DO NOTHING;
