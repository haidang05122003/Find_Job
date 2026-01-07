"use client";

import { useSidebar } from "@/context/SidebarContext";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";
import AppHeader from "@/layout/AppHeader";
import AdminSidebar from "@/layout/AdminSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import AdminGuard from "@/components/auth/AdminGuard";

import { usePathname } from "next/navigation";

import { PageTransition } from "@/components/shared/PageTransition";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const pathname = usePathname();
  const isChatPage = pathname?.includes('/chat');

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <AuthProvider>
      <ToastProvider>
        <ChatProvider>
          <div className="min-h-screen xl:flex">
            <AdminSidebar />
            <Backdrop />
            <div
              className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
            >
              <AppHeader />
              <div className={`mx-auto ${isChatPage ? 'p-0 w-full max-w-full' : 'p-4 max-w-(--breakpoint-2xl) md:p-6'}`}>
                <AdminGuard>
                  <PageTransition>
                    {children}
                  </PageTransition>
                </AdminGuard>
              </div>
            </div>
          </div>
        </ChatProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
