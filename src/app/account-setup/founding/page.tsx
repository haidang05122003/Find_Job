"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ArrowRightIcon, ChevronLeftIcon } from "@/components/shared/icons";

export default function FoundingInfoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    foundedYear: "",
    companySize: "",
    industry: "",
    website: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/account-setup/social");
  };

  const handlePrevious = () => {
    router.push("/account-setup");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white/90 mb-2">
          Thông tin thành lập
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Cung cấp thông tin về lịch sử và quy mô công ty
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Năm thành lập</Label>
          <Input
            type="number"
            value={formData.foundedYear}
            onChange={(e) =>
              setFormData({ ...formData, foundedYear: e.target.value })
            }
            placeholder="VD: 2010"
            min="1900"
            max={new Date().getFullYear().toString()}
          />
        </div>

        <div>
          <Label>Quy mô công ty</Label>
          <select
            value={formData.companySize}
            onChange={(e) =>
              setFormData({ ...formData, companySize: e.target.value })
            }
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
          >
            <option value="">Chọn quy mô...</option>
            <option value="1-10">1-10 nhân viên</option>
            <option value="11-50">11-50 nhân viên</option>
            <option value="51-200">51-200 nhân viên</option>
            <option value="201-500">201-500 nhân viên</option>
            <option value="501-1000">501-1000 nhân viên</option>
            <option value="1000+">1000+ nhân viên</option>
          </select>
        </div>

        <div>
          <Label>Ngành nghề</Label>
          <select
            value={formData.industry}
            onChange={(e) =>
              setFormData({ ...formData, industry: e.target.value })
            }
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
          >
            <option value="">Chọn ngành nghề...</option>
            <option value="technology">Công nghệ thông tin</option>
            <option value="finance">Tài chính - Ngân hàng</option>
            <option value="healthcare">Y tế - Sức khỏe</option>
            <option value="education">Giáo dục - Đào tạo</option>
            <option value="retail">Bán lẻ</option>
            <option value="manufacturing">Sản xuất</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div>
          <Label>Website công ty</Label>
          <Input
            type="url"
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          className="min-w-[120px]"
        >
          <ChevronLeftIcon className="mr-2" />
          Quay lại
        </Button>
        <Button type="submit" className="min-w-[140px]">
          Lưu & Tiếp tục
          <ArrowRightIcon className="ml-2" />
        </Button>
      </div>
    </form>
  );
}
