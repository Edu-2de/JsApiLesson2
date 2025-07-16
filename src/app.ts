import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { setupDatabase, testConnection } from './database/setup';

import accountRoutes from './routes/accountRoutes';
import authRoutes from './routes/authRoutes';
import transactionsRoutes from './routes/transactionsRoutes';
import cardRoutes from './routes/cardRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    console.log('🔧 Starting server...');

    await testConnection();
    console.log('✅ Database connection successful');

    await setupDatabase();
    console.log('✅ Database setup completed');

    app.use('/account', accountRoutes);
    app.use('/user', authRoutes);
    app.use('/transaction', transactionsRoutes);
    app.use('/cardRoutes', cardRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Test DB: http://localhost:${PORT}/test-db`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
