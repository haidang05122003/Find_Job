"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";
import { authService } from "@/services/auth.service";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";

export default function SignInForm() {
  const router = useRouter();
  const { error: toastError, success: toastSuccess } = useToast();
  const { login, socialLogin } = useAuth(); // Import login from hook
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use AuthContext login instead of direct service call
      const loginData = await login({ username: email, password });

      toastSuccess(t('auth.signInSuccess') || "Đăng nhập thành công");

      // Use the returned loginData for redirection logic
      if (loginData) {
        const roles = loginData.roles || [];
        // Determine role (handle different backend response structures if needed)
        // Adjusting logic based on AuthResponse interface which has roles: string[]
        const userRole = roles.length > 0 ? roles[0] : 'CANDIDATE';

        if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') {
          router.push("/admin");
        } else if (userRole === 'HR' || userRole === 'ROLE_HR') {
          // For HR, we might still need to check company status, but we can do that slightly later or assume dashboard
          // Ideally backend login response should have company status if crucial
          // For now, redirect to HR dashboard, AuthGuard will handle specifics or we fetch company status separate
          // Optimization: Just go to HR dashboard. If specialized logic needed, keep it but simpler.

          // If we really need company status, we fetch it. But let's try to trust the router/guards more.
          // Or just keep the detailed logic but ONLY for HR.
          try {
            const companyRes = await import("@/services/hr.service").then(m => m.hrService.getMyCompany());
            if (companyRes.data) {
              if (companyRes.data.status === 'PENDING' || companyRes.data.status === 'REJECTED') {
                router.push("/hr/company-status");
              } else {
                router.push("/hr");
              }
            } else {
              router.push("/hr/setup-company");
            }
          } catch (err) {
            router.push("/hr/setup-company");
          }
        } else {
          // Explicitly redirect candidates to Home page
          // Add a small delay to ensure AuthContext state propagates
          await new Promise(resolve => setTimeout(resolve, 100));
          router.push("/");
        }
      } else {
        // Fallback if no data (shouldn't happen with updated context)
        router.push("/");
      }

      // DO NOT set isLoading(false) here, so button stays disabled during redirect
    } catch (error: any) {
      console.error("Login failed:", error.message || error);
      let message = t('auth.signInFailed') || "Đăng nhập thất bại";

      if (error?.message) message = error.message;
      if (error?.response?.data?.message) message = error.response.data.message;

      toastError(message);
      setIsLoading(false); // Only re-enable button on error
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        await socialLogin({
          provider: 'google',
          token: tokenResponse.access_token // Google returns access_token
        });

        toastSuccess(t('auth.signInSuccess') || "Đăng nhập thành công");
        router.push("/");
      } catch (error: unknown) {
        console.error("Login error:", error);
        const err = error as { message?: string };
        toastError(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toastError("Đăng nhập Google thất bại");
      setIsLoading(false);
    }
  });

  const handleGoogleLogin = () => {
    googleLogin();
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          {t('auth.backToHome')}
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            {t('auth.signInTitle')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('auth.signInSubtitle')}
          </p>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <Label htmlFor="email-login">
                  {t('auth.email')} <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder={t('auth.emailPlaceholder')}
                  type="email"
                  id="email-login"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="password-login">
                  {t('auth.password')} <span className="text-error-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t('auth.passwordPlaceholder')}
                    id="password-login"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="text-sm text-gray-700 dark:text-gray-400">
                    {t('auth.rememberMe')}
                  </span>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <div>
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? `${t('auth.signIn')}...` : t('auth.signIn')}
                </Button>
              </div>
            </div>
          </form>

          {/* Divider */}
          <div className="relative py-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                {t('common.or')}
              </span>
            </div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full inline-flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                fill="#4285F4"
              />
              <path
                d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                fill="#34A853"
              />
              <path
                d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                fill="#FBBC05"
              />
              <path
                d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                fill="#EB4335"
              />
            </svg>
            {t('auth.signInWith')} Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('auth.noAccount')}{" "}
              <Link
                href="/signup"
                className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                {t('auth.signUp')}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
