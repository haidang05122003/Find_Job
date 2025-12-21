"use client";

import { motion } from "framer-motion";
import { itemVariants } from "@/lib/animations";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "brand" | "warning" | "success";
  index?: number;
}

const colorClasses = {
  brand: "bg-white dark:bg-gray-800 border border-brand-100 dark:border-brand-500/20",
  warning: "bg-white dark:bg-gray-800 border border-yellow-100 dark:border-yellow-500/20",
  success: "bg-white dark:bg-gray-800 border border-success-100 dark:border-success-500/20"
};

const iconContainerClasses = {
  brand: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400",
  warning: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400",
  success: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400"
};

export default function StatsCard({ title, value, icon, color, index = 0 }: StatsCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
      className={`${colorClasses[color]} p-6 rounded-2xl shadow-sm transition-all duration-300 cursor-pointer group`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconContainerClasses[color]} transition-colors group-hover:scale-110 duration-300`}>
          {icon}
        </div>
        <div className="text-right">
          <motion.h3
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5, type: "spring" }}
          >
            {value}
          </motion.h3>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</p>
    </motion.div>
  );
}
