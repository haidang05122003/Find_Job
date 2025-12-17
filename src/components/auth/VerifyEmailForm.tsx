"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function VerifyEmailForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Verify API
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    router.push("/signin");
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendSuccess(false);
    
    // TODO: Call resend email API
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsResending(false);
    setResendSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setResendSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full animate-slide-in-right">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/signup"
          className="inline-flex items-center text-sm text-gray-500 transition-colors duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Quay lại đăng ký
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8 text-center">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Xác thực email
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Chúng tôi đã gửi mã xác thực đến{" "}
              <span className="font-semibold text-gray-900 dark:text-white/90">
                emailaddress@gmail.com
              </span>
              . Vui lòng kiểm tra email và nhập mã xác thực để kích hoạt tài khoản.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="transition-all duration-300">
            <div className="space-y-6">
              <div>
                <Label>
                  Mã xác thực <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="verification-code"
                  name="code"
                  placeholder="Nhập mã xác thực"
                  defaultValue={code}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 6);
                    setCode(value);
                  }}
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
                  {isLoading ? "Đang xác thực..." : "Xác thực tài khoản"}
                </Button>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Không nhận được mã?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="font-semibold text-brand-500 hover:text-brand-600 dark:text-brand-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isResending ? "Đang gửi..." : "Gửi lại"}
                  </button>
                </p>
                {resendSuccess && (
                  <p className="mt-2 text-sm text-success-600 dark:text-success-400">
                    Đã gửi lại mã xác thực thành công!
                  </p>
                )}
              </div>
            </div>
          </form>
          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Đã có tài khoản?{" "}
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

