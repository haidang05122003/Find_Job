"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ComponentCard from "../common/ComponentCard";
import { adminService } from "@/services/admin.service";
import type { Job } from "@/types/job";
import type { Company } from "@/types/company";
import type { Report } from "@/services/report.service";

const AdminWorklist: React.FC = () => {
  const [pendingJobs, setPendingJobs] = useState<Job[]>([]);
  const [pendingCompanies, setPendingCompanies] = useState<Company[]>([]);
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, companiesRes, reportsRes] = await Promise.all([
          adminService.getPendingJobs({ page: 0, size: 5 }),
          adminService.getPendingCompanies({ page: 0, size: 5 }),
          adminService.getPendingReports({ page: 0, size: 5 }),
        ]);

        if (jobsRes.data) setPendingJobs(jobsRes.data.content);
        if (companiesRes.data) setPendingCompanies(companiesRes.data.content);
        if (reportsRes.data) setPendingReports(reportsRes.data.content);
      } catch (error) {
        console.error("Failed to fetch worklist data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-gray-100 p-6 dark:border-gray-800">
            <div className="h-6 w-1/2 animate-pulse bg-gray-100 dark:bg-gray-800 mb-4 rounded" />
            <div className="space-y-3">
              {[1, 2].map((j) => (
                <div key={j} className="h-16 animate-pulse bg-gray-50 dark:bg-gray-800/50 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ComponentCard
        title="Tin chờ phê duyệt"
        desc="Ưu tiên xử lý các tin mới nhất."
      >
        <div className="space-y-3">
          {pendingJobs.length ? (
            pendingJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-gray-100 p-3 text-sm dark:border-gray-800"
              >
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {job.title}
                </p>
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[60%]">
                    {job.companyName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(job.createdAt || Date.now()).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Không có tin nào chờ duyệt.
            </p>
          )}
          <Link href="/admin/job-approvals" className="block text-center text-xs text-brand-500 hover:underline mt-2">
            Xem tất cả
          </Link>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Công ty đăng ký mới"
        desc="Xét duyệt doanh nghiệp trước khi cấp quyền."
      >
        <div className="space-y-3">
          {pendingCompanies.length ? (
            pendingCompanies.map((company) => (
              <div
                key={company.id}
                className="rounded-xl border border-gray-100 p-3 text-sm dark:border-gray-800"
              >
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {company.companyName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Email: {company.email}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Không có công ty mới đăng ký.
            </p>
          )}
          <Link href="/admin/companies" className="block text-center text-xs text-brand-500 hover:underline mt-2">
            Xem tất cả
          </Link>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Báo cáo vi phạm"
        desc="Những báo cáo chưa được xử lý trong hệ thống."
      >
        <div className="space-y-3">
          {pendingReports.length ? (
            pendingReports.map((report) => (
              <div
                key={report.id}
                className="rounded-xl border border-gray-100 p-3 text-sm dark:border-gray-800"
              >
                <p className="font-semibold text-gray-900 dark:text-white">
                  Báo cáo #{report.id}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Đối tượng: {report.targetType} · {new Date(report.createdAt).toLocaleDateString("vi-VN")}
                </p>
                <p className="text-xs text-gray-500 truncate">{report.reason}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Không có báo cáo nào chờ xử lý.
            </p>
          )}
          <Link href="/admin/violations" className="block text-center text-xs text-brand-500 hover:underline mt-2">
            Xem tất cả
          </Link>
        </div>
      </ComponentCard>
    </div>
  );
};

export default AdminWorklist;



