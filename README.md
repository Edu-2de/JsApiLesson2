# JsApiLesson2

## Descrição

Este projeto é uma aplicação fullstack de exemplo, composta por um backend em Node.js com Express e Prisma (conectado ao PostgreSQL) e um frontend em React (Next.js) com Tailwind CSS. O objetivo é demonstrar a estrutura de um sistema moderno de autenticação, cadastro de usuários e exibição de produtos em um carrossel.

---

## Tecnologias Utilizadas

### Backend
- **Node.js**
- **Express**
- **Prisma ORM**
- **PostgreSQL**
- **JWT (jsonwebtoken)**
- **bcrypt**
- **CORS**

### Frontend
- **React (Next.js)**
- **Tailwind CSS**
- **react-icons**

---

## Estrutura de Pastas

```
backend/
  src/
    controllers/
      authController.js
    models/
      User.js
    routes/
      authRoutes.js
    app.js
  prisma/
    schema.prisma
  .env
frontend/
  src/
    components/
      Header.tsx
      Hero.tsx
      ProductsCarrousel.tsx
    app/
      page.tsx
  tailwind.config.js
  ...
```

---

## Como rodar o projeto

### Pré-requisitos

- Node.js (v18+)
- PostgreSQL
- npm

### 1. Clone o repositório

```
git clone https://github.com/seu-usuario/JsApiLesson2.git
cd JsApiLesson2
```

### 2. Configuração do Backend

#### Instale as dependências

```
cd backend
npm install
```

#### Configure o banco de dados

- Crie um banco PostgreSQL.
- Copie o arquivo `.env.example` para `.env` e configure a variável `DATABASE_URL`:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nomedobanco"
JWT_SECRET="sua_chave_secreta"
```

#### Configure o Prisma

```
npx prisma migrate dev --name init
```

#### Inicie o servidor

```
npm run dev
```

O backend estará rodando em `http://localhost:4000`.

---

### 3. Configuração do Frontend

Abra outro terminal e vá para a pasta do frontend:

```
cd ../frontend
npm install
```

#### Inicie o frontend

```
npm run dev
```

O frontend estará rodando em `http://localhost:3000`.

---

## Funcionalidades

- Cadastro e login de usuários com autenticação JWT
- Hash de senha com bcrypt
- Carrossel de produtos com navegação infinita
- Interface responsiva e clean com Tailwind CSS
- Separação clara de responsabilidades (controllers, models, routes, services, utils)

---

## Endpoints principais (Backend)

- `POST /api/auth/register` — Cadastro de usuário
- `POST /api/auth/login` — Login de usuário

---

## Scripts úteis

- `npm run dev` — Inicia o servidor em modo desenvolvimento (nodemon)
- `npx prisma studio` — Interface visual para o banco de dados Prisma

---

## Observações --

- Certifique-se de que o banco de dados está rodando antes de iniciar o backend.
- Para adicionar mais modelos/tabelas, edite o arquivo `prisma/schema.prisma` e rode `npx prisma migrate dev`.
- O frontend consome a API do backend para autenticação e exibição de produtos.

---

## Licença

Este projeto é apenas para fins educacionais.
