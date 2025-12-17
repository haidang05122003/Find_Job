"use client";

import React from "react";
import FeaturedJobCard, {
  JobCardProps,
} from "./FeaturedJobCard";

const FeaturedJobsSection: React.FC = () => {
  // Dữ liệu job demo
  type Job = Omit<JobCardProps, "onApply">;

  const jobs: Job[] = [
    {
      logo: "https://placehold.co/48x48/F3E8FF/A855F7?text=U",
      title: "UI/UX Designer",
      company: "Upwork",
      location: "Hà Nội",
      type: "Toàn thời gian",
      category: "Thiết kế",
    },
    {
      logo: "https://placehold.co/48x48/ECFDF5/10B981?text=C",
      title: "Creative Designer",
      company: "Canva",
      location: "Làm việc từ xa",
      type: "Bán thời gian",
      category: "Thiết kế",
    },
    {
      logo: "https://placehold.co/48x48/DBEAFE/3B82F6?text=J",
      title: "Frontend Developer",
      company: "TechCorp",
      location: "TP. Hồ Chí Minh",
      type: "Toàn thời gian",
      category: "Phát triển",
    },
    {
      logo: "https://placehold.co/48x48/FFFBEB/F59E0B?text=P",
      title: "Product Manager",
      company: "StartupX",
      location: "Đà Nẵng",
      type: "Toàn thời gian",
      category: "Quản lý",
    },
  ];

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          Việc làm nổi bật
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job, index) => (
            <FeaturedJobCard key={index} {...job} id={index + 1} onApply={() => { }} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobsSection;

