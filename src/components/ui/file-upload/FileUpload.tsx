"use client";

import React, { useState, useCallback } from "react";
import { UploadCloudIcon, XIcon } from "@/components/shared/icons";
import Image from "next/image";

interface FileUploadProps {
  accept: string;
  maxSize: number; // in MB
  onUpload: (file: File) => Promise<void>;
  preview?: boolean;
  label: string;
  description?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  maxSize,
  onUpload,
  preview = false,
  label,
  description,
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File phải nhỏ hơn ${maxSize}MB`;
    }

    // Check file type
    const acceptedTypes = accept.split(",").map((type) => type.trim());
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    const mimeType = file.type;

    const isAccepted = acceptedTypes.some(
      (type) =>
        type === fileExtension ||
        type === mimeType ||
        (type.endsWith("/*") && mimeType.startsWith(type.replace("/*", "")))
    );

    if (!isAccepted) {
      return `Định dạng file không được hỗ trợ. Chỉ chấp nhận: ${accept}`;
    }

    return null;
  }, [accept, maxSize]);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setSelectedFile(file);

      // Create preview for images
      if (preview && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }

      // Upload file
      try {
        setIsUploading(true);
        await onUpload(file);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải file");
        setSelectedFile(null);
        setPreviewUrl(null);
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload, preview, validateFile]
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          isDragging
            ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
            : error
            ? "border-error-300 bg-error-50 dark:bg-error-500/10"
            : "border-gray-300 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500"
        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl && preview ? (
          <div className="relative">
            <Image
              src={previewUrl}
              alt="Preview"
              width={200}
              height={200}
              className="mx-auto rounded-lg object-cover"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Xóa file"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        ) : selectedFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-brand-100 dark:bg-brand-500/20 rounded-lg">
                <UploadCloudIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white/90">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="p-2 text-gray-400 hover:text-error-500 transition-colors"
              aria-label="Xóa file"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <UploadCloudIcon className="mx-auto text-gray-400 dark:text-gray-500 w-12 h-12 mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {isDragging ? "Thả file vào đây" : "Kéo thả file hoặc nhấn để chọn"}
            </p>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-500">{description}</p>
            )}
          </>
        )}

        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
          aria-label={label}
        />

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-lg">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Đang tải lên...</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-error-600 dark:text-error-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
