"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/button/Button";
import { ArrowRightIcon } from "@/components/shared/icons";
import { slideUpVariants } from "@/lib/animations";

export default function ProfileCompletionBanner() {
  return (
    <motion.div
      variants={slideUpVariants}
      initial="hidden"
      animate="visible"
      className="bg-error-50 dark:bg-error-500/10 border border-error-300 dark:border-error-500/30 text-error-800 dark:text-error-400 p-6 rounded-lg flex flex-col md:flex-row items-center justify-between transition-all duration-200 hover:shadow-theme-md"
    >
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Image
            src="https://placehold.co/48x48/FEE2E2/DC2626?text=E"
            alt="Esther Howard"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
        </motion.div>
        <div>
          <h3 className="font-semibold">Hồ sơ của bạn chưa hoàn thiện.</h3>
          <p className="text-sm">
            Hoàn thiện hồ sơ và tạo CV tùy chỉnh của bạn
          </p>
        </div>
      </div>
      <Link href="/dashboard/settings">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-error-600 text-white hover:bg-error-700 dark:bg-error-600 dark:hover:bg-error-500 border-none">
            Chỉnh sửa hồ sơ <ArrowRightIcon className="text-white" />
          </Button>
        </motion.div>
      </Link>
    </motion.div>
  );
}
