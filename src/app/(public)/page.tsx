'use client';

import React, { useEffect, useState } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CategoriesSection from '@/components/homepage/CategoriesSection';
import FeaturedJobs from '@/components/homepage/FeaturedJobs';
import TopCompanies from '@/components/homepage/TopCompanies';
import TrustedCompanies from '@/components/landing/TrustedCompanies';
import { FadeIn, SlideUp } from '@/components/shared/Motion';
import { jobService } from '@/services/job.service';
import { categoryService } from '@/services/category.service';
import { companyService } from '@/services/company.service';
import { useToast } from '@/context/ToastContext';
import { Job } from '@/types/job';
import { Category } from '@/types/category';
import { Company } from '@/types/company';

export default function LandingPage() {
  const { info } = useToast();

  // State for data
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [topCompanies, setTopCompanies] = useState<Company[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on client side
  useEffect(() => {
    const fetchLandingPageData = async () => {
      try {
        const [categoriesRes, jobsRes, companiesRes, locationsRes] = await Promise.all([
          categoryService.getAllCategories(),
          jobService.searchJobs({ page: 0, size: 9, sort: 'createdAt,desc' }),
          companyService.searchCompanies({ page: 0, size: 9 }),
          jobService.getLocations(),
        ]);

        if (categoriesRes.data) setCategories(categoriesRes.data);
        if (jobsRes.data?.content) setFeaturedJobs(jobsRes.data.content);
        if (companiesRes.data?.content) setTopCompanies(companiesRes.data.content);
        if (locationsRes.data) setLocations(locationsRes.data);

      } catch (error) {
        console.error('Error fetching landing page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingPageData();
  }, []);

  const handleApply = (jobId: string) => {
    info('Chức năng ứng tuyển đang được phát triển');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-brand-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection locations={locations} />

      {/* Features Section */}
      <FadeIn>
        <div className="py-16 bg-white dark:bg-gray-900">
          <FeaturesSection />
        </div>
      </FadeIn>

      {/* Categories Section */}
      <SlideUp>
        <CategoriesSection categories={categories.slice(0, 8)} />
      </SlideUp>

      {/* How It Works Section */}
      <FadeIn>
        <HowItWorksSection />
      </FadeIn>

      {/* Featured Jobs Section */}
      <SlideUp>
        <FeaturedJobs
          jobs={featuredJobs}
          onApply={handleApply}
        />
      </SlideUp>

      {/* Top Companies Section */}
      <FadeIn>
        <TopCompanies companies={topCompanies} />
      </FadeIn>

      {/* Trusted Companies Section */}
      <SlideUp>
        <TrustedCompanies companies={topCompanies} />
      </SlideUp>
    </main>
  );
}
