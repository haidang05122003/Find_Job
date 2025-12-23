"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { candidateService } from "@/services/candidate.service";
import { useToast } from "@/context/ToastContext";
import { Skill } from "@/types/candidate";
import { TrashIcon, PlusIcon, EditIcon } from "@/components/shared/icons";


import { EducationModal } from "@/components/dashboard/profile/EducationModal";
import { ExperienceModal } from "@/components/dashboard/profile/ExperienceModal";
import { CandidateEducation, CandidateExperience } from "@/types/candidate";

// ... inside ProfileSettingsPage ...

export default function ProfileSettingsPage() {
  const { error: toastError, success: toastSuccess } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Consolidated state for simpler management
  const [profileData, setProfileData] = useState({
    title: "",
    aboutMe: "",
    address: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ name: "", level: "Intermediate" });

  const [educations, setEducations] = useState<CandidateEducation[]>([]);
  const [experiences, setExperiences] = useState<CandidateExperience[]>([]);

  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<CandidateEducation | null>(null);

  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<CandidateExperience | null>(null);

  // Load effect updates
  const loadProfile = async () => {
    try {
      const response = await candidateService.getProfile();
      if (response.success && response.data) {
        const data = response.data;
        setProfileData({
          title: data.title || "",
          aboutMe: data.aboutMe || "",
          address: data.address || "",
          phone: data.phone || "",
          dateOfBirth: data.dateOfBirth || "",
          gender: data.gender || "male",
        });
        setSkills(data.skills || []);
        setEducations(data.educations || []);
        setExperiences(data.experiences || []);
      }
    } catch (error) {
      console.error("Load profile error", error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);



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

  const handleSaveEdu = (edu: CandidateEducation) => {
    if (edu.id) {
      setEducations(educations.map(e => e.id === edu.id ? edu : e));
    } else {
      setEducations([...educations, { ...edu, id: Date.now() }]);
    }
  };

  const handleSaveExp = (exp: CandidateExperience) => {
    if (exp.id) {
      setExperiences(experiences.map(e => e.id === exp.id ? exp : e));
    } else {
      setExperiences([...experiences, { ...exp, id: Date.now() }]);
    }
  };

  // Submit handler updates
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await candidateService.updateProfile({
        ...profileData,
        skills: skills,
        educations: educations,
        experiences: experiences,
      });
      toastSuccess("Đã lưu hồ sơ thành công!");
    } catch (error: any) {
      toastError(error.message || "Lưu thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90 mb-6">
        Kinh nghiệm & Kỹ năng
      </h3>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Module Removed - Handled in Main Settings Page */}

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

        {/* Education List Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Học vấn</Label>
            <button
              type="button"
              onClick={() => {
                setEditingEdu(null);
                setIsEduModalOpen(true);
              }}
              className="text-sm text-brand-500 hover:text-brand-600 font-medium"
            >
              + Thêm
            </button>
          </div>
          <div className="space-y-3">
            {educations.map((edu, index) => (
              <div key={edu.id || index} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800/50 flex justify-between items-start group">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{edu.schoolName}</p>
                  <p className="text-sm text-gray-500">{edu.degree} - {edu.major}</p>
                  {(edu.startDate || edu.endDate) && <p className="text-xs text-gray-400">{edu.startDate} - {edu.endDate}</p>}
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEdu(edu);
                      setIsEduModalOpen(true);
                    }}
                    className="text-gray-400 hover:text-brand-500 p-1"
                  >
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEducations(educations.filter((_, i) => i !== index))}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {educations.length === 0 && <p className="text-sm text-gray-400 italic">Chưa có thông tin học vấn.</p>}
          </div>
        </div>

        {/* Experience List Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Kinh nghiệm làm việc</Label>
            <button
              type="button"
              onClick={() => {
                setEditingExp(null);
                setIsExpModalOpen(true);
              }}
              className="text-sm text-brand-500 hover:text-brand-600 font-medium"
            >
              + Thêm
            </button>
          </div>
          <div className="space-y-3">
            {experiences.map((exp, index) => (
              <div key={exp.id || index} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800/50 flex justify-between items-start group">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{exp.companyName}</p>
                  <p className="text-sm text-brand-600">{exp.position}</p>
                  {(exp.startDate || exp.endDate) && <p className="text-xs text-gray-400">{exp.startDate} - {exp.endDate}</p>}
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingExp(exp);
                      setIsExpModalOpen(true);
                    }}
                    className="text-gray-400 hover:text-brand-500 p-1"
                  >
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setExperiences(experiences.filter((_, i) => i !== index))}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {experiences.length === 0 && <p className="text-sm text-gray-400 italic">Chưa có kinh nghiệm làm việc.</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form >

      <EducationModal
        isOpen={isEduModalOpen}
        onClose={() => setIsEduModalOpen(false)}
        onSubmit={handleSaveEdu}
        initialData={editingEdu}
      />
      <ExperienceModal
        isOpen={isExpModalOpen}
        onClose={() => setIsExpModalOpen(false)}
        onSubmit={handleSaveExp}
        initialData={editingExp}
      />
    </div >
  );
}

