import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db';
import { BRAND } from './config/brand.config';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import entitlementRoutes from './routes/entitlement.routes';
import downloadRoutes from './routes/download.routes';
import paymentRoutes from './routes/payment.routes';
import adminRoutes from './routes/admin.routes';
import adminEnhancedRoutes from './routes/admin.enhanced.routes';
import supportRoutes from './routes/support.routes';
import { getRobotsTxt, getSitemapXml } from './controllers/seo.controller';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// SEO Routes
app.get('/robots.txt', getRobotsTxt);
app.get('/sitemap.xml', getSitemapXml);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    brand: BRAND.name,
    tagline: BRAND.tagline,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api/me', entitlementRoutes);
app.use('/api', downloadRoutes);
app.use('/api', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminEnhancedRoutes);
app.use('/api', supportRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[SERVER ERROR]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
});

// Connect DB and start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[SERVER] ${BRAND.name} API running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
};

if (require.main === module) {
  startServer();
}

export default app;
