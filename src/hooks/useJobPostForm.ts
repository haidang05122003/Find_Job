import { useState, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { hrService, JobPostRequest } from "@/services/hr.service";
import { categoryService, Category } from "@/services/category.service";
import { useToast } from "@/context/ToastContext";
import { JOB_LEVELS, EMPLOYMENT_TYPES, WORK_METHODS, GENDERS } from "@/constants/job.constants";

const employmentTypeValues = EMPLOYMENT_TYPES.map(t => t.value) as [string, ...string[]];
const workMethodValues = WORK_METHODS.map(m => m.value) as [string, ...string[]];
const genderValues = GENDERS.map(g => g.value) as [string, ...string[]];
const jobLevelValues = JOB_LEVELS.map(l => l.value) as [string, ...string[]];

// Schema validation
export const jobSchema = z.object({
    title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
    categoryId: z.string().min(1, "Vui lòng chọn ngành nghề"),
    locations: z.array(z.string()).min(1, "Vui lòng nhập ít nhất 1 địa điểm"),
    address: z.string().min(5, "Vui lòng nhập địa chỉ chi tiết"),
    salaryMin: z.number().min(0, "Mức lương không hợp lệ"),
    salaryMax: z.number().min(0, "Mức lương không hợp lệ"),
    description: z.string().min(20, "Mô tả phải có ít nhất 20 ký tự"),
    requirements: z.string().min(20, "Yêu cầu phải có ít nhất 20 ký tự"),
    benefits: z.string().optional(),
    employmentType: z.enum(employmentTypeValues),
    workMethod: z.enum(workMethodValues),
    experience: z.string().min(1, "Vui lòng nhập kinh nghiệm"),
    quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
    gender: z.enum(genderValues),
    level: z.enum(jobLevelValues).optional(),
    deadline: z.string().min(1, "Vui lòng chọn hạn nộp"),
    skills: z.array(z.string()).min(1, "Ít nhất 1 kỹ năng"),
    keywords: z.array(z.string()).optional(),
});

export type JobFormData = z.infer<typeof jobSchema>;

interface UseJobPostFormProps {
    initialData?: JobFormData & { id?: string };
    isEditMode?: boolean;
}

interface UseJobPostFormReturn {
    form: UseFormReturn<JobFormData>;
    categories: Category[];
    loading: boolean;
    onSubmit: (data: JobFormData) => Promise<void>;
}

export const useJobPostForm = ({ initialData, isEditMode = false }: UseJobPostFormProps): UseJobPostFormReturn => {
    const router = useRouter();
    const { error: toastError, success: toastSuccess } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    const form = useForm<JobFormData>({
        resolver: zodResolver(jobSchema),
        defaultValues: initialData || {
            employmentType: "FULL_TIME",
            workMethod: "OFFLINE",
            gender: "ANY",
            level: "FRESHER",
            quantity: 1,
            salaryMin: 0,
            salaryMax: 0,
            locations: [],
            skills: [],
            keywords: [],
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
                location: data.locations[0] || "",
                categoryId: Number(data.categoryId),
                salaryUnit: "VND",
                deadline: new Date(data.deadline).toISOString().split('T')[0] + "T23:59:59",
                gender: data.gender === "ANY" ? "ALL" : data.gender as any,
                address: data.address || "",
                employmentType: data.employmentType as "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP",
                workMethod: data.workMethod as "ONLINE" | "OFFLINE" | "HYBRID",
                level: data.level,
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
            console.error("Submit Error:", err);
            const errorMsg = err?.response?.data?.message || err?.message || "Có lỗi xảy ra";
            toastError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        categories,
        loading,
        onSubmit,
    };
};
