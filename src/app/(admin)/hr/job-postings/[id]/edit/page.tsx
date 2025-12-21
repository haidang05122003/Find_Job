"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import JobPostForm from "@/components/hr/JobPostForm";
import { hrService } from "@/services/hr.service";
import { useToast } from "@/context/ToastContext";

export default function EditJobPage() {
    const params = useParams();
    const router = useRouter();
    const { error: toastError } = useToast();
    const [jobData, setJobData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const jobId = params?.id as string;

    useEffect(() => {
        const fetchJob = async () => {
            if (!jobId) return;
            try {
                const res = await hrService.getJob(jobId);
                if (res.success && res.data) {
                    const job = res.data;
                    // Transform response to form data
                    setJobData({
                        id: job.id.toString(),
                        title: job.title,
                        categoryId: job.categoryId?.toString() || "", // Using optional chaining if backend returns it
                        location: job.location,
                        address: job.address,
                        salaryMin: job.salaryMin,
                        salaryMax: job.salaryMax,
                        description: job.description,
                        requirements: job.requirements,
                        benefits: job.benefits,
                        employmentType: job.employmentType,
                        workMethod: job.workMethod,
                        experience: job.experience,
                        quantity: job.quantity,
                        gender: job.gender === "ALL" ? "ANY" : job.gender,
                        level: job.level,
                        skills: job.skills || [],
                        keywords: job.keywords || [],
                        locations: job.locations && job.locations.length > 0 ? job.locations : (job.location ? [job.location] : []),
                        deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : "",
                    });
                }
            } catch (err) {
                toastError("Không thể tải thông tin tin tuyển dụng");
                router.push("/hr/job-postings");
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [jobId, router, toastError]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</span>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Chỉnh sửa tin tuyển dụng
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Cập nhật thông tin chi tiết cho tin tuyển dụng.
                </p>
            </div>

            {jobData && <JobPostForm initialData={jobData} isEditMode={true} />}
        </div>
    );
}
