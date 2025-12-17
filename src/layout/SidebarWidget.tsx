import React from "react";
import Link from "next/link";

const SidebarWidget: React.FC = () => {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-white p-4 text-center dark:border-gray-800 dark:bg-white/[0.03]">
      <p className="text-sm font-medium text-gray-800 dark:text-white">
        Cần tạo tin tuyển dụng mới?
      </p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Đảm bảo cập nhật thông tin chính xác trước khi gửi duyệt.
      </p>
      <Link
        href="/hr/job-postings"
        className="mt-3 inline-flex items-center justify-center rounded-xl bg-brand-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-600"
      >
        Tạo tin ngay
      </Link>
    </div>
  );
};

export default SidebarWidget;



