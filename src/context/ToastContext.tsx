'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ToastType = "success" | "error" | "warning" | "info";

type Toast = {
  id: number;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

type ToastContextValue = {
  pushToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: number) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

const ToastIcon: React.FC<{ type: ToastType }> = ({ type }) => {
  const icons = {
    success: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };
  return icons[type];
};

const toneClasses: Record<ToastType, string> = {
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
  error:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300",
  warning:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
  info:
    "border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300",
};

const progressClasses: Record<ToastType, string> = {
  success: "bg-emerald-500",
  error: "bg-rose-500",
  warning: "bg-amber-500",
  info: "bg-brand-500",
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback((toast: Omit<Toast, "id">) => {
    setToasts((prev) => {
      const id = Date.now();
      const next = [...prev, { id, ...toast }];
      const duration = toast.duration ?? 2500;
      if (duration > 0) {
        window.setTimeout(() => {
          setToasts((current) => current.filter((item) => item.id !== id));
        }, duration);
      }
      return next;
    });
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((title: string, description?: string) => {
    pushToast({ title, description, type: 'success' });
  }, [pushToast]);

  const error = useCallback((title: string, description?: string) => {
    pushToast({ title, description, type: 'error' });
  }, [pushToast]);

  const warning = useCallback((title: string, description?: string) => {
    pushToast({ title, description, type: 'warning' });
  }, [pushToast]);

  const info = useCallback((title: string, description?: string) => {
    pushToast({ title, description, type: 'info' });
  }, [pushToast]);

  const value = useMemo(
    () => ({ pushToast, removeToast, success, error, warning, info }),
    [pushToast, removeToast, success, error, warning, info]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-20 z-[1000] flex max-w-sm flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`relative overflow-hidden rounded-xl border pl-4 pr-12 py-3 shadow-lg backdrop-blur-sm ${toneClasses[toast.type ?? "info"]}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 pt-0.5">
                  <ToastIcon type={toast.type ?? "info"} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{toast.title}</p>
                  {toast.description && (
                    <p className="mt-1 text-xs font-medium opacity-80">{toast.description}</p>
                  )}
                  {toast.action && (
                    <button
                      onClick={() => {
                        toast.action?.onClick();
                        removeToast(toast.id);
                      }}
                      className="mt-2 text-xs font-semibold underline hover:no-underline"
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>
                <button
                  className="absolute right-2 top-2 rounded-md p-1 text-xs opacity-70 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
                  onClick={() => removeToast(toast.id)}
                  aria-label="Đóng"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-black/5 dark:bg-white/10">
                <div
                  className={`h-full ${progressClasses[toast.type ?? "info"]} animate-toast-progress`}
                  style={{ animationDuration: `${toast.duration ?? 2500}ms` }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
