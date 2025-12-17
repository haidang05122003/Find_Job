import type { Category } from '@/types/category';

/**
 * Job Categories Data - Vietnamese Context
 * Danh mục việc làm phù hợp với thị trường Việt Nam
 */

export const categories: Category[] = [
    {
        id: 'it-software',
        name: 'Công nghệ thông tin',
        icon: '💻',
        description: 'Phát triển phần mềm, lập trình, IT support',
        jobCount: 1250,
        color: 'blue',
        subcategories: [
            'Frontend Developer',
            'Backend Developer',
            'Full-stack Developer',
            'Mobile Developer',
            'DevOps Engineer',
            'QA/Tester',
            'IT Support',
            'System Admin'
        ]
    },
    {
        id: 'marketing',
        name: 'Marketing - PR',
        icon: '📢',
        description: 'Digital marketing, content, social media, PR',
        jobCount: 890,
        color: 'pink',
        subcategories: [
            'Digital Marketing',
            'Content Marketing',
            'SEO/SEM Specialist',
            'Social Media Manager',
            'Brand Manager',
            'PR Specialist',
            'Marketing Manager'
        ]
    },
    {
        id: 'sales',
        name: 'Kinh doanh - Bán hàng',
        icon: '💼',
        description: 'Sales, business development, account management',
        jobCount: 1120,
        color: 'green',
        subcategories: [
            'Sales Executive',
            'Business Development',
            'Account Manager',
            'Sales Manager',
            'Key Account Manager',
            'Telesales',
            'B2B Sales'
        ]
    },
    {
        id: 'design',
        name: 'Thiết kế - Sáng tạo',
        icon: '🎨',
        description: 'UI/UX, graphic design, creative',
        jobCount: 670,
        color: 'purple',
        subcategories: [
            'UI/UX Designer',
            'Graphic Designer',
            'Product Designer',
            'Motion Designer',
            'Illustrator',
            'Art Director',
            '3D Designer'
        ]
    },
    {
        id: 'finance',
        name: 'Tài chính - Kế toán',
        icon: '💰',
        description: 'Kế toán, kiểm toán, tài chính doanh nghiệp',
        jobCount: 780,
        color: 'yellow',
        subcategories: [
            'Kế toán tổng hợp',
            'Kế toán trưởng',
            'Kiểm toán viên',
            'Phân tích tài chính',
            'Kế toán thuế',
            'Kế toán công nợ',
            'Kế toán chi phí'
        ]
    },
    {
        id: 'hr',
        name: 'Nhân sự',
        icon: '👥',
        description: 'Tuyển dụng, đào tạo, quản lý nhân sự',
        jobCount: 540,
        color: 'orange',
        subcategories: [
            'HR Manager',
            'Recruitment Specialist',
            'HR Business Partner',
            'Training & Development',
            'C&B Specialist',
            'HR Admin',
            'Talent Acquisition'
        ]
    },
    {
        id: 'customer-service',
        name: 'Chăm sóc khách hàng',
        icon: '🎧',
        description: 'Customer service, call center, support',
        jobCount: 920,
        color: 'teal',
        subcategories: [
            'Customer Service',
            'Call Center Agent',
            'Customer Support',
            'Technical Support',
            'Customer Success',
            'Help Desk',
            'CS Manager'
        ]
    },
    {
        id: 'education',
        name: 'Giáo dục - Đào tạo',
        icon: '📚',
        description: 'Giảng viên, giáo viên, đào tạo',
        jobCount: 650,
        color: 'indigo',
        subcategories: [
            'Giáo viên Tiếng Anh',
            'Giảng viên',
            'Giáo viên Toán',
            'Giáo viên Lý',
            'Training Specialist',
            'Academic Manager',
            'Giáo viên Mầm non'
        ]
    },
    {
        id: 'healthcare',
        name: 'Y tế - Sức khỏe',
        icon: '⚕️',
        description: 'Bác sĩ, y tá, dược sĩ, chăm sóc sức khỏe',
        jobCount: 480,
        color: 'red',
        subcategories: [
            'Bác sĩ',
            'Y tá/Điều dưỡng',
            'Dược sĩ',
            'Kỹ thuật viên y tế',
            'Chăm sóc sức khỏe',
            'Y tế công cộng',
            'Quản lý bệnh viện'
        ]
    },
    {
        id: 'engineering',
        name: 'Kỹ thuật - Xây dựng',
        icon: '🏗️',
        description: 'Kỹ sư xây dựng, cơ khí, điện, tự động hóa',
        jobCount: 820,
        color: 'gray',
        subcategories: [
            'Kỹ sư xây dựng',
            'Kỹ sư cơ khí',
            'Kỹ sư điện',
            'Kỹ sư tự động hóa',
            'Giám sát công trình',
            'Kiến trúc sư',
            'Kỹ sư QA/QC'
        ]
    },
    {
        id: 'logistics',
        name: 'Vận tải - Logistics',
        icon: '🚚',
        description: 'Logistics, supply chain, vận chuyển',
        jobCount: 710,
        color: 'brown',
        subcategories: [
            'Logistics Coordinator',
            'Supply Chain Manager',
            'Warehouse Manager',
            'Import/Export Specialist',
            'Procurement Officer',
            'Inventory Manager',
            'Delivery Driver'
        ]
    },
    {
        id: 'hospitality',
        name: 'Khách sạn - Nhà hàng',
        icon: '🏨',
        description: 'Khách sạn, nhà hàng, du lịch, F&B',
        jobCount: 590,
        color: 'cyan',
        subcategories: [
            'Receptionist',
            'Waiter/Waitress',
            'Chef/Cook',
            'Hotel Manager',
            'F&B Manager',
            'Housekeeping',
            'Tour Guide'
        ]
    },
    {
        id: 'retail',
        name: 'Bán lẻ - Thời trang',
        icon: '🛍️',
        description: 'Bán hàng, merchandising, thời trang',
        jobCount: 680,
        color: 'pink',
        subcategories: [
            'Sales Associate',
            'Store Manager',
            'Merchandiser',
            'Fashion Designer',
            'Visual Merchandiser',
            'Retail Manager',
            'Cashier'
        ]
    },
    {
        id: 'manufacturing',
        name: 'Sản xuất - Vận hành',
        icon: '🏭',
        description: 'Sản xuất, vận hành máy móc, quản lý nhà máy',
        jobCount: 750,
        color: 'slate',
        subcategories: [
            'Production Manager',
            'Quality Control',
            'Machine Operator',
            'Production Supervisor',
            'Maintenance Engineer',
            'Factory Manager',
            'Process Engineer'
        ]
    },
    {
        id: 'legal',
        name: 'Pháp lý - Luật',
        icon: '⚖️',
        description: 'Luật sư, pháp chế, tư vấn pháp lý',
        jobCount: 320,
        color: 'stone',
        subcategories: [
            'Luật sư',
            'Legal Counsel',
            'Pháp chế',
            'Legal Assistant',
            'Compliance Officer',
            'Contract Manager',
            'Legal Manager'
        ]
    },
    {
        id: 'media',
        name: 'Truyền thông - Báo chí',
        icon: '📰',
        description: 'Báo chí, biên tập, truyền thông',
        jobCount: 410,
        color: 'amber',
        subcategories: [
            'Journalist',
            'Editor',
            'Content Writer',
            'Copywriter',
            'Video Editor',
            'Photographer',
            'Media Planner'
        ]
    },
    {
        id: 'real-estate',
        name: 'Bất động sản',
        icon: '🏢',
        description: 'Môi giới, quản lý dự án BĐS, tư vấn',
        jobCount: 560,
        color: 'emerald',
        subcategories: [
            'Real Estate Agent',
            'Property Manager',
            'Real Estate Consultant',
            'Leasing Manager',
            'Project Manager',
            'Sales BĐS',
            'Valuation Specialist'
        ]
    },
    {
        id: 'consulting',
        name: 'Tư vấn',
        icon: '💡',
        description: 'Tư vấn quản lý, chiến lược, kinh doanh',
        jobCount: 380,
        color: 'violet',
        subcategories: [
            'Management Consultant',
            'Business Consultant',
            'Strategy Consultant',
            'IT Consultant',
            'Financial Consultant',
            'HR Consultant',
            'Marketing Consultant'
        ]
    },
    {
        id: 'agriculture',
        name: 'Nông nghiệp',
        icon: '🌾',
        description: 'Nông nghiệp, thủy sản, chăn nuôi',
        jobCount: 290,
        color: 'lime',
        subcategories: [
            'Kỹ sư nông nghiệp',
            'Quản lý trang trại',
            'Kỹ thuật viên',
            'Chăn nuôi',
            'Thủy sản',
            'Kinh doanh nông sản',
            'Nghiên cứu'
        ]
    },
    {
        id: 'other',
        name: 'Khác',
        icon: '📋',
        description: 'Các ngành nghề khác',
        jobCount: 450,
        color: 'neutral',
        subcategories: [
            'Admin/Thư ký',
            'Driver',
            'Security',
            'Cleaner',
            'General Labor',
            'Freelancer',
            'Part-time'
        ]
    },
];

// Helper functions
export const getCategoryById = (id: string): Category | undefined => {
    return categories.find(category => category.id === id);
};

export const getCategoryByName = (name: string): Category | undefined => {
    return categories.find(category =>
        category.name.toLowerCase() === name.toLowerCase()
    );
};

export const getPopularCategories = (limit: number = 8): Category[] => {
    return categories
        .sort((a, b) => b.jobCount - a.jobCount)
        .slice(0, limit);
};

export const searchCategories = (query: string): Category[] => {
    const lowerQuery = query.toLowerCase();
    return categories.filter(category =>
        category.name.toLowerCase().includes(lowerQuery) ||
        category.description.toLowerCase().includes(lowerQuery) ||
        category.subcategories.some(sub => sub.toLowerCase().includes(lowerQuery))
    );
};

export const getTotalJobCount = (): number => {
    return categories.reduce((total, category) => total + category.jobCount, 0);
};
