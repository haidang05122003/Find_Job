import type { Metadata } from "next";
import React from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CandidatesBoard from "@/components/hr/CandidatesBoard";

export const metadata: Metadata = {
  title: "Ứng viên | Khối HR",
  description: "Theo dõi hồ sơ ứng viên, điểm phỏng vấn và trạng thái phê duyệt.",
};

export default function CandidatesPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Ứng viên" />
      <CandidatesBoard />
    </>
  );
}



