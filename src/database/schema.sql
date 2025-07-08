CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INTEGER NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK(role IN ('full_access', 'limit_access', 'user')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, age, password_hash, role) VALUES
('bank manager', 'admin@system.com', 30, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'full_access')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, age, password_hash, role) VALUES
('bank employee', 'employee@system.com', 22, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at4.uheWG/igi', 'limit_access')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, age, password_hash, role) VALUES
('Ronnie', 'employee@system.com', 20, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at6.uheWG/igi', 'user')
ON CONFLICT (email) DO NOTHING;

CREATE TABLE IF NOT EXISTS account_types (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) DEFAULT 'current' CHECK(type IN ('current', 'savings', 'premium', 'kids')),
    daily_withdrawal_limit DECIMAL(10,2) DEFAULT 0.00,
    daily_transfer_limit DECIMAL(10,2) DEFAULT 0.00,
    monthly_withdrawal_limit DECIMAL(10,2) DEFAULT 0.00,
    monthly_transfer_limit DECIMAL(10,2) DEFAULT 0.00
    
);

CREATE TABLE IF NOT EXISTS interest_and_fees (
    id SERIAL PRIMARY KEY,
    account_type_id INTEGER REFERENCES account_types(id) ON DELETE SET NULL,
    monthly_maintenance_fee DECIMAL(5,2) DEFAULT 0.00,
    withdrawal_fee DECIMAL(5,2) DEFAULT 0.00,
    transfer_fee DECIMAL(5,2) DEFAULT 0.00,
    interest_rate  DECIMAL(5,2) DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS account(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    account_types_id INTEGER REFERENCES account_types(id) ON DELETE SET NULL
)