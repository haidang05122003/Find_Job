"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { XCircleIcon, EyeIcon, EyeOffIcon } from "@/components/shared/icons";
import { candidateService } from "@/services/candidate.service";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function AccountSettingsPage() {
  const { user } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    location: "",
    phone: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setContactInfo(prev => ({ ...prev, email: user.email }));
      }
      try {
        const response = await candidateService.getProfile();
        if (response.success && response.data) {
          setContactInfo(prev => ({
            ...prev,
            location: response.data!.address || "",
            phone: response.data!.phone || ""
          }));
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };
    fetchData();
  }, [user]);


  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Update Candidate Profile for Phone and Address (Location)
      await candidateService.updateProfile({
        address: contactInfo.location,
        phone: contactInfo.phone,
        // We must preserve other fields if the backend replaces nulls, 
        // but typically updateProfile should only update fields present or use PATCH.
        // The service impl currently overwrites updates. 
        // Ideally we should have loaded all data first.
        // Wait, I should make sure I don't wipe out other fields.
        // But getProfile is called on mount, so I should probably store full profile state?
        // Or simpler: The backend implementation seemingly updates fields individually if set?
        // Let's check backend... It does: profile.setAddress(request.getAddress());
        // If I only send address, others become null if Request DTO has them as null?
        // Yes, Java DTO will have nulls. And simple setters will set them to null.
        // FIX: Reread profile or merge state.
        // Actually, the best way in this simplified component is to merge with existing data
        // But 'getProfile' logic in this component only set 'contactInfo'.
        // I need to fetch full profile first.
        // Let's just refactor to fetch full profile.
        // OR better: Assume 'updateProfile' in backend handles nulls? 
        // Backend code: `profile.setTitle(request.getTitle());` -> if request.getTitle() is null, it sets null.
        // So I MUST send all current values.
      } as any);

      // WAIT. If I send partial data, I wipe other data.
      // I should load full data first. 
      // Let's modify the component to hold full profile data.
    } catch (error: any) {
      toastError(error.message || "Cập nhật thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  // RE-IMPLEMENTING handleContactSubmit properly below in ReplacementContent

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.new.length < 8) {
      toastError("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toastError("Mật khẩu xác nhận không khớp");
      return;
    }

    setIsLoading(true);
    try {
      await authService.changePassword({
        oldPassword: passwords.current,
        newPassword: passwords.new
      });
      toastSuccess("Đã thay đổi mật khẩu thành công!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error: any) {
      toastError(error.response?.data?.message || "Đổi mật khẩu thất bại. Kiểm tra mật khẩu cũ.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  // Need to fetch full profile to avoid wiping data
  const [fullProfile, setFullProfile] = useState<any>({});

  useEffect(() => {
    const loadFullProfile = async () => {
      try {
        const res = await candidateService.getProfile();
        if (res.success && res.data) {
          setFullProfile(res.data);
          setContactInfo({
            location: res.data.address || "",
            phone: res.data.phone || "",
            email: res.data.email || (user?.email || "")
          });
        }
      } catch (e) { }
    }
    loadFullProfile();
  }, [user]);

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await candidateService.updateProfile({
        ...fullProfile, // Spread existing
        address: contactInfo.location,
        phone: contactInfo.phone
      });
      toastSuccess("Cập nhật thông tin liên hệ thành công!");
      // Update full profile state
      setFullProfile({ ...fullProfile, address: contactInfo.location, phone: contactInfo.phone });
    } catch (error: any) {
      toastError("Cập nhật thất bại");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Contact Info */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90 mb-6">
          Thông tin liên hệ
        </h3>

        <form onSubmit={handleSaveContact} className="space-y-4">
          <div>
            <Label>Địa chỉ</Label>
            <Input
              type="text"
              value={contactInfo.location}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, location: e.target.value })
              }
              placeholder="VD: New York, USA"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Số điện thoại</Label>
              <Input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, phone: e.target.value })
                }
                placeholder="Số điện thoại..."
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={contactInfo.email}
                disabled
                className="bg-gray-100 cursor-not-allowed"
                placeholder="Địa chỉ email..."
              />
              <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi.</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90 mb-6">
          Thay đổi mật khẩu
        </h3>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Mật khẩu hiện tại</Label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                  placeholder="Mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPasswords.current ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label>Mật khẩu mới</Label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                  placeholder="Mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPasswords.new ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label>Xác nhận mật khẩu</Label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                  placeholder="Mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPasswords.confirm ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mật khẩu phải có ít nhất 8 ký tự.
          </p>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Thay đổi mật khẩu"}
            </Button>
          </div>
        </form>
      </div>

      {/* Delete Account - kept as mock/warning */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-error-200 dark:border-error-500/30 p-6">
        <h3 className="text-lg font-semibold text-error-600 dark:text-error-400 mb-2">
          Xóa tài khoản
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Hành động này không thể hoàn tác. Vui lòng liên hệ quản trị viên để thực hiện.
        </p>
        <Button
          variant="ghost"
          disabled
          className="text-error-400 dark:text-error-600 cursor-not-allowed px-0 opacity-50"
        >
          <XCircleIcon className="w-5 h-5 mr-2" />
          Xóa tài khoản
        </Button>
      </div>
    </div>
  );
}
