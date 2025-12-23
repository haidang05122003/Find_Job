"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useAuth } from "@/context/AuthContext";

import { hrService } from "@/services/hr.service";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [companyStatus, setCompanyStatus] = useState<string | null>(null);
  const { user, logout } = useAuth();

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const roles: string[] = user?.roles || [];
  const isAdmin = roles.includes("ADMIN") || roles.includes("ROLE_ADMIN");
  const isHR = roles.includes("HR") || roles.includes("ROLE_HR");

  useEffect(() => {
    if (isHR && isOpen) { // Fetch when dropdown opens to save requests, or just on mount if prefers
      hrService.getMyCompany()
        .then(res => {
          if (res.data) setCompanyStatus(res.data.status);
        })
        .catch(() => setCompanyStatus(null));
    }
  }, [isHR, isOpen]);

  const closeDropdown = () => setIsOpen(false);

  /* ================= ROLE LOGIC ================= */


  /* ================= ROUTE CONFIG ================= */
  const dashboardLink = isAdmin ? "/admin" : isHR ? "/hr" : "/dashboard";
  const dashboardLabel = "Thống kê";
  const settingsLink = isAdmin ? "/profile" : isHR ? "/profile" : "/dashboard/settings";

  /* ================= USER INFO ================= */
  const displayName = isAdmin
    ? "Administrator"
    : user?.fullName || "User";

  const avatarSrc =
    user?.avatarUrl && user.avatarUrl.startsWith("http")
      ? user.avatarUrl
      : user?.avatarUrl
        ? `http://localhost:8080${user.avatarUrl}`
        : "/images/user/owner.jpg";

  return (
    <div className="relative">
      {/* ===== Button ===== */}
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11 border border-gray-200 dark:border-gray-700">
          <Image
            src={avatarSrc}
            width={80}
            height={80}
            alt={displayName}
            className="w-full h-full object-contain"
          />
        </span>

        <span className="mr-1 font-medium text-theme-sm">
          {displayName}
        </span>

        <svg
          className={`stroke-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* ===== Dropdown ===== */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] w-[260px] rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        {/* ===== User Info ===== */}
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-300">
            {displayName}
          </span>
          <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email || "email@example.com"}
          </span>
        </div>

        {/* ===== Menu ===== */}
        <ul className="flex flex-col gap-1 py-4 border-b border-gray-200 dark:border-gray-800">

          {/* Admin & Normal User Links (Always visible) */}
          {!isHR && (
            <li>
              <DropdownItem
                tag="a"
                href={dashboardLink}
                onItemClick={closeDropdown}
                className="flex items-center gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
              >

                {dashboardLabel}
              </DropdownItem>
            </li>
          )}

          {/* HR Links - Logic: Only show full menu if APPROVED */}
          {isHR && (
            <>
              {(user?.status === 'PENDING' && !user?.isCompanyOwner) ? (
                /* Pending Member -> Show only link to check status */
                <li>
                  <DropdownItem
                    tag="a"
                    href="/hr/pending"
                    onItemClick={closeDropdown}
                    className="flex items-center gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm text-yellow-600 bg-yellow-50 hover:bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-500/10 dark:hover:bg-yellow-500/20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    Trạng thái: Chờ duyệt
                  </DropdownItem>
                </li>
              ) : companyStatus === 'APPROVED' ? (
                <>
                  <li>
                    <DropdownItem
                      tag="a"
                      href="/hr"
                      onItemClick={closeDropdown}
                      className="flex items-center gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                    >
                      Thống kê
                    </DropdownItem>
                  </li>
                  <li>
                    <DropdownItem
                      tag="a"
                      href="/hr/job-postings"
                      onItemClick={closeDropdown}
                      className="flex items-center gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                    >

                      Tin tuyển dụng
                    </DropdownItem>
                  </li>
                  <li>
                    <DropdownItem
                      tag="a"
                      href="/hr/company-profile"
                      onItemClick={closeDropdown}
                      className="flex items-center gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                    >

                      Hồ sơ công ty
                    </DropdownItem>
                  </li>
                </>
              ) : (
                <li>
                  <DropdownItem
                    tag="a"
                    href="/hr/company-status"
                    onItemClick={closeDropdown}
                    className="flex items-center gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm text-orange-600 bg-orange-50 hover:bg-orange-100 dark:text-orange-400 dark:bg-orange-500/10 dark:hover:bg-orange-500/20"
                  >

                    Trạng thái: {companyStatus || 'Chờ duyệt'}
                  </DropdownItem>
                </li>
              )}
            </>
          )}

          {/* Profile */}


          {/* Settings */}
          <li>
            <DropdownItem
              tag="a"
              href={(isHR && companyStatus !== 'APPROVED') ? '/profile' : settingsLink}
              onItemClick={closeDropdown}
              className="flex items-center gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
            >

              Cài đặt
            </DropdownItem>
          </li>
        </ul>

        {/* ===== Logout ===== */}
        <button
          onClick={() => {
            logout();
            closeDropdown();
          }}
          className="flex w-full items-center gap-3 px-3 py-2 mt-2 font-medium text-red-600 rounded-lg text-theme-sm hover:bg-red-50 dark:hover:bg-white/5"
        >

          Đăng xuất
        </button>
      </Dropdown>
    </div>
  );
}
