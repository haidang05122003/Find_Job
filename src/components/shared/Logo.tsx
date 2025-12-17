"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Logo Component - JobViet
 * System-synchronized colors using brand palette
 */
export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = "md"
}) => {
  // Size configurations
  const sizeConfig = {
    sm: { iconSize: 28, title: "text-lg", tagline: "text-[9px]" },
    md: { iconSize: 36, title: "text-xl", tagline: "text-[10px]" },
    lg: { iconSize: 44, title: "text-2xl", tagline: "text-xs" },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={`
        flex items-center gap-1.5
        transition-all duration-200 ease-out
        hover:opacity-90
        ${className}
      `}
    >
      {/* Icon */}
      <Image
        src="/images/logo/logo-icon.png"
        alt="JobViet Logo"
        width={config.iconSize}
        height={config.iconSize}
        className="flex-shrink-0 object-contain"
        priority
        unoptimized
      />

      {/* Text - Using system brand colors */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline">
          <span className={`font-bold text-gray-900 dark:text-white ${config.title}`}>
            Job
          </span>
          <span className={`font-bold text-brand-500 ${config.title}`}>
            Viet
          </span>
        </div>
        <span className={`text-gray-500 dark:text-gray-400 italic ${config.tagline} mt-0.5`}>
          Nắm Bắt Tương Lai
        </span>
      </div>
    </div>
  );
};

export default Logo;
