import React, { useState, useEffect } from 'react';
import { formatCurrency } from "@/lib/utils";

export interface FilterState {
    jobTypes: string[];
    experienceLevels: string[];
    salaryRange: { min: number; max: number };
    datePosted: string;
    locationType: string[];
    jobLevels: string[];
}

interface AdvanceFilterProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    onReset: () => void;
    isOpen: boolean;
    onClose: () => void;
}

const AdvanceFilter: React.FC<AdvanceFilterProps> = ({
    filters,
    onFilterChange,
    onReset,
    isOpen,
    onClose,
}) => {
    const [localFilters, setLocalFilters] = useState<FilterState>(filters);

    useEffect(() => {
        if (isOpen) {
            setLocalFilters(filters);
        }
    }, [isOpen, filters]);

    if (!isOpen) return null;

    const jobTypes = [
        { value: 'FULL_TIME', label: 'Toàn thời gian' },
        { value: 'PART_TIME', label: 'Bán thời gian' },
        { value: 'CONTRACT', label: 'Hợp đồng' },
        { value: 'INTERNSHIP', label: 'Thực tập' },
        { value: 'REMOTE', label: 'Làm từ xa' },
        { value: 'TEMPORARY', label: 'Tạm thời' },
    ];

    const experienceLevels = [
        { value: 'Không yêu cầu', label: 'Mới tốt nghiệp / Thực tập' },
        { value: 'Dưới 1 năm', label: '1 - 2 Năm' },
        { value: '1 năm', label: '2 - 4 Năm' },
        { value: '3 năm', label: '4 - 6 Năm' },
        { value: '5 năm', label: '6 - 8 Năm' },
        { value: 'Trên 5 năm', label: '10 - 15 Năm' },
        { value: 'Expert', label: 'Trên 15 Năm' },
    ];

    const jobLevelOptions = [
        { value: 'INTERN', label: 'Thực tập sinh' },
        { value: 'FRESHER', label: 'Fresher' },
        { value: 'JUNIOR', label: 'Junior' },
        { value: 'MIDDLE', label: 'Middle' },
        { value: 'SENIOR', label: 'Senior' },
        { value: 'LEADER', label: 'Trưởng nhóm' },
        { value: 'MANAGER', label: 'Trưởng phòng' },
        { value: 'DIRECTOR', label: 'Giám đốc' },
    ];

    const handleCheckboxChange = (field: keyof FilterState, value: string) => {
        // @ts-ignore
        const currentList = localFilters[field] as string[];
        const newList = currentList.includes(value)
            ? currentList.filter(item => item !== value)
            : [...currentList, value];

        setLocalFilters({ ...localFilters, [field]: newList });
    };

    const handleSalaryChange = (type: 'min' | 'max', value: string) => {
        // Remove non-numeric characters
        const numericValue = parseInt(value.replace(/\D/g, ''), 10) || 0;
        setLocalFilters({
            ...localFilters,
            salaryRange: {
                ...localFilters.salaryRange,
                [type]: numericValue
            }
        });
    };



    const handleApply = () => {
        onFilterChange(localFilters);
        onClose();
    };

    return (
        <div className="absolute top-full right-0 mt-2 w-[900px] z-50 rounded-xl bg-white p-8 shadow-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <div className="grid grid-cols-4 gap-8">
                {/* Experience Column */}
                <div>
                    <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">Kinh nghiệm</h3>
                    <div className="space-y-3">
                        {experienceLevels.map((exp) => (
                            <label key={exp.value} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${localFilters.experienceLevels.includes(exp.value)
                                    ? 'border-brand-500 bg-brand-500'
                                    : 'border-gray-300 group-hover:border-brand-300 dark:border-gray-600'
                                    }`}>
                                    {localFilters.experienceLevels.includes(exp.value) && (
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={localFilters.experienceLevels.includes(exp.value)}
                                    onChange={() => handleCheckboxChange('experienceLevels', exp.value)}
                                />
                                <span className="text-gray-600 dark:text-gray-300 group-hover:text-brand-500 font-medium text-sm">{exp.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Salary Column (Custom Input) */}
                <div>
                    <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">Mức lương (VND)</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Tối thiểu</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formatCurrency(localFilters.salaryRange.min)}
                                    onChange={(e) => handleSalaryChange('min', e.target.value)}
                                    placeholder="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                                />
                                <span className="absolute right-3 top-2 text-gray-400 text-xs">₫</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Tối đa</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formatCurrency(localFilters.salaryRange.max)}
                                    onChange={(e) => handleSalaryChange('max', e.target.value)}
                                    placeholder="Không giới hạn"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                                />
                                <span className="absolute right-3 top-2 text-gray-400 text-xs">₫</span>
                            </div>
                        </div>
                        <p className="text-xs text-brand-600 italic">Nhập 0 để không giới hạn</p>
                    </div>
                </div>

                {/* Job Type Column */}
                <div>
                    <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">Loại công việc</h3>
                    <div className="space-y-3">
                        {jobTypes.map((type) => (
                            <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${localFilters.jobTypes.includes(type.value)
                                    ? 'border-brand-500 bg-brand-500'
                                    : 'border-gray-300 group-hover:border-brand-300 dark:border-gray-600'
                                    }`}>
                                    {localFilters.jobTypes.includes(type.value) && (
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={localFilters.jobTypes.includes(type.value)}
                                    onChange={() => handleCheckboxChange('jobTypes', type.value)}
                                />
                                <span className="text-gray-600 dark:text-gray-300 group-hover:text-brand-500 font-medium text-sm">{type.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Job Level Column */}
                <div>
                    <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">Cấp bậc</h3>
                    <div className="space-y-3">
                        {jobLevelOptions.map((level) => (
                            <label key={level.value} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${localFilters.jobLevels.includes(level.value)
                                    ? 'border-brand-500 bg-brand-500'
                                    : 'border-gray-300 group-hover:border-brand-300 dark:border-gray-600'
                                    }`}>
                                    {localFilters.jobLevels.includes(level.value) && (
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={localFilters.jobLevels.includes(level.value)}
                                    onChange={() => handleCheckboxChange('jobLevels', level.value)}
                                />
                                <span className="text-gray-600 dark:text-gray-300 group-hover:text-brand-500 font-medium text-sm">{level.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={onReset}
                    className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                >
                    Hủy bỏ
                </button>
                <button
                    onClick={handleApply}
                    className="px-8 py-2.5 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                    Áp dụng
                </button>
            </div>
        </div>
    );
};

export default AdvanceFilter;
