import express, { json } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';

const app = express();
app.use(cors());
app.use(json());

app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
  res.send('MeuSite backend running!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));