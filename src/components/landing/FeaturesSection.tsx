'use client';

import React from 'react';
import Link from 'next/link';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Tìm kiếm nhanh chóng',
      description: 'Giúp bạn tìm được công việc phù hợp nhất với kỹ năng và kinh nghiệm',
      color: 'from-blue-500 to-cyan-500',
      link: '/jobs',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Ứng tuyển nhanh chóng',
      description: 'Chỉ với một cú click, hồ sơ của bạn sẽ được gửi đến nhà tuyển dụng ngay lập tức',
      color: 'from-purple-500 to-pink-500',
      link: '/jobs',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Bảo mật tuyệt đối',
      description: 'Thông tin cá nhân của bạn được bảo vệ với công nghệ mã hóa',
      color: 'from-green-500 to-emerald-500',
      link: '/privacy',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Chat realtime',
      description: 'Chat trực tiếp với nhà tuyển dụng theo thời gian thực',
      color: 'from-orange-500 to-red-500',
      link: '/messages',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-20 dark:bg-gray-950 sm:py-28">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-gray-900/[0.04] dark:bg-grid-white/[0.02]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Tại sao chọn chúng tôi?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Nền tảng tuyển dụng hiện đại với nhiều tính năng vượt trội
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative animate-fade-in-stagger h-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link href={feature.link} className='block h-full'>
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900 h-full flex flex-col">
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} />

                  {/* Icon */}
                  <div className={`relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                    {feature.icon}
                  </div>



                  {/* Content */}
                  <h3 className="relative mb-3 text-xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="relative text-sm text-gray-600 dark:text-gray-400 flex-1">
                    {feature.description}
                  </p>

                  {/* Arrow Icon */}
                  <div className="relative mt-4 flex items-center text-sm font-medium text-brand-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-brand-400">
                    Tìm hiểu thêm
                    <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
