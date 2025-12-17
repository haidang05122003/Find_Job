"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/shared/PageTransition";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { FileUpload } from "@/components/ui/file-upload/FileUpload";
import { Modal } from "@/components/ui/modal/Modal";
import {
  LinkIcon,
  FileTextIcon,
  PlusIcon,
  DownloadIcon,
  TrashIcon,
  UserIcon,
  SettingsIcon,
  ShareIcon,
  ShieldIcon,
  CheckIcon,
} from "@/components/shared/icons";
import { fadeInVariants } from "@/lib/animations";
import { candidateService } from "@/services/candidate.service";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Resume, CandidateProfile } from "@/types/candidate";


type TabType = "personal" | "profile" | "social" | "account";

import RichTextEditor from "@/components/ui/editor/RichTextEditor";

export default function PersonalSettingsPage() {
  const { error: toastError, success: toastSuccess } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { refreshUser } = useAuth();

  /* State to hold full profile for re-submission of required fields */
  const [fullProfile, setFullProfile] = useState<CandidateProfile | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    headline: "",
    education: "",
    aboutMe: "",
    avatarUrl: "",
    phone: "",
    address: ""
  });

  const [cvs, setCvs] = useState<Resume[]>([]);
  const [isAddCVModalOpen, setIsAddCVModalOpen] = useState(false);
  const [newCVName, setNewCVName] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await candidateService.getProfile();
      if (response.success && response.data) {
        const data = response.data;
        setFullProfile(data); // Save full profile
        setFormData({
          fullName: data.fullName || "",
          headline: data.title || "",
          education: data.education || "",
          aboutMe: data.aboutMe || "",
          avatarUrl: data.avatarUrl || "",
          phone: data.phone || "",
          address: data.address || ""
        });
        setCvs(data.cvs || []);
      }
    } catch (error) {
      console.error("Failed to load profile", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Validate file type/size if needed
      const response = await candidateService.uploadAvatar(file);
      if (response.success && response.data) {
        toastSuccess("Upload Avatar thành công!");
        const newAvatarUrl = response.data;
        setFormData(prev => ({ ...prev, avatarUrl: newAvatarUrl }));

        // Refresh global user state to update header
        await refreshUser();
      }
    } catch (error: any) {
      toastError("Upload Avatar thất bại");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullProfile) return; // Guard clause

    setIsLoading(true);
    try {
      const response = await candidateService.updateProfile({
        // Fields managed in this form
        title: formData.headline,
        education: formData.education,
        aboutMe: formData.aboutMe,
        phone: formData.phone,
        address: formData.address,

        // Required fields preserved from existing profile
        experience: fullProfile.experience || "",
        dateOfBirth: fullProfile.dateOfBirth || "",
        gender: fullProfile.gender || "Other", // Default fallback if needed
        skills: fullProfile.skills || []
      });
      if (response.success) {
        toastSuccess("Đã lưu thay đổi hồ sơ!");
        // Update fullProfile with new values to keep it in sync
        setFullProfile({
          ...fullProfile,
          title: formData.headline,
          education: formData.education,
          aboutMe: formData.aboutMe,
        });
      }
    } catch (error: any) {
      toastError(error.message || "Cập nhật thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCVUpload = async (file: File) => {
    try {
      // Create a loading state or toast if needed
      const response = await candidateService.uploadCv(file);
      if (response.success && response.data) {
        toastSuccess("Upload CV thành công!");
        setCvs([...cvs, response.data]);

        // Update fullProfile's CV list too if we want to be consistent, 
        // though strictly 'cvs' state is used for rendering.
        if (fullProfile) {
          setFullProfile({
            ...fullProfile,
            cvs: [...(fullProfile.cvs || []), response.data]
          });
        }

        setIsAddCVModalOpen(false);
        setNewCVName("");
      }
    } catch (error: any) {
      toastError(error.message || "Upload thất bại");
    }
  };

  const handleDeleteCV = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa CV này?")) {
      try {
        await candidateService.deleteCv(id);
        setCvs(cvs.filter((cv) => cv.id !== id));
        toastSuccess("Đã xóa CV thành công");
      } catch (error: any) {
        toastError("Xóa CV thất bại");
      }
    }
  };

  const handleSetDefaultCV = async (id: number) => {
    try {
      await candidateService.setDefaultCv(id);
      setCvs(cvs.map(cv => ({ ...cv, isDefault: cv.id === id })));
      toastSuccess("Đã đặt CV mặc định");
    } catch (error: any) {
      toastError("Thao tác thất bại");
    }
  };



  return (
    <PageTransition>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="space-y-6"
      >
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90 mb-6">
              Thông tin cơ bản
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Picture Upload */}
                <div className="md:col-span-1">
                  <div className="flex flex-col items-center">
                    <div className="relative group w-32 h-32 mb-4">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 flex items-center justify-center">
                        {formData.avatarUrl ? (
                          <img
                            src={formData.avatarUrl.startsWith('http') ? formData.avatarUrl : `http://localhost:8080${formData.avatarUrl}`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserIcon className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-brand-500 text-white p-2 rounded-full cursor-pointer hover:bg-brand-600 shadow-lg transition-transform hover:scale-105">
                        <PlusIcon className="w-4 h-4" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      Cho phép: *.jpg, *.png
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <Label>
                      Họ và tên <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      value={formData.fullName}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div>
                    <Label>Chức danh / Tiêu đề</Label>
                    <Input
                      type="text"
                      value={formData.headline}
                      onChange={(e) =>
                        setFormData({ ...formData, headline: e.target.value })
                      }
                      placeholder="VD: Senior UX Designer"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label>Học vấn</Label>
                      <Input
                        type="text"
                        value={formData.education}
                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        placeholder="VD: Đại học Bách Khoa..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Số điện thoại</Label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="VD: 0912345678"
                        />
                      </div>
                      <div>
                        <Label>Địa chỉ / Khu vực</Label>
                        <Input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="VD: Hà Nội, TP.HCM..."
                        />
                      </div>
                    </div>
                  </div>



                  <div>
                    <Label>Giới thiệu (Bio)</Label>
                    <RichTextEditor
                      content={formData.aboutMe}
                      onChange={(html) => setFormData({ ...formData, aboutMe: html })}
                      placeholder="Mô tả ngắn về bản thân..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </form>
          </div >

          {/* CV/Resume Section */}
          < div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6" >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90 mb-6">
              CV/Resume của bạn
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Existing CVs */}
              {cvs.map((cv) => (
                <div
                  key={cv.id}
                  className={`border rounded-lg p-4 transition-all duration-200 group relative ${cv.isDefault
                    ? "border-brand-500 bg-brand-50/50 dark:bg-brand-900/10"
                    : "border-gray-200 dark:border-gray-800 hover:border-brand-300"
                    }`}
                >
                  {cv.isDefault && (
                    <div className="absolute top-2 right-2 text-brand-600" title="CV Mặc định">
                      <CheckIcon className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <FileTextIcon className="text-brand-600 dark:text-brand-400 w-8 h-8 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white/90 truncate" title={cv.fileName}>
                          {cv.fileName}
                        </p>
                        <button
                          onClick={async () => {
                            try {
                              const blob = await candidateService.downloadCvBlob(cv.id);
                              const url = window.URL.createObjectURL(blob);
                              window.open(url, '_blank');
                            } catch (e) {
                              toastError("Không thể tải file. Vui lòng thử lại.");
                            }
                          }}
                          className="text-xs text-brand-500 hover:underline bg-transparent border-none p-0 cursor-pointer text-left"
                        >
                          Xem file (Bảo mật)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-2">
                    {!cv.isDefault && (
                      <button
                        onClick={() => handleSetDefaultCV(cv.id)}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 text-gray-600 dark:text-gray-300"
                      >
                        Đặt mặc định
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteCV(cv.id)}
                      className="ml-auto p-2 text-gray-400 hover:text-error-500 dark:hover:text-error-400 rounded-lg hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors"
                      aria-label="Xóa"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add CV Card */}
              <button
                onClick={() => setIsAddCVModalOpen(true)}
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center text-gray-600 dark:text-gray-400 hover:border-brand-500 dark:hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/5 transition-all duration-200 min-h-[140px]"
              >
                <PlusIcon className="w-8 h-8 mb-2" />
                <span className="font-medium">Thêm CV/Resume</span>
                <span className="text-xs mt-1">Chỉ chấp nhận file PDF</span>
              </button>
            </div>
          </div >

          {/* Add CV Modal */}
          < Modal
            isOpen={isAddCVModalOpen}
            onClose={() => {
              setIsAddCVModalOpen(false);
              setNewCVName("");
            }
            }
            title="Thêm CV/Resume"
            size="md"
          >
            <div className="space-y-4">
              <FileUpload
                accept=".pdf,application/pdf"
                maxSize={12}
                onUpload={handleCVUpload}
                label="Tải lên CV/Resume"
                description="Chỉ chấp nhận file PDF. Tối đa 12 MB."
              />

              <Button
                variant="outline"
                onClick={() => {
                  setIsAddCVModalOpen(false);
                  setNewCVName("");
                }}
              >
                Hủy
              </Button>
            </div>
          </Modal >


        </motion.div>
      </motion.div >
    </PageTransition >
  );
}


