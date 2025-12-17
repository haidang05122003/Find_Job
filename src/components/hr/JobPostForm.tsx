"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { hrService, JobPostRequest } from "@/services/hr.service";
import { categoryService, Category } from "@/services/category.service";
import { useToast } from "@/context/ToastContext";
import ComponentCard from "../common/ComponentCard";
import RichTextEditor from "../ui/editor/RichTextEditor";

// Schema validation
const jobSchema = z.object({
    title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
    categoryId: z.string().min(1, "Vui lòng chọn ngành nghề"),
    location: z.string().min(1, "Vui lòng nhập Tỉnh/Thành phố"),
    address: z.string().min(5, "Vui lòng nhập địa chỉ chi tiết"),
    salaryMin: z.number().min(0, "Mức lương không hợp lệ"),
    salaryMax: z.number().min(0, "Mức lương không hợp lệ"),
    description: z.string().min(20, "Mô tả phải có ít nhất 20 ký tự"),
    requirements: z.string().min(20, "Yêu cầu phải có ít nhất 20 ký tự"),
    benefits: z.string().optional(),
    employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]),
    workMethod: z.enum(["ONLINE", "OFFLINE", "HYBRID"]),
    experience: z.string().min(1, "Vui lòng nhập kinh nghiệm"),
    quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
    gender: z.enum(["MALE", "FEMALE", "ANY"]),
    deadline: z.string().min(1, "Vui lòng chọn hạn nộp"),
});

type JobFormData = z.infer<typeof jobSchema>;

interface JobPostFormProps {
    initialData?: JobFormData & { id?: string };
    isEditMode?: boolean;
}

const JobPostForm: React.FC<JobPostFormProps> = ({ initialData, isEditMode = false }) => {
    const router = useRouter();
    const { error: toastError, success: toastSuccess } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<JobFormData>({
        resolver: zodResolver(jobSchema),
        defaultValues: initialData || {
            employmentType: "FULL_TIME",
            workMethod: "OFFLINE",
            gender: "ANY",
            quantity: 1,
            salaryMin: 0,
            salaryMax: 0,
        },
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.getAllCategories();
                if (res.success && res.data) {
                    setCategories(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    const onSubmit = async (data: JobFormData) => {
        setLoading(true);
        try {
            const payload: JobPostRequest = {
                ...data,
                categoryId: Number(data.categoryId), // Ensure number
                salaryUnit: "VND", // Default currency
                deadline: new Date(data.deadline).toISOString().split('T')[0] + "T23:59:59", // Format to LocalDateTime
                gender: data.gender === "ANY" ? "ALL" : data.gender, // Map ANY to ALL for backend
                address: data.address,
            };

            let res;
            if (isEditMode && initialData?.id) {
                res = await hrService.updateJob(initialData.id, payload);
            } else {
                res = await hrService.createJob(payload);
            }

            if (res.success) {
                toastSuccess(isEditMode ? "Cập nhật tin thành công" : "Đăng tin thành công");
                router.push("/hr/job-postings");
            }
        } catch (err: any) {
            // Log detailed error from backend if available
            console.error("Submit Error RAW:", err);
            if (typeof err === 'object') {
                try {
                    console.error("Submit Error JSON:", JSON.stringify(err, null, 2));
                } catch (e) { /* ignore circular */ }
            }

            const errorMsg = err?.response?.data?.message || err?.message || "Có lỗi xảy ra";
            if (typeof err?.response?.data === 'string') {
                // specific case where backend returns string body
                console.error("Submit Error Body:", err.response.data);
            }

            toastError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

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

                    {/* Location */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Tỉnh / Thành phố <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("location")}
                            type="text"
                            placeholder="Ví dụ: Hà Nội, TP.HCM..."
                            className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                        {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location.message}</p>}
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
                            <option value="FULL_TIME">Toàn thời gian</option>
                            <option value="PART_TIME">Bán thời gian</option>
                            <option value="CONTRACT">Hợp đồng</option>
                            <option value="INTERNSHIP">Thực tập</option>
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
                            <option value="OFFLINE">Tại văn phòng</option>
                            <option value="ONLINE">Remote</option>
                            <option value="HYBRID">Hybrid</option>
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
                            <option value="Không yêu cầu">Không yêu cầu</option>
                            <option value="Dưới 1 năm">Dưới 1 năm</option>
                            <option value="1 năm">1 năm</option>
                            <option value="2 năm">2 năm</option>
                            <option value="3 năm">3 năm</option>
                            <option value="4 năm">4 năm</option>
                            <option value="5 năm">5 năm</option>
                            <option value="Trên 5 năm">Trên 5 năm</option>
                        </select>
                        {errors.experience && <p className="mt-1 text-xs text-red-500">{errors.experience.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                                <option value="ANY">Không yêu cầu</option>
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                            </select>
                        </div>
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
                    onClick={() => router.back()}
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
        </form>
    );
};

export default JobPostForm;
