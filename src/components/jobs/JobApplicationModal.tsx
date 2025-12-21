'use client';

import React, { useState, useEffect, useRef } from 'react';
import { candidateService } from '@/services/candidate.service';
import { applicationService, ApplicationRequest } from '@/services/application.service';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface JobApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    jobTitle: string;
    companyName: string;
    locations?: string[];
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
    isOpen,
    onClose,
    jobId,
    jobTitle,
    companyName,
    locations = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "Bình Dương", "Khác"]
}) => {
    const { user } = useAuth();
    const { success, error: toastError } = useToast();

    const [activeTab, setActiveTab] = useState<'upload' | 'library'>('upload');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Form Data
    const [coverLetter, setCoverLetter] = useState('');
    const [desiredLocation, setDesiredLocation] = useState('');

    // Library Data
    const [cvList, setCvList] = useState<any[]>([]);
    const [selectedCvId, setSelectedCvId] = useState<number | null>(null);

    // Upload Data
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && user) {
            fetchProfile();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, user]);

    const fetchProfile = async () => {
        try {
            const res = await candidateService.getProfile();
            if (res.success && res.data) {
                setCvList(res.data.cvs || []);
                // Pre-select default CV if available
                const defaultCv = res.data.cvs?.find((cv: any) => cv.isDefault);
                if (defaultCv) setSelectedCvId(defaultCv.id);
            }
        } catch (err) {
            console.error("Failed to fetch profile", err);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Basic validation (e.g. max 5MB, pdf/doc/docx)
            if (file.size > 5 * 1024 * 1024) {
                toastError("File quá lớn. Vui lòng chọn file dưới 5MB.");
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleSubmit = async () => {
        if (!desiredLocation) {
            toastError("Vui lòng chọn địa điểm làm việc mong muốn.");
            return;
        }

        setIsLoading(true);
        try {
            let finalCvId = selectedCvId;

            // Step 1: Handle Upload if in upload tab
            if (activeTab === 'upload') {
                if (!selectedFile) {
                    toastError("Vui lòng chọn file CV để tải lên.");
                    setIsLoading(false);
                    return;
                }

                setIsUploading(true);
                const uploadRes = await candidateService.uploadCv(selectedFile);
                setIsUploading(false);

                if (uploadRes.success && uploadRes.data) {
                    finalCvId = uploadRes.data.id;
                } else {
                    throw new Error("Tải CV thất bại");
                }
            } else {
                if (!finalCvId) {
                    toastError("Vui lòng chọn một CV từ thư viện.");
                    setIsLoading(false);
                    return;
                }
            }

            // Step 2: Submit Application
            const request: ApplicationRequest = {
                jobId: jobId,
                cvId: finalCvId?.toString(),
                coverLetter: coverLetter,
                desiredLocation: desiredLocation
            };

            const appRes = await applicationService.submitApplication(request);

            if (appRes.success) {
                success("Nộp hồ sơ ứng tuyển thành công!");
                onClose();
            } else {
                toastError(appRes.message || "Nộp hồ sơ thất bại.");
            }

        } catch (err: any) {
            toastError(err.message || "Đã có lỗi xảy ra.");
        } finally {
            setIsLoading(false);
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-900/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full max-w-3xl">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900">
                            Ứng tuyển <span className="text-brand-600">{jobTitle}</span>
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="px-6 py-6 max-h-[80vh] overflow-y-auto">
                        {/* 1. CV Selection Section */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-brand-500 text-white p-1 rounded">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <h4 className="font-bold text-gray-900">Chọn CV để ứng tuyển</h4>
                            </div>

                            <div className="flex gap-6 mb-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="cvOption"
                                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300"
                                        checked={activeTab === 'library'}
                                        onChange={() => setActiveTab('library')}
                                    />
                                    <span className="text-sm font-medium text-gray-700">Chọn CV trong thư viện</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="cvOption"
                                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300"
                                        checked={activeTab === 'upload'}
                                        onChange={() => setActiveTab('upload')}
                                    />
                                    <span className="text-sm font-medium text-gray-700">Tải lên CV từ máy tính</span>
                                </label>
                            </div>

                            {/* Content Logic */}
                            {activeTab === 'upload' ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                    />
                                    {selectedFile ? (
                                        <div>
                                            <p className="text-brand-600 font-medium mb-1">{selectedFile.name}</p>
                                            <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="mx-auto h-12 w-12 text-gray-400 mb-2">
                                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                            </div>
                                            <p className="text-sm text-gray-600 font-medium">Nhấn để tải lên CV của bạn</p>
                                            <p className="text-xs text-gray-500 mt-1">Hỗ trợ định dạng .doc, .docx, .pdf có kích thước dưới 5MB</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-48 overflow-y-auto">
                                    {cvList.length > 0 ? (
                                        cvList.map((cv) => (
                                            <div
                                                key={cv.id}
                                                onClick={() => setSelectedCvId(cv.id)}
                                                className={`p-3 border rounded-lg cursor-pointer flex items-center justify-between hover:border-brand-500 transition-all ${selectedCvId === cv.id ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-gray-200'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded text-red-500">
                                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{cv.fileName}</p>
                                                        <p className="text-xs text-gray-500">Cập nhật: {new Date().toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                {cv.isDefault && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Mặc định</span>}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-500">Bạn chưa có CV nào trong thư viện.</p>
                                            <button onClick={() => setActiveTab('upload')} className="text-sm text-brand-600 hover:underline mt-1 font-medium">Tải lên ngay</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 2. Personal Info & Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                                <input type="text" value={user?.fullName || ''} disabled className="w-full rounded-lg border-gray-300 bg-gray-50/50 text-gray-700 text-base py-2.5 px-4 font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                                <input type="text" value={user?.email || ''} disabled className="w-full rounded-lg border-gray-300 bg-gray-50/50 text-gray-700 text-base py-2.5 px-4 font-medium" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm làm việc mong muốn <span className="text-red-500">*</span></label>
                                <select
                                    value={desiredLocation}
                                    onChange={(e) => setDesiredLocation(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-brand-500 focus:ring-brand-500 text-sm py-2.5"
                                >
                                    <option value="">Chọn địa điểm bạn muốn làm việc</option>
                                    {locations.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 3. Cover Letter */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="text-brand-600">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </div>
                                <label className="block text-sm font-bold text-gray-900">Thư giới thiệu:</label>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">Một thư giới thiệu ngắn gọn, chỉn chu sẽ giúp bạn trở nên chuyên nghiệp và gây ấn tượng hơn với nhà tuyển dụng.</p>
                            <textarea
                                rows={4}
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                placeholder="Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, điểm yếu) và nêu rõ mong muốn, lý do bạn muốn ứng tuyển cho vị trí này."
                                className="w-full rounded-lg border-gray-300 focus:border-brand-500 focus:ring-brand-500 text-sm p-3 min-h-[120px]"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                        <div className="flex items-center">
                            {/* Placeholder for checkbox */}
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || isUploading}
                            className={`w-full sm:w-auto px-8 py-2.5 rounded-lg text-white font-bold text-sm shadow-lg shadow-brand-500/30 transition-all transform hover:-translate-y-0.5 ${isLoading || isUploading ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-brand-600 hover:bg-brand-700'}`}
                        >
                            {isLoading ? 'Đang xử lý...' : (isUploading ? 'Đang tải CV...' : 'Nộp hồ sơ ứng tuyển')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobApplicationModal;
