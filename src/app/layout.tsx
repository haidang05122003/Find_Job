import { Inter, Lexend } from 'next/font/google';
import './globals.css';
import '@/lib/fontawesome';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import QueryProvider from '@/providers/QueryProvider';
import { ChatProvider } from '@/context/ChatContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PageTransition } from '@/components/shared/PageTransition';

// Prevent Font Awesome from adding its CSS
config.autoAddCss = false;

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

const lexend = Lexend({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-lexend",
  preload: true,
});

export const metadata = {
  title: "JobViet - Nắm Bắt Tương Lai",
  description: "Cổng thông tin việc làm hàng đầu Việt Nam",
  icons: {
    icon: "/images/logo/logo-icon.png",
    shortcut: "/images/logo/logo-icon.png",
    apple: "/images/logo/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${lexend.variable}`} suppressHydrationWarning>
      <body className={`${inter.className}`} suppressHydrationWarning>
        <ThemeProvider>
          <QueryProvider>
            <ToastProvider>
              <GoogleOAuthProvider clientId="78415419073-kgoogg3i87hkr552aenravb8iiue89q5.apps.googleusercontent.com">
                <AuthProvider>
                  <SidebarProvider>
                    <ChatProvider>
                      <NotificationProvider>
                        <PageTransition>
                          {children}
                        </PageTransition>
                      </NotificationProvider>
                    </ChatProvider>
                  </SidebarProvider>
                </AuthProvider>
              </GoogleOAuthProvider>
            </ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
