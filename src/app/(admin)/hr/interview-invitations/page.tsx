import type { Metadata } from "next";
import React from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InterviewInvitations from "@/components/hr/InterviewInvitations";

export const metadata: Metadata = {
  title: "Thư mời phỏng vấn | Khối HR",
  description: "Soạn và gửi thư mời phỏng vấn, theo dõi lịch gửi.",
};

export default function InterviewInvitationsPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Thư mời phỏng vấn" />
      <InterviewInvitations />
    </>
  );
}



