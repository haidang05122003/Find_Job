"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useAuth } from "@/context/AuthContext";
import { GridIcon, UserCircleIcon } from "@/icons";
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
  const dashboardLink = isAdmin
    ? "/admin"
    : isHR
      ? "/hr"
      : "/dashboard";

  const dashboardLabel = isAdmin
    ? "Trang quản trị"
    : isHR
      ? "Bảng HR"
      : "Bảng điều khiển";

  const settingsLink = isAdmin
    ? "/admin/settings"
    : isHR
      ? "/profile"
      : "/dashboard/settings";

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
            width={44}
            height={44}
            alt={displayName}
            className="w-full h-full object-cover"
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
                <GridIcon className="w-5 h-5 fill-gray-500" />
                {dashboardLabel}
              </DropdownItem>
            </li>
          )}

          {/* HR Links - Logic: Only show full menu if APPROVED */}
          {isHR && (
            <>
              {companyStatus === 'APPROVED' ? (
                <>
                  <li>
                    <DropdownItem
                      tag="a"
                      href="/hr"
                      onItemClick={closeDropdown}
                      className="flex items-center gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                    >
                      <GridIcon className="w-5 h-5 fill-gray-500" />
                      Bảng HR
                    </DropdownItem>
                  </li>
                  <li>
                    <DropdownItem
                      tag="a"
                      href="/hr/job-postings"
                      onItemClick={closeDropdown}
                      className="flex items-center gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" className="fill-gray-500">
                        <path d="M7 6V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6H20C21.1046 6 22 6.89543 22 8V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V8C2 6.89543 2.89543 6 4 6H7ZM9 4V6H15V4H9ZM4 8V20H20V8H4Z" />
                      </svg>
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
                      <svg width="20" height="20" viewBox="0 0 24 24" className="fill-gray-500">
                        <path d="M12 7V3H2V21H22V7H12ZM6 19H4V17H6V19ZM6 15H4V13H6V15ZM6 11H4V9H6V11ZM6 7H4V5H6V7ZM10 19H8V17H10V19ZM10 15H8V13H10V15ZM10 11H8V9H10V11ZM10 7H8V5H10V7ZM20 19H12V17H14V15H16V17H20V19ZM20 15H18V13H20V15ZM20 11H12V9H20V11Z" />
                      </svg>
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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    Trạng thái: {companyStatus || 'Chờ duyệt'}
                  </DropdownItem>
                </li>
              )}
            </>
          )}

          {/* Profile */}
          <li>
            <DropdownItem
              tag="a"
              href={isHR || isAdmin ? "/profile" : "/dashboard/settings"}
              onItemClick={closeDropdown}
              className="flex items-center gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <UserCircleIcon className="w-5 h-5 fill-gray-500" />
              Tài khoản cá nhân
            </DropdownItem>
          </li>

          {/* Settings */}
          <li>
            <DropdownItem
              tag="a"
              href={(isHR && companyStatus !== 'APPROVED') ? '/profile' : settingsLink}
              onItemClick={closeDropdown}
              className="flex items-center gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="fill-gray-500"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm-9 3.5a9 9 0 1118 0 9 9 0 01-18 0z"
                />
              </svg>
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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 17v-3H9v-4h7V7l5 5-5 5zM4 3h8v2H4v14h8v2H4a2 2 0 01-2-2V5a2 2 0 012-2z" />
          </svg>
          Đăng xuất
        </button>
      </Dropdown>
    </div>
  );
}
