"use client";

import React from 'react';
import { CopyIcon } from "@/icons";
import { useToast } from "@/context/ToastContext";

interface JobDescriptionProps {
  description: string;
  responsibilities?: string[] | string;
  requirements: string[] | string;
  benefits: string[] | string;
}

const JobDescription: React.FC<JobDescriptionProps> = ({
  description,
  responsibilities,
  requirements,
  benefits,
}) => {
  const { success } = useToast();

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      success("Đã sao chép liên kết!");
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-6 flex flex-col gap-4 border-l-4 border-brand-500 pl-4 py-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Chi tiết tin tuyển dụng
        </h2>
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 self-center hidden sm:block">Chia sẻ:</span>
          <button
            onClick={handleCopyLink}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600 transition-all dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-500 dark:hover:bg-brand-900/30 dark:hover:text-brand-400"
            title="Sao chép liên kết"
          >
            <CopyIcon className="h-5 w-5" />
          </button>
        </div>
      </div>


      {/* Description */}
      <section>
        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
          Mô tả công việc
        </h3>
        <div
          className="prose prose-gray max-w-none dark:prose-invert text-gray-600 dark:text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </section>

      {/* Requirements */}
      <section>
        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
          Yêu cầu ứng viên
        </h3>
        <div
          className="prose prose-gray max-w-none dark:prose-invert text-gray-600 dark:text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: Array.isArray(requirements) ? requirements.join('<br/>') : requirements }}
        />
      </section>

      {/* Benefits */}
      <section>
        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
          Quyền lợi
        </h3>
        <div
          className="prose prose-gray max-w-none dark:prose-invert text-gray-600 dark:text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: Array.isArray(benefits) ? benefits.join('<br/>') : benefits }}
        />
      </section>
    </div>
  );
};

export default JobDescription;
