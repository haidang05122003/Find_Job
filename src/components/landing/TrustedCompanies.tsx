'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Company } from '@/types/company';

const TrustedCompanies: React.FC<{ companies: Company[] }> = ({ companies }) => {
    // If no companies are provided, don't render or show loading state? 
    // For now, let's gracefully handle empty array by mapping whatever is there.
    // Actually, we should use the duplicated list logic for the marquee.

    // Ensure we have enough items for a smooth marquee even if fetch returns few
    const displayCompanies = companies.length > 0 ? companies : [];
    // Duplicate at least enough times to fill width. 
    // If we have 10, 2 repeats is 20, usually enough. 3 is safer.
    const duplicatedCompanies = [...displayCompanies, ...displayCompanies, ...displayCompanies];

    if (companies.length === 0) return null;

    return (
        <section className="bg-gray-50 py-16 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-8">
                    Được tin tưởng bởi hơn {companies.length * 100}+ công ty hàng đầu
                </p>

                <div className="relative flex overflow-hidden mask-linear-gradient">
                    <motion.div
                        className="flex gap-12 sm:gap-24 items-center whitespace-nowrap"
                        // Actually, for a perfect loop with Framer Motion, it's best to wrap the children.
                        // Let's use X: "-100%" of the container? No.
                        // Let's revert to a CSS animation class if Framer Motion is tricky with dynamic width, 
                        // OR calculate it.
                        // Let's try x: ["0%", "-33.33%"] since we triplicated the list?
                        // Yes, if we have 3 sets, scrolling 33.33% effectively scrolls exactly one set, returning to start of second set which looks identical to start of first.
                        // That is the standard marquee trick.
                        animate={{
                            x: ["0%", "-33.33%"],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: Math.max(20, companies.length * 2), // Adjust speed based on count
                                ease: "linear",
                            },
                        }}
                    >
                        {duplicatedCompanies.map((company, index) => (
                            <div
                                key={`${company.id}-${index}`}
                                className="flex items-center gap-4 transition-all duration-300 group cursor-pointer hover:opacity-100 opacity-90"
                            >
                                {/* Logo */}
                                <div className="relative h-10 w-10 overflow-hidden transition-all duration-300">
                                    <img
                                        src={company.logo && company.logo.startsWith('http') ? company.logo : `http://localhost:8080${company.logo || '/images/company-placeholder.png'}`}
                                        alt={company.name}
                                        className="h-full w-full object-contain"
                                        onError={(e) => {
                                            // Fallback to initial
                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random`;
                                        }}
                                    />
                                </div>
                                {/* Name */}
                                <span className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors">
                                    {company.name}
                                </span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Fade Gradients for smooth edges */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900" />
                </div>
            </div>
        </section>
    );
};

export default TrustedCompanies;
