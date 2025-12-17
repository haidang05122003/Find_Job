import CompanyManagementTable from "@/components/admin/CompanyManagementTable";

export default function CompanyManagementPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Quản lý công ty
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Xem xét và phê duyệt hồ sơ doanh nghiệp.
                </p>
            </div>

            <CompanyManagementTable />
        </div>
    );
}
