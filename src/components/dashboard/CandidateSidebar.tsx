'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CandidateSidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/dashboard' && pathname === '/dashboard') return true;
        if (path !== '/dashboard' && pathname.startsWith(path)) return true;
        return false;
    };

    const menuItems = [
        {

            items: [
                { label: "Tổng quan", href: "/dashboard" },
                { label: "Việc đã ứng tuyển", href: "/dashboard/applied" },
                { label: "Việc yêu thích", href: "/dashboard/favorite" },
                { label: "Cài đặt", href: "/dashboard/settings" },
            ]
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sticky top-24">
            {menuItems.map((section, idx) => (
                <div key={idx}>
                    <nav className="space-y-1">
                        {section.items.map((item) => {
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                    flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
                    ${active
                                            ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                                        }
                  `}
                                >
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            ))}
        </div>
    );
}
