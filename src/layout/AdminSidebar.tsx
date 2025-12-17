"use client";
import React from "react";
import AppSidebar from "./AppSidebar";

// For now, AdminSidebar uses the same AppSidebar
// In the future, this can be customized with admin-specific menu items
const AdminSidebar: React.FC = () => {
  return <AppSidebar />;
};

export default AdminSidebar;
