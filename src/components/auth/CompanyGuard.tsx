"use client";

import { useAuth } from "@/context/AuthContext";
import { hrService } from "@/services/hr.service";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CompanyGuard({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkCompany = async () => {
            if (isLoading) return;

            if (!isAuthenticated || !user) {
                // If not logged in, let AuthGuard handle it or redirect to login
                // But this guard assumes it's inside an authenticated area usually
                return;
            }

            // Only check for HR
            const isHR = user.roles.includes('HR');

            if (isHR) {
                // Allow access to setup and status pages freely to avoid loops
                if (pathname === '/hr/setup-company' || pathname === '/hr/company-status') {
                    setIsChecking(false);
                    return;
                }

                // Block Pending Members (who are not solving setup)
                if (user.status === 'PENDING' && !user.isCompanyOwner) {
                    // Redirect to a waiting screen
                    if (pathname !== '/hr/pending') {
                        router.push('/hr/pending');
                    }
                    setIsChecking(false);
                    return;
                }

                try {
                    const res = await hrService.getMyCompany();
                    if (res.data) {
                        if (res.data.status === 'APPROVED') {
                            setIsChecking(false);
                        } else {
                            // Pending or Rejected -> Go to 404 (Masking the page)
                            router.push('/error-404');
                        }
                    } else {
                        // No company -> Go to setup page
                        router.push('/hr/setup-company');
                    }
                } catch (error) {
                    // Error fetching company (e.g. 404) -> Go to setup page
                    router.push('/hr/setup-company');
                }
            } else {
                // Not HR (e.g. Admin accessing HR route? Or Candidate?)
                // If it's an admin, maybe allow? For now assuming strict HR check
                setIsChecking(false);
            }
        };

        checkCompany();
    }, [user, isAuthenticated, isLoading, pathname, router]);

    if (isLoading || isChecking) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
        );
    }

    return <>{children}</>;
}
