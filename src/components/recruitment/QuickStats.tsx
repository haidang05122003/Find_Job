"use client";

import React, { useMemo } from "react";

import {
  ApplicationStatusEnum,
  applications,
  jobPosts,
  JobStatusEnum,
  reports,
} from "@/data/mockRecruitment";

type Tone = "positive" | "neutral" | "negative";

type StatCard = {
  id: "active-jobs" | "expiring-jobs" | "new-applications" | "interviews";
  label: string;
  value: string;
  change?: string;
  changeTone?: Tone;
  caption?: string;
};

const toneClassMap: Record<Tone, string> = {
  positive:
    "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-400/10",
  neutral:
    "text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-400/10",
  negative: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-400/10",
};

const countInterviewUpcoming = () =>
  applications.filter(
    (application) =>
      application.status === ApplicationStatusEnum.INTERVIEW &&
      application.interviewAt
  ).length;

const countNewApplicationsThisWeek = () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return applications.filter(
    (application) =>
      new Date(application.appliedAt) >= oneWeekAgo &&
      application.status === ApplicationStatusEnum.APPLIED
  ).length;
};

const countJobsByStatus = (status: JobStatusEnum) =>
  jobPosts.filter((job) => job.status === status).length;

type QuickStatsProps = {
  onCardClick?: (card: StatCard) => void;
};

export const QuickStats: React.FC<QuickStatsProps> = ({ onCardClick }) => {
  const stats = useMemo<StatCard[]>(() => {
    const expiringCount = jobPosts.filter(
      (job) =>
        job.status === JobStatusEnum.APPROVED &&
        new Date(job.deadline).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000
    ).length;

    return [
      {
        id: "active-jobs",
        label: "Tin đang hiển thị",
        value: String(countJobsByStatus(JobStatusEnum.APPROVED)),
        change: `${countJobsByStatus(JobStatusEnum.PENDING)} tin chờ duyệt`,
        changeTone: "positive",
        caption: "Hiển thị với ứng viên trong hệ thống",
      },
      {
        id: "expiring-jobs",
        label: "Tin sắp hết hạn",
        value: String(expiringCount),
        change: `${countJobsByStatus(JobStatusEnum.CLOSED)} tin đã đóng`,
        changeTone: "neutral",
        caption: "Gia hạn kịp thời để tránh mất ứng viên",
      },
      {
        id: "new-applications",
        label: "Ứng viên mới",
        value: String(countNewApplicationsThisWeek()),
        change: `${applications.filter(
          (application) => application.status === ApplicationStatusEnum.REVIEWING
        ).length} hồ sơ đang chờ duyệt`,
        changeTone: "positive",
        caption: "Ứng viên nộp trong 7 ngày gần nhất",
      },
      {
        id: "interviews",
        label: "Lịch phỏng vấn",
        value: String(countInterviewUpcoming()),
        change: `${reports.filter((report) => report.status === "PENDING").length} báo cáo cần xử lý`,
        changeTone: "negative",
        caption: "Nhắc nhở các buổi phỏng vấn sắp diễn ra",
      },
    ];
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:border-brand-500/60 hover:shadow-lg dark:border-gray-800 dark:bg-white/[0.03]"
          role={onCardClick ? "button" : undefined}
          tabIndex={onCardClick ? 0 : undefined}
          onClick={() => onCardClick?.(stat)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onCardClick?.(stat);
            }
          }}
        >
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
            {stat.change && stat.changeTone && (
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${toneClassMap[stat.changeTone]}`}
              >
                {stat.change}
              </span>
            )}
          </div>
          <div className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">
            {stat.value}
          </div>
          {stat.caption && (
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              {stat.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuickStats;


