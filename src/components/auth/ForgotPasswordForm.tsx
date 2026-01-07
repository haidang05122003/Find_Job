"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { authService } from "@/services/auth.service";
import { useToast } from "@/context/ToastContext";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { error: toastError, success: toastSuccess } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        toastSuccess("Link đặt lại mật khẩu đã được gửi đến email của bạn.");
        // Optional: Redirect or show success message
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }
    } catch (error: unknown) {
      console.error("Forgot password error:", error);
      const err = error as { message?: string };
      toastError(err.message || "Gửi yêu cầu thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full animate-slide-in-right">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Quay lại đăng nhập
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Quên mật khẩu
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nhập email của bạn để nhận link đặt lại mật khẩu
            </p>
          </div>
          <form onSubmit={handleSubmit} className="transition-all duration-300">
            <div className="space-y-6">
              <div>
                <Label>
                  Địa chỉ email <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  id="email-forgot"
                  name="email"
                  placeholder="example@gmail.com"
                  defaultValue={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Button
                  type="submit"
                  className="w-full"
                  size="sm"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang gửi..." : "Gửi mã OTP để đổi mật khẩu"}
                </Button>
              </div>
            </div>
          </form>
          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Nhớ mật khẩu?{" "}
              <Link
                href="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

