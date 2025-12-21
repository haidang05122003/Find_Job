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
    <div className="grid gap-6 lg:grid-cols-2">
      <ComponentCard
        title="Danh mục ngành nghề"
        desc="Quản lý danh sách ngành nghề hiển thị khi đăng tin."
      >
        <div className="space-y-4">
          {loading ? <p>Đang tải...</p> : (
            <>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-start justify-between rounded-2xl border border-gray-100 p-4 dark:border-gray-800"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {cat.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {cat.jobCount || 0} tin tuyển dụng
                    </p>
                  </div>
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 hover:border-brand-500 hover:text-brand-600 dark:border-gray-700 dark:text-gray-300">
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-red-600 hover:border-red-500 hover:bg-red-50 dark:border-gray-700 dark:text-red-400">
                      Xóa
                    </button>
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    showItemsPerPage={false}
                  />
                </div>
              )}
            </>
          )}

          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Tên ngành nghề mới..."
              className="flex-1 rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-100 dark:border-gray-700 dark:text-gray-300"
            />
            <button
              onClick={handleCreate}
              className="rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-semibold text-gray-500 hover:border-brand-500 hover:text-brand-600 dark:border-gray-700 dark:text-gray-400">
              + Thêm
            </button>
          </div>
        </div>
      </ComponentCard>



      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh sửa ngành nghề"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <Label>Tên ngành nghề</Label>
            <Input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Mô tả</Label>
            <Input
              type="text"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Hủy</Button>
            <Button onClick={handleUpdate}>Cập nhật</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManager;
