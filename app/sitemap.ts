import { MetadataRoute } from 'next'
import { getAllTemplates } from '@/lib/templates'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  const templates = getAllTemplates()

  // Main pages
  const staticPages = [
    '',
    '/templates',
    '/about',
    '/contact',
    '/custom',
    '/privacy',
    '/terms',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Template category pages
  const categoryPages = [
    '/templates/notion',
    '/templates/n8n',
    '/templates/make',
    '/templates/zapier',
    '/templates/chatgpt',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Individual template pages
  const templatePages = templates.map(template => ({
    url: `${baseUrl}/templates/${template.category}/${template.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...categoryPages, ...templatePages]
}