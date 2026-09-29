import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Cloud Run health check
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

// Serve compiled static assets from Vite dist build
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// SPA Fallback: All routes serve index.html
app.get('*', (_req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Click N Create live web server listening on port ${PORT}`);
});
