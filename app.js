import express from 'express';

import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

import bookRoutes from './routes/bookRoutes.js';
app.use('/api/books', bookRoutes);

import authRoutes from './routes/authRoutes.js';
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});