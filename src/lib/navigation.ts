// Navigation structure for the entire application

export interface NavItem {
    label: string;
    href: string;
    icon?: string;
    description?: string;
    children?: NavItem[];
}

// Public Navigation
export const publicNav: NavItem[] = [
    {
        label: 'Trang chủ',
        href: '/',
        description: 'Khám phá cơ hội việc làm',
    },
    {
        label: 'Tìm việc',
        href: '/jobs',
        description: 'Tìm kiếm công việc phù hợp',
    },
    {
        label: 'Công ty',
        href: '/employers',
        description: 'Danh sách nhà tuyển dụng',
    },
    {
        label: 'Ứng viên',
        href: '/candidates',
        description: 'Tìm ứng viên tài năng',
    },
    {
        label: 'Chat',
        href: '/messages',
        description: 'Trò chuyện trực tuyến',
    },
];

// Dashboard Navigation
export const dashboardNav: NavItem[] = [
    {
        label: 'Tổng quan',
        href: '/dashboard',
        icon: '📊',
    },
    {
        label: 'Đã ứng tuyển',
        href: '/dashboard/applied',
        icon: '📝',
    },
    {
        label: 'Yêu thích',
        href: '/dashboard/favorite',
        icon: '❤️',
    },
    {
        label: 'Thông báo',
        href: '/dashboard/alerts',
        icon: '🔔',
    },
    {
        label: 'Cài đặt',
        href: '/dashboard/settings',
        icon: '⚙️',
        children: [
            {
                label: 'Hồ sơ',
                href: '/dashboard/settings/profile',
            },
            {
                label: 'Tài khoản',
                href: '/dashboard/settings/account',
            },
            {
                label: 'Mạng xã hội',
                href: '/dashboard/settings/social',
            },
        ],
    },
];

// Admin Navigation
export const adminNav: NavItem[] = [
    {
        label: 'Dashboard',
        href: '/admin',
        icon: '📊',
    },
    {
        label: 'Người dùng',
        href: '/admin/users',
        icon: '👥',
    },
    {
        label: 'Duyệt tin',
        href: '/admin/job-approvals',
        icon: '✅',
    },
    {
        label: 'Danh mục',
        href: '/admin/categories',
        icon: '📁',
    },
    {
        label: 'Vi phạm',
        href: '/admin/violations',
        icon: '⚠️',
    },
    {
        label: 'Thống kê',
        href: '/admin/statistics',
        icon: '📈',
    },
];

// HR Navigation
export const hrNav: NavItem[] = [
    {
        label: 'Dashboard',
        href: '/hr',
        icon: '📊',
    },
    {
        label: 'Tin tuyển dụng',
        href: '/hr/job-postings',
        icon: '📝',
    },
    {
        label: 'Ứng viên',
        href: '/hr/candidates',
        icon: '👤',
    },
    {
        label: 'Lời mời phỏng vấn',
        href: '/hr/interview-invitations',
        icon: '📅',
    },
    {
        label: 'Hồ sơ công ty',
        href: '/hr/company-profile',
        icon: '🏢',
    },
    {
        label: 'Thống kê',
        href: '/hr/statistics',
        icon: '📈',
    },
];

// Auth Navigation
export const authNav: NavItem[] = [
    {
        label: 'Đăng nhập',
        href: '/signin',
    },
    {
        label: 'Đăng ký',
        href: '/signup',
    },
    {
        label: 'Quên mật khẩu',
        href: '/forgot-password',
    },
];

// Account Setup Navigation
export const accountSetupNav: NavItem[] = [
    {
        label: 'Thông tin cơ bản',
        href: '/account-setup',
    },
    {
        label: 'Thông tin liên hệ',
        href: '/account-setup/contact',
    },
    {
        label: 'Thông tin công ty',
        href: '/account-setup/founding',
    },
    {
        label: 'Mạng xã hội',
        href: '/account-setup/social',
    },
];

// Get breadcrumbs for current path
export function getBreadcrumbs(pathname: string): NavItem[] {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: NavItem[] = [
        { label: 'Trang chủ', href: '/' },
    ];

    let currentPath = '';
    segments.forEach((segment) => {
        currentPath += `/${segment}`;

        // Find label from navigation
        const allNavs = [...publicNav, ...dashboardNav, ...adminNav, ...hrNav];
        const navItem = allNavs.find(item => item.href === currentPath);

        breadcrumbs.push({
            label: navItem?.label || segment.charAt(0).toUpperCase() + segment.slice(1),
            href: currentPath,
        });
    });

    return breadcrumbs;
}

// Check if user has access to route
export function hasAccess(pathname: string, userRole?: string): boolean {
    if (pathname.startsWith('/admin')) {
        return userRole === 'ADMIN';
    }
    if (pathname.startsWith('/hr')) {
        return userRole === 'HR' || userRole === 'ADMIN';
    }
    if (pathname.startsWith('/dashboard')) {
        return !!userRole;
    }
    return true; // Public routes
}
