"use client";

import React from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminQuickStats from "@/components/admin/AdminQuickStats";

import AdminWorklist from "@/components/admin/AdminWorklist";
import JobApprovalQueue from "@/components/admin/JobApprovalQueue";
import QuickStats from "@/components/recruitment/QuickStats";
import { StaggerContainer, StaggerItem } from "@/components/shared/Motion";


export default function AdminOverviewPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Tổng quan quản trị" />
      <div className="space-y-6">
        <div>
          <AdminQuickStats />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Thống kê tuyển dụng (HR)
          </h2>
          <QuickStats />
        </div>

        <div>
          <AdminWorklist />
        </div>
        <div>
          <JobApprovalQueue />
        </div>
      </div>
    </>
  );
}

