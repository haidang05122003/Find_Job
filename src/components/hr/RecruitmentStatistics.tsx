import React from "react";
import ComponentCard from "../common/ComponentCard";

const metrics = [
  {
    label: "Ứng viên/ tin",
    value: "28",
    detail: "Trung bình 30 ngày",
    trend: "+4 so với tháng trước",
  },
  {
    label: "Nguồn ứng viên hiệu quả",
    value: "LinkedIn · 42%",
    detail: "Website · 33%, Giới thiệu · 18%",
    trend: "",
  },
  {
    label: "Tỉ lệ nhận offer",
    value: "64%",
    detail: "Mục tiêu tháng 11: 70%",
    trend: "+6% MoM",
  },
];

const funnel = [
  { stage: "Ứng tuyển", value: 100 },
  { stage: "Sàng lọc", value: 58 },
  { stage: "Phỏng vấn 1", value: 32 },
  { stage: "Phỏng vấn 2", value: 14 },
  { stage: "Offer", value: 6 },
];

const RecruitmentStatistics: React.FC = () => {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <ComponentCard
        title="Chỉ số chính"
        desc="KPI tuyển dụng theo tháng của doanh nghiệp."
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
        title="Tỷ lệ chuyển đổi"
        desc="Phễu tuyển dụng theo số lượng ứng viên."
      >
        <div className="space-y-4">
          {funnel.map((item) => (
            <div key={item.stage} className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{item.stage}</span>
                <span>{item.value} ứng viên</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${item.value}%` }}
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



