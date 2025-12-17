import type { Company } from '@/types/company';

/**
 * Top Companies Data - Vietnamese Context
 * Mock data cho các công ty hàng đầu tại Việt Nam
 */

export const topCompanies: Company[] = [
    {
        id: 'fpt-software',
        name: 'FPT Software',
        logo: '🚀',
        description: 'Công ty phần mềm hàng đầu Việt Nam với hơn 30,000 nhân viên, cung cấp dịch vụ IT cho khách hàng toàn cầu.',
        industry: 'Công nghệ thông tin',
        size: 'large-enterprise',
        location: 'Hà Nội',
        website: 'https://www.fpt-software.com',
        founded: 1999,
        employees: '30,000+',
        openPositions: 150,
        benefits: [
            'Lương tháng 13, 14',
            'Bảo hiểm sức khỏe cao cấp',
            'Đào tạo công nghệ mới',
            'Cơ hội làm việc quốc tế',
            'Môi trường chuyên nghiệp'
        ],
        culture: [
            'Văn hóa học tập liên tục',
            'Đổi mới sáng tạo',
            'Làm việc nhóm hiệu quả',
            'Cân bằng công việc - cuộc sống'
        ],
        images: [],
        isFollowing: false,
    },
    {
        id: 'viettel',
        name: 'Viettel',
        logo: '📱',
        description: 'Tập đoàn viễn thông và công nghệ hàng đầu Việt Nam, tiên phong trong chuyển đổi số quốc gia.',
        industry: 'Viễn thông',
        size: 'large-enterprise',
        location: 'Hà Nội',
        website: 'https://www.viettel.com.vn',
        founded: 1989,
        employees: '50,000+',
        openPositions: 200,
        benefits: [
            'Lương thưởng cạnh tranh',
            'Bảo hiểm toàn diện',
            'Đào tạo chuyên môn',
            'Cơ hội thăng tiến',
            'Ổn định lâu dài'
        ],
        culture: [
            'Kỷ luật và chuyên nghiệp',
            'Đoàn kết và trách nhiệm',
            'Sáng tạo và đổi mới',
            'Phát triển bền vững'
        ],
        images: [],
        isFollowing: false,
    },
    {
        id: 'tiki',
        name: 'Tiki',
        logo: '🛒',
        description: 'Sàn thương mại điện tử hàng đầu Việt Nam, mang đến trải nghiệm mua sắm online tuyệt vời.',
        industry: 'E-commerce',
        size: 'large-enterprise',
        location: 'Hồ Chí Minh',
        website: 'https://www.tiki.vn',
        founded: 2010,
        employees: '5,000+',
        openPositions: 80,
        benefits: [
            'Lương cạnh tranh + bonus',
            'Discount 30% sản phẩm',
            'Bảo hiểm đầy đủ',
            'Team building thường xuyên',
            'Môi trường năng động'
        ],
        culture: [
            'Customer obsessed',
            'Move fast, learn fast',
            'Ownership mindset',
            'Collaboration và innovation'
        ],
        images: [],
        isFollowing: false,
    },
    {
        id: 'shopee',
        name: 'Shopee',
        logo: '🛍️',
        description: 'Nền tảng thương mại điện tử và công nghệ hàng đầu Đông Nam Á, phục vụ hàng triệu người dùng.',
        industry: 'E-commerce',
        size: 'large-enterprise',
        location: 'Hồ Chí Minh',
        website: 'https://www.shopee.vn',
        founded: 2015,
        employees: '10,000+',
        openPositions: 120,
        benefits: [
            'Lương thưởng hấp dẫn',
            'Bảo hiểm cao cấp',
            'Flexible working',
            'Laptop và thiết bị hiện đại',
            'Cơ hội phát triển khu vực'
        ],
        culture: [
            'Serve buyers and sellers',
            'Be adaptable',
            'Strive for impact',
            'Commit to team success'
        ],
        images: [],
        isFollowing: false,
    },
    {
        id: 'vnpay',
        name: 'VNPAY',
        logo: '💳',
        description: 'Công ty công nghệ tài chính hàng đầu Việt Nam, cung cấp giải pháp thanh toán điện tử toàn diện.',
        industry: 'Fintech',
        size: 'large-enterprise',
        location: 'Hà Nội',
        website: 'https://www.vnpay.vn',
        founded: 2007,
        employees: '3,000+',
        openPositions: 60,
        benefits: [
            'Lương tháng 13, 14 + bonus',
            'Bảo hiểm Bảo Việt',
            'Annual health check',
            'Đào tạo fintech',
            'Cơ hội làm việc với công nghệ mới'
        ],
        culture: [
            'Innovation và technology',
            'Customer centric',
            'Integrity và compliance',
            'Continuous learning'
        ],
        images: [],
        isFollowing: false,
    },
    {
        id: 'momo',
        name: 'MoMo',
        logo: '💰',
        description: 'Ví điện tử số 1 Việt Nam với hơn 30 triệu người dùng, tiên phong trong thanh toán không tiền mặt.',
        industry: 'Fintech',
        size: 'large-enterprise',
        location: 'Hồ Chí Minh',
        website: 'https://www.momo.vn',
        founded: 2007,
        employees: '2,000+',
        openPositions: 50,
        benefits: [
            'Lương cạnh tranh + KPI',
            'Bảo hiểm đầy đủ',
            'Flexible time',
            'Môi trường trẻ trung',
            'Cơ hội phát triển fintech'
        ],
        culture: [
            'Customer first',
            'Think big, act fast',
            'Ownership và accountability',
            'Fun và collaborative'
        ],
        images: [],
        isFollowing: false,
    },
    {
        id: 'grab',
        name: 'Grab',
        logo: '🚗',
        description: 'Siêu ứng dụng hàng đầu Đông Nam Á, cung cấp dịch vụ đi chuyển, giao đồ ăn và thanh toán.',
        industry: 'Technology',
        size: 'large-enterprise',
        location: 'Hồ Chí Minh',
        website: 'https://www.grab.com',
        founded: 2012,
        employees: '8,000+',
        openPositions: 90,
        benefits: [
            'Competitive salary + equity',
            'Premium insurance',
            'Flexible working',
            'Learning budget',
            'Regional opportunities'
        ],
        culture: [
            'Obsess over customers',
            'Be humble and hungry',
            'Commit to team',
            'Think big and bold'
        ],
        images: [],
        isFollowing: false,
    },
    {
        id: 'vng',
        name: 'VNG Corporation',
        logo: '🎮',
        description: 'Tập đoàn công nghệ hàng đầu Việt Nam, phát triển game, mạng xã hội và dịch vụ số.',
        industry: 'Technology',
        size: 'large-enterprise',
        location: 'Hồ Chí Minh',
        website: 'https://www.vng.com.vn',
        founded: 2004,
        employees: '3,000+',
        openPositions: 70,
        benefits: [
            'Lương thưởng hấp dẫn',
            'Bảo hiểm cao cấp',
            'Gym và thể thao',
            'Game room và entertainment',
            'Môi trường sáng tạo'
        ],
        culture: [
            'Innovation và creativity',
            'User-centric thinking',
            'Collaboration và respect',
            'Work-life balance'
        ],
        images: [],
        isFollowing: false,
    },
    {
        id: 'be-group',
        name: 'Be Group',
        logo: '🐝',
        description: 'Nền tảng công nghệ đa dịch vụ Việt Nam, cung cấp giải pháp di chuyển và giao hàng thông minh.',
        industry: 'Technology',
        size: 'sme',
        location: 'Hà Nội',
        website: 'https://www.be.com.vn',
        founded: 2018,
        employees: '1,500+',
        openPositions: 40,
        benefits: [
            'Lương cạnh tranh',
            'Bảo hiểm đầy đủ',
            'Startup environment',
            'Fast career growth',
            'Impact-driven work'
        ],
        culture: [
            'Customer obsession',
            'Move fast and learn',
            'Ownership mindset',
            'Team collaboration'
        ],
        images: [],
        isFollowing: false,
    },
];

// Helper functions
export const getCompanyById = (id: string): Company | undefined => {
    return topCompanies.find(company => company.id === id);
};

export const getCompaniesByIndustry = (industry: string): Company[] => {
    return topCompanies.filter(company => company.industry === industry);
};

export const getCompaniesWithOpenings = (): Company[] => {
    return topCompanies.filter(company => company.openPositions > 0);
};

export const searchCompanies = (query: string): Company[] => {
    const lowerQuery = query.toLowerCase();
    return topCompanies.filter(company =>
        company.name.toLowerCase().includes(lowerQuery) ||
        company.description.toLowerCase().includes(lowerQuery) ||
        company.industry.toLowerCase().includes(lowerQuery)
    );
};
