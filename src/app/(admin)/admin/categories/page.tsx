import type { Metadata } from "next";
import React from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CategoryManager from "@/components/admin/CategoryManager";

export const metadata: Metadata = {
  title: "Danh mục | Quản trị hệ thống",
  description: "Quản lý danh mục ngành nghề và kỹ năng toàn hệ thống.",
};

export default function CategoriesPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Danh mục ngành & kỹ năng" />
      <CategoryManager />
    </>
  );
}




