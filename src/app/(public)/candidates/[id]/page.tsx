'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { candidateService, PublicCandidateResponse } from '@/services/candidate.service';
import Button from '@/components/shared/Button';
import Badge from '@/components/shared/Badge';
import { useToast } from '@/context/ToastContext';
import { t } from '@/lib/i18n';

export default function CandidateDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { error } = useToast();
    const { isAuthenticated, hasRole } = useAuth();
    const id = params.id as string;

    const [candidate, setCandidate] = useState<PublicCandidateResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const response = await candidateService.getCandidateDetail(id);
                if (response.success && response.data) {
                    setCandidate(response.data);
                } else {
                    error('Không tìm thấy ứng viên');
                    router.push('/candidates');
                }
            } catch (err) {
                console.error('Failed to fetch candidate', err);
                error('Có lỗi xảy ra khi tải thông tin ứng viên');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCandidate();
        }
    }, [id, router, error]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-500">Đang tải hồ sơ...</p>
                </div>
            </div>
        );
    }

    if (!candidate) return null;

    const isRecruiter = isAuthenticated && (hasRole('HR') || hasRole('ROLE_HR'));

    // Helper to format date
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'Chưa cập nhật';
        return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12 pt-8 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Quay lại danh sách
                </button>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* LEFT COLUMN - MAIN CONTENT */}
                    <div className="space-y-8 lg:col-span-2">

                        {/* 1. Header Card (Avatar + Name + Actions) */}
                        <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 border-4 border-gray-50 dark:border-gray-700">
                                <img
                                    src={candidate.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.fullName)}&background=random`}
                                    alt={candidate.fullName}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{candidate.fullName}</h1>
                                <p className="text-brand-600 dark:text-brand-400 font-medium">{candidate.title}</p>
                                <p className="text-sm text-gray-500 mt-1">{candidate.address || 'Chưa cập nhật địa điểm'}</p>
                            </div>
                            <div className="flex gap-3 mt-4 sm:mt-0">
                                <Button size="sm" variant="outline" className="p-2">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </Button>
                                <Button size="sm" className="gap-2">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Liên hệ
                                </Button>
                            </div>
                        </div>

                        {/* 2. Biography */}
                        <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800">
                            <h3 className="mb-6 text-lg font-bold uppercase tracking-wider text-gray-900 dark:text-white border-b pb-2 dark:border-gray-700">GIỚI THIỆU</h3>
                            <div className="prose max-w-none text-gray-600 dark:text-gray-300 dark:prose-invert" dangerouslySetInnerHTML={{ __html: candidate.aboutMe || "Chưa cập nhật tiểu sử." }} />
                        </div>

                        {/* 3. Cover Letter (Experience) */}
                        <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800">
                            <h3 className="mb-6 text-lg font-bold uppercase tracking-wider text-gray-900 dark:text-white border-b pb-2 dark:border-gray-700">KINH NGHIỆM LÀM VIỆC</h3>
                            {candidate.experience ? (
                                <div className="prose max-w-none text-gray-600 dark:text-gray-300 dark:prose-invert" dangerouslySetInnerHTML={{ __html: candidate.experience }} />
                            ) : (
                                <p className="text-gray-500 italic">Chưa cập nhật kinh nghiệm làm việc.</p>
                            )}
                        </div>

                        {/* 4. Social Media */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm dark:bg-gray-800">
                            <h3 className="mb-6 text-sm font-bold text-gray-900 dark:text-white uppercase">Follow me Social Media</h3>
                            <div className="flex gap-3">
                                {candidate.socialLinks && candidate.socialLinks.length > 0 ? candidate.socialLinks.map((link) => (
                                    <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="h-10 w-10 flex items-center justify-center rounded bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-gray-700 dark:text-blue-400">
                                        {/* Simple generic icon matching platform if possible, else link icon */}
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                    </a>
                                )) : <p className="text-gray-400 text-sm">Chưa cập nhật</p>}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN - SIDEBAR */}
                    <div className="space-y-8 lg:col-span-1">

                        {/* 1. Personal Details Grid */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span className="text-xs font-semibold uppercase">Ngày Sinh</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{formatDate(candidate.dateOfBirth)}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-8a2 2 0 012-2h14a2 2 0 012 2v8M16 10V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v5" /></svg>
                                        <span className="text-xs font-semibold uppercase">Giới tính</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{candidate.gender === 'male' ? 'Nam' : candidate.gender === 'female' ? 'Nữ' : 'Khác'}</p>
                                </div>
                                <div className="col-span-2">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                                        <span className="text-xs font-semibold uppercase">Học vấn</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{candidate.education || 'Chưa cập nhật'}</p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Download Resume */}
                        {/* 2. Download Resume */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                            <h3 className="mb-4 text-base font-bold text-gray-900 dark:text-white">Download My Resume</h3>
                            {candidate.cv ? (
                                <div className="flex items-center justify-between p-4 border rounded-xl border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" alt="PDF" className="h-8 w-8 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={candidate.cv.fileName}>
                                                {candidate.cv.fileName}
                                            </p>
                                            <p className="text-xs text-gray-500">PDF</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            if (!candidate.cv) return;
                                            try {
                                                const blob = await candidateService.downloadPublicCvBlob(candidate.cv.id);
                                                const url = window.URL.createObjectURL(blob);
                                                const link = document.createElement('a');
                                                link.href = url;
                                                link.setAttribute('download', candidate.cv.fileName);
                                                document.body.appendChild(link);
                                                link.click();
                                                link.remove();
                                            } catch (e) {
                                                error('Không thể tải CV. Vui lòng thử lại.');
                                            }
                                        }}
                                        className="ml-2 p-2 text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-400 flex-shrink-0"
                                        title="Tải xuống"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">Ứng viên chưa cập nhật CV.</p>
                            )}
                        </div>

                        {/* 3. Contact Information */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                            <h3 className="mb-4 text-base font-bold text-gray-900 dark:text-white">Contact Information</h3>
                            {isRecruiter ? (
                                <div className="space-y-4">
                                    {/* Location */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-slate-300">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-gray-500 font-semibold mb-0.5">Location</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{candidate.address || 'Chưa cập nhật'}</p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-slate-300">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-gray-500 font-semibold mb-0.5">Phone</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{candidate.phone || 'Chưa cập nhật'}</p>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-slate-300">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs uppercase text-gray-500 font-semibold mb-0.5">Email</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={candidate.email}>{candidate.email || 'Chưa cập nhật'}</p>
                                        </div>
                                    </div>

                                </div>
                            ) : (
                                <div className="p-4 bg-gray-50 rounded-lg text-center dark:bg-gray-700/50">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Vui lòng đăng nhập với tài khoản <span className="font-semibold text-brand-600">Nhà tuyển dụng</span> để xem thông tin liên hệ.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Skills (Using same style card) */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                            <h3 className="mb-4 text-base font-bold text-gray-900 dark:text-white">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {candidate.skills && candidate.skills.length > 0 ? (
                                    candidate.skills.map((skill) => (
                                        <Badge key={skill.id} variant="neutral" className="text-sm">
                                            {skill.skillName}
                                        </Badge>
                                    ))
                                ) : <p className="text-sm text-gray-500">Chưa cập nhật</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
