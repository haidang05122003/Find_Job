"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { candidateService } from "@/services/candidate.service";
import { useToast } from "@/context/ToastContext";
import { Skill } from "@/types/candidate";
import { TrashIcon, PlusIcon } from "@/components/shared/icons";
import RichTextEditor from "@/components/ui/editor/RichTextEditor";

export default function ProfileSettingsPage() {
  const { error: toastError, success: toastSuccess } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "male",
    experience: "", // Previously biography, now mapped to experience
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ name: "", level: "Intermediate" });

  const [fullProfile, setFullProfile] = useState<{
    title?: string;
    aboutMe?: string;
    education?: string;
    address?: string;
    phone?: string;
  }>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await candidateService.getProfile();
      if (response.success && response.data) {
        const data = response.data;

        // Helper to handle existing plain text content
        const processContent = (content: string) => {
          if (!content) return "";
          // If it looks like HTML, keep it. Otherwise convert newlines to <br/>
          if (/<[a-z][\s\S]*>/i.test(content)) return content;
          return content.replace(/\n/g, '<br/>');
        };

        setFormData({
          dateOfBirth: data.dateOfBirth || "",
          gender: data.gender || "male",
          experience: processContent(data.experience || ""),
        });
        setSkills(data.skills || []);
        setFullProfile({
          title: data.title || "",
          aboutMe: data.aboutMe || "",
          education: data.education || "",
          address: data.address || "",
          phone: data.phone || "",
        });
      }
    } catch (error) {
      console.error("Load profile error", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Update Basic Info with all required fields
      await candidateService.updateProfile({
        title: fullProfile.title || "",
        aboutMe: fullProfile.aboutMe || "",
        education: fullProfile.education || "",
        address: fullProfile.address || "",
        phone: fullProfile.phone || "",
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        experience: formData.experience,
        skills: skills,
      });

      toastSuccess("Đã lưu hồ sơ thành công!");
    } catch (error: any) {
      toastError(error.message || "Lưu thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    const skillToAdd: Skill = {
      skillName: newSkill.name,
      skillLevel: newSkill.level,
    };
    setSkills([...skills, skillToAdd]);
    setNewSkill({ ...newSkill, name: "" });
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90 mb-6">
        Thông tin hồ sơ
      </h3>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Ngày sinh</Label>
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div>
            <Label>Giới tính</Label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>

        {/* Skills Section - Replacing Marital Status */}
        <div>
          <Label>Kỹ năng chuyên môn</Label>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white dark:bg-gray-700 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {skill.skillName} <span className="text-xs text-brand-500 ml-1">({skill.skillLevel})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="text-gray-400 hover:text-error-500 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {skills.length === 0 && (
                <p className="text-sm text-gray-500 italic">Chưa có kỹ năng nào.</p>
              )}
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Tên kỹ năng (VD: ReactJS, Java...)"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                />
              </div>
              <div className="w-40">
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white h-[46px]" // Height match input
                >
                  <option value="Beginner">Mới</option>
                  <option value="Intermediate">Trung bình</option>
                  <option value="Advanced">Thành thạo</option>
                  <option value="Expert">Chuyên gia</option>
                </select>
              </div>
              <Button type="button" onClick={handleAddSkill} className="shrink-0">
                <PlusIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Experience - Renamed from Biography */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Kinh nghiệm làm việc</Label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formData.experience.length} ký tự
            </span>
          </div>

          <RichTextEditor
            content={formData.experience}
            onChange={(html) => setFormData({ ...formData, experience: html })}
            placeholder="Mô tả chi tiết kinh nghiệm làm việc của bạn..."
            className="min-h-[300px]"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Hãy liệt kê các dự án, công nghệ và thành tựu bạn đã đạt được.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form >
    </div >
  );
}

