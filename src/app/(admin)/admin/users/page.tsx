import type { Metadata } from "next";
import React from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserManagementTable from "@/components/admin/UserManagementTable";

export const metadata: Metadata = {
  title: "Người dùng | Quản trị hệ thống",
  description: "Quản lý người dùng, phân quyền và khóa tài khoản.",
};

export default function UsersPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Quản lý người dùng" />
      <UserManagementTable />
    </>
  );
}




