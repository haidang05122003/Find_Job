"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { AccountSetupStepper } from "@/components/account-setup/stepper";
import { BriefcaseIcon, InfoIcon, LinkIcon, PhoneIcon } from "@/components/shared/icons";

export default function AccountSetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const steps = [
    {
      id: "company",
      name: "Thông tin công ty",
      icon: <BriefcaseIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      path: "/account-setup",
    },
    {
      id: "founding",
      name: "Thông tin thành lập",
      icon: <InfoIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      path: "/account-setup/founding",
    },
    {
      id: "social",
      name: "Mạng xã hội",
      icon: <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      path: "/account-setup/social",
    },
    {
      id: "contact",
      name: "Liên hệ",
      icon: <PhoneIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      path: "/account-setup/contact",
    },
  ];

  const currentStepIndex = steps.findIndex((step) => step.path === pathname);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="w-full p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <Logo />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto p-6 sm:p-10 flex flex-col items-center">
        <AccountSetupStepper
          steps={steps}
          currentStep={currentStepIndex >= 0 ? currentStepIndex : 0}
        />

        <div className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 sm:p-8 animate-fade-in-up">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center p-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800">
        © 2024 Kết Nối Việc Làm. Cơ hội trong tầm tay.
      </footer>
    </div>
  );
}
