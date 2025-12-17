import React from 'react';
import { Company } from '@/types/company';
import { CloseIcon } from '@/icons';

interface CompanyDetailModalProps {
    company: Company;
    onClose: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    isProcessing?: boolean;
}

const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({ company, onClose, onApprove, onReject, isProcessing }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="relative h-32 bg-gradient-to-r from-brand-500 to-blue-600">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                    <div className="absolute -bottom-10 left-8">
                        {company.logoUrl ? (
                            <img
                                src={company.logoUrl}
                                alt={company.companyName}
                                className="w-20 h-20 rounded-xl border-4 border-white dark:border-gray-900 shadow-md object-cover bg-white"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-xl border-4 border-white dark:border-gray-900 shadow-md bg-brand-50 flex items-center justify-center text-brand-600 text-2xl font-bold">
                                {(company.companyName || '?').charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-12 px-8 pb-6 overflow-y-auto flex-1">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{company.companyName || 'Unnamed Company'}</h2>
                        <div className="flex flex-wrap gap-2 text-sm">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${company.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                company.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                                    'bg-amber-50 text-amber-600 border-amber-200'
                                }`}>
                                {company.status === 'APPROVED' ? 'Đã duyệt' :
                                    company.status === 'REJECTED' ? 'Đã từ chối' :
                                        company.status === 'PENDING' ? 'Chờ duyệt' : company.status}
                            </span>
                            {company.industry && (
                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                    {company.industry}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Thông tin liên hệ</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex gap-2">
                                        <span className="text-gray-400 w-16 flex-shrink-0">Email:</span>
                                        <span className="text-gray-900 dark:text-white font-medium break-all">{company.email || 'Chưa cập nhật'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-gray-400 w-16 flex-shrink-0">SĐT:</span>
                                        <span className="text-gray-900 dark:text-white font-medium">{company.phone || 'Chưa cập nhật'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-gray-400 w-16 flex-shrink-0">Website:</span>
                                        {company.website ? (
                                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline truncate max-w-[200px] block">
                                                {company.website}
                                            </a>
                                        ) : (
                                            <span className="text-gray-500">Chưa cập nhật</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Địa chỉ</h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {company.address || 'Chưa cập nhật'}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Giới thiệu</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {company.description || 'Chưa có mô tả.'}
                        </p>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                    >
                        Đóng
                    </button>

                    <button
                        onClick={() => onReject(company.id)}
                        disabled={isProcessing || company.status === 'REJECTED'}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${company.status === 'REJECTED' ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200 disabled:opacity-50 disabled:cursor-not-allowed'}`}
                    >
                        {isProcessing ? 'Đang xử lý...' : 'Từ chối'}
                    </button>

                    <button
                        onClick={() => onApprove(company.id)}
                        disabled={isProcessing || company.status === 'APPROVED'}
                        className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors ${company.status === 'APPROVED' ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed'}`}
                    >
                        {isProcessing ? 'Đang xử lý...' : 'Duyệt công ty'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetailModal;
