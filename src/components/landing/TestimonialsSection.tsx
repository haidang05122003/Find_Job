'use client';

import React from 'react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Nguyễn Văn An',
      role: 'Senior Developer',
      company: 'Tech Corp',
      avatar: '👨‍💻',
      content: 'Tôi đã tìm được công việc mơ ước chỉ sau 2 tuần sử dụng nền tảng này. Giao diện thân thiện và quy trình ứng tuyển rất nhanh chóng!',
      rating: 5,
    },
    {
      name: 'Trần Thị Bình',
      role: 'UX Designer',
      company: 'Design Studio',
      avatar: '👩‍🎨',
      content: 'Nền tảng tuyệt vời với nhiều công việc chất lượng. Tôi đã nhận được nhiều lời mời phỏng vấn từ các công ty hàng đầu.',
      rating: 5,
    },
    {
      name: 'Lê Minh Cường',
      role: 'Product Manager',
      company: 'Startup Inc',
      avatar: '👨‍💼',
      content: 'Công cụ tìm kiếm thông minh giúp tôi tiết kiệm rất nhiều thời gian. Highly recommended!',
      rating: 5,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-20 dark:bg-gray-950 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Người dùng nói gì về chúng tôi
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Hàng nghìn người đã tìm được công việc mơ ước
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="group animate-fade-in-stagger"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:border-gray-800 dark:from-gray-900 dark:to-gray-800">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-6xl text-brand-500/10">
                  &quot;
                </div>

                {/* Rating */}
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <p className="relative mb-6 text-gray-700 dark:text-gray-300">
                  {testimonial.content}
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-purple-600 text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role} tại {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
