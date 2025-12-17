import React from 'react';
import SkeletonCard from './SkeletonCard';

interface SkeletonListProps {
  count?: number;
  variant?: 'job' | 'company' | 'category';
  className?: string;
}

const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 6,
  variant = 'job',
  className = ''
}) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard
          key={index}
          variant={variant}
          className="mb-4"
        />
      ))}
    </div>
  );
};

export default SkeletonList;
