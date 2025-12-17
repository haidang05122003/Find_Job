import React from "react";
import ComponentCard from "../common/ComponentCard";

import {
  jobPosts,
  JobStatusEnum,
  reports,
} from "@/data/mockRecruitment";

const alerts = [
  {
    title: "Tin chờ phê duyệt",
    detail: `${jobPosts.filter((job) => job.status === JobStatusEnum.PENDING).length} tin tuyển dụng đang cần bổ sung thông tin trước khi phê duyệt.`,
    action: "Xem danh sách",
  },
  {
    title: "Tin sắp hết hạn",
    detail: `${jobPosts.filter(
      (job) =>
        job.status === JobStatusEnum.APPROVED &&
        new Date(job.deadline).getTime() - Date.now() <
          5 * 24 * 60 * 60 * 1000
    ).length} tin sẽ hết hạn trong 5 ngày tới.`,
    action: "Gia hạn ngay",
  },
  {
    title: "Báo cáo vi phạm",
    detail: `${reports.filter((report) => report.status === "PENDING").length} báo cáo mới cần phản hồi.`,
    action: "Xử lý báo cáo",
  },
];

const AdminAlerts: React.FC = () => {
  return (
    <ComponentCard
      title="Công việc ưu tiên"
      desc="Các tác vụ cần xử lý để đảm bảo quy trình tuyển dụng trơn tru."
    >
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.title}
            className="rounded-xl border border-gray-100 p-4 dark:border-gray-800"
          >
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              {alert.title}
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {alert.detail}
            </p>
            <button className="mt-3 inline-flex items-center text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
              {alert.action}
            </button>
          </div>
        ))}
      </div>
    </ComponentCard>
  );
};

export default AdminAlerts;
