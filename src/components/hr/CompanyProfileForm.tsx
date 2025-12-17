"use client";

import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import { hrService, CompanyUpdateRequest } from "@/services/hr.service";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import RichTextEditor from "../ui/editor/RichTextEditor";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2 text-sm text-gray-700 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-200 dark:focus:border-brand-400";

const CompanyProfileForm: React.FC = () => {
  const { error: toastError, success: toastSuccess } = useToast();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    address: "",
    phone: "",
    description: "",
    logoUrl: "",
    coverImageUrl: "",
    companySize: "",
  });

  // Fetch company data on mount
  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const response = await hrService.getMyCompany();
        if (response.success && response.data) {
          setFormData({
            companyName: response.data.companyName || "",
            website: response.data.website || "",
            address: response.data.address || "",
            phone: response.data.phone || "",
            description: response.data.description || "",
            logoUrl: response.data.logoUrl || "",
            coverImageUrl: response.data.coverImageUrl || "",
            companySize: response.data.companySize || "",
          });
        }
      } catch (err) {
        // Company might not exist yet
        // console.log("Could not fetch company data");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData: CompanyUpdateRequest = {
        companyName: formData.companyName || undefined,
        description: formData.description || undefined,
        address: formData.address || undefined,
        website: formData.website || undefined,
        phone: formData.phone || undefined,
        logoUrl: formData.logoUrl || undefined,
        coverImageUrl: formData.coverImageUrl || undefined,
        companySize: formData.companySize || undefined,
      };

      const response = await hrService.updateCompany(updateData);
      if (response.success) {
        toastSuccess("Cập nhật thông tin công ty thành công");
      } else {
        toastError(response.message || "Không thể cập nhật thông tin");
      }
    } catch (err) {
      toastError("Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toastError("Kích thước tệp quá lớn (tối đa 2MB)");
      return;
    }

    setSaving(true);
    try {
      const response = await hrService.uploadLogo(file);
      if (response.success && response.data) {
        setFormData(prev => ({ ...prev, logoUrl: response.data }));
        toastSuccess("Tải Logo thành công");
      } else {
        toastError(response.message || "Tải ảnh thất bại");
      }
    } catch (err) {
      toastError("Lỗi tải Logo");
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toastError("Kích thước tệp quá lớn (tối đa 2MB)");
      return;
    }

    setSaving(true);
    try {
      const response = await hrService.uploadCover(file);
      if (response.success && response.data) {
        setFormData(prev => ({ ...prev, coverImageUrl: response.data }));
        toastSuccess("Tải ảnh bìa thành công");
      } else {
        toastError(response.message || "Tải ảnh thất bại");
      }
    } catch (err) {
      toastError("Lỗi tải ảnh bìa");
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  };

  const handleReset = () => {
    // Reload the page to reset form
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải thông tin công ty...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Thông tin công ty"
        desc="Cập nhật nội dung giới thiệu và thông tin hiển thị cho ứng viên."
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tên công ty <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Nhập tên công ty"
                className={inputClass}
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Website
              </span>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className={inputClass}
              />
            </label>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Địa chỉ
              </span>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ công ty"
                className={inputClass}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Số điện thoại
              </span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                className={inputClass}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quy mô công ty
              </span>
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Chọn quy mô...</option>
                <option value="1-10 nhân viên">1-10 nhân viên</option>
                <option value="10-50 nhân viên">10-50 nhân viên</option>
                <option value="50-100 nhân viên">50-100 nhân viên</option>
                <option value="100-500 nhân viên">100-500 nhân viên</option>
                <option value="500-1000 nhân viên">500-1000 nhân viên</option>
                <option value="1000+ nhân viên">1000+ nhân viên</option>
              </select>
            </label>
          </div>
          <label className="space-y-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mô tả công ty
            </span>
            <RichTextEditor
              content={formData.description}
              onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
              placeholder="Giới thiệu về công ty, văn hóa doanh nghiệp..."
              className="min-h-[200px]"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Logo Công ty (Avatar)
            </span>
            <div className="flex items-center gap-4">
              {formData.logoUrl ? (
                <img
                  src={formData.logoUrl}
                  alt="Logo Preview"
                  className="h-16 w-16 rounded-xl object-contain border border-gray-200 bg-white"
                />
              ) : (
                <div className="h-16 w-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-dashed border-gray-300">
                  <span className="text-xs text-center text-gray-400">No Logo</span>
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formData.logoUrl ? "Logo đã tải lên" : "Chưa có Logo"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  PNG, JPG tối đa 2MB
                </p>
              </div>
              <label className="cursor-pointer rounded-xl bg-gray-900 px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-gray-900 hover:opacity-90 transition">
                <span>Tải Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={saving}
                />
              </label>
            </div>
          </label>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 dark:border-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:opacity-50 flex items-center gap-2"
            >
              {saving && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </ComponentCard>

      <ComponentCard
        title="Thương hiệu tuyển dụng"
        desc="Quản lý media và các phúc lợi nổi bật."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ảnh bìa/Banner (Hiển thị trang chi tiết)
            </p>
            <div className="flex items-center gap-4 rounded-2xl border border-dashed border-gray-300 p-4 dark:border-gray-700 relative">
              {formData.coverImageUrl ? (
                <img
                  src={formData.coverImageUrl}
                  alt="Company Cover"
                  className="h-20 w-32 rounded-xl object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder-company.png';
                  }}
                />
              ) : (
                <div className="h-20 w-32 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formData.coverImageUrl ? "Ảnh bìa đã tải lên" : "Chưa có ảnh bìa"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  PNG, JPG tối đa 2MB
                </p>
              </div>
              <label className="cursor-pointer ml-auto rounded-xl bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-gray-900 hover:opacity-90 transition">
                <span>Tải Ảnh Bìa</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                  disabled={saving}
                />
              </label>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Trạng thái công ty
            </p>
            <div className="rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Đã được phê duyệt
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Hồ sơ công ty của bạn đã được admin phê duyệt và hiển thị công khai.
              </p>
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
};

export default CompanyProfileForm;
