import React from 'react';
import { ToastProvider } from '@/context/ToastContext';
import { FilterProvider } from '@/context/FilterContext';
import { AuthProvider } from '@/context/AuthContext';
import PublicHeader from '@/components/landing/PublicHeader';
import Footer from '@/components/landing/Footer';
import ChatWidget from '@/components/shared/ChatWidget';
import { PageTransition } from '@/components/shared/PageTransition';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ToastProvider>
        <FilterProvider>
          <div className="flex min-h-screen flex-col bg-gray-50">
            <PublicHeader />
            <PageTransition>
              <main className="flex-1">{children}</main>
            </PageTransition>
            <Footer />
            <ChatWidget />
          </div>
        </FilterProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
