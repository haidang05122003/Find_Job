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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Danh mục ngành nghề
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Quản lý danh sách ngành nghề hiển thị trên hệ thống.
          </p>
        </div>
      </div>

      <ComponentCard title="">
        <div className="space-y-6 p-4">
          {/* Add Category Section */}
          <div className="flex flex-col gap-3 sm:flex-row">
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

          {/* Category List */}
          <div className="min-h-[300px]">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center text-gray-500">
                <p>Chưa có danh mục nào.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="group flex items-center justify-between bg-white p-4 transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {cat.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {cat.id} • {cat.jobCount || 0} tin tuyển dụng
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => openEditModal(cat)}
                          title="Chỉnh sửa"
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-brand-400"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          title="Xóa"
                          className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                        >
                          <TrashBinIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
