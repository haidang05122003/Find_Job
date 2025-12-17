import type { Metadata } from "next";
import React from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import JobPostingsTable from "@/components/hr/JobPostingsTable";

export const metadata: Metadata = {
  title: "Tin tuyển dụng | Khối HR",
  description: "Tạo mới, chỉnh sửa và theo dõi trạng thái tin tuyển dụng.",
};

export default function JobPostingsPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Tin tuyển dụng" />
      <JobPostingsTable />
    </>
  );
}



