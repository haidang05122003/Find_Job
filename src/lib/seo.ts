import { Metadata } from 'next';
import { SEO } from './constants';

interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
}

export function generateSEO({
    title,
    description = SEO.SITE_DESCRIPTION,
    image = SEO.DEFAULT_OG_IMAGE,
    url = SEO.SITE_URL,
    type = 'website',
}: SEOProps): Metadata {
    const fullTitle = `${title} | ${SEO.SITE_NAME}`;

    return {
        title: fullTitle,
        description,
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: SEO.SITE_NAME,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: 'vi_VN',
            type,
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [image],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

export function generateJobSEO(job: {
    title: string;
    company: { name: string };
    location: string;
    description: string;
}) {
    return generateSEO({
        title: `${job.title} tại ${job.company.name}`,
        description: `${job.description.slice(0, 155)}...`,
        type: 'article',
    });
}
