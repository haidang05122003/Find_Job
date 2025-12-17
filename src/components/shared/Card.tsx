import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface CardProps {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  children,
  onClick,
}) => {
  const baseStyles = 'rounded-xl bg-white dark:bg-gray-900 transition-all duration-200';

  const variantStyles = {
    default: 'border border-gray-200 dark:border-gray-800',
    bordered: 'border-2 border-gray-200 dark:border-gray-800',
    elevated: 'shadow-theme-md',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverStyles = hover
    ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:border-brand-500 dark:hover:border-brand-500'
    : '';

  const cardClasses = twMerge(
    baseStyles,
    variantStyles[variant],
    paddingStyles[padding],
    hoverStyles,
    className
  );

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
