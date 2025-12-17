"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookmarkIcon } from "@/components/shared/icons";
import Button from "@/components/ui/button/Button";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    logo: string;
    location: string;
    salary: string;
    type: string;
    remaining: string;
    isFavorite: boolean;
  };
  onToggleFavorite?: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onToggleFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(job.isFavorite);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    setIsFavorite(!isFavorite);

    if (onToggleFavorite) {
      onToggleFavorite(job.id);
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-lg border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-theme-md hover:border-brand-200 dark:hover:border-brand-500/30 transition-all duration-200 group">
      {/* Left: Job Info */}
      <div className="flex items-start sm:items-center space-x-4 flex-1 min-w-0">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Image
              src={job.logo}
              alt={job.company}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Job Details */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/jobs/${job.id}`}
            className="font-semibold text-gray-900 dark:text-white/90 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200 line-clamp-1"
          >
            {job.title}
          </Link>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
            <span>{job.location}</span>
            <span className="hidden sm:inline">•</span>
            <span>{job.salary}</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-brand-600 dark:text-brand-400 font-medium">
              {job.type}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
        {/* Time Remaining */}
        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap hidden md:block">
          {job.remaining}
        </span>

        {/* Bookmark Button */}
        <button
          onClick={handleToggleFavorite}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isFavorite
              ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10"
              : "text-gray-400 dark:text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-white/5"
          } ${isAnimating ? "scale-110" : ""}`}
          aria-label={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          aria-pressed={isFavorite}
        >
          <BookmarkIcon
            className="w-5 h-5 transition-all duration-200"
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>

        {/* Apply Button */}
        <Link href={`/jobs/${job.id}`}>
          <Button
            variant="outline"
            className="text-sm py-2 px-4 whitespace-nowrap hover:bg-brand-600 hover:text-white hover:border-brand-600 dark:hover:bg-brand-500 dark:hover:border-brand-500 transition-all duration-200"
          >
            Ứng tuyển
          </Button>
        </Link>
      </div>
    </div>
  );
};
