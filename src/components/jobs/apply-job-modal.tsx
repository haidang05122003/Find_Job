"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { XIcon, UploadCloudIcon, FileTextIcon, TrashIcon, ArrowRightIcon } from "@/components/shared/icons";
import { useToast } from "@/context/ToastContext";

import { applicationService } from "@/services/application.service";
import { candidateService } from "@/services/candidate.service";

interface ApplyJobModalProps {
  onClose: () => void;
  jobTitle: string;
  jobId: string;
}

export const ApplyJobModal: React.FC<ApplyJobModalProps> = ({
  onClose,
  jobTitle,
  jobId,
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) return;

    setIsSubmitting(true);

    try {
      // 1. Upload CV
      const uploadRes = await candidateService.uploadCv(uploadedFile);
      // Assuming response has data.id for resume ID. 
      // Checking candidate.service.ts -> type Resume.
      // I should cast or assume the structure. 
      // If uploadRes.data is Resume, let's assume it has an ID.
      // But verify types later. For now, assume uploadRes.data.id exists.

      if (!uploadRes.data?.id) {
        throw new Error('Upload CV failed');
      }

      // 2. Submit Application
      // 2. Submit Application
      await applicationService.submitApplication({
        jobId: jobId,
        cvId: String(uploadRes.data.id),
        coverLetter: coverLetter
      });

      success("Ứng tuyển thành công! Nhà tuyển dụng sẽ sớm liên hệ với bạn.");
      onClose();
    } catch (err) {
      console.error(err);
      error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Ứng tuyển: {jobTitle}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Đóng"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Upload Resume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chọn CV <span className="text-error-500">*</span>
              </label>
              {!uploadedFile ? (
                <label className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-brand-500 dark:hover:border-brand-400 transition-all duration-200 block hover:bg-brand-50/50 dark:hover:bg-brand-500/5">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                  />
                  <UploadCloudIcon className="mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Kéo thả hoặc{" "}
                    <span className="font-semibold text-brand-600 dark:text-brand-400">
                      duyệt
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PDF, DOC, DOCX (Tối đa 5MB)
                  </p>
                </label>
              ) : (
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center space-x-3">
                    <FileTextIcon className="text-brand-600 dark:text-brand-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="text-error-500 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300 transition-colors duration-200 p-2 rounded-lg hover:bg-error-50 dark:hover:bg-error-500/10"
                    aria-label="Xóa file"
                  >
                    <TrashIcon />
                  </button>
                </div>
              )}
            </div>

            {/* Cover Letter */}
            <div>
              <label
                htmlFor="cover-letter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Thư xin việc (Tùy chọn)
              </label>
              <textarea
                id="cover-letter"
                rows={6}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200 resize-none"
                placeholder="Viết giới thiệu ngắn gọn về bản thân, kinh nghiệm và lý do bạn phù hợp với vị trí này..."
              ></textarea>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {coverLetter.length}/500 ký tự
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end items-center space-x-3 p-6 border-t border-gray-200 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !uploadedFile}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang gửi...
                </>
              ) : (
                <>
                  Ứng tuyển ngay
                  <ArrowRightIcon />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
