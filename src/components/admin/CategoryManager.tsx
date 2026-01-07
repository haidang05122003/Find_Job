"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import { categoryService, Category } from "@/services/category.service";
import { adminService } from "@/services/admin.service";
import Pagination from "@/components/shared/Pagination";
import { Modal } from "@/components/ui/modal/Modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { PencilIcon, TrashBinIcon } from "@/icons";

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  // Create States
  const [newCategoryName, setNewCategoryName] = useState("");


  // Edit States
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", description: "" });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Use paginated API
      const catRes = await categoryService.getCategories(currentPage - 1, ITEMS_PER_PAGE);
      if (catRes.success && catRes.data) {
        setCategories(catRes.data.content);
        setTotalPages(catRes.data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchCategories();
  }, [currentPage]);



  // --- Category Handlers ---

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa ngành nghề này?")) return;
    try {
      await categoryService.deleteCategory(id);
      fetchCategories();
    } catch (error) {
      alert("Xóa thất bại");
    }
  };

  const handleCreate = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await categoryService.createCategory({
        name: newCategoryName,
        description: 'Created via Admin Dashboard'
      });
      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
      alert("Tạo thất bại");
    }
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setEditForm({ name: cat.name, description: cat.description || "" });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingCategory || !editForm.name.trim()) return;
    try {
      await categoryService.updateCategory(editingCategory.id, {
        name: editForm.name,
        description: editForm.description
      });
      setIsEditModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      alert("Cập nhật thất bại");
    }
  };



  return (
    <div className="space-y-6">


      <ComponentCard
        title="Danh mục ngành nghề"
        desc="Quản lý danh sách ngành nghề hiển thị trên hệ thống."
      >
        <div className="space-y-6">
          {/* Add Category Section */}
          <div className="flex flex-col gap-3 sm:flex-row border-b border-gray-100 pb-6 dark:border-gray-800">
            <div className="flex-1">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nhập tên ngành nghề mới..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={!newCategoryName.trim()}
              className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
            >
              + Thêm mới
            </button>
          </div>

          {/* Category Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-800">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                <tr className="border-b border-gray-100 dark:border-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
                  <th className="py-4 px-4 w-[10%]">ID</th>
                  <th className="py-4 px-4 w-[50%]">Tên danh mục</th>
                  <th className="py-4 px-4 w-[20%] text-center">Tin tuyển dụng</th>
                  <th className="py-4 px-4 w-[20%] text-right pr-6">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-4"><div className="h-4 w-8 bg-gray-100 rounded" /></td>
                      <td className="p-4"><div className="h-4 w-48 bg-gray-100 rounded" /></td>
                      <td className="p-4 text-center"><div className="h-4 w-12 bg-gray-100 rounded mx-auto" /></td>
                      <td className="p-4 text-right"><div className="h-8 w-16 bg-gray-100 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-gray-500">
                      Chưa có danh mục nào.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="p-4 text-sm text-gray-500">#{cat.id}</td>
                      <td className="p-4">
                        <span className="font-medium text-gray-900 dark:text-white">{cat.name}</span>
                        {cat.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{cat.description}</p>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                          {cat.jobCount || 0} tin
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(cat)}
                            title="Chỉnh sửa"
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:bg-gray-800"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            title="Xóa"
                            className="p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:bg-red-900/20"
                          >
                            <TrashBinIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showItemsPerPage={false}
              />
            </div>
          )}
        </div>
      </ComponentCard>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh sửa danh mục"
        size="sm"
      >
        <div className="space-y-5">
          <div>
            <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Tên danh mục <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              placeholder="Nhập tên danh mục..."
            />
          </div>
          <div>
            <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Mô tả</Label>
            <Input
              type="text"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              placeholder="Mô tả ngắn gọn..."
            />
          </div>
          <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleUpdate}
              className="bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500"
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManager;
