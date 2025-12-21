"use client";

import React from "react";
import { Controller } from "react-hook-form";
import ComponentCard from "../common/ComponentCard";
import RichTextEditor from "../ui/editor/RichTextEditor";
import TagInput from "./job-form/TagInput";
import { useJobPostForm, JobFormData } from "@/hooks/useJobPostForm";
import {
    LOCATION_SUGGESTIONS,
    JOB_LEVELS,
    EMPLOYMENT_TYPES,
    WORK_METHODS,
    EXPERIENCES,
    GENDERS
} from "@/constants/job.constants";

interface JobPostFormProps {
    initialData?: JobFormData & { id?: string };
    isEditMode?: boolean;
}

const JobPostForm: React.FC<JobPostFormProps> = ({ initialData, isEditMode = false }) => {
    const { form, categories, loading, onSubmit } = useJobPostForm({ initialData, isEditMode });
    const { register, control, formState: { errors }, handleSubmit } = form;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <ComponentCard title={isEditMode ? "Chỉnh sửa tin tuyển dụng" : "Đăng tin tuyển dụng"}>
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Title */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Tiêu đề tin tuyển dụng <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("title")}
                            type="text"
                            placeholder="Ví dụ: Senior React Developer..."
                            className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Ngành nghề <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register("categoryId")}
                            className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="">-- Chọn ngành nghề --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId.message}</p>}
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Hạn nộp hồ sơ <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("deadline")}
                            type="date"
                            className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                        {errors.deadline && <p className="mt-1 text-xs text-red-500">{errors.deadline.message}</p>}
                    </div>

                    {/* Skills (MultiSelect) */}
                    <div>
                        <Controller
                            control={control}
                            name="skills"
                            render={({ field: { value, onChange } }) => (
                                <TagInput
                                    label="Kỹ năng yêu cầu"
                                    required
                                    value={value || []}
                                    onChange={onChange}
                                    placeholder="Nhập kỹ năng và nhấn Enter..."
                                    helperText="Ví dụ: ReactJS, Node.js, Java..."
                                    error={errors.skills?.message}
                                />
                            )}
                        />
                    </div>

                    {/* Keywords (MultiSelect) */}
                    <div>
                        <Controller
                            control={control}
                            name="keywords"
                            render={({ field: { value, onChange } }) => (
                                <TagInput
                                    label="Từ khóa / Tags (Optional)"
                                    value={value || []}
                                    onChange={onChange}
                                    placeholder="Nhập từ khóa và nhấn Enter..."
                                    helperText="Ví dụ: Việc làm IT, Developer, Remote..."
                                    error={errors.keywords?.message}
                                />
                            )}
                        />
                    </div>

                    {/* Locations (MultiSelect) */}
                    <div className="md:col-span-2">
                        <Controller
                            control={control}
                            name="locations"
                            render={({ field: { value, onChange } }) => (
                                <TagInput
                                    label="Tỉnh / Thành phố"
                                    required
                                    value={value || []}
                                    onChange={onChange}
                                    suggestions={LOCATION_SUGGESTIONS}
                                    placeholder="Nhập địa điểm và nhấn Enter..."
                                    helperText="Nhập tên thành phố và nhấn Enter. Hỗ trợ nhập nhiều địa điểm."
                                    error={errors.locations?.message}
                                />
                            )}
                        />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Địa chỉ chi tiết <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("address")}
                            type="text"
                            placeholder="Ví dụ: 123 Cầu Giấy..."
                            className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                        {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
                    </div>

                    {/* Salary Min */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Mức lương tối thiểu (VND)
                        </label>
                        <input
                            {...register("salaryMin", { valueAsNumber: true })}
                            type="number"
                            min="0"
                            className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                        {errors.salaryMin && <p className="mt-1 text-xs text-red-500">{errors.salaryMin.message}</p>}
                    </div>

                    {/* Salary Max */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Mức lương tối đa (VND)
                        </label>
                        <input
                            {...register("salaryMax", { valueAsNumber: true })}
                            type="number"
                            min="0"
                            className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                        <p className="mt-1 text-xs text-gray-500">Để 0 nếu là lương thỏa thuận</p>
                        {errors.salaryMax && <p className="mt-1 text-xs text-red-500">{errors.salaryMax.message}</p>}
                    </div>

                    {/* Attributes Row 1 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Hình thức làm việc
                        </label>
                        <select
                            {...register("employmentType")}
                            className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        >
                            {EMPLOYMENT_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Phương thức làm việc
                        </label>
                        <select
                            {...register("workMethod")}
                            className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        >
                            {WORK_METHODS.map((method) => (
                                <option key={method.value} value={method.value}>
                                    {method.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Attributes Row 2 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Kinh nghiệm <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register("experience")}
                            className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="">-- Chọn kinh nghiệm --</option>
                            {EXPERIENCES.map((exp) => (
                                <option key={exp.value} value={exp.value}>
                                    {exp.label}
                                </option>
                            ))}
                        </select>
                        {errors.experience && <p className="mt-1 text-xs text-red-500">{errors.experience.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Cấp bậc
                        </label>
                        <select
                            {...register("level")}
                            className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        >
                            {JOB_LEVELS.map((lvl) => (
                                <option key={lvl.value} value={lvl.value}>
                                    {lvl.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Số lượng
                        </label>
                        <input
                            {...register("quantity", { valueAsNumber: true })}
                            type="number"
                            min="1"
                            className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Giới tính
                        </label>
                        <select
                            {...register("gender")}
                            className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        >
                            {GENDERS.map((gender) => (
                                <option key={gender.value} value={gender.value}>
                                    {gender.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </ComponentCard>


            <ComponentCard title="Chi tiết công việc">
                <div className="space-y-6">
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Mô tả công việc <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <RichTextEditor
                                    content={field.value}
                                    onChange={field.onChange}
                                    placeholder="Mô tả chi tiết về trách nhiệm và công việc hàng ngày..."
                                />
                            )}
                        />
                        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
                    </div>

                    {/* Requirements */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Yêu cầu ứng viên <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="requirements"
                            control={control}
                            render={({ field }) => (
                                <RichTextEditor
                                    content={field.value}
                                    onChange={field.onChange}
                                    placeholder="Kỹ năng, bằng cấp, thái độ..."
                                />
                            )}
                        />
                        {errors.requirements && <p className="mt-1 text-xs text-red-500">{errors.requirements.message}</p>}
                    </div>

                    {/* Benefits */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Quyền lợi
                        </label>
                        <Controller
                            name="benefits"
                            control={control}
                            render={({ field }) => (
                                <RichTextEditor
                                    content={field.value || ""}
                                    onChange={field.onChange}
                                    placeholder="Lương thưởng, bảo hiểm, du lịch..."
                                />
                            )}
                        />
                    </div>
                </div>
            </ComponentCard>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
                >
                    Hủy bỏ
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:opacity-70"
                >
                    {loading ? "Đang xử lý..." : isEditMode ? "Cập nhật tin" : "Đăng tin ngay"}
                </button>
            </div>
        </form >
    );
};

export default JobPostForm;
