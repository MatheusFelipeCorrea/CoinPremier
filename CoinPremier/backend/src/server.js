import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3333;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (_req, res) => {
res.json({ message: '🪙 CoinPremier API funcionando!' });
});

// TODO: importar rotas
// import routes from './routes/index.js';
// app.use('/api', routes);

app.listen(PORT, () => {
console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});