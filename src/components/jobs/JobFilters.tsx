'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface FilterState {
  jobTypes: string[];
  experienceLevels: string[];
  salaryRange: { min: number; max: number };
  datePosted: string;
  locationType: string[];
  jobLevels: string[];
}

interface JobFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  isMobile = false,
  onClose,
}) => {
  const [localMinSalary, setLocalMinSalary] = useState<string>(filters.salaryRange.min ? String(filters.salaryRange.min) : '');
  const [localMaxSalary, setLocalMaxSalary] = useState<string>(filters.salaryRange.max === 200000 ? '' : String(filters.salaryRange.max));
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalMinSalary(filters.salaryRange.min ? String(filters.salaryRange.min) : '');
    setLocalMaxSalary(filters.salaryRange.max === 200000 ? '' : String(filters.salaryRange.max));
  }, [filters.salaryRange.min, filters.salaryRange.max]);

  const jobTypes = [
    { value: 'FULL_TIME', label: 'Toàn thời gian' },
    { value: 'PART_TIME', label: 'Bán thời gian' },
    { value: 'CONTRACT', label: 'Hợp đồng' },
    { value: 'INTERNSHIP', label: 'Thực tập' },
  ];

  const experienceLevels = [
    { value: 'Không yêu cầu', label: 'Không yêu cầu' },
    { value: 'Dưới 1 năm', label: 'Dưới 1 năm' },
    { value: '1 năm', label: '1 năm' },
    { value: '2 năm', label: '2 năm' },
    { value: '3 năm', label: '3 năm' },
    { value: '4 năm', label: '4 năm' },
    { value: '5 năm', label: '5 năm' },
    { value: 'Trên 5 năm', label: 'Trên 5 năm' },
  ];

  const locationTypes = [
    { value: 'OFFLINE', label: 'Làm tại văn phòng' },
    { value: 'ONLINE', label: 'Làm từ xa' },
    { value: 'HYBRID', label: 'Linh hoạt' },
  ];

  const levelOptions = [
    { value: 'INTERN', label: 'Thực tập sinh' },
    { value: 'FRESHER', label: 'Fresher' },
    { value: 'JUNIOR', label: 'Junior' },
    { value: 'MIDDLE', label: 'Middle' },
    { value: 'SENIOR', label: 'Senior' },
    { value: 'LEADER', label: 'Trưởng nhóm' },
    { value: 'MANAGER', label: 'Trưởng phòng' },
    { value: 'DIRECTOR', label: 'Giám đốc' },
  ];

  const handleCheckboxChange = (
    field: 'jobTypes' | 'experienceLevels' | 'locationType' | 'jobLevels',
    value: string
  ) => {
    const currentValues = filters[field] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    onFilterChange({ ...filters, [field]: newValues });
  };

  const handleSalaryInputChange = (type: 'min' | 'max', inputValue: string) => {
    if (type === 'min') {
      setLocalMinSalary(inputValue);
    } else {
      setLocalMaxSalary(inputValue);
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const numValue = Number(inputValue) || (type === 'max' ? 200000 : 0);
      onFilterChange({
        ...filters,
        salaryRange: { ...filters.salaryRange, [type]: numValue },
      });
    }, 500);
  };

  // Radio circle component
  const RadioCircle = ({ selected }: { selected: boolean }) => (
    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'border-brand-500' : 'border-gray-300 dark:border-gray-600'
      }`}>
      {selected && <div className="w-2 h-2 rounded-full bg-brand-500" />}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 dark:text-white">Bộ lọc</h2>
        {isMobile && onClose && (
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Job Type */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Loại công việc</h3>
        <div className="grid grid-cols-2 gap-2">
          {jobTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => handleCheckboxChange('jobTypes', type.value)}
              className="flex items-center gap-2 py-1 text-left"
            >
              <RadioCircle selected={filters.jobTypes.includes(type.value)} />
              <span className={`text-sm ${filters.jobTypes.includes(type.value)
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400'
                }`}>
                {type.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Location Type */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Hình thức làm việc</h3>
        <div className="grid grid-cols-2 gap-2">
          {locationTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => handleCheckboxChange('locationType', type.value)}
              className="flex items-center gap-2 py-1 text-left"
            >
              <RadioCircle selected={filters.locationType.includes(type.value)} />
              <span className={`text-sm ${filters.locationType.includes(type.value)
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400'
                }`}>
                {type.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Kinh nghiệm</h3>
        <div className="grid grid-cols-2 gap-2">
          {experienceLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => handleCheckboxChange('experienceLevels', level.value)}
              className="flex items-center gap-2 py-1 text-left"
            >
              <RadioCircle selected={filters.experienceLevels.includes(level.value)} />
              <span className={`text-sm ${filters.experienceLevels.includes(level.value)
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400'
                }`}>
                {level.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Job Level */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Cấp bậc</h3>
        <div className="grid grid-cols-2 gap-2">
          {levelOptions.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => handleCheckboxChange('jobLevels', level.value)}
              className="flex items-center gap-2 py-1 text-left"
            >
              <RadioCircle selected={filters.jobLevels.includes(level.value)} />
              <span className={`text-sm ${filters.jobLevels.includes(level.value)
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400'
                }`}>
                {level.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Salary */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Mức lương (VNĐ)</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-8 text-sm text-gray-500">Từ</span>
            <input
              type="number"
              value={localMinSalary}
              onChange={(e) => handleSalaryInputChange('min', e.target.value)}
              placeholder="0"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8 text-sm text-gray-500">Đến</span>
            <input
              type="number"
              value={localMaxSalary}
              onChange={(e) => handleSalaryInputChange('max', e.target.value)}
              placeholder="Tối đa"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={onReset}
        className="w-full py-2.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
      >
        Xóa tất cả bộ lọc
      </button>
    </div>
  );
};

export default JobFilters;
