
import React from 'react';
import Button from '@/components/shared/Button';
import { Job } from '@/types/job';

interface JobApplicationInfoProps {
    job: Job;
    onApply: () => void;
    onSave: () => void;
    isSaved: boolean;
}

const JobApplicationInfo: React.FC<JobApplicationInfoProps> = ({
    job,
    onApply,
    onSave,
    isSaved,
}) => {
    // Format deadline if valid date
    const formattedDeadline = job.expiresAt
        ? new Date(job.expiresAt).toLocaleDateString('vi-VN')
        : 'Chưa cập nhật';

    return (
        <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8">

            {/* Location */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Địa điểm làm việc <span className="text-sm font-normal text-gray-500 italic">(đã được cập nhật theo Danh mục Hành chính mới)</span>
                </h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                    - {job.location}
                </p>
            </div>

            {/* Working Time */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Thời gian làm việc
                </h3>
                <ul className="mt-2 list-disc pl-5 text-gray-700 dark:text-gray-300">
                    <li>Thứ 2 - Thứ 6 (từ 08:00 đến 17:00)</li>
                </ul>
            </div>

            {/* How to Apply */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Cách thức ứng tuyển
                </h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                    Ứng viên nộp hồ sơ trực tuyến bằng cách bấm <span className="font-bold">Ứng tuyển</span> ngay dưới đây.
                </p>
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                    Hạn nộp hồ sơ: {formattedDeadline}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                    className="flex-1 bg-brand-500 hover:bg-brand-600 border-transparent text-white font-bold py-3 rounded-md uppercase"
                    onClick={onApply}
                >
                    Ứng tuyển ngay
                </Button>
                <button
                    onClick={onSave}
                    className={`flex-1 rounded-md border py-3 font-bold uppercase transition ${isSaved
                        ? 'border-brand-500 text-brand-500 bg-brand-50'
                        : 'border-brand-500 text-brand-500 hover:bg-gray-50'
                        }`}
                >
                    {isSaved ? 'Đã lưu' : 'Lưu tin'}
                </button>
            </div>

            {/* Alert Box */}
            <div className="mt-4 flex items-start gap-3 rounded-lg bg-brand-50 p-4 text-sm text-gray-700 dark:bg-brand-900/10 dark:text-gray-300">
                <svg className="h-5 w-5 flex-shrink-0 text-brand-600 dark:text-brand-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                    Báo cáo tin tuyển dụng: Nếu bạn thấy rằng tin tuyển dụng này không đúng hoặc có dấu hiệu lừa đảo, <a href="#" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">hãy phản ánh với chúng tôi.</a>
                </span>
            </div>

        </div>
    );
};

export default JobApplicationInfo;
