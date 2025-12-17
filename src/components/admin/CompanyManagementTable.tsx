"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Pagination from "../shared/Pagination";
import { adminService } from "@/services/admin.service";
import { Company } from "@/types/company";
import CompanyDetailModal from "./CompanyDetailModal";
import { EyeIcon } from "@/icons";

const statusBadge = (status: string) => {
    switch (status) {
        case "APPROVED":
            return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
        case "PENDING":
            return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
        case "REJECTED":
            return "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300";
        default:
            return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-300";
    }
};

const CompanyManagementTable: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState("");
    const [keyword, setKeyword] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedKeyword(keyword);
        }, 500);
        return () => clearTimeout(handler);
    }, [keyword]);

    const fetchCompanies = async (page: number) => {
        setLoading(true);
        try {
            const params: any = { page: page - 1, size: 10 };
            if (status) params.status = status;
            if (debouncedKeyword) params.keyword = debouncedKeyword;

            // Use getAllCompanies or getPendingCompanies depending on requirement.
            // User asked for "Company Management", likely all companies.
            const res = await adminService.getAllCompanies(params);
            if (res.data) {
                setCompanies(res.data.content);
                setTotalPages(res.data.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch companies", (error as any).response?.data || (error as any).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies(currentPage);
    }, [currentPage, status, debouncedKeyword]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleApprove = async (id: string) => {
        if (!confirm("Are you sure you want to approve this company?")) return;
        setProcessingId(id);
        try {
            await adminService.approveCompany(id);
            await fetchCompanies(currentPage);
        } catch (error) {
            console.error(error);
            alert("Failed to approve company");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm("Are you sure you want to reject this company?")) return;
        setProcessingId(id);
        try {
            await adminService.rejectCompany(id);
            await fetchCompanies(currentPage);
        } catch (error) {
            console.error(error);
            alert("Failed to reject company");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <ComponentCard
            title="Quản lý công ty"
            desc="Duyệt và quản lý hồ sơ doanh nghiệp."
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex flex-col gap-3 md:flex-row">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => { setKeyword(e.target.value); setCurrentPage(1); }}
                        placeholder="Tìm kiếm công ty..."
                        className="rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-100 dark:border-gray-700 dark:text-gray-300 min-w-[200px]"
                    />
                    <select
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }}
                        className="rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-100 dark:border-gray-700 dark:text-gray-300"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="PENDING">Chờ duyệt</option>
                        <option value="APPROVED">Đã duyệt</option>
                        <option value="REJECTED">Từ chối</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto mb-4">
                <table className="w-full min-w-[720px] text-left text-sm text-gray-600 dark:text-gray-300">
                    <thead className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        <tr>
                            <th className="pb-3 font-semibold">Tên công ty</th>
                            <th className="pb-3 font-semibold">Email/Liên hệ</th>
                            <th className="pb-3 font-semibold">Trạng thái</th>
                            <th className="pb-3 text-right font-semibold">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {loading ? (
                            <tr><td colSpan={4} className="text-center py-4">Đang tải...</td></tr>
                        ) : companies.length > 0 ? (
                            companies.map((company) => (
                                <tr key={company.id} className="hover:bg-gray-50/60 dark:hover:bg-white/5">
                                    <td className="py-3">
                                        <div className="flex items-center gap-3">
                                            {company.logoUrl ? (
                                                <img src={company.logoUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-700" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold border border-brand-100 dark:bg-brand-900/20 dark:border-brand-800 dark:text-brand-400">
                                                    {(company.companyName || '?').charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span className="font-medium text-gray-900 dark:text-white">{company.companyName || 'Unnamed Company'}</span>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <p className="text-gray-900 dark:text-white">{company.email}</p>
                                        <p className="text-xs text-gray-500">{company.phone}</p>
                                    </td>

                                    <td className="py-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge(company.status || '')}`}
                                        >
                                            {company.status || 'UNKNOWN'}
                                        </span>
                                    </td>
                                    <td className="py-3 text-right">
                                        <div className="inline-flex gap-2">
                                            <button
                                                onClick={() => setSelectedCompany(company)}
                                                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                                title="Xem chi tiết"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => handleApprove(company.id)}
                                                disabled={company.status === 'APPROVED'}
                                                className={`rounded-lg border px-3 py-1 text-xs font-semibold hover:bg-emerald-100 transition-colors ${company.status === 'APPROVED' ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400'}`}>
                                                Duyệt
                                            </button>

                                            <button
                                                onClick={() => handleReject(company.id)}
                                                disabled={company.status === 'REJECTED'}
                                                className={`rounded-lg border px-3 py-1 text-xs font-semibold hover:bg-rose-100 transition-colors ${company.status === 'REJECTED' ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-rose-50 text-rose-600 border-rose-200 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                                                Từ chối
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={4} className="text-center py-4">Không có công ty nào.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {selectedCompany && (
                <CompanyDetailModal
                    company={selectedCompany}
                    onClose={() => setSelectedCompany(null)}
                    isProcessing={!!processingId}
                    onApprove={async (id) => {
                        await handleApprove(id);
                        setSelectedCompany(null);
                    }}
                    onReject={async (id) => {
                        await handleReject(id);
                        setSelectedCompany(null);
                    }}
                />
            )}
        </ComponentCard>
    );
};

export default CompanyManagementTable;
