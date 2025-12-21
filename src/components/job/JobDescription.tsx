import React from 'react';

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
  return (
    <div className="space-y-8">
      <div className="mb-6 flex flex-col gap-4 border-l-4 border-brand-500 pl-4 py-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Chi tiết tin tuyển dụng
        </h2>
        <div className="flex gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 self-center hidden sm:block">Chia sẻ:</span>
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600 transition-all dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-500 dark:hover:bg-brand-900/30 dark:hover:text-brand-400">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600 transition-all dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-500 dark:hover:bg-brand-900/30 dark:hover:text-brand-400">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
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
