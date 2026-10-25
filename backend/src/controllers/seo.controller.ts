import { Request, Response } from 'express';
import Product from '../models/Product';
import { BRAND } from '../config/brand.config';

export const getRobotsTxt = (req: Request, res: Response): void => {
  const baseUrl = (process.env.CLIENT_URL && !process.env.CLIENT_URL.includes('localhost'))
    ? process.env.CLIENT_URL
    : 'https://campusget.vercel.app';

  const content = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /login
Disallow: /register
Disallow: /verify-otp
Disallow: /checkout/

Sitemap: ${baseUrl}/sitemap.xml`;

  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(content);
};

export const getSitemapXml = async (req: Request, res: Response): Promise<void> => {
  try {
    const baseUrl = (process.env.CLIENT_URL && !process.env.CLIENT_URL.includes('localhost'))
      ? process.env.CLIENT_URL
      : 'https://campusget.vercel.app';
    const products = await Product.find({ isPublished: true }).select('slug updatedAt');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/projects</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/placement-prep</loc>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${baseUrl}/study-materials</loc>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/pricing</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/faq</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/refund-policy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>`;

    products.forEach((p) => {
      const dateStr = p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : '2026-10-25';
      xml += `
  <url>
    <loc>${baseUrl}/projects/${p.slug}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    xml += `\n</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
};
