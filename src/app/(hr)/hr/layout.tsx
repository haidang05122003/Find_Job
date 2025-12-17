"use client";

import CompanyGuard from "@/components/auth/CompanyGuard";

export default function HRLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CompanyGuard>
            {children}
        </CompanyGuard>
    );
}
