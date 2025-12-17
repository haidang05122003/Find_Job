"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated || !user) {
            router.push("/signin");
            return;
        }

        if (pathname.startsWith("/admin")) {
            if (user.roles.includes("ADMIN")) {
                setAuthorized(true);
            } else {
                router.push("/dashboard");
            }
        } else if (pathname.startsWith("/hr")) {
            if (user.roles.includes("HR") || user.roles.includes("ADMIN")) { // Admin can access HR? Usually yes or no. User asked for separation.
                // If strictly separte: 
                if (user.roles.includes("HR")) setAuthorized(true);
                else router.push("/dashboard");
            } else {
                router.push("/dashboard");
            }
        } else {
            // Other routes under this layout (e.g. profile?)
            setAuthorized(true);
        }
    }, [isLoading, isAuthenticated, user, pathname, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!authorized) {
        return null;
    }

    return <>{children}</>;
}
