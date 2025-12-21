import type { Metadata } from "next";
import React from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import JobApprovalQueue from "@/components/admin/JobApprovalQueue";

export const metadata: Metadata = {
  title: "Quản lý tuyển dụng | Quản trị hệ thống",
  description: "Quản lý và xét duyệt tin tuyển dụng trong hệ thống.",
};

export default function JobApprovalsPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Quản lý tuyển dụng" />
      <JobApprovalQueue />
    </>
  );
}




