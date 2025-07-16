# JsApiLesson2

## Overview

JsApiLesson2 is a RESTful API for managing users, accounts, cards, and financial transactions (withdrawals, deposits, transfers) in a banking system. The project is built with Node.js, Express, and PostgreSQL, featuring authentication, authorization, robust business logic, and a full test suite.

---

## Features

- **User Management**

  - Register, login, update, and delete users
  - Password hashing with bcrypt
  - Role-based access control (user, admin)
  - Admin can manage any user

- **Account Management**

  - Register, update, block, close, activate, and delete accounts
  - Account types with configurable limits and fees
  - Admin and owner access controls
  - Safe deletion rules (`ON DELETE SET NULL` for historical integrity)

- **Card Management**

  - Create, list, and delete cards for accounts
  - Unique card number and CVV generation
  - Card types: credit, debit, prepaid
  - Expiry date calculation

- **Transactions**

  - Withdrawals with fee calculation and balance validation
  - Deposits
  - Transfers between accounts with fee and double balance update
  - Transaction and transfer history (last 50 per account)
  - All transaction types are auditable

- **Authentication & Authorization**

  - JWT-based authentication
  - Middleware for protected routes and role checks

- **Database**

  - PostgreSQL schema with foreign keys and constraints
  - Safe deletion and referential integrity

- **Testing**

  - Jest unit tests for controllers and business logic
  - 80+ tests covering all main features

- **Scripts**
  - Password hash generator (`scripts/generatePasswords.js`)

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/JsApiLesson2.git
   cd JsApiLesson2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=your_jwt_secret
   ```

4. **Set up the database**

   - Run the SQL schema:
     ```bash
     psql -U your_db_user -d your_db_name -f src/database/sql/schema.sql
     ```

---

## Usage

### Start the server

```bash
npm start
```

### API Endpoints

#### Auth Routes (`/auth`)

- `POST /auth/login` — User login
- `POST /auth/register` — User registration
- `GET /auth/` — Get own user info (auth required)
- `PATCH /auth/` — Update own user info (auth required)
- `DELETE /auth/` — Delete own user (auth required)
- `GET /auth/admin/:userId` — Get user by ID (admin only)
- `PATCH /auth/admin/:userId` — Update user by ID (admin only)
- `DELETE /auth/admin/:userId` — Delete user by ID (admin only)

#### Account Routes (`/account`)

- `POST /account/login` — Account login
- `POST /account/register` — Account registration
- `GET /account/myaccount` — Get own account info (auth required)
- `PATCH /account/myaccount/close` — Close own account (owner/admin)
- `PATCH /account/myaccount/active` — Activate own account (owner/admin)
- `DELETE /account/myaccount` — Delete own account (owner/admin)
- `GET /account/myaccount/cards` — List cards for own account
- `POST /account/myaccount/cards` — Create card for own account
- `DELETE /account/myaccount/cards` — Delete card for own account
- `GET /account/myaccount/transactions` — List transactions and transfers for own account
- `GET /account/admin/:accountId` — Get account by ID (admin only)
- `PATCH /account/admin/:accountId` — Update account by ID (admin only)
- `PATCH /account/admin/block/:accountId` — Block account (admin only)
- `PATCH /account/admin/close/:accountId` — Close account (admin only)
- `PATCH /account/admin/active/:accountId` — Activate account (admin only)
- `DELETE /account/admin/:accountId` — Delete account by ID (admin only)
- `GET /account/admin/all` — Get all accounts (admin only)

#### Card Routes (`/account/myaccount/cards`)

- `GET /account/myaccount/cards` — List all cards for the authenticated user's account
- `POST /account/myaccount/cards` — Create a new card for the authenticated user's account
- `DELETE /account/myaccount/cards` — Delete a card by card number for the authenticated user's account

#### Transactions Routes (`/transactions`)

- `POST /transactions/withdrawal` — Withdraw from account (auth required)
- `POST /transactions/deposit` — Deposit to account (auth required)
- `POST /transactions/transfer` — Transfer between accounts (auth required)
- `GET /transactions/myaccount` — Get transaction and transfer history for own account

---

## Scripts

### Generate Password Hashes

Use the script to generate bcrypt hashes for passwords:

```bash
node scripts/generatePasswords.js
```

---

## Testing

Run unit tests with Jest:

```bash
npm test
```

---

## Project Structure

```
src/
  controllers/         # Business logic for users, accounts, cards, transactions
  middleware/          # Auth and account middlewares
  routes/              # API route definitions
  database/
    sql/               # SQL schema and seed files
  __tests__/           # Jest unit tests
scripts/
  generatePasswords.js # Password hash generator
.env                   # Environment variables
```

---

## Security Notes

- Passwords are hashed with bcrypt before storing.
- JWT is used for authentication.
- Role-based access ensures only authorized actions are allowed.
- Database constraints prevent orphaned records and ensure data integrity.
- Sensitive actions require authentication and/or admin privileges.

---

## License

MIT

---

## Author

Eduardo — [edupaim1712@gmail.com](mailto:edupaim1712@gmail.com)

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## Contact

For questions or support, open an issue or contact the author.
