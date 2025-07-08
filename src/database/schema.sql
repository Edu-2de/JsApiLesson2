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
('Ronnie', 'ronnie@gmail.com', 20, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at6.uheWG/igi', 'user')
ON CONFLICT (email) DO NOTHING;




CREATE TABLE IF NOT EXISTS account_types (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) UNIQUE DEFAULT 'current' CHECK(type IN ('current', 'savings', 'premium', 'kids')),
    daily_withdrawal_limit DECIMAL(10,2) DEFAULT 0.00,
    daily_transfer_limit DECIMAL(10,2) DEFAULT 0.00,
    monthly_withdrawal_limit DECIMAL(10,2) DEFAULT 0.00,
    monthly_transfer_limit DECIMAL(10,2) DEFAULT 0.00
    
);

INSERT INTO account_types(type, daily_withdrawal_limit, daily_transfer_limit, monthly_withdrawal_limit, monthly_transfer_limit) VALUES
('current', 1000.00, 5000.00, 15000.00, 50000.00)
ON CONFLICT (type) DO NOTHING;

INSERT INTO account_types(type, daily_withdrawal_limit, daily_transfer_limit, monthly_withdrawal_limit, monthly_transfer_limit) VALUES
('savings', 500.00, 2000.00, 8000.00, 20000.00)
ON CONFLICT (type) DO NOTHING;

INSERT INTO account_types(type, daily_withdrawal_limit, daily_transfer_limit, monthly_withdrawal_limit, monthly_transfer_limit) VALUES
('premium', 5000.00, 20000.00, 100000.00, 500000.00)
ON CONFLICT (type) DO NOTHING;

INSERT INTO account_types(type, daily_withdrawal_limit, daily_transfer_limit, monthly_withdrawal_limit, monthly_transfer_limit) VALUES
('kids', 100.00, 200.00, 1000.00, 2000.00)
ON CONFLICT (type) DO NOTHING;




CREATE TABLE IF NOT EXISTS interest_and_fees (
    id SERIAL PRIMARY KEY,
    account_type_id INTEGER REFERENCES account_types(id) ON DELETE SET NULL,
    monthly_maintenance_fee DECIMAL(5,2) DEFAULT 0.00,
    withdrawal_fee DECIMAL(5,2) DEFAULT 0.00,
    transfer_fee DECIMAL(5,2) DEFAULT 0.00,
    interest_rate  DECIMAL(5,2) DEFAULT 0.00
);

INSERT INTO interest_and_fees(account_type_id, monthly_maintenance_fee, withdrawal_fee, transfer_fee, interest_rate)VALUES
(1, 2.50, 1.00, 0.50, 0.00)
ON CONFLICT (account_type_id) DO NOTHING;

INSERT INTO interest_and_fees(account_type_id, monthly_maintenance_fee, withdrawal_fee, transfer_fee, interest_rate)VALUES
(2, 0.00, 2.00, 1.50, 0.50)
ON CONFLICT (account_type_id) DO NOTHING;

INSERT INTO interest_and_fees(account_type_id, monthly_maintenance_fee, withdrawal_fee, transfer_fee, interest_rate)VALUES
(3, 0.00, 0.00, 0.00, 0.75)
ON CONFLICT (account_type_id) DO NOTHING;

INSERT INTO interest_and_fees(account_type_id, monthly_maintenance_fee, withdrawal_fee, transfer_fee, interest_rate)VALUES
(4, 0.00, 0.00, 0.00, 1.00)
ON CONFLICT (account_type_id) DO NOTHING;




CREATE TABLE IF NOT EXISTS accounts(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    account_type_id INTEGER REFERENCES account_types(id) ON DELETE SET NULL,
    balance DECIMAL(10,2) DEFAULT 0.00,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK(status IN ('active', 'blocked', 'closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO accounts(user_id, account_type_id, balance, account_number)VALUES
(1, 3, 999999999.99, '001-98765-4')
ON CONFLICT (account_number) DO NOTHING;

INSERT INTO accounts(user_id, account_type_id, balance, account_number)VALUES
(2, 3, 99000.00, '001-55443-2')
ON CONFLICT (account_number) DO NOTHING;

INSERT INTO accounts(user_id, account_type_id, balance, account_number)VALUES
(3, 2, 3000.00, '001-12345-6')
ON CONFLICT (account_number) DO NOTHING;




CREATE TABLE IF NOT EXISTS transactions(
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL,
    transaction_type VARCHAR(20) DEFAULT 'deposit' CHECK(transaction_type IN ('deposit', 'withdrawal', 'transfer')),
    amount DECIMAL(10,2) DEFAULT 0.00,
    description TEXT,
    reference_number VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cards(
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL,
    card_number VARCHAR(20) UNIQUE NOT NULL,
    card_type VARCHAR(20) DEFAULT 'credit' CHECK(card_type IN('credit', 'debit', 'prepaid')),
    status VARCHAR(20) DEFAULT 'active' CHECK(status IN('active', 'blocked', 'expired')),
    expiry_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cvv VARCHAR(5) NOT NULL
);

CREATE TABLE IF NOT EXISTS transfers(
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id) ON DELETE SET NULL,
    destination_account_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL,
    fee DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);