'use client';

import React from 'react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Tạo tài khoản',
      description: 'Đăng ký miễn phí và tạo hồ sơ chuyên nghiệp của bạn',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      number: '02',
      title: 'Tìm kiếm công việc',
      description: 'Khám phá hàng nghìn công việc phù hợp với kỹ năng của bạn',
      color: 'from-purple-500 to-pink-500',
    },
    {
      number: '03',
      title: 'Ứng tuyển',
      description: 'Gửi hồ sơ và theo dõi tiến trình ứng tuyển',
      color: 'from-green-500 to-emerald-500',
    },
    {
      number: '04',
      title: 'Nhận việc',
      description: 'Nhận được công việc mơ ước và bắt đầu sự nghiệp mới',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 py-20 dark:from-gray-900 dark:to-gray-950 sm:py-28">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Cách thức hoạt động
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Chỉ 4 bước đơn giản để tìm được công việc mơ ước
          </p>
        </div>

        {/* Steps Container with Connecting Line */}
        <div className="relative mt-16">
          {/* Horizontal Connecting Line - positioned at circle center */}
          <div className="absolute top-16 left-[12.5%] right-[12.5%] hidden h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-orange-300 lg:block" />

          {/* Steps Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative animate-fade-in-stagger flex flex-col items-center"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Circle Icon Container */}
                <div className="relative mb-6">
                  {/* Main Circle with Number */}
                  <div className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${step.color} shadow-xl ring-4 ring-white dark:ring-gray-800 transition-transform group-hover:scale-110 duration-300`}>
                    <span className="text-3xl font-bold text-white drop-shadow-md">{step.number}</span>
                  </div>
                </div>

                {/* Content - fixed height for consistency */}
                <div className="text-center flex flex-col items-center">
                  <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 max-w-[200px] min-h-[40px]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition hover:scale-105 hover:shadow-brand-500/50">
            Bắt đầu ngay
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
