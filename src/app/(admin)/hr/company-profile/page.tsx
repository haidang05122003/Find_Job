import type { Metadata } from "next";
import React from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CompanyProfileForm from "@/components/hr/CompanyProfileForm";

export const metadata: Metadata = {
  title: "Hồ sơ công ty | Khối HR",
  description: "Quản lý hồ sơ công ty, thương hiệu tuyển dụng và phúc lợi nổi bật.",
};

export default function CompanyProfilePage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Hồ sơ công ty" />
      <CompanyProfileForm />
    </>
  );
}



