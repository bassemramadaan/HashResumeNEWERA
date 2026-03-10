import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || 'https://hashresume.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/editor', '/share', '/api'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
