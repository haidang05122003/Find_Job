"use client";


import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";
import { ToastProvider } from "@/context/ToastContext";
import Logo from "@/components/shared/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="relative min-h-screen bg-white">
        <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
          {/* Left Side - Form */}
          <div className="flex w-full items-center justify-center p-6 lg:w-1/2 lg:p-12">
            {children}
          </div>

          {/* Right Side - Branding & Background */}
          <div className="relative hidden w-full overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 lg:flex lg:w-1/2">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
              <Image
                src="/images/auth/pattern.svg"
                alt="Background Pattern"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/90 via-brand-700/80 to-brand-900/90" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-lg text-center"
              >
                {/* Logo */}
                <Link href="/" className="mb-8 inline-block">
                  <div className="bg-white rounded-xl px-4 py-3 shadow-lg">
                    <Logo size="lg" />
                  </div>
                </Link>

                {/* Tagline */}
                <h2 className="mb-4 text-3xl font-bold leading-tight">
                  {t('home.hero.title')}
                </h2>
                <p className="mb-8 text-lg text-white/80">
                  {t('home.hero.subtitle')}
                </p>

                {/* Value Propositions */}
                <div className="space-y-4 text-left">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">{t('home.features.feature1Title')}</h3>
                      <p className="text-sm text-white/70">{t('home.features.feature1Desc')}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">{t('home.features.feature2Title')}</h3>
                      <p className="text-sm text-white/70">{t('home.features.feature2Desc')}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">{t('home.features.feature4Title')}</h3>
                      <p className="text-sm text-white/70">{t('home.features.feature4Desc')}</p>
                    </div>
                  </motion.div>
                </div>


              </motion.div>
            </div>

            {/* Floating Shapes */}
            <div className="absolute left-10 top-20 h-20 w-20 rounded-full bg-white/5 blur-xl" />
            <div className="absolute bottom-20 right-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
          </div>


        </div>
      </div>
    </ToastProvider >
  );
}
