"use client";
import React from "react";
import AppSidebar from "./AppSidebar";

// For now, HRSidebar uses the same AppSidebar
// In the future, this can be customized with HR-specific menu items
const HRSidebar: React.FC = () => {
  return <AppSidebar />;
};

export default HRSidebar;
