"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import { hrService, HRDashboardStats } from "@/services/hr.service";

interface RecruitmentStatisticsProps {
  data?: HRDashboardStats | null;
}

const RecruitmentStatistics: React.FC<RecruitmentStatisticsProps> = ({ data }) => {
  const [stats, setStats] = useState<HRDashboardStats | null>(data || null);
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    if (data) {
      setStats(data);
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await hrService.getDashboardStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [data]);

  if (loading) {
    return <div className="grid gap-6 xl:grid-cols-3 animate-pulse">
      <div className="h-64 rounded-2xl bg-gray-100 xl:col-span-2 dark:bg-gray-800"></div>
      <div className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-800"></div>
    </div>;
  }

  if (!stats) return null;

  // --- Calculations ---

  // 1. Candidates per Job
  // Avoid division by zero
  const candidatesPerJob = stats.totalJobs > 0
    ? Math.round(stats.totalApplications / stats.totalJobs)
    : 0;

  // 2. Offer Acceptance Rate (Estimated)
  // Formula: Hired / (Hired + Offered but not yet hired + Rejected after offer?) 
  // Simplified: Hired / (Hired + Offered)  <-- This is tricky if 'Offered' implies 'Pending Offer'
  // Based on available fields: 
  // 'offeredApplications' = current status is OFFERED.
  // 'hiredCount' = current status is HIRED.
  // Total offers made = offeredApplications + hiredCount (assuming hired came from offered)
  const totalOffersMade = stats.offeredApplications + stats.hiredCount;
  const offerAcceptanceRate = totalOffersMade > 0
    ? Math.round((stats.hiredCount / totalOffersMade) * 100)
    : 0;

  // 3. Funnel Construction
  // Stage 1: Applied (Total)
  // Stage 2: Screened (Anyone who passed initial review) -> Approved + Interview + Offered + Hired
  const screenedCount = stats.approvedApplications + stats.interviewScheduled + stats.offeredApplications + stats.hiredCount;

  // Stage 3: Interview (Interview + Offered + Hired)
  const interviewCount = stats.interviewScheduled + stats.offeredApplications + stats.hiredCount;

  // Stage 4: Offer (Offered + Hired)
  const offerCount = stats.offeredApplications + stats.hiredCount;

  // Stage 5: Hired
  const hiredCount = stats.hiredCount;

  const funnel = [
    { stage: "Ứng tuyển", value: stats.totalApplications, percent: 100 },
    { stage: "Sàng lọc", value: screenedCount, percent: stats.totalApplications > 0 ? (screenedCount / stats.totalApplications) * 100 : 0 },
    { stage: "Phỏng vấn", value: interviewCount, percent: stats.totalApplications > 0 ? (interviewCount / stats.totalApplications) * 100 : 0 },
    { stage: "Offer", value: offerCount, percent: stats.totalApplications > 0 ? (offerCount / stats.totalApplications) * 100 : 0 },
    { stage: "Tuyển dụng", value: hiredCount, percent: stats.totalApplications > 0 ? (hiredCount / stats.totalApplications) * 100 : 0 },
  ];

  const metrics = [
    {
      label: "Ứng viên/ tin",
      value: candidatesPerJob.toString(),
      detail: "Trung bình trên tổng số tin tuyển dụng",
      trend: "",
    },
    {
      label: "Nguồn ứng viên",
      value: "Website", // Placeholder until we track source
      detail: "Nguồn chính",
      trend: "",
    },
    {
      label: "Tỉ lệ nhận offer",
      value: `${offerAcceptanceRate}%`,
      detail: `${stats.hiredCount} đã tuyển / ${totalOffersMade} offer`,
      trend: "",
    },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <ComponentCard
        title="Chỉ số chính"
        desc="KPI tuyển dụng tổng quan của doanh nghiệp."
        className="xl:col-span-2"
      >
        <div className="grid gap-5 md:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-gray-100 p-4 dark:border-gray-800"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {metric.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {metric.value}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{metric.detail}</p>
              {metric.trend && (
                <p className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {metric.trend}
                </p>
              )}
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Phễu tuyển dụng"
        desc="Tỷ lệ chuyển đổi qua các vòng."
      >
        <div className="space-y-6">
          {funnel.map((item) => (
            <div key={item.stage} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-200">{item.stage}</span>
                <span className="text-gray-500 dark:text-gray-400">{item.value} ứng viên <span className="text-xs">({Math.round(item.percent)}%)</span></span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all duration-500 ease-out"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>
    </div>
  );
};

export default RecruitmentStatistics;



