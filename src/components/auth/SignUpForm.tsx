"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "@/services/auth.service";
import { useToast } from "@/context/ToastContext";

export default function SignUpForm() {
  const router = useRouter();
  const { error: toastError, success: toastSuccess } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [step, setStep] = useState(1); // 1: Account Info, 2: Company Info

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CANDIDATE", // Default role
    companyName: "",
    companyAddress: "",
    companyWebsite: "",
    companyPhone: "",
    companyDescription: "",
    companyLogoUrl: "",
    companyCode: "", // Add companyCode
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [joinExisting, setJoinExisting] = useState(false); // New state to toggle mode

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setError("");

    // Validation for Step 1
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (formData.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }
    if (!formData.fullName || !formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin tài khoản");
      return;
    }

    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Final Validation
    if (formData.role === 'HR') {
      if (joinExisting) {
        if (!formData.companyCode) {
          setError("Vui lòng nhập mã công ty");
          return;
        }
      } else {
        if (!formData.companyName || !formData.companyAddress) {
          setError("Vui lòng nhập tên công ty và địa chỉ");
          return;
        }
      }
    }

    if (!isChecked) {
      setError("Vui lòng đồng ý với Điều khoản và Chính sách bảo mật");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({
        username: formData.email.split('@')[0],
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName.trim(),
        role: formData.role as any,
        companyName: formData.companyName,
        companyAddress: formData.companyAddress,
        companyWebsite: formData.companyWebsite,
        companyPhone: formData.companyPhone,
        companyDescription: formData.companyDescription,
        companyLogoUrl: formData.companyLogoUrl,
        companyCode: joinExisting ? formData.companyCode : undefined // Pass companyCode only if joining
      });

      if (response.success) {
        toastSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
        router.push("/signin");
      }
    } catch (err: any) {
      console.error("Register error:", err);
      const message = err.message || "Đăng ký thất bại. Vui lòng thử lại.";
      setError(message);
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Quay lại trang chủ
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                {step === 1 ? "Đăng ký tài khoản" : "Thông tin doanh nghiệp"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {step === 1 ? "Chọn vai trò và nhập thông tin để tạo tài khoản mới!" : "Vui lòng cung cấp thông tin công ty để xác thực."}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {error && (
                  <div className="p-3 text-sm text-error-600 bg-error-50 rounded-lg dark:bg-error-500/10 dark:text-error-400">
                    {error}
                  </div>
                )}

                {/* STEP 1: ACCOUNT INFO */}
                {step === 1 && (
                  <>
                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-2 p-1 mb-6 bg-gray-100 rounded-lg dark:bg-gray-800">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'CANDIDATE' })}
                        className={`py-2 text-sm font-medium rounded-md transition-all ${formData.role === 'CANDIDATE'
                          ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-white'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                          }`}
                      >
                        Ứng viên
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'HR' })}
                        className={`py-2 text-sm font-medium rounded-md transition-all ${formData.role === 'HR'
                          ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-white'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                          }`}
                      >
                        Nhà tuyển dụng
                      </button>
                    </div>

                    <div>
                      <Label>Họ và tên <span className="text-error-500">*</span></Label>
                      <Input
                        type="text"
                        placeholder="Nhập họ và tên"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Email <span className="text-error-500">*</span></Label>
                      <Input
                        type="email"
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Mật khẩu <span className="text-error-500">*</span></Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                        <span onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                          {showPassword ? <EyeIcon className="fill-gray-500" /> : <EyeCloseIcon className="fill-gray-500" />}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label>Xác nhận mật khẩu <span className="text-error-500">*</span></Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Xác nhận mật khẩu"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          required
                        />
                        <span onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                          {showPassword ? <EyeIcon className="fill-gray-500" /> : <EyeCloseIcon className="fill-gray-500" />}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      {formData.role === 'HR' ? (
                        <Button type="button" onClick={handleNextStep} className="w-full">
                          Tiếp tục: Thông tin công ty
                        </Button>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 mb-4">
                            <Checkbox className="w-5 h-5" checked={isChecked} onChange={setIsChecked} />
                            <p className="text-sm text-gray-500">Đồng ý với Điều khoản dịch vụ</p>
                          </div>
                          <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Đang xử lý..." : "Tạo tài khoản"}
                          </Button>
                        </>
                      )}
                    </div>
                  </>
                )}

                {/* STEP 2: COMPANY INFO (Only for HR) */}
                {step === 2 && formData.role === 'HR' && (
                  <div className="space-y-4">
                    {/* Mode Selection */}
                    <div className="grid grid-cols-2 gap-2 p-1 mb-6 bg-gray-100 rounded-lg dark:bg-gray-800">
                      <button
                        type="button"
                        onClick={() => setJoinExisting(false)}
                        className={`py-2 text-sm font-medium rounded-md transition-all ${!joinExisting
                          ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-white'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                          }`}
                      >
                        Tạo công ty mới
                      </button>
                      <button
                        type="button"
                        onClick={() => setJoinExisting(true)}
                        className={`py-2 text-sm font-medium rounded-md transition-all ${joinExisting
                          ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-white'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                          }`}
                      >
                        Tham gia công ty
                      </button>
                    </div>

                    {joinExisting ? (
                      // JOIN EXISTING COMPANY UI
                      <div>
                        <Label>Mã công ty (Company Code) <span className="text-error-500">*</span></Label>
                        <Input
                          value={formData.companyCode}
                          onChange={(e) => setFormData({ ...formData, companyCode: e.target.value })}
                          placeholder="Nhập mã công ty (VD: CMP-123...)"
                          required
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Nhập mã định danh được cung cấp bởi quản trị viên công ty của bạn.
                        </p>
                      </div>
                    ) : (
                      // CREATE NEW COMPANY UI
                      <>
                        <div>
                          <Label>Tên công ty <span className="text-error-500">*</span></Label>
                          <Input
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            placeholder="VD: Công ty công nghệ Viễn Đông"
                            required
                          />
                        </div>
                        <div>
                          <Label>Địa chỉ <span className="text-error-500">*</span></Label>
                          <Input
                            value={formData.companyAddress}
                            onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                            placeholder="Số 10, Đường ABC, Quận XYZ..."
                            required
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <Label>Mô tả công ty</Label>
                          <TextArea
                            value={formData.companyDescription || ''}
                            onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                            placeholder="Giới thiệu về công ty..."
                            rows={4}
                          />
                        </div>

                        <div>
                          <Label>Website</Label>
                          <Input
                            value={formData.companyWebsite}
                            onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <Label>Số điện thoại</Label>
                          <Input
                            value={formData.companyPhone}
                            onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                            placeholder="0901234567"
                          />
                        </div>

                        {/* Logo URL */}
                        <div>
                          <Label>URL Logo</Label>
                          <Input
                            value={formData.companyLogoUrl || ''}
                            onChange={(e) => setFormData({ ...formData, companyLogoUrl: e.target.value })}
                            placeholder="https://example.com/logo.png"
                          />
                        </div>
                      </>
                    )}

                    <div className="flex items-center gap-3 mt-4 mb-4">
                      <Checkbox className="w-5 h-5" checked={isChecked} onChange={setIsChecked} />
                      <p className="text-sm text-gray-500">Đồng ý với Điều khoản dịch vụ & Chính sách</p>
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={handleBack} className="w-1/3">
                        Quay lại
                      </Button>
                      <Button type="submit" className="w-2/3" disabled={isLoading}>
                        {isLoading ? "Đang xử lý..." : (joinExisting ? "Gia nhập công ty" : "Tạo công ty mới")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </form>

            {step === 1 && (
              <div className="mt-5 text-center">
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Đã có tài khoản? <Link href="/signin" className="text-brand-500 hover:underline">Đăng nhập</Link>
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
