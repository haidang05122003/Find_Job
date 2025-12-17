"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/button/Button";
import { ChevronRightIcon } from "./icons";

export interface JobCardProps {
  id?: number;
  logo: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  onApply?: () => void;
}

const FeaturedJobCard: React.FC<JobCardProps> = ({
  id = 1,
  logo,
  title,
  company,
  location,
  type,
  category,
  onApply,
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center justify-between mb-4">
      {/* Company logo + title */}
      <Link href={`/jobs/${id}`} className="flex items-center space-x-4 flex-1">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={logo}
            alt={company}
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {company} • {location}
          </p>
        </div>
      </Link>

      {/* Bookmark icon placeholder */}
      <Link href={`/jobs/${id}`} className="text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200">
        <ChevronRightIcon />
      </Link>
    </div>

    {/* Tags */}
    <div className="flex items-center space-x-2 mb-4">
      <span className="bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-400 px-3 py-1 rounded-full text-xs font-medium">
        {type}
      </span>
      <span className="bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-400 px-3 py-1 rounded-full text-xs font-medium">
        {category}
      </span>
    </div>

    {/* Salary + Apply */}
    <div className="flex items-center justify-between">
      <p className="text-lg font-bold text-brand-500 dark:text-brand-400">
        75,000,000₫
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/năm</span>
      </p>

      <Link href={`/jobs/${id}`}>
        <Button
          variant="outline"
          onClick={onApply}
          className="px-4 py-2 text-sm flex items-center gap-1"
        >
          Ứng tuyển ngay
          <ChevronRightIcon />
        </Button>
      </Link>
    </div>
  </div>
);

export default FeaturedJobCard;

