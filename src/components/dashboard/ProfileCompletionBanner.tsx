"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { candidateService } from "@/services/candidate.service";

import { slideUpVariants } from "@/lib/animations";

export default function ProfileCompletionBanner() {
  const [hasCv, setHasCv] = useState<boolean | null>(null);

  useEffect(() => {
    const checkCv = async () => {
      try {
        const response = await candidateService.getProfile();
        if (response.success && response.data) {
          setHasCv(response.data.cvs && response.data.cvs.length > 0);
        }
      } catch (error) {
        console.error("Failed to check CV status", error);
        setHasCv(false);
      }
    };
    checkCv();
  }, []);

  // Loading state - don't show anything
  if (hasCv === null) return null;

  // If user has CV, don't show banner
  if (hasCv) return null;

  return (
    <motion.div
      variants={slideUpVariants}
      initial="hidden"
      animate="visible"
      className="bg-warning-50 dark:bg-warning-500/10 border border-warning-300 dark:border-warning-500/30 text-warning-800 dark:text-warning-400 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between transition-all duration-200 hover:shadow-theme-md"
    >
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <div>
          <h3 className="font-semibold text-base">Hồ sơ của bạn chưa hoàn thiện.</h3>
          <p className="text-sm">
            Hoàn thiện hồ sơ và tạo CV tùy chỉnh của bạn
          </p>
        </div>
      </div>
      <Link href="/dashboard/settings">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-warning-600 text-white hover:bg-warning-700 dark:bg-warning-600 dark:hover:bg-warning-500 border-none px-4 py-2 text-sm">
            Chỉnh sửa hồ sơ
          </Button>
        </motion.div>
      </Link>
    </motion.div>
  );
}
