// Unsplash API Types

export interface UnsplashImage {
    id: string;
    created_at: string;
    updated_at: string;
    width: number;
    height: number;
    color: string;
    blur_hash?: string;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
    };
    alt_description: string | null;
    description: string | null;
    user: {
        id: string;
        username: string;
        name: string;
        portfolio_url: string | null;
        bio: string | null;
        location: string | null;
    };
    links: {
        self: string;
        html: string;
        download: string;
        download_location: string;
    };
}

export interface CachedImage extends UnsplashImage {
    cachedAt: number;
    expiresAt: number;
}

export interface UnsplashApiResponse {
    total: number;
    total_pages: number;
    results: UnsplashImage[];
}

export interface UnsplashError {
    errors: string[];
}
