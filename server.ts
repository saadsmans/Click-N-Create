import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import zlib from 'zlib';
import { fileURLToPath } from 'url';
import apiRouter from './server/routes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.disable('x-powered-by');
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Lightweight zero-dependency gzip/brotli compression for production static text payloads
  if (isProd) {
    app.use((req, res, next) => {
      const acceptEnc = String(req.headers['accept-encoding'] || '');
      const useBr = acceptEnc.includes('br');
      const useGzip = !useBr && acceptEnc.includes('gzip');
      if (!useBr && !useGzip) return next();

      const origSend = res.send.bind(res);
      res.send = ((body: any) => {
        const contentType = String(res.getHeader('Content-Type') || '');
        const isText =
          typeof body === 'string' ||
          Buffer.isBuffer(body) && /text\/|javascript|json|svg|xml/.test(contentType);

        if (!isText || res.headersSent) {
          return origSend(body);
        }

        const buf = typeof body === 'string' ? Buffer.from(body) : body;
        if (buf.length < 1024) return origSend(body);

        try {
          const compressed = useBr
            ? zlib.brotliCompressSync(buf, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4 } })
            : zlib.gzipSync(buf, { level: 6 });
          res.setHeader('Content-Encoding', useBr ? 'br' : 'gzip');
          res.setHeader('Vary', 'Accept-Encoding');
          res.removeHeader('Content-Length');
          return res.end(compressed);
        } catch {
          return origSend(body);
        }
      }) as typeof res.send;
      next();
    });
  }

  // Mount static uploads directory for admin uploaded assets & logos with stale-while-revalidate caching
  const uploadsPath = path.resolve(__dirname, 'public/uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  app.use(
    '/uploads',
    express.static(uploadsPath, {
      maxAge: '7d',
      etag: true,
      setHeaders: (res) => {
        res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
      },
    })
  );

  // Mount API router
  app.use('/api', apiRouter);

  // Direct favicon handlers with 7-day caching
  app.get('/favicon.ico', (_req, res) => {
    const icoPath = path.resolve(__dirname, 'public/favicon.ico');
    const pngPath = path.resolve(__dirname, 'public/favicon.png');
    res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    if (fs.existsSync(icoPath)) return res.sendFile(icoPath);
    if (fs.existsSync(pngPath)) return res.sendFile(pngPath);
    return res.status(204).end();
  });
  app.get('/favicon.png', (_req, res) => {
    const pngPath = path.resolve(__dirname, 'public/favicon.png');
    res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    if (fs.existsSync(pngPath)) return res.sendFile(pngPath);
    return res.status(204).end();
  });

  // Root SEO endpoints for search engines
  app.get('/sitemap.xml', (req, res, next) => {
    (apiRouter as any).handle(req, res, next);
  });
  app.get('/robots.txt', (req, res, next) => {
    (apiRouter as any).handle(req, res, next);
  });

  if (!isProd) {
    // Development mode: Mount Vite dev server middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static assets from dist with immutable hashed asset cache & fresh HTML
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(
        express.static(distPath, {
          etag: true,
          setHeaders: (res, filePath) => {
            if (filePath.endsWith('.html')) {
              res.setHeader('Cache-Control', 'no-cache, must-revalidate');
            } else if (/[/\\]assets[/\\]aistudio[/\\]/.test(filePath)) {
              res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
            } else if (/[/\\]assets[/\\]/.test(filePath)) {
              res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            } else {
              res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
            }
          },
        })
      );
      app.get('*', (_req, res) => {
        res.setHeader('Cache-Control', 'no-cache, must-revalidate');
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      console.warn('Production build dist/ not found, falling back to basic handler');
      app.get('*', (_req, res) => {
        res.setHeader('Cache-Control', 'no-cache, must-revalidate');
        res.sendFile(path.join(__dirname, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Click N Create] Full-Stack Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
