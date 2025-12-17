"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { FileUpload } from "@/components/ui/file-upload/FileUpload";
import { ArrowRightIcon } from "@/components/shared/icons";

export default function CompanyInfoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    about: "",
  });

  const handleLogoUpload = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleBannerUpload = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName.trim()) {
      alert("Vui lòng nhập tên công ty");
      return;
    }

    // Navigate to next step
    router.push("/account-setup/founding");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white/90 mb-2">
          Thông tin công ty
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Cung cấp thông tin cơ bản về công ty của bạn
        </p>
      </div>

      {/* Logo and Banner Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUpload
          accept="image/*"
          maxSize={5}
          onUpload={handleLogoUpload}
          preview={true}
          label="Logo công ty"
          description="Ảnh lớn hơn 400x400 pixels. Tối đa 5 MB."
        />

        <FileUpload
          accept="image/*"
          maxSize={5}
          onUpload={handleBannerUpload}
          preview={true}
          label="Ảnh bìa"
          description="Kích thước đề xuất 1920x400. Tối đa 5 MB."
        />
      </div>

      {/* Company Name */}
      <div>
        <Label>
          Tên công ty <span className="text-error-500">*</span>
        </Label>
        <Input
          type="text"
          value={formData.companyName}
          onChange={(e) =>
            setFormData({ ...formData, companyName: e.target.value })
          }
          placeholder="Nhập tên công ty"
          required
        />
      </div>

      {/* About Us */}
      <div>
        <Label>
          Giới thiệu về công ty <span className="text-error-500">*</span>
        </Label>
        <textarea
          value={formData.about}
          onChange={(e) =>
            setFormData({ ...formData, about: e.target.value })
          }
          rows={6}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white transition-all duration-200 resize-none"
          placeholder="Viết về công ty của bạn. Hãy cho ứng viên biết công ty bạn làm gì, văn hóa làm việc và những giá trị cốt lõi..."
          required
        />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Mô tả chi tiết về công ty sẽ giúp thu hút ứng viên phù hợp hơn
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end pt-4">
        <Button type="submit" className="min-w-[140px]">
          Lưu & Tiếp tục
          <ArrowRightIcon className="ml-2" />
        </Button>
      </div>
    </form>
  );
}
