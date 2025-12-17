import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  noindex?: boolean;
}

/**
 * Generate optimized metadata for SEO
 */
export function generateSEO({
  title,
  description,
  keywords = [],
  ogImage = '/banner.png',
  ogType = 'website',
  canonical,
  noindex = false,
}: SEOProps): Metadata {
  const siteName = 'Kết Nối Việc Làm';
  const fullTitle = `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      type: ogType,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
    },
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#101828' },
    ],
  };
}

/**
 * Generate JSON-LD structured data for jobs
 */
export function generateJobPostingSchema(job: {
  title: string;
  description: string;
  company: { name: string; logo: string };
  location: string;
  salary: { min: number; max: number; currency: string };
  postedAt: Date;
  validThrough: Date;
  employmentType: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company.name,
      logo: job.company.logo,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
      },
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: job.salary.currency,
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salary.min,
        maxValue: job.salary.max,
        unitText: 'MONTH',
      },
    },
    datePosted: job.postedAt.toISOString(),
    validThrough: job.validThrough.toISOString(),
    employmentType: job.employmentType,
  };
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationSchema(org: {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
    logo: org.logo,
    description: org.description,
    sameAs: org.sameAs || [],
  };
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
