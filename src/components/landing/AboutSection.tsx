'use client';

import React from 'react';
import Image from 'next/image';
import { FadeIn, SlideUp } from '@/components/shared/Motion';

const AboutSection: React.FC = () => {
    const images = [
        {
            src: '/images/landing/about-1.jpg',
            alt: 'Professional Collaboration',
            title: 'Hợp tác tin cậy',
            description: 'Kết nối doanh nghiệp và ứng viên với sự tin tưởng tuyệt đối.',
            delay: 0
        },
        {
            src: '/images/landing/about-2.jpg',
            alt: 'Dynamic Team',
            title: 'Môi trường năng động',
            description: 'Thúc đẩy sự sáng tạo và phát triển không ngừng trong công việc.',
            delay: 0.1
        },
        {
            src: '/images/landing/about-3.jpg',
            alt: 'Leadership and Growth',
            title: 'Cơ hội thăng tiến',
            description: 'Lộ trình phát triển rõ ràng cho mọi nhân tài.',
            delay: 0.2
        }
    ];

    return (
        <section className="relative overflow-hidden bg-gray-50 py-20 dark:bg-gray-900 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                            Về chúng tôi
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Kiến tạo tương lai nghề nghiệp vững chắc với nền tảng tuyển dụng hàng đầu.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid gap-8 md:grid-cols-3">
                    {images.map((img, index) => (
                        <SlideUp key={index} delay={img.delay}>
                            <div className="group relative h-96 overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 p-6 text-white transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                                    <h3 className="text-xl font-bold mb-2">{img.title}</h3>
                                    <p className="text-sm text-gray-200 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                        {img.description}
                                    </p>
                                </div>
                            </div>
                        </SlideUp>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
