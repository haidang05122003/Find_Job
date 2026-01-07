"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { authService } from "@/services/auth.service";
import { useToast } from "@/context/ToastContext";
import OtpInput from "@/components/form/input/OtpInput";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { error: toastError, success: toastSuccess } = useToast();

  const [step, setStep] = useState<1 | 2>(1); // Step 1: Verify OTP, Step 2: Reset Password
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);

  // Countdown timer effect
  React.useEffect(() => {
    if (step === 1 && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, step]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email không hợp lệ.");
      return;
    }

    if (otp.length !== 6) {
      setError("Vui lòng nhập đủ 6 số OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.verifyOtp(email, otp);
      if (response.success) {
        setStep(2);
        toastSuccess("Mã OTP hợp lệ. Vui lòng nhập mật khẩu mới.");
      }
    } catch (err: any) {
      console.error("Verify OTP error:", err);
      setError(err.message || "Mã OTP không hợp lệ hoặc đã hết hạn.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    if (!email) {
      setError("Email không hợp lệ.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.resetPassword({
        email,
        otp,
        newPassword: password
      });

      if (response.success) {
        toastSuccess("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
        router.push("/signin");
      }
    } catch (error: unknown) {
      console.error("Reset password error:", error);
      const err = error as { message?: string };
      toastError(err.message || "Đặt lại mật khẩu thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email || countdown > 0) return;
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setCountdown(60);
      toastSuccess("Đã gửi lại mã OTP.");
    } catch (err: any) {
      toastError("Gửi lại OTP thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full animate-slide-in-right">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/forgot-password"
          className="inline-flex items-center text-sm text-gray-500 transition-colors duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Quay lại
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
            {step === 1 ? "Xác thực OTP" : "Đặt lại mật khẩu"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {step === 1
              ? "Mã xác thực đã được gửi đến email của bạn"
              : "Nhập mật khẩu mới của bạn"}
          </p>
          {step === 1 && email && (
            <p className="text-xs text-gray-400 mt-1">{email}</p>
          )}
        </div>

        <form onSubmit={step === 1 ? handleVerifyOtp : handleResetPassword} className="transition-all duration-300">
          <div className="space-y-8">
            {error && (
              <div className="p-3 text-sm text-center text-error-600 bg-error-50 rounded-lg dark:bg-error-500/10 dark:text-error-400">
                {error}
              </div>
            )}

            {/* Step 1: OTP Input */}
            {step === 1 && (
              <div className="flex flex-col items-center space-y-6">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  disabled={isLoading}
                />

                <Button
                  type="submit"
                  className="w-full max-w-[200px]"
                  size="lg"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? "Đang xác thực..." : "Xác thực"}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  Bạn không nhận được mã?{" "}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || isLoading}
                    className={`font-medium transition-colors ${countdown > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-brand-500 hover:text-brand-600 dark:text-brand-400"
                      }`}
                  >
                    {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi lại mã"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Password Inputs */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label>
                    Mật khẩu mới <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="new-password"
                      name="password"
                      placeholder="Nhập mật khẩu mới"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={step === 2}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Label>
                    Xác nhận mật khẩu <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm-new-password"
                      name="confirmPassword"
                      placeholder="Xác nhận mật khẩu mới"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={step === 2}
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
