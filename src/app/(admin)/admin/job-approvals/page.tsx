import type { Metadata } from "next";
import React from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import JobApprovalQueue from "@/components/admin/JobApprovalQueue";

export const metadata: Metadata = {
  title: "Duyệt tin tuyển dụng | Quản trị hệ thống",
  description: "Xét duyệt tin tuyển dụng mới và yêu cầu chỉnh sửa.",
};

export default function JobApprovalsPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Duyệt tin tuyển dụng" />
      <JobApprovalQueue />
    </>
  );
}




