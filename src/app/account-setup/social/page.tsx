"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
} from "@/components/shared/icons";

export default function SocialMediaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/account-setup/contact");
  };

  const handlePrevious = () => {
    router.push("/account-setup/founding");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white/90 mb-2">
          Mạng xã hội
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Kết nối các trang mạng xã hội của công ty
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Facebook</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FacebookIcon className="text-blue-600" />
            </div>
            <Input
              type="url"
              value={formData.facebook}
              onChange={(e) =>
                setFormData({ ...formData, facebook: e.target.value })
              }
              placeholder="https://facebook.com/yourcompany"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label>Twitter</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TwitterIcon className="text-sky-500" />
            </div>
            <Input
              type="url"
              value={formData.twitter}
              onChange={(e) =>
                setFormData({ ...formData, twitter: e.target.value })
              }
              placeholder="https://twitter.com/yourcompany"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label>LinkedIn</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkedinIcon className="text-blue-700" />
            </div>
            <Input
              type="url"
              value={formData.linkedin}
              onChange={(e) =>
                setFormData({ ...formData, linkedin: e.target.value })
              }
              placeholder="https://linkedin.com/company/yourcompany"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 rounded-lg p-4">
        <p className="text-sm text-brand-800 dark:text-brand-300">
          Các liên kết mạng xã hội giúp ứng viên tìm hiểu thêm về công ty và văn hóa làm việc của bạn.
        </p>
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
