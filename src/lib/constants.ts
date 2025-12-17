// ============================================
// API & NETWORK
// ============================================
export const API_ENDPOINTS = {
    JOBS: '/api/jobs',
    COMPANIES: '/api/companies',
    CATEGORIES: '/api/categories',
} as const;

export const CACHE_DURATION = {
    JOBS: 300, // 5 minutes
    JOB_DETAIL: 600, // 10 minutes
    COMPANIES: 600, // 10 minutes
    CATEGORIES: 3600, // 1 hour
} as const;

// ============================================
// UI & LAYOUT
// ============================================
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 12,
    PAGE_SIZE_OPTIONS: [12, 24, 48],
} as const;

export const ANIMATION = {
    FAST: 150,
    NORMAL: 200,
    SLOW: 300,
    STAGGER_DELAY: 50,
} as const;

export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
} as const;

// ============================================
// SEO
// ============================================
export const SEO = {
    SITE_NAME: 'JobPortal',
    SITE_DESCRIPTION: 'Nền tảng tìm việc làm hàng đầu Việt Nam',
    SITE_URL: 'https://jobportal.com',
    DEFAULT_OG_IMAGE: '/og-image.png',
} as const;

// ============================================
// JOB CATEGORIES
// ============================================
export const JOB_CATEGORIES = [
    { id: 'it-software', name: 'IT - Phần mềm', icon: '💻' },
    { id: 'marketing', name: 'Marketing - PR', icon: '📢' },
    { id: 'sales', name: 'Kinh doanh - Bán hàng', icon: '💼' },
    { id: 'design', name: 'Thiết kế - Sáng tạo', icon: '🎨' },
    { id: 'finance', name: 'Tài chính - Kế toán', icon: '💰' },
    { id: 'hr', name: 'Nhân sự', icon: '👥' },
    { id: 'customer-service', name: 'Chăm sóc khách hàng', icon: '🎧' },
    { id: 'education', name: 'Giáo dục - Đào tạo', icon: '📚' },
    { id: 'healthcare', name: 'Y tế - Sức khỏe', icon: '⚕️' },
    { id: 'engineering', name: 'Kỹ thuật - Xây dựng', icon: '🏗️' },
    { id: 'logistics', name: 'Vận tải - Logistics', icon: '🚚' },
    { id: 'hospitality', name: 'Khách sạn - Nhà hàng', icon: '🏨' },
    { id: 'retail', name: 'Bán lẻ - Thời trang', icon: '🛍️' },
    { id: 'manufacturing', name: 'Sản xuất - Vận hành', icon: '🏭' },
    { id: 'legal', name: 'Pháp lý - Luật', icon: '⚖️' },
    { id: 'media', name: 'Truyền thông - Báo chí', icon: '📰' },
    { id: 'real-estate', name: 'Bất động sản', icon: '🏢' },
    { id: 'consulting', name: 'Tư vấn', icon: '💡' },
    { id: 'agriculture', name: 'Nông nghiệp', icon: '🌾' },
    { id: 'other', name: 'Khác', icon: '📋' },
] as const;

// ============================================
// EXPERIENCE LEVELS & JOB TYPES
// ============================================
export const EXPERIENCE_LEVELS = [
    { id: 'intern', name: 'Thực tập sinh', description: 'Sinh viên hoặc mới tốt nghiệp' },
    { id: 'junior', name: 'Junior', description: 'Dưới 2 năm kinh nghiệm' },
    { id: 'mid-level', name: 'Middle', description: '2-5 năm kinh nghiệm' },
    { id: 'senior', name: 'Senior', description: 'Trên 5 năm kinh nghiệm' },
    { id: 'manager', name: 'Manager', description: 'Vị trí quản lý' }
] as const;

export const JOB_TYPES = [
    { id: 'full-time', name: 'Toàn thời gian', icon: '💼' },
    { id: 'part-time', name: 'Bán thời gian', icon: '⏰' },
    { id: 'contract', name: 'Hợp đồng', icon: '📝' },
    { id: 'freelance', name: 'Freelance', icon: '🎯' },
    { id: 'remote', name: 'Remote', icon: '🏠' }
] as const;

export const COMPANY_SIZES = [
    { id: 'startup', name: 'Startup', range: '1-50 nhân viên' },
    { id: 'sme', name: 'SME', range: '51-500 nhân viên' },
    { id: 'large-enterprise', name: 'Doanh nghiệp lớn', range: '500+ nhân viên' }
] as const;

export const POSTED_WITHIN_OPTIONS = [
    { id: '24h', name: '24 giờ qua' },
    { id: '7d', name: '7 ngày qua' },
    { id: '30d', name: '30 ngày qua' },
    { id: 'all', name: 'Tất cả' }
] as const;

// ============================================
// LOCATIONS
// ============================================
export const VIETNAM_CITIES = [
    {
        id: 'hanoi',
        name: 'Hà Nội',
        districts: ['Ba Đình', 'Hoàn Kiếm', 'Tây Hồ', 'Long Biên', 'Cầu Giấy', 'Đống Đa', 'Hai Bà Trưng', 'Hoàng Mai', 'Thanh Xuân', 'Nam Từ Liêm', 'Bắc Từ Liêm', 'Hà Đông']
    },
    {
        id: 'hcm',
        name: 'Hồ Chí Minh',
        districts: ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12', 'Bình Thạnh', 'Gò Vấp', 'Phú Nhuận', 'Tân Bình', 'Tân Phú', 'Thủ Đức']
    },
    {
        id: 'danang',
        name: 'Đà Nẵng',
        districts: ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ', 'Hòa Vang']
    },
    {
        id: 'haiphong',
        name: 'Hải Phòng',
        districts: ['Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Hải An', 'Kiến An', 'Đồ Sơn', 'Dương Kinh']
    },
    {
        id: 'cantho',
        name: 'Cần Thơ',
        districts: ['Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Ô Môn', 'Thốt Nốt']
    },
    { id: 'binhduong', name: 'Bình Dương', districts: [] },
    { id: 'dongnai', name: 'Đồng Nai', districts: [] },
    { id: 'vungtau', name: 'Bà Rịa - Vũng Tàu', districts: [] },
    { id: 'nhatrang', name: 'Khánh Hòa', districts: [] },
    { id: 'dalat', name: 'Lâm Đồng', districts: [] },
    { id: 'hue', name: 'Thừa Thiên Huế', districts: [] },
    { id: 'quangninh', name: 'Quảng Ninh', districts: [] },
] as const;

// ============================================
// TYPE EXPORTS
// ============================================
export type JobCategoryId = typeof JOB_CATEGORIES[number]['id'];
export type CityId = typeof VIETNAM_CITIES[number]['id'];
export type ExperienceLevelId = typeof EXPERIENCE_LEVELS[number]['id'];
export type JobTypeId = typeof JOB_TYPES[number]['id'];
