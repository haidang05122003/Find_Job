import React from 'react';
import { Job } from '@/types/job';
import { formatSalary } from '@/lib/utils/jobHelpers';

interface JobOverviewSidebarProps {
    job: Job;
}

const LEVEL_LABELS: Record<string, string> = {
    INTERN: 'Thực tập sinh',
    FRESHER: 'Fresher',
    JUNIOR: 'Junior',
    MIDDLE: 'Middle',
    SENIOR: 'Senior',
    LEADER: 'Trưởng nhóm',
    MANAGER: 'Trưởng phòng',
    DIRECTOR: 'Giám đốc',
    VICE_PRESIDENT: 'Phó chủ tịch',
    // Fallbacks
    STAFF: 'Nhân viên',
    TEAM_LEADER: 'Trưởng nhóm',
};

const JobOverviewSidebar: React.FC<JobOverviewSidebarProps> = ({ job }) => {

    const getLevelLabel = (level?: string) => {
        if (!level) return 'Nhân viên';
        return LEVEL_LABELS[level] || level;
    };

    const infoItems = [
        {
            icon: (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-500">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
            ),
            label: "Cấp bậc",
            value: getLevelLabel(job.level)
        },
        {
            icon: (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-500">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
            ),
            label: "Số lượng tuyển",
            value: `${job.quantity} người`
        },
        {
            icon: (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-500">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
            ),
            label: "Hình thức làm việc",
            value: job.jobType === 'full-time' ? 'Toàn thời gian' : job.jobType === 'part-time' ? 'Bán thời gian' : job.jobType === 'contract' ? 'Hợp đồng' : 'Thực tập'
        },
        {
            icon: (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-500">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            ),
            label: "Giới tính",
            value: job.gender === 'MALE' ? 'Nam' : job.gender === 'FEMALE' ? 'Nữ' : 'Không yêu cầu'
        }
    ];

    const locations = job.locations && job.locations.length > 0 ? job.locations : [job.location];
    const skills = job.skills || [];
    const keywords = job.keywords || [];

    return (
        <div className="space-y-6">
            {/* 1. Thông tin chung (General Info) */}
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                    Thông tin chung
                </h3>

                <div className="space-y-6">
                    {infoItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                            {item.icon}
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Kỹ năng cần có (Skills) */}
            {skills.length > 0 && (
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                    <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                        Kỹ năng cần có
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, idx) => (
                            <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer dark:bg-blue-900/30 dark:text-blue-300">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. Khu vực (Locations) */}
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                    Khu vực
                </h3>
                <div className="flex flex-wrap gap-2">
                    {locations.map((loc, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer dark:bg-gray-800 dark:text-gray-300">
                            {loc}
                        </span>
                    ))}
                </div>
            </div>

            {/* 4. Từ khóa (Keywords/Tags) */}
            {keywords.length > 0 && (
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                    <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                        Từ khóa
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {keywords.map((kw, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer dark:bg-gray-800 dark:text-gray-300">
                                {kw}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobOverviewSidebar;
