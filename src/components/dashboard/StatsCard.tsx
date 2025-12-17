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
  brand: "bg-brand-50 dark:bg-brand-500/10 text-brand-800 dark:text-brand-400",
  warning: "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-800 dark:text-yellow-400",
  success: "bg-success-50 dark:bg-success-500/10 text-success-800 dark:text-success-400"
};

const iconColorClasses = {
  brand: "text-brand-700 dark:text-brand-300",
  warning: "text-yellow-700 dark:text-yellow-300",
  success: "text-success-700 dark:text-success-300"
};

export default function StatsCard({ title, value, icon, color, index = 0 }: StatsCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className={`${colorClasses[color]} p-6 rounded-lg shadow-theme-sm hover:shadow-theme-md transition-shadow duration-200 cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-3">
        <motion.h3 
          className="text-4xl font-bold"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + index * 0.1, duration: 0.5, type: "spring" }}
        >
          {value}
        </motion.h3>
        <div className={`${iconColorClasses[color]} text-2xl`}>
          {icon}
        </div>
      </div>
      <p className={iconColorClasses[color]}>{title}</p>
    </motion.div>
  );
}
