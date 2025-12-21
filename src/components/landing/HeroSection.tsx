'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFilters } from '@/context/FilterContext';
import Button from '@/components/shared/Button';
import { t } from '@/lib/i18n';
import { jobService } from '@/services/job.service';
import { companyService } from '@/services/company.service';
import { candidateService } from '@/services/candidate.service';
import { categoryService } from '@/services/category.service';
import { AnimatePresence, motion } from 'framer-motion';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  stats?: {
    jobs: number;
    companies: number;
    candidates: number;
    newJobs: number;
  };
  locations?: string[];
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = t('home.hero.title'),
  subtitle = t('home.hero.subtitle'),
  locations = [],
}) => {
  const router = useRouter();
  useFilters(); // Context hook for potential future use

  const [stats, setStats] = useState({
    jobs: 0,
    companies: 0,
    candidates: 0,
    newJobs: 0,
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [popularCategories, setPopularCategories] = useState<any[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {

        // Optimize: Only fetch categories needed for dynamic UI, use static stats
        const categoriesRes = await categoryService.getAllCategories();

        if (categoriesRes.data) {
          setCategories(categoriesRes.data.map(c => c.name));
        }

        if (categoriesRes.success && categoriesRes.data) {
          // Sort by jobCount (descending) and take top 10
          const sortedCategories = [...categoriesRes.data]
            .sort((a, b) => (b.jobCount || 0) - (a.jobCount || 0))
            .slice(0, 10);
          setPopularCategories(sortedCategories);
        }

        // Use static data to reduce API calls as requested
        setStats({
          jobs: 1250,
          companies: 80,
          candidates: 4500,
          newJobs: 120,
        });

      } catch (error) {
        console.error('Error fetching hero data:', error);
      }
    };

    fetchData();
  }, []);

  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');


  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (jobTitle.trim()) params.set('q', jobTitle.trim());
    if (location.trim()) params.set('locations', location.trim());
    if (category) params.set('categories', category);

    if (params.toString()) {
      router.push(`/jobs?${params.toString()}`);
    } else {
      router.push('/jobs');
    }
  }, [jobTitle, location, category, router]);

  // Static filters removed in favor of dynamic categories

  const handleQuickFilter = (categoryName: string) => {
    const params = new URLSearchParams();
    params.set('categories', categoryName);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative w-full min-h-[650px] lg:min-h-[800px] flex items-center justify-center overflow-hidden">

      {/* Modern Gradient Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Decorative floating orbs */}
        <div className="absolute top-10 left-[5%] w-80 h-80 bg-gradient-to-br from-blue-500/30 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-32 right-[10%] w-96 h-96 bg-gradient-to-br from-purple-600/25 to-pink-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-[20%] w-72 h-72 bg-gradient-to-br from-cyan-400/25 to-teal-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-[15%] w-64 h-64 bg-gradient-to-br from-indigo-500/30 to-violet-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Radial gradient spotlight effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.15)_0%,_transparent_70%)]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center text-center">

          {/* Main Headings */}
          <div className="max-w-5xl mx-auto flex flex-col items-center">
            <h1 className="animate-fade-in text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
              {title}
            </h1>
            <p className="mt-6 animate-fade-in text-lg text-blue-100 font-medium sm:text-xl max-w-2xl" style={{ animationDelay: '0.1s' }}>
              {subtitle}
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mt-10 animate-fade-in w-full max-w-4xl relative z-20" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col gap-3 rounded-2xl bg-white/95 backdrop-blur-md p-4 shadow-2xl shadow-black/20 border border-white/30 sm:flex-row">
                {/* Job Title Input */}
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder={t('home.hero.searchPlaceholder')}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                {/* Location Input with Datalist */}
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    list="locations-list"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={t('home.hero.locationPlaceholder')}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <datalist id="locations-list">
                    {locations.map((loc) => (
                      <option key={loc} value={loc} />
                    ))}
                  </datalist>
                </div>

                {/* Custom Category Dropdown */}
                <div className="relative flex-1" ref={categoryRef}>
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-8 text-sm text-left text-gray-900 transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 flex items-center justify-between"
                  >
                    <span className={category ? 'text-gray-900' : 'text-gray-500'}>
                      {category || t('home.hero.categoryPlaceholder')}
                    </span>
                    <svg
                      className={`h-4 w-4 text-gray-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {isCategoryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 top-full mt-2 z-50 max-h-60 overflow-auto rounded-xl border border-gray-100 bg-white shadow-lg p-1"
                      >
                        <div
                          className="cursor-pointer rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2952FF] transition-colors"
                          onClick={() => {
                            setCategory('');
                            setIsCategoryOpen(false);
                          }}
                        >
                          {t('home.hero.categoryPlaceholder')}
                        </div>
                        {categories.map((cat) => (
                          <div
                            key={cat}
                            className={`cursor-pointer rounded-lg px-4 py-2.5 text-sm transition-colors ${category === cat
                              ? 'bg-blue-50 text-[#2952FF] font-medium'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-[#2952FF]'
                              }`}
                            onClick={() => {
                              setCategory(cat);
                              setIsCategoryOpen(false);
                            }}
                          >
                            {cat}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Search Button */}
                <Button type="submit" size="lg" className="sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border-none shadow-blue-500/30 font-semibold px-8">
                  {t('home.hero.searchButton')}
                </Button>
              </div>
            </form>

            {/* Quick Filters */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <span className="text-sm font-semibold text-blue-200">Gợi ý:</span>
              {popularCategories.map((cat) => (
                <button
                  key={cat.id || cat.name}
                  onClick={() => handleQuickFilter(cat.name)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-white hover:text-blue-600 hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mt-20 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 animate-fade-in max-w-5xl mx-auto" style={{ animationDelay: '0.5s' }}>
          {[
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
              value: stats.jobs,
              label: t('home.stats.jobs'),
              color: 'text-blue-600 bg-blue-50'
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              ),
              value: stats.companies,
              label: t('home.stats.companies'),
              color: 'text-blue-600 bg-blue-50'
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ),
              value: stats.candidates,
              label: t('home.stats.candidates'),
              color: 'text-blue-600 bg-blue-50'
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              value: stats.newJobs,
              label: t('home.stats.newJobs'),
              color: 'text-blue-600 bg-blue-50'
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="group rounded-2xl border border-white/20 bg-white/95 backdrop-blur-md p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-white"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {stat.value.toLocaleString()}
              </div>
              <div className="mt-1 text-sm font-medium text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
