import type { Job } from '@/types/job';

/**
 * Featured Jobs Data - Vietnamese Context
 * Mock data cho các việc làm nổi bật tại Việt Nam
 */

export const featuredJobs: Job[] = [
    {
        id: '1',
        title: 'Senior Frontend Developer (React/Next.js)',
        company: {
            id: 'fpt-software',
            name: 'FPT Software',
            logo: '🚀',
        },
        location: 'Hà Nội',
        locationType: 'hybrid',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salary: {
            min: 30000000,
            max: 50000000,
            currency: 'VNĐ',
            period: 'month',
        },
        description: 'Chúng tôi đang tìm kiếm Senior Frontend Developer có kinh nghiệm với React và Next.js để tham gia vào các dự án lớn cho khách hàng quốc tế.',
        requirements: [
            '5+ năm kinh nghiệm phát triển Frontend',
            'Thành thạo React, Next.js, TypeScript',
            'Kinh nghiệm với Tailwind CSS, Redux/Zustand',
            'Hiểu biết về Web Performance Optimization',
            'Tiếng Anh giao tiếp tốt'
        ],
        responsibilities: [
            'Phát triển và maintain các ứng dụng web sử dụng React/Next.js',
            'Làm việc với team Backend để tích hợp API',
            'Code review và mentor junior developers',
            'Tối ưu performance và UX của ứng dụng'
        ],
        benefits: [
            'Lương tháng 13, thưởng theo dự án',
            'Bảo hiểm sức khỏe cao cấp',
            'Làm việc hybrid (3 ngày văn phòng, 2 ngày remote)',
            'Đào tạo và phát triển kỹ năng',
            'Môi trường làm việc quốc tế'
        ],
        category: 'Công nghệ thông tin',
        tags: ['React', 'Next.js', 'TypeScript', 'Frontend'],
        postedAt: new Date('2024-11-20'),
        expiresAt: new Date('2024-12-20'),
        isFeatured: true,
        isBookmarked: false,
        applicantsCount: 45,
    },
    {
        id: '2',
        title: 'Marketing Manager',
        company: {
            id: 'tiki',
            name: 'Tiki',
            logo: '🛒',
        },
        location: 'Hồ Chí Minh',
        locationType: 'onsite',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salary: {
            min: 25000000,
            max: 40000000,
            currency: 'VNĐ',
            period: 'month',
        },
        description: 'Tiki đang tìm kiếm Marketing Manager để quản lý và phát triển các chiến dịch marketing online, tăng trưởng thương hiệu và doanh số.',
        requirements: [
            '3-5 năm kinh nghiệm Marketing, ưu tiên E-commerce',
            'Kinh nghiệm quản lý team 5-10 người',
            'Thành thạo Digital Marketing (SEO, SEM, Social Media)',
            'Kỹ năng phân tích dữ liệu và báo cáo',
            'Tư duy sáng tạo và chiến lược'
        ],
        responsibilities: [
            'Xây dựng và triển khai chiến lược marketing',
            'Quản lý ngân sách marketing và ROI',
            'Phối hợp với các phòng ban để launch campaigns',
            'Phân tích thị trường và đối thủ cạnh tranh',
            'Quản lý và phát triển team marketing'
        ],
        benefits: [
            'Lương cạnh tranh + thưởng KPI',
            'Bảo hiểm đầy đủ theo luật',
            'Discount 30% sản phẩm Tiki',
            'Team building, du lịch hàng năm',
            'Cơ hội thăng tiến rõ ràng'
        ],
        category: 'Marketing - PR',
        tags: ['Marketing', 'E-commerce', 'Digital Marketing', 'Manager'],
        postedAt: new Date('2024-11-18'),
        expiresAt: new Date('2024-12-18'),
        isFeatured: true,
        isBookmarked: false,
        applicantsCount: 67,
    },
    {
        id: '3',
        title: 'Business Analyst',
        company: {
            id: 'viettel',
            name: 'Viettel',
            logo: '📱',
        },
        location: 'Hà Nội',
        locationType: 'onsite',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salary: {
            min: 20000000,
            max: 35000000,
            currency: 'VNĐ',
            period: 'month',
        },
        description: 'Viettel tuyển dụng Business Analyst để phân tích nghiệp vụ, thu thập yêu cầu và hỗ trợ phát triển các sản phẩm công nghệ.',
        requirements: [
            '2-4 năm kinh nghiệm BA trong lĩnh vực IT/Telecom',
            'Kỹ năng phân tích và giải quyết vấn đề tốt',
            'Thành thạo SQL, Excel, PowerPoint',
            'Hiểu biết về Agile/Scrum',
            'Kỹ năng giao tiếp và làm việc nhóm'
        ],
        responsibilities: [
            'Thu thập và phân tích yêu cầu nghiệp vụ',
            'Viết tài liệu đặc tả chức năng (BRD, FRD)',
            'Làm việc với stakeholders và development team',
            'Test và đảm bảo chất lượng sản phẩm',
            'Hỗ trợ training và deployment'
        ],
        benefits: [
            'Lương tháng 13, 14 + thưởng dự án',
            'Bảo hiểm sức khỏe toàn diện',
            'Đào tạo chuyên môn định kỳ',
            'Môi trường làm việc chuyên nghiệp',
            'Cơ hội làm việc với công nghệ mới'
        ],
        category: 'Công nghệ thông tin',
        tags: ['Business Analysis', 'IT', 'Agile', 'SQL'],
        postedAt: new Date('2024-11-22'),
        expiresAt: new Date('2024-12-22'),
        isFeatured: true,
        isBookmarked: false,
        applicantsCount: 38,
    },
    {
        id: '4',
        title: 'UI/UX Designer',
        company: {
            id: 'shopee',
            name: 'Shopee',
            logo: '🛍️',
        },
        location: 'Hồ Chí Minh',
        locationType: 'hybrid',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salary: {
            min: 22000000,
            max: 38000000,
            currency: 'VNĐ',
            period: 'month',
        },
        description: 'Shopee đang tìm kiếm UI/UX Designer sáng tạo để thiết kế trải nghiệm người dùng tuyệt vời cho hàng triệu người dùng.',
        requirements: [
            '3+ năm kinh nghiệm UI/UX Design',
            'Thành thạo Figma, Adobe XD, Sketch',
            'Portfolio ấn tượng về mobile/web design',
            'Hiểu biết về Design System và Accessibility',
            'Kỹ năng user research và testing'
        ],
        responsibilities: [
            'Thiết kế UI/UX cho app mobile và website',
            'Tạo wireframes, prototypes và mockups',
            'Conduct user research và usability testing',
            'Collaborate với Product và Engineering teams',
            'Maintain và phát triển Design System'
        ],
        benefits: [
            'Lương cạnh tranh + bonus',
            'Bảo hiểm cao cấp',
            'Flexible working hours',
            'Laptop và thiết bị làm việc hiện đại',
            'Môi trường sáng tạo và năng động'
        ],
        category: 'Thiết kế - Sáng tạo',
        tags: ['UI/UX', 'Figma', 'Mobile Design', 'Design System'],
        postedAt: new Date('2024-11-19'),
        expiresAt: new Date('2024-12-19'),
        isFeatured: true,
        isBookmarked: false,
        applicantsCount: 52,
    },
    {
        id: '5',
        title: 'Backend Developer (Node.js)',
        company: {
            id: 'vnpay',
            name: 'VNPAY',
            logo: '💳',
        },
        location: 'Hà Nội',
        locationType: 'onsite',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salary: {
            min: 25000000,
            max: 45000000,
            currency: 'VNĐ',
            period: 'month',
        },
        description: 'VNPAY tuyển dụng Backend Developer để phát triển các hệ thống thanh toán điện tử quy mô lớn, phục vụ hàng triệu giao dịch mỗi ngày.',
        requirements: [
            '3+ năm kinh nghiệm Backend với Node.js',
            'Thành thạo Express, NestJS, TypeScript',
            'Kinh nghiệm với MongoDB, PostgreSQL, Redis',
            'Hiểu biết về Microservices, Message Queue',
            'Kinh nghiệm với AWS/GCP là lợi thế'
        ],
        responsibilities: [
            'Phát triển và maintain RESTful APIs',
            'Thiết kế database schema và optimize queries',
            'Implement security best practices',
            'Write unit tests và integration tests',
            'Collaborate với Frontend và Mobile teams'
        ],
        benefits: [
            'Lương tháng 13, 14 + thưởng dự án',
            'Bảo hiểm sức khỏe Bảo Việt',
            'Annual health check-up',
            'Đào tạo công nghệ mới',
            'Cơ hội làm việc với fintech'
        ],
        category: 'Công nghệ thông tin',
        tags: ['Node.js', 'Backend', 'API', 'Microservices'],
        postedAt: new Date('2024-11-21'),
        expiresAt: new Date('2024-12-21'),
        isFeatured: true,
        isBookmarked: false,
        applicantsCount: 41,
    },
    {
        id: '6',
        title: 'Content Marketing Specialist',
        company: {
            id: 'momo',
            name: 'MoMo',
            logo: '💰',
        },
        location: 'Hồ Chí Minh',
        locationType: 'hybrid',
        jobType: 'full-time',
        experienceLevel: 'entry',
        salary: {
            min: 15000000,
            max: 25000000,
            currency: 'VNĐ',
            period: 'month',
        },
        description: 'MoMo tìm kiếm Content Marketing Specialist để sáng tạo nội dung hấp dẫn, tăng engagement và brand awareness.',
        requirements: [
            '1-2 năm kinh nghiệm Content Marketing',
            'Kỹ năng viết content sáng tạo và SEO-friendly',
            'Thành thạo Facebook, Instagram, TikTok',
            'Hiểu biết về content strategy và analytics',
            'Đam mê fintech và digital marketing'
        ],
        responsibilities: [
            'Sáng tạo content cho social media và blog',
            'Lên kế hoạch content calendar',
            'Phân tích performance và optimize content',
            'Collaborate với Design và Marketing teams',
            'Research trends và competitor analysis'
        ],
        benefits: [
            'Lương cạnh tranh + KPI bonus',
            'Bảo hiểm đầy đủ',
            'Flexible working time',
            'Môi trường trẻ trung, sáng tạo',
            'Cơ hội phát triển trong fintech'
        ],
        category: 'Marketing - PR',
        tags: ['Content Marketing', 'Social Media', 'SEO', 'Copywriting'],
        postedAt: new Date('2024-11-23'),
        expiresAt: new Date('2024-12-23'),
        isFeatured: true,
        isBookmarked: false,
        applicantsCount: 73,
    },
];

// Helper function to get job by ID
export const getJobById = (id: string): Job | undefined => {
    return featuredJobs.find(job => job.id === id);
};

// Helper function to filter jobs
export const filterJobs = (filters: {
    category?: string;
    location?: string;
    jobType?: string;
    experienceLevel?: string;
}): Job[] => {
    return featuredJobs.filter(job => {
        if (filters.category && job.category !== filters.category) return false;
        if (filters.location && job.location !== filters.location) return false;
        if (filters.jobType && job.jobType !== filters.jobType) return false;
        if (filters.experienceLevel && job.experienceLevel !== filters.experienceLevel) return false;
        return true;
    });
};

// Helper function to get related jobs
export const getRelatedJobs = (jobId: string, limit: number = 3): Job[] => {
    const currentJob = getJobById(jobId);
    if (!currentJob) return [];

    return featuredJobs
        .filter(job =>
            job.id !== jobId &&
            (job.category === currentJob.category || job.location === currentJob.location)
        )
        .slice(0, limit);
};
