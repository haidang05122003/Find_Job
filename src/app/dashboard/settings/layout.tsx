"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserIcon, BriefcaseIcon, LinkIcon, SettingsIcon } from "@/components/shared/icons";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    {
      name: "Cá nhân",
      href: "/dashboard/settings",
      icon: UserIcon,
      exact: true,
    },
    {
      name: "Hồ sơ",
      href: "/dashboard/settings/profile",
      icon: BriefcaseIcon,
    },
    {
      name: "Mạng xã hội",
      href: "/dashboard/settings/social",
      icon: LinkIcon,
    },
    {
      name: "Tài khoản",
      href: "/dashboard/settings/account",
      icon: SettingsIcon,
    },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="animate-fade-in-up">
      {/* Tabs Navigation */}
      <nav
        className="flex items-center space-x-1 border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto no-scrollbar"
        role="tablist"
        aria-label="Cài đặt"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href, tab.exact);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 whitespace-nowrap ${
                active
                  ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
              role="tab"
              aria-selected={active}
              aria-controls={`${tab.name}-panel`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Tab Content */}
      <div role="tabpanel" id="settings-panel">
        {children}
      </div>
    </div>
  );
}
