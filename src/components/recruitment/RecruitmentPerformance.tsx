import React from "react";
import ComponentCard from "../common/ComponentCard";

import {
  applications,
  ApplicationStatusEnum,
} from "@/data/mockRecruitment";

type PerformanceMetric = {
  label: string;
  value: string;
  change?: string;
  tone: "positive" | "negative" | "neutral";
};

const toneClasses: Record<PerformanceMetric["tone"], string> = {
  positive: "text-emerald-600 dark:text-emerald-400",
  negative: "text-rose-600 dark:text-rose-400",
  neutral: "text-gray-500 dark:text-gray-400",
};

const hiredApplications = applications.filter(
  (application) => application.status === ApplicationStatusEnum.HIRED
);

const averageTimeToHireInDays = (() => {
  if (!hiredApplications.length) return 0;
  const total = hiredApplications.reduce((acc, application) => {
    const appliedAt = new Date(application.appliedAt).getTime();
    const interviewAt = application.interviewAt
      ? new Date(application.interviewAt).getTime()
      : appliedAt;
    const diff = Math.max(interviewAt - appliedAt, 0);
    return acc + diff;
  }, 0);
  return Math.round(total / hiredApplications.length / (1000 * 60 * 60 * 24));
})();

const offerRate = (() => {
  const relevant = applications.filter((application) =>
    [
      ApplicationStatusEnum.REVIEWING,
      ApplicationStatusEnum.INTERVIEW,
      ApplicationStatusEnum.HIRED,
      ApplicationStatusEnum.REJECTED,
    ].includes(application.status)
  );
  if (!relevant.length) return 0;
  const hired = relevant.filter(
    (application) => application.status === ApplicationStatusEnum.HIRED
  ).length;
  return Math.round((hired / relevant.length) * 100);
})();

const rejectionAfterScreening = (() => {
  const screened = applications.filter((application) =>
    [
      ApplicationStatusEnum.REVIEWING,
      ApplicationStatusEnum.INTERVIEW,
      ApplicationStatusEnum.REJECTED,
    ].includes(application.status)
  );
  if (!screened.length) return 0;
  const rejected = screened.filter(
    (application) => application.status === ApplicationStatusEnum.REJECTED
  ).length;
  return Math.round((rejected / screened.length) * 100);
})();

const performance: PerformanceMetric[] = [
  {
    label: "Thời gian tuyển trung bình",
    value: `${averageTimeToHireInDays || 1} ngày`,
    change: "Ước tính từ hồ sơ đã nhận offer",
    tone: "positive",
  },
  {
    label: "Tỉ lệ nhận offer",
    value: `${offerRate}%`,
    change: "Tính trên tổng hồ sơ đã sàng lọc",
    tone: offerRate >= 60 ? "positive" : "neutral",
  },
  {
    label: "Tỉ lệ rớt sau sàng lọc",
    value: `${rejectionAfterScreening}%`,
    change: "Bao gồm các hồ sơ bị từ chối trước phỏng vấn",
    tone: rejectionAfterScreening > 35 ? "negative" : "neutral",
  },
];

const weeklyAppliedCounts = Array.from({ length: 4 }).map((_, index) => {
  const start = new Date();
  start.setDate(start.getDate() - (index + 1) * 7);
  const end = new Date();
  end.setDate(end.getDate() - index * 7);

  return applications.filter((application) => {
    const applied = new Date(application.appliedAt);
    return applied >= start && applied < end;
  }).length;
}).reverse();

const RecruitmentPerformance: React.FC = () => {
  return (
    <ComponentCard
      title="Hiệu quả tuyển dụng"
      desc="Các chỉ số chính theo dõi hiệu quả tuyển dụng trong 30 ngày gần nhất."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {performance.map((item) => (
          <div key={item.label} className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {item.label}
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {item.value}
            </p>
            {item.change && (
              <p className={`text-sm font-medium ${toneClasses[item.tone]}`}>
                {item.change}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6">
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>Tuần 1</span>
          <span>Tuần 2</span>
          <span>Tuần 3</span>
          <span>Tuần 4</span>
        </div>
        <div className="mt-3 h-20 rounded-xl bg-gradient-to-br from-brand-500/15 via-brand-500/5 to-transparent p-3 dark:from-brand-400/20 dark:via-brand-400/5">
          <div className="flex h-full items-end gap-2">
            {weeklyAppliedCounts.map((count, index) => (
              <span
                key={`${count}-${index}`}
                className="flex-1 rounded-t-full bg-brand-500/70 transition-all hover:bg-brand-500"
                style={{
                  height: `${Math.max(count * 12, 6)}px`,
                }}
                aria-hidden
              />
            ))}
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Biểu đồ thể hiện số lượng hồ sơ ứng tuyển mới theo từng tuần gần đây.
        </p>
      </div>
    </ComponentCard>
  );
};

export default RecruitmentPerformance;
