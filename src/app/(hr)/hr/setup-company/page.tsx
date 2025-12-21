"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import RichTextEditor from "@/components/ui/editor/RichTextEditor";
import { hrService } from "@/services/hr.service";
import { useToast } from "@/context/ToastContext";

interface CompanySetupForm {
    companyName: string;
    description: string;
    industry: string;
    address: string;
    website: string;
    phone: string;
    email: string; // Contact email
    logoUrl: string;
    companySize: string;
    companyCode?: string;
}

export default function CompanySetupPage() {
    const router = useRouter();
    const { success, error } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<'create' | 'join'>('create');

    // Form for Create
    const { register, handleSubmit, control, formState: { errors } } = useForm<CompanySetupForm>();

    // Form for Join
    const { register: registerJoin, handleSubmit: handleSubmitJoin, formState: { errors: errorsJoin } } = useForm<{ companyCode: string }>();

    const onSubmitCreate = async (data: CompanySetupForm) => {
        setIsLoading(true);
        try {
            const res = await hrService.registerCompany(data);
            if (res.success) {
                success("Đăng ký công ty thành công! Vui lòng chờ quản trị viên duyệt.");
                router.push("/hr/company-status");
            }
        } catch (err: any) {
            console.error(err);
            error(err.response?.data?.message || "Đăng ký công ty thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitJoin = async (data: { companyCode: string }) => {
        setIsLoading(true);
        try {
            const res = await hrService.joinCompany(data.companyCode);
            if (res.success) {
                success("Gửi yêu cầu tham gia thành công! Vui lòng chờ người quản lý duyệt.");
                router.push("/hr/pending");
            }
        } catch (err: any) {
            console.error(err);
            error(err.response?.data?.message || "Tham gia công ty thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 dark:bg-gray-900">
            <div className="w-full max-w-3xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Thiết lập công ty</h1>
                    <p className="text-gray-600 dark:text-gray-400">Bạn muốn tạo công ty mới hay tham gia công ty có sẵn?</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    {/* Tabs */}
                    <div className="flex mb-8 border-b border-gray-200 dark:border-gray-700">
                        <button
                            className={`flex-1 py-4 text-center font-medium text-sm transition-colors ${mode === 'create'
                                ? 'text-brand-600 border-b-2 border-brand-600'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                }`}
                            onClick={() => setMode('create')}
                        >
                            Đăng ký công ty mới
                        </button>
                        <button
                            className={`flex-1 py-4 text-center font-medium text-sm transition-colors ${mode === 'join'
                                ? 'text-brand-600 border-b-2 border-brand-600'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                }`}
                            onClick={() => setMode('join')}
                        >
                            Tham gia bằng mã
                        </button>
                    </div>

                    {mode === 'create' ? (
                        <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-6">
                            {/* ... Existing Create Form ... */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    <div>
                                        <Label required>Tên công ty</Label>
                                        <Input
                                            {...register("companyName", { required: "Vui lòng nhập tên công ty" })}
                                            placeholder="Công ty TNHH ABC..."
                                            className="mt-1"
                                        />
                                        {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
                                    </div>

                                    <div>
                                        <Label required>Lĩnh vực hoạt động</Label>
                                        <Input
                                            {...register("industry", { required: "Vui lòng nhập lĩnh vực" })}
                                            placeholder="CNTT, Marketing, ..."
                                            className="mt-1"
                                        />
                                        {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry.message}</p>}
                                    </div>

                                    <div>
                                        <Label required>Số điện thoại liên hệ</Label>
                                        <Input
                                            {...register("phone", { required: "Vui lòng nhập SĐT" })}
                                            placeholder="090..."
                                            className="mt-1"
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                    </div>
                                    <div>
                                        <Label required>Email liên hệ</Label>
                                        <Input
                                            {...register("email", { required: "Vui lòng nhập Email" })}
                                            placeholder="contact@company.com"
                                            type="email"
                                            className="mt-1"
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    <div>
                                        <Label required>Địa chỉ trụ sở</Label>
                                        <Input
                                            {...register("address", { required: "Vui lòng nhập địa chỉ" })}
                                            placeholder="Số 1, Đường X, Quận Y..."
                                            className="mt-1"
                                        />
                                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                                    </div>

                                    <div>
                                        <Label>Website</Label>
                                        <Input
                                            {...register("website")}
                                            placeholder="https://company.com"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label>Logo URL</Label>
                                        <Input
                                            {...register("logoUrl")}
                                            placeholder="https://example.com/logo.png"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label required>Quy mô công ty</Label>
                                        <select
                                            {...register("companySize", { required: "Vui lòng chọn quy mô" })}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="">Chọn quy mô...</option>
                                            <option value="1-10 nhân viên">1-10 nhân viên</option>
                                            <option value="10-50 nhân viên">10-50 nhân viên</option>
                                            <option value="50-100 nhân viên">50-100 nhân viên</option>
                                            <option value="100-500 nhân viên">100-500 nhân viên</option>
                                            <option value="500-1000 nhân viên">500-1000 nhân viên</option>
                                            <option value="1000+ nhân viên">1000+ nhân viên</option>
                                        </select>
                                        {errors.companySize && <p className="text-red-500 text-xs mt-1">{errors.companySize.message}</p>}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label required>Giới thiệu công ty</Label>
                                <Controller
                                    name="description"
                                    control={control}
                                    rules={{ required: "Vui lòng nhập giới thiệu" }}
                                    render={({ field }) => (
                                        <RichTextEditor
                                            content={field.value}
                                            onChange={field.onChange}
                                            placeholder="Mô tả về quy mô, môi trường làm việc..."
                                            className="mt-1"
                                        />
                                    )}
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                            </div>

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                <Button type="submit" size="lg" disabled={isLoading}>
                                    {isLoading ? "Đang xử lý..." : "Gửi yêu cầu xét duyệt"}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmitJoin(onSubmitJoin)} className="space-y-6 max-w-md mx-auto py-8">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nhập mã công ty</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Vui lòng nhập mã công ty (ví dụ: CMP-ABC12345) được cung cấp bởi quản lý của bạn.
                                </p>
                            </div>

                            <div>
                                <Label required>Mã tham gia</Label>
                                <Input
                                    {...registerJoin("companyCode", { required: "Vui lòng nhập mã công ty" })}
                                    placeholder="CMP-..."
                                    className="mt-1 text-center font-mono uppercase tracking-widest"
                                />
                                {errorsJoin.companyCode && <p className="text-red-500 text-xs mt-1">{errorsJoin.companyCode.message}</p>}
                            </div>

                            <div className="pt-4 flex justify-center">
                                <Button type="submit" size="lg" disabled={isLoading} className="w-full">
                                    {isLoading ? "Đang xử lý..." : "Gửi yêu cầu tham gia"}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
