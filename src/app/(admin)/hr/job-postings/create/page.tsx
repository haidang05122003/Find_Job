"use client";

import React from "react";
import JobPostForm from "@/components/hr/JobPostForm";

export default function CreateJobPage() {
    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Tạo tin tuyển dụng mới
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Điền đầy đủ thông tin để đăng tin tuyển dụng và thu hút ứng viên tiềm năng.
                </p>
            </div>

            <JobPostForm />
        </div>
    );
}
