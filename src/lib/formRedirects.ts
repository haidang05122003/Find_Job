// Form redirect logic và navigation flows

export interface RedirectConfig {
    success: string;
    cancel?: string;
    error?: string;
}

// Authentication Redirects
export const authRedirects = {
    signin: {
        success: '/dashboard',
        cancel: '/',
        forgotPassword: '/forgot-password',
        signup: '/signup',
    },
    signup: {
        success: '/account-setup',
        cancel: '/',
        signin: '/signin',
    },
    forgotPassword: {
        success: '/verify-email',
        cancel: '/signin',
    },
    resetPassword: {
        success: '/signin',
    },
    verifyEmail: {
        success: '/signin',
    },
} as const;

// Account Setup Redirects (Multi-step)
export const accountSetupRedirects = {
    step1: {
        next: '/account-setup/contact',
        skip: '/dashboard',
        cancel: '/signin',
    },
    step2Contact: {
        next: (isEmployer: boolean) =>
            isEmployer ? '/account-setup/founding' : '/account-setup/social',
        back: '/account-setup',
        skip: '/dashboard',
    },
    step3Founding: {
        next: '/account-setup/social',
        back: '/account-setup/contact',
        skip: '/dashboard',
    },
    step4Social: {
        finish: '/dashboard',
        back: (isEmployer: boolean) =>
            isEmployer ? '/account-setup/founding' : '/account-setup/contact',
    },
} as const;

// Dashboard Redirects
export const dashboardRedirects = {
    profile: {
        save: '/dashboard/settings/profile',
        cancel: '/dashboard/settings',
        viewPublic: (userId: string) => `/candidates/${userId}`,
    },
    account: {
        save: '/dashboard/settings/account',
        cancel: '/dashboard/settings',
        deleteAccount: '/signin',
    },
    social: {
        save: '/dashboard/settings/social',
        cancel: '/dashboard/settings',
    },
} as const;

// HR Redirects
export const hrRedirects = {
    createJob: {
        saveDraft: '/hr/job-postings',
        publish: '/hr/job-postings',
        cancel: '/hr/job-postings',
    },
    editJob: {
        update: (jobId: string) => `/hr/job-postings/${jobId}`,
        delete: '/hr/job-postings',
        cancel: (jobId: string) => `/hr/job-postings/${jobId}`,
    },
    companyProfile: {
        save: '/hr/company-profile',
        preview: (companyId: string) => `/employers/${companyId}`,
        cancel: '/hr',
    },
    interviewInvitation: {
        send: '/hr/interview-invitations',
        cancel: '/hr/interview-invitations',
    },
} as const;

// Admin Redirects
export const adminRedirects = {
    userEdit: {
        update: (userId: string) => `/admin/users/${userId}`,
        delete: '/admin/users',
        cancel: (userId: string) => `/admin/users/${userId}`,
    },
    jobApproval: {
        approve: '/admin/job-approvals',
        reject: '/admin/job-approvals',
        requestChanges: (jobId: string) => `/admin/job-approvals/${jobId}`,
    },
    categoryManagement: {
        create: '/admin/categories',
        update: '/admin/categories',
        delete: '/admin/categories',
    },
} as const;

// Job Application Redirects
export const applicationRedirects = {
    apply: {
        submit: '/dashboard/applied',
        saveDraft: (jobId: string) => `/jobs/${jobId}`,
        cancel: (jobId: string) => `/jobs/${jobId}`,
    },
} as const;

// Helper function to get redirect URL with query params
export function getRedirectUrl(
    baseUrl: string,
    params?: Record<string, string>
): string {
    if (!params) return baseUrl;

    const queryString = new URLSearchParams(params).toString();
    return `${baseUrl}?${queryString}`;
}

// Helper function to get redirect with success message
export function getRedirectWithMessage(
    url: string,
    message: string,
    type: 'success' | 'error' | 'info' = 'success'
): string {
    return getRedirectUrl(url, { message, type });
}

// Check if user should be redirected based on auth state
export function getAuthRedirect(
    isAuthenticated: boolean,
    currentPath: string,
    userRole?: string
): string | null {
    // Public paths that don't need redirect
    const publicPaths = ['/', '/jobs', '/employers', '/candidates', '/messages'];
    const authPaths = ['/signin', '/signup', '/forgot-password', '/reset-password'];

    // If authenticated and on auth page, redirect to dashboard
    if (isAuthenticated && authPaths.includes(currentPath)) {
        return '/dashboard';
    }

    // If not authenticated and on protected page, redirect to signin
    if (!isAuthenticated && !publicPaths.includes(currentPath) && !authPaths.includes(currentPath)) {
        return getRedirectUrl('/signin', { redirect: currentPath });
    }

    // Check role-based access
    if (isAuthenticated && userRole) {
        if (currentPath.startsWith('/admin') && userRole !== 'ADMIN') {
            return '/dashboard';
        }
        if (currentPath.startsWith('/hr') && userRole !== 'HR' && userRole !== 'ADMIN') {
            return '/dashboard';
        }
    }

    return null;
}

// Get next step in account setup
export function getAccountSetupNextStep(
    currentStep: string,
    isEmployer: boolean
): string {
    const steps = {
        '/account-setup': '/account-setup/contact',
        '/account-setup/contact': isEmployer ? '/account-setup/founding' : '/account-setup/social',
        '/account-setup/founding': '/account-setup/social',
        '/account-setup/social': '/dashboard',
    };

    return steps[currentStep as keyof typeof steps] || '/dashboard';
}

// Get previous step in account setup
export function getAccountSetupPrevStep(
    currentStep: string,
    isEmployer: boolean
): string {
    const steps = {
        '/account-setup/contact': '/account-setup',
        '/account-setup/founding': '/account-setup/contact',
        '/account-setup/social': isEmployer ? '/account-setup/founding' : '/account-setup/contact',
    };

    return steps[currentStep as keyof typeof steps] || '/account-setup';
}

// Calculate account setup progress
export function getAccountSetupProgress(currentStep: string, isEmployer: boolean): number {
    const employerSteps = [
        '/account-setup',
        '/account-setup/contact',
        '/account-setup/founding',
        '/account-setup/social',
    ];

    const jobSeekerSteps = [
        '/account-setup',
        '/account-setup/contact',
        '/account-setup/social',
    ];

    const steps = isEmployer ? employerSteps : jobSeekerSteps;
    const currentIndex = steps.indexOf(currentStep);

    return currentIndex >= 0 ? ((currentIndex + 1) / steps.length) * 100 : 0;
}
