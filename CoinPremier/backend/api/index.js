import app from '../src/server.js';
import { createServer as createVercelServer } from '@vercel/node';

export default createVercelServer(app);