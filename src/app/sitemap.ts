import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bsp-id.com'
    const currentDate = new Date()

    const routes = [
        '',
        '/create',
        '/recover',
        '/privacy',
        '/terms',
        '/export',
        '/destroy',
        '/governance',
        '/biorecords',
        '/consent',
        '/guardians',
        '/institution',
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: currentDate,
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.8,
    }))
}
