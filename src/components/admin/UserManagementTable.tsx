"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Pagination from "../shared/Pagination";
import { adminService } from "@/services/admin.service";
import { UserProfile } from "@/types/user";

const statusBadge = (status: string) =>
  status === "ACTIVE"
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
    : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300";

const roles = ["ADMIN", "RECRUITER", "CANDIDATE"];

const UserManagementTable: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);
    return () => clearTimeout(handler);
  }, [keyword]);

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const params: any = { page: page, size: 10 }; // Make sure pagination is 1-based or 0-based consistently. AdminService handles -1.
      if (role) params.role = role;
      if (status) params.status = status;
      if (debouncedKeyword) params.keyword = debouncedKeyword;

      const res = await adminService.getAllUsers(params);
      if (res.data) {
        setUsers(res.data.content);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, role, status, debouncedKeyword]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLockToggle = async (user: UserProfile) => {
    try {
      if (user.status === 'ACTIVE') {
        await adminService.lockUser(user.id);
      } else {
        await adminService.unlockUser(user.id);
      }
      fetchUsers(currentPage);
    } catch (error) {
      alert("Failed to update user status");
    }
  };

  return (
    <ComponentCard
      title="Quản lý người dùng"
      desc="Phân quyền và khóa/mở tài khoản trong hệ thống."
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setCurrentPage(1); }}
            placeholder="Tìm kiếm theo tên hoặc email..."
            className="rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-100 dark:border-gray-700 dark:text-gray-300 min-w-[200px]"
          />
          <select
            value={role}
            onChange={(e) => { setRole(e.target.value); setCurrentPage(1); }}
            className="rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-100 dark:border-gray-700 dark:text-gray-300"
          >
            <option value="">Tất cả quyền</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }}
            className="rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-100 dark:border-gray-700 dark:text-gray-300"
          >
            <option value="">Trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="BANNED">Đã khóa</option>
          </select>
        </div>

      </div>

      <div className="overflow-x-auto mb-4">
        <table className="w-full min-w-[720px] text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <tr>
              <th className="pb-3 font-semibold">Tên hiển thị</th>
              <th className="pb-3 font-semibold">Email</th>
              <th className="pb-3 font-semibold">Vai trò</th>
              <th className="pb-3 font-semibold">Trạng thái</th>
              <th className="pb-3 font-semibold">Ngày tạo</th>
              <th className="pb-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-4">Đang tải...</td></tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/60 dark:hover:bg-white/5">
                  <td className="py-3 font-medium text-gray-900 dark:text-white">
                    {user.fullName || user.name || user.email}
                  </td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">{user.role || (user.roles && user.roles[0]) || 'UNKNOWN'}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge(user.status || 'UNKNOWN')}`}
                    >
                      {user.status || 'Chưa xác định'}
                    </span>
                  </td>
                  <td className="py-3">{user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : '-'}</td>
                  <td className="py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => handleLockToggle(user)}
                        className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 hover:border-brand-500 hover:text-brand-600 dark:border-gray-700 dark:text-gray-300">
                        {user.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="text-center py-4">Không có người dùng nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </ComponentCard>
  );
};

export default UserManagementTable;




