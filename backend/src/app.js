import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('MeuSite backend running!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));