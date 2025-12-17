import type { Metadata } from "next";
import React from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ViolationReportsTable from "@/components/admin/ViolationReportsTable";

export const metadata: Metadata = {
  title: "Báo cáo vi phạm | Quản trị hệ thống",
  description: "Theo dõi và xử lý báo cáo vi phạm trên toàn hệ thống.",
};

export default function ViolationsPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Báo cáo vi phạm" />
      <ViolationReportsTable />
    </>
  );
}




