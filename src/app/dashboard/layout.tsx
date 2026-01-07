"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ToastProvider } from "@/context/ToastContext";
import { FilterProvider } from "@/context/FilterContext";
import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";
import PublicHeader from "@/components/landing/PublicHeader";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/shared/ChatWidget";
import AuthGuard from "@/components/auth/AuthGuard";

import CandidateSidebar from "@/components/dashboard/CandidateSidebar";
import { PageTransition } from "@/components/shared/PageTransition";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ToastProvider>
        <ChatProvider>
          <FilterProvider>
            <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
              {/* Header */}
              <PublicHeader />

              {/* Main Content with Sidebar */}
              <div className="flex-1">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                      <CandidateSidebar />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                      <AuthGuard fallback={<DashboardSkeleton />}>
                        <PageTransition>
                          {children}
                        </PageTransition>
                      </AuthGuard>
                    </main>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <Footer />
              <ChatWidget />
            </div>
          </FilterProvider>
        </ChatProvider>
      </ToastProvider>
    </AuthProvider>
  );
}



