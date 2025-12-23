"use client";

import React, { useEffect, useState } from "react";
import Portal from "./Portal";
import { candidateService, PublicCandidateResponse } from "@/services/candidate.service";
import {
    FacebookIcon,
    GithubIcon,
    LinkedinIcon,
    TwitterIcon,
    InstagramIcon,
    YoutubeIcon,
    GlobeIcon,
    LinkIcon
} from "@/components/shared/icons";

interface CandidateProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidateId: string;
    applicationData?: {
        email: string;
        name: string;
    };
}

const getSocialIcon = (platform: string) => {
    switch (platform) {
        case 'FACEBOOK': return <FacebookIcon className="w-4 h-4 text-blue-600" />;
        case 'GITHUB': return <GithubIcon className="w-4 h-4 text-gray-900 dark:text-gray-100" />;
        case 'LINKEDIN': return <LinkedinIcon className="w-4 h-4 text-blue-700" />;
        case 'TWITTER': return <TwitterIcon className="w-4 h-4 text-sky-500" />;
        case 'INSTAGRAM': return <InstagramIcon className="w-4 h-4 text-pink-600" />;
        case 'YOUTUBE': return <YoutubeIcon className="w-4 h-4 text-red-600" />;
        case 'WEBSITE': return <GlobeIcon className="w-4 h-4 text-emerald-500" />;
        default: return <LinkIcon className="w-4 h-4 text-gray-500" />;
    }
};

const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
    isOpen,
    onClose,
    candidateId,
    applicationData,
}) => {
    const [profile, setProfile] = useState<PublicCandidateResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen && candidateId) {
            const fetchProfile = async () => {
                setLoading(true);
                setError("");
                try {
                    const res = await candidateService.getCandidateDetail(candidateId);
                    if (res.success && res.data) {
                        setProfile(res.data);
                    } else {
                        setError("Không thể tải thông tin ứng viên.");
                    }
                } catch (err) {
                    setError("Đã xảy ra lỗi khi tải hồ sơ.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        } else {
            setProfile(null); // Reset on close
        }
    }, [isOpen, candidateId]);

    if (!isOpen) return null;

    return (
        <Portal>
            <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl dark:bg-gray-900 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Hồ sơ ứng viên
                        </h3>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-white/10 dark:hover:text-gray-300"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
                                <p className="mt-4 text-sm text-gray-500">Đang tải thông tin...</p>
                            </div>
                        ) : error ? (
                            <div className="rounded-xl bg-red-50 p-4 text-center text-red-600 dark:bg-red-900/10 dark:text-red-400">
                                {error}
                            </div>
                        ) : profile ? (
                            <div className="space-y-6">
                                {/* Header Info */}
                                <div className="flex items-start gap-4">
                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                        {profile.avatarUrl ? (
                                            <img src={profile.avatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-gray-400">
                                                {profile.fullName?.charAt(0) || applicationData?.name?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {profile.fullName || applicationData?.name}
                                        </h2>
                                        <p className="text-sm font-medium text-brand-600">{profile.title || "Chưa cập nhật chức danh"}</p>
                                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                                            {applicationData?.email && (
                                                <div className="flex items-center gap-1">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>{applicationData.email}</span>
                                                </div>
                                            )}
                                            {profile.address && (
                                                <div className="flex items-center gap-1">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>{profile.address}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-gray-800" />

                                {/* Experience */}
                                <h4 className="mb-2 text-sm font-semibold uppercase text-gray-900 dark:text-white">Kinh nghiệm làm việc</h4>
                                {profile.experiences && profile.experiences.length > 0 ? (
                                    <div className="space-y-4">
                                        {profile.experiences.map((exp) => (
                                            <div key={exp.id} className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                                                <div className="mb-1 flex justify-between items-start">
                                                    <div>
                                                        <h5 className="font-bold text-gray-900 dark:text-white">{exp.companyName}</h5>
                                                        {exp.position && <p className="text-sm font-medium text-brand-600">{exp.position}</p>}
                                                    </div>
                                                    {(exp.startDate || exp.endDate) && (
                                                        <span className="text-xs text-gray-500 bg-white dark:bg-gray-700 px-2 py-1 rounded border border-gray-100 dark:border-gray-600">
                                                            {exp.startDate ? new Date(exp.startDate).getFullYear() : 'N/A'} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                                                        </span>
                                                    )}
                                                </div>
                                                {exp.description && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-line">
                                                        {exp.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">Chưa cập nhật kinh nghiệm làm việc.</p>
                                )}
                                {/* Education */}
                                {profile?.educations && profile.educations.length > 0 && (
                                    <div>
                                        <h4 className="mb-2 text-sm font-semibold uppercase text-gray-900 dark:text-white">Học vấn</h4>
                                        <div className="space-y-4">
                                            {profile.educations.map((edu) => (
                                                <div key={edu.id} className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                                                    <div className="mb-1 flex justify-between items-start">
                                                        <div>
                                                            <h5 className="font-bold text-gray-900 dark:text-white">{edu.schoolName}</h5>
                                                            {edu.major && <p className="text-sm font-medium text-brand-600">{edu.degree ? `${edu.degree} - ` : ''}{edu.major}</p>}
                                                        </div>
                                                        {(edu.startDate || edu.endDate) && (
                                                            <span className="text-xs text-gray-500 bg-white dark:bg-gray-700 px-2 py-1 rounded border border-gray-100 dark:border-gray-600">
                                                                {edu.startDate ? new Date(edu.startDate).getFullYear() : 'N/A'} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {edu.description && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                                            {edu.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Skills ... */}
                                <div>
                                    <h4 className="mb-2 text-sm font-semibold uppercase text-gray-900 dark:text-white">Kỹ năng</h4>
                                    {profile?.skills && profile.skills.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {profile.skills.map((skill) => (
                                                <span key={skill.id} className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                                    {skill.skillName}
                                                    {skill.skillLevel && <span className="ml-1 opacity-70">- {skill.skillLevel}</span>}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">Chưa cập nhật kỹ năng.</p>
                                    )}
                                </div>

                                {/* Social Links */}
                                {profile?.socialLinks && profile.socialLinks.length > 0 && (
                                    <div>
                                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-6" />
                                        <h4 className="mb-2 text-sm font-semibold uppercase text-gray-900 dark:text-white">Mạng xã hội & Liên kết</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {profile.socialLinks.map((link) => (
                                                <a
                                                    key={link.id}
                                                    href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-brand-500 hover:text-brand-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-brand-500 dark:hover:text-brand-400 transition-colors"
                                                >
                                                    {getSocialIcon(link.platform)}
                                                    <span>{link.platform}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>


                        ) : null}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                        <button
                            onClick={onClose}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </Portal >
    );
};

export default CandidateProfileModal;
