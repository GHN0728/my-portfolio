import type { MetadataRoute } from 'next'
import { profile } from '@/data/profile'
import projects from '@/data/projects.json'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: profile.siteUrl },
    ...projects.map((p) => ({ url: `${profile.siteUrl}/projects/${p.slug}` })),
  ]
}
