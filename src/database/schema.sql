CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INTEGER NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK(role IN ('full_access', 'limit_access', 'user')),
    balance DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

INSERT INTO users (name, email, age, password_hash, role, balance) VALUES
('bank manager', 'admin@system.com', 30, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'full_access', 10000.00)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, age, password_hash, role, balance) VALUES
('bank employee', 'employee@system.com', 22, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at4.uheWG/igi', 'limit_access', 10000.00)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, age, password_hash, role) VALUES
('Ronnie', 'employee@system.com', 20, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at6.uheWG/igi', 'user')
ON CONFLICT (email) DO NOTHING;


