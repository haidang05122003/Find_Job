
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Company } from '@/types/company';
import { Job } from '@/types/job';
import { companyService } from '@/services/company.service';
import { jobService } from '@/services/job.service';
import Button from '@/components/shared/Button';
import CompanyJobCard from '@/components/company/CompanyJobCard';

export default function CompanyDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [company, setCompany] = useState<Company | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [locationFilter, setLocationFilter] = useState('');

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                // 1. Fetch Company Info
                const companyRes = await companyService.getCompanyDetail(id);
                if (companyRes.success && companyRes.data) {
                    setCompany(companyRes.data);
                } else {
                    setError('Không tìm thấy thông tin công ty');
                    return;
                }

                // 2. Fetch Jobs by Company
                // Using searchJobs with companyId param
                const jobsRes = await jobService.searchJobs({ companyId: id, size: 20 });
                if (jobsRes.success && jobsRes.data) {
                    setJobs(jobsRes.data.content);
                }
            } catch (err) {
                console.error(err);
                setError('Đã xảy ra lỗi khi tải dữ liệu');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanyDetails();
    }, [id]);

    const handleSearch = async () => {
        try {
            const jobsRes = await jobService.searchJobs({
                companyId: id,
                title: searchKeyword,
                location: locationFilter
            });
            if (jobsRes.success && jobsRes.data) {
                setJobs(jobsRes.data.content);
            }
        } catch (e) {
            console.error(e);
        }
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-brand-500"></div>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="container mx-auto py-12 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Không tìm thấy công ty</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{error || 'Vui lòng kiểm tra lại đường dẫn'}</p>
                <Link href="/jobs" className="mt-4 inline-block text-brand-500 hover:underline">Quay lại danh sách việc làm</Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-12">
            {/* 1. Header Section */}
            <div className="bg-white dark:bg-gray-800 shadow-sm relative z-0">
                {/* Cover Image */}
                <div className="h-64 sm:h-80 relative bg-gradient-to-r from-gray-800 to-gray-900">
                    {company.coverImage ? (
                        <Image
                            src={company.coverImage}
                            alt={`${company.name} Cover`}
                            fill
                            className="object-cover opacity-90"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 bg-brand-900/50 flex items-center justify-center">
                            <span className="text-white/30 text-4xl font-bold">{company.name}</span>
                        </div>
                    )}
                </div>

                {/* Company Info Bar */}
                <div className="container mx-auto px-4 relative">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 pb-6">
                        {/* Logo Box */}
                        <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-2xl bg-white shadow-xl overflow-hidden border-4 border-white dark:border-gray-800 dark:bg-gray-900 flex-shrink-0">
                            {company.logo ? (
                                <Image
                                    src={company.logo}
                                    alt={`${company.name} Logo`}
                                    fill
                                    className="object-contain p-2"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center bg-gray-50 text-gray-400">
                                    <span className="text-4xl">🏢</span>
                                </div>
                            )}
                        </div>

                        {/* Text Info */}
                        <div className="flex-1 text-center md:text-left text-white md:text-gray-900 md:dark:text-white mb-2 shadow-black/50 md:shadow-none drop-shadow-md md:drop-shadow-none">
                            {/* On mobile, text is white due to overlapping cover. On desktop, it's below cover effectively (mostly). Actually with -mt-16 it overlaps. 
                                Let's adjust text color logic or structure. 
                                The design shows green background box for company info? No, standard header.
                                LG CNS Screenshot: The text is below the cover image, on a green background strip? 
                                Actually, looking closer at provided screenshot 1: 
                                - Cover image is top.
                                - Below cover is a GREEN STRIP containing Company Name + Info + Follow Button.
                                - Logo overlaps both Cover and Green Strip.
                             */}
                            {/* Let's replicate that Green Strip look if possible, or just standard clean white. 
                                The user asked "giống như này" (like this).
                                Screenshot 1: Green layout.
                                I will try to match the Green layout.
                             */}
                        </div>

                        {/* Follow Button - Absolute or flex */}
                    </div>
                </div>

                {/* Green Strip Layout Implementation */}
                <div className="bg-[#00854a] -mt-[60px] pt-[70px] pb-6 relative z-[-1]">
                    <div className="container mx-auto px-4 pl-[190px] flex flex-col md:flex-row justify-between items-end gap-4">
                        {/* pl-190px to clear the logo width (160px + gap) */}
                        <div className="text-white">
                            <h1 className="text-2xl md:text-3xl font-bold">{company.name}</h1>
                            <div className="flex flex-wrap gap-6 mt-2 text-white/90 text-sm">
                                {company.website && (
                                    <a href={company.website} target="_blank" className="flex items-center gap-2 hover:underline">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                        {company.website.replace(/^https?:\/\//, '')}
                                    </a>
                                )}
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    {company.companySize || '100-499 nhân viên'}
                                </span>
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    420 người theo dõi
                                </span>
                            </div>
                        </div>

                        <button className="bg-white text-gray-800 font-semibold px-6 py-2 rounded shadow hover:bg-gray-50 transition-colors">
                            Đang theo dõi
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar Left: Intro & Contact - Matching Screenshot 1 Layout where "Giới thiệu" and "Liên hệ" are side-by-side or stacked? 
                        Screenshot 1 shows "Giới thiệu công ty" (Green Header) on Left/Main, and "Thông tin liên hệ" (Green Header) on Right.
                     */}

                    {/* Left Column (Main) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Company Intro Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                            <div className="bg-[#00854a] px-6 py-3">
                                <h2 className="text-white font-bold text-lg">Giới thiệu công ty</h2>
                            </div>
                            <div className="p-6">
                                <div
                                    className="prose prose-sm sm:prose max-w-none text-gray-600 dark:text-gray-300 dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: company.description || 'Chưa có thông tin giới thiệu.' }}
                                />
                            </div>
                        </div>

                        {/* Tuyển dụng (Recruitment) Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                            <div className="bg-[#00854a] px-6 py-3">
                                <h2 className="text-white font-bold text-lg">Tuyển dụng</h2>
                            </div>

                            {/* Search Bar */}
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="Tên công việc, vị trí ứng tuyển..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500 dark:bg-gray-900 dark:border-gray-700"
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                    />
                                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <div className="md:w-1/3 relative">
                                    <select
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500 appearance-none bg-white dark:bg-gray-900 dark:border-gray-700"
                                        value={locationFilter}
                                        onChange={(e) => setLocationFilter(e.target.value)}
                                    >
                                        <option value="">Tất cả tỉnh/thành phố</option>
                                        <option value="Hà Nội">Hà Nội</option>
                                        <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                        <option value="Đà Nẵng">Đà Nẵng</option>
                                    </select>
                                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <svg className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                                <button
                                    onClick={handleSearch}
                                    className="bg-[#00b14f] hover:bg-[#009944] text-white px-6 py-2 rounded font-medium flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    Tìm kiếm
                                </button>
                            </div>

                            {/* Job List */}
                            <div className="p-6 space-y-4">
                                {jobs.length > 0 ? (
                                    jobs.map(job => (
                                        <CompanyJobCard key={job.id} job={job} />
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        Không tìm thấy công việc nào phù hợp.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-6">
                        {/* Contact Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                            <div className="bg-[#00854a] px-6 py-3">
                                <h2 className="text-white font-bold text-lg">Thông tin liên hệ</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm">Địa chỉ công ty</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{company.address || 'Chưa cập nhật'}</p>
                                    </div>
                                </div>
                                <div className="h-px bg-gray-100 dark:bg-gray-700 my-2"></div>
                                <div className="space-y-2">
                                    <h3 className="flex items-center gap-2 font-bold text-green-700 dark:text-green-400 text-sm">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-1.447-.894L15 7m0 13V7m0 0L9 7" /></svg>
                                        Xem bản đồ
                                    </h3>
                                    {/* Map Placeholder */}
                                    <div className="w-full h-48 bg-gray-200 rounded-lg relative overflow-hidden group cursor-pointer border border-gray-200">
                                        <Image
                                            src="https://placehold.co/600x400/png?text=Bản+Đồ"
                                            alt="Map"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                            <span className="bg-white shadow px-3 py-1 rounded text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">Xem rõ hơn</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

