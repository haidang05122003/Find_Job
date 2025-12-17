# 🚀 Deployment Guide

## 📋 Pre-deployment Checklist

### 1. Code Quality
- [x] All TypeScript errors fixed
- [x] ESLint warnings resolved
- [x] No console.log in production code
- [x] All tests passing

### 2. Performance
- [x] Lighthouse score > 90
- [x] Bundle size optimized
- [x] Images optimized
- [x] Lazy loading implemented

### 3. SEO
- [x] Meta tags configured
- [x] Sitemap generated
- [x] Robots.txt configured
- [x] Open Graph tags

### 4. Security
- [x] Environment variables secured
- [x] API keys not exposed
- [x] HTTPS enforced
- [x] CORS configured

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

#### Step 2: Login
```bash
vercel login
```

#### Step 3: Deploy
```bash
# Development
vercel

# Production
vercel --prod
```

#### Environment Variables
```bash
# Add in Vercel Dashboard
NEXT_PUBLIC_API_URL=https://api.yoursite.com
NEXT_PUBLIC_SITE_URL=https://yoursite.com
```

### Option 2: Netlify

#### Step 1: Build Command
```bash
npm run build
```

#### Step 2: Publish Directory
```
.next
```

#### Step 3: Environment Variables
Add in Netlify dashboard

### Option 3: Docker

#### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

#### Build & Run
```bash
docker build -t job-portal .
docker run -p 3000:3000 job-portal
```

## 🔧 Configuration

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['your-cdn.com'],
    formats: ['image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

module.exports = nextConfig;
```

### Environment Variables

#### .env.local (Development)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### .env.production (Production)
```env
NEXT_PUBLIC_API_URL=https://api.yoursite.com
NEXT_PUBLIC_SITE_URL=https://yoursite.com
```

## 📊 Monitoring

### 1. Vercel Analytics
```typescript
// Automatic with Vercel deployment
```

### 2. Google Analytics
```typescript
// Add to layout.tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
  strategy="afterInteractive"
/>
```

### 3. Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

## 🔒 Security

### 1. Headers
```javascript
// next.config.js
headers: async () => [
  {
    source: '/:path*',
    headers: [
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin',
      },
    ],
  },
],
```

### 2. CSP (Content Security Policy)
```javascript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
}
```

## 🌍 CDN Setup

### Cloudflare
1. Add site to Cloudflare
2. Update nameservers
3. Enable caching rules
4. Configure SSL/TLS

### AWS CloudFront
1. Create distribution
2. Set origin to Vercel/Netlify
3. Configure cache behaviors
4. Add custom domain

## 📱 PWA Setup

### manifest.json
```json
{
  "name": "Job Portal",
  "short_name": "JobPortal",
  "description": "Find your dream job",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#465fff",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📈 Performance Monitoring

### Web Vitals
```typescript
// pages/_app.tsx
export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics
}
```

### Lighthouse CI
```bash
npm install -g @lhci/cli
lhci autorun
```

## 🎯 Post-Deployment

### 1. Verify Deployment
- [ ] Homepage loads correctly
- [ ] All routes accessible
- [ ] Images loading
- [ ] API calls working
- [ ] Forms submitting

### 2. Test Performance
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Test on mobile devices
- [ ] Verify loading times

### 3. Monitor Errors
- [ ] Check error logs
- [ ] Monitor API errors
- [ ] Track user issues

### 4. SEO Verification
- [ ] Submit sitemap to Google
- [ ] Verify robots.txt
- [ ] Check meta tags
- [ ] Test social sharing

## 🆘 Troubleshooting

### Build Errors
```bash
# Clear cache
rm -rf .next
npm run build
```

### Image Optimization Issues
```javascript
// next.config.js
images: {
  unoptimized: true, // Temporary fix
}
```

### Memory Issues
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

## 📞 Support

- Documentation: [Next.js Docs](https://nextjs.org/docs)
- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Community: [Next.js Discord](https://nextjs.org/discord)

## ✅ Deployment Complete!

Your Job Portal is now live and optimized for production! 🎉
