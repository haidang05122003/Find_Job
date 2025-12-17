"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon } from "@/components/shared/icons";

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Vietnam",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      alert("Vui lòng nhập email liên hệ");
      return;
    }

    alert("Hoàn tất thiết lập tài khoản!");
    router.push("/dashboard");
  };

  const handlePrevious = () => {
    router.push("/account-setup/social");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white/90 mb-2">
          Thông tin liên hệ
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Cung cấp thông tin để ứng viên có thể liên hệ với công ty
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>
            Email liên hệ <span className="text-error-500">*</span>
          </Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="contact@company.com"
            required
          />
        </div>

        <div>
          <Label>Số điện thoại</Label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="+84 123 456 789"
          />
        </div>
      </div>

      <div>
        <Label>Địa chỉ</Label>
        <Input
          type="text"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          placeholder="Số nhà, tên đường"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Thành phố</Label>
          <Input
            type="text"
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            placeholder="VD: Hà Nội"
          />
        </div>

        <div>
          <Label>Quốc gia</Label>
          <select
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
          >
            <option value="Vietnam">Việt Nam</option>
            <option value="USA">Hoa Kỳ</option>
            <option value="UK">Vương quốc Anh</option>
            <option value="Singapore">Singapore</option>
            <option value="Japan">Nhật Bản</option>
            <option value="Korea">Hàn Quốc</option>
          </select>
        </div>
      </div>

      <div className="bg-success-50 dark:bg-success-500/10 border border-success-200 dark:border-success-500/30 rounded-lg p-4">
        <p className="text-sm text-success-800 dark:text-success-300">
          <strong>Chúc mừng!</strong> Bạn sắp hoàn tất quá trình thiết lập tài khoản. 
          Sau khi hoàn tất, bạn có thể bắt đầu đăng tin tuyển dụng.
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
        <Button type="submit" className="min-w-[140px] bg-success-600 hover:bg-success-700">
          Hoàn tất
        </Button>
      </div>
    </form>
  );
}
