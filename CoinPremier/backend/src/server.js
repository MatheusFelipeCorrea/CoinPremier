import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3333;

function isAllowedOrigin(origin) {
	if (!origin) return true;

	const frontendUrl = process.env.FRONTEND_URL;
	if (frontendUrl && origin === frontendUrl) return true;

	try {
		const frontendHost = frontendUrl ? new URL(frontendUrl).hostname : null;
		const originHost = new URL(origin).hostname;

		if (frontendHost && originHost === frontendHost) return true;
		if (originHost.endsWith('.vercel.app')) return true;
	} catch {
		return false;
	}

	return false;
}

app.use(helmet());
app.use(
	cors({
		origin(origin, callback) {
			if (isAllowedOrigin(origin)) {
				return callback(null, true);
			}

			return callback(new Error(`CORS bloqueado para origem: ${origin}`));
		},
		credentials: true,
	})
);
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (_req, res) => {
	res.json({ message: 'CoinPremier API funcionando!' });
});

app.get('/api', (_req, res) => {
	res.json({ message: 'CoinPremier API funcionando!', ok: true });
});

app.use('/api', routes);
app.use(errorHandler);

// Só roda app.listen em ambiente local/desenvolvimento
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
	app.listen(PORT, () => {
		console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
	});
}

// Exporta o app para uso serverless (Vercel)
export default app;