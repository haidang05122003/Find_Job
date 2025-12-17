/**
 * Vietnamese translations for ViecLamViet
 * Tất cả văn bản giao diện được định nghĩa tại đây
 */

export const vi = {
    // Common terms - Thuật ngữ chung
    common: {
        search: 'Tìm kiếm',
        filter: 'Lọc',
        sort: 'Sắp xếp',
        apply: 'Ứng tuyển',
        save: 'Lưu',
        saved: 'Đã lưu',
        share: 'Chia sẻ',
        viewDetails: 'Xem chi tiết',
        viewAll: 'Xem tất cả',
        showMore: 'Xem thêm',
        showLess: 'Thu gọn',
        loading: 'Đang tải...',
        error: 'Đã có lỗi xảy ra',
        success: 'Thành công',
        cancel: 'Hủy',
        confirm: 'Xác nhận',
        close: 'Đóng',
        back: 'Quay lại',
        next: 'Tiếp theo',
        previous: 'Trước',
        submit: 'Gửi',
        reset: 'Đặt lại',
        clear: 'Xóa',
        clearAll: 'Xóa tất cả',
        select: 'Chọn',
        selected: 'Đã chọn',
        all: 'Tất cả',
        none: 'Không có',
        or: 'hoặc',
        and: 'và',
        required: 'Bắt buộc',
        optional: 'Tùy chọn',
    },

    // Authentication - Xác thực
    auth: {
        signIn: 'Đăng nhập',
        signUp: 'Đăng ký',
        signOut: 'Đăng xuất',
        email: 'Email',
        password: 'Mật khẩu',
        confirmPassword: 'Xác nhận mật khẩu',
        forgotPassword: 'Quên mật khẩu?',
        resetPassword: 'Đặt lại mật khẩu',
        rememberMe: 'Ghi nhớ đăng nhập',
        noAccount: 'Chưa có tài khoản?',
        haveAccount: 'Đã có tài khoản?',
        signInWith: 'Đăng nhập với',
        signUpWith: 'Đăng ký với',
        continueWith: 'Tiếp tục với',
        google: 'Google',
        facebook: 'Facebook',
        twitter: 'Twitter',

        // Titles & descriptions
        signInTitle: 'Đăng nhập',
        signInSubtitle: 'Nhập email và mật khẩu của bạn để đăng nhập!',
        signUpTitle: 'Đăng ký tài khoản',
        signUpSubtitle: 'Tạo tài khoản để bắt đầu tìm việc làm phù hợp với bạn',
        forgotPasswordTitle: 'Quên mật khẩu',
        forgotPasswordSubtitle: 'Nhập email của bạn để nhận link đặt lại mật khẩu',
        resetPasswordTitle: 'Đặt lại mật khẩu',
        resetPasswordSubtitle: 'Nhập mật khẩu mới của bạn',
        verifyEmailTitle: 'Xác thực email',
        verifyEmailSubtitle: 'Chúng tôi đã gửi mã xác thực đến email của bạn',

        // Role selection
        selectRole: 'Bạn là',
        jobSeeker: 'Người tìm việc',
        employer: 'Nhà tuyển dụng',

        // Messages
        signInSuccess: 'Đăng nhập thành công!',
        signUpSuccess: 'Đăng ký thành công!',
        signOutSuccess: 'Đăng xuất thành công!',
        passwordResetSent: 'Link đặt lại mật khẩu đã được gửi đến email của bạn',
        passwordResetSuccess: 'Mật khẩu đã được đặt lại thành công',
        emailVerified: 'Email đã được xác thực',

        // Errors
        invalidEmail: 'Email không hợp lệ',
        invalidPassword: 'Mật khẩu phải có ít nhất 8 ký tự',
        passwordMismatch: 'Mật khẩu không khớp',
        emailRequired: 'Vui lòng nhập email',
        passwordRequired: 'Vui lòng nhập mật khẩu',
        loginFailed: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin',

        // Placeholders
        emailPlaceholder: 'example@gmail.com',
        passwordPlaceholder: 'Nhập mật khẩu của bạn',
        confirmPasswordPlaceholder: 'Nhập lại mật khẩu',

        // Links
        backToHome: 'Quay lại trang chủ',
        backToSignIn: 'Quay lại đăng nhập',
    },

    // Jobs - Việc làm
    jobs: {
        title: 'Việc làm',
        job: 'Công việc',
        jobs: 'Việc làm',
        findJobs: 'Tìm việc làm',
        searchJobs: 'Tìm kiếm việc làm',
        jobSearch: 'Tìm việc',
        allJobs: 'Tất cả việc làm',
        featuredJobs: 'Việc làm nổi bật',
        recentJobs: 'Việc làm mới nhất',
        relatedJobs: 'Việc làm liên quan',
        recommendedJobs: 'Việc làm đề xuất',
        savedJobs: 'Việc làm đã lưu',
        appliedJobs: 'Việc đã ứng tuyển',

        // Job details
        jobTitle: 'Vị trí',
        company: 'Công ty',
        location: 'Địa điểm',
        salary: 'Mức lương',
        salaryRange: 'Khoảng lương',
        jobType: 'Loại hình',
        experience: 'Kinh nghiệm',
        deadline: 'Hạn nộp',
        postedDate: 'Ngày đăng',
        description: 'Mô tả công việc',
        requirements: 'Yêu cầu',
        benefits: 'Quyền lợi',
        responsibilities: 'Trách nhiệm',

        // Job types
        fullTime: 'Toàn thời gian',
        partTime: 'Bán thời gian',
        contract: 'Hợp đồng',
        internship: 'Thực tập',
        freelance: 'Tự do',
        remote: 'Làm từ xa',

        // Experience levels
        noExperience: 'Không yêu cầu kinh nghiệm',
        lessThan1Year: 'Dưới 1 năm',
        oneToThreeYears: '1-3 năm',
        threeToFiveYears: '3-5 năm',
        moreThanFiveYears: 'Trên 5 năm',

        // Actions
        applyNow: 'Ứng tuyển ngay',
        saveJob: 'Lưu việc làm',
        unsaveJob: 'Bỏ lưu',
        shareJob: 'Chia sẻ việc làm',
        reportJob: 'Báo cáo',

        // Messages
        jobSaved: 'Đã lưu công việc vào danh sách yêu thích',
        jobUnsaved: 'Đã xóa khỏi danh sách yêu thích',
        jobApplied: 'Đã ứng tuyển thành công',
        applyInProgress: 'Chức năng ứng tuyển đang được phát triển',

        // Search & filters
        searchPlaceholder: 'Tìm kiếm theo vị trí, công ty...',
        locationPlaceholder: 'Thành phố, quận...',
        categoryPlaceholder: 'Chọn danh mục',
        filters: 'Bộ lọc',
        activeFilters: 'Bộ lọc đang áp dụng',
        clearFilters: 'Xóa bộ lọc',
        applyFilters: 'Áp dụng',

        // Sort options
        sortBy: 'Sắp xếp theo',
        latest: 'Mới nhất',
        oldest: 'Cũ nhất',
        salaryHighToLow: 'Lương cao đến thấp',
        salaryLowToHigh: 'Lương thấp đến cao',
        relevance: 'Liên quan nhất',

        // View options
        gridView: 'Dạng lưới',
        listView: 'Dạng danh sách',

        // Results
        jobsFound: 'việc làm',
        noJobsFound: 'Không tìm thấy việc làm phù hợp',
        tryAdjustingFilters: 'Thử điều chỉnh bộ lọc của bạn',
    },

    // Companies - Công ty
    companies: {
        title: 'Công ty',
        company: 'Công ty',
        companies: 'Công ty',
        topCompanies: 'Công ty hàng đầu',
        allCompanies: 'Tất cả công ty',
        featuredCompanies: 'Công ty nổi bật',

        // Company details
        about: 'Giới thiệu',
        website: 'Website',
        industry: 'Ngành nghề',
        companySize: 'Quy mô',
        founded: 'Thành lập',
        headquarters: 'Trụ sở chính',

        // Company size
        employees: 'nhân viên',
        small: '1-50 nhân viên',
        medium: '51-200 nhân viên',
        large: '201-1000 nhân viên',
        enterprise: 'Trên 1000 nhân viên',

        // Actions
        viewCompany: 'Xem công ty',
        followCompany: 'Theo dõi',
        unfollowCompany: 'Bỏ theo dõi',

        // Messages
        companyFollowed: 'Đã theo dõi công ty',
        companyUnfollowed: 'Đã bỏ theo dõi công ty',
    },

    // Categories - Danh mục
    categories: {
        title: 'Danh mục',
        category: 'Danh mục',
        categories: 'Danh mục',
        popularCategories: 'Danh mục phổ biến',
        allCategories: 'Tất cả danh mục',
        browseByCategory: 'Duyệt theo danh mục',

        // Common categories (Vietnamese context)
        technology: 'Công nghệ thông tin',
        marketing: 'Marketing',
        sales: 'Kinh doanh',
        design: 'Thiết kế',
        finance: 'Tài chính',
        hr: 'Nhân sự',
        customerService: 'Chăm sóc khách hàng',
        engineering: 'Kỹ thuật',
        healthcare: 'Y tế',
        education: 'Giáo dục',
        hospitality: 'Khách sạn - Nhà hàng',
        retail: 'Bán lẻ',
    },

    // Homepage - Trang chủ
    home: {
        hero: {
            title: 'Tìm việc làm, Tuyển dụng hiệu quả',
            subtitle: 'Khám phá hàng nghìn cơ hội việc làm từ các công ty hàng đầu',
            searchPlaceholder: 'Vị trí, kỹ năng, công ty...',
            locationPlaceholder: 'Thành phố, quận...',
            categoryPlaceholder: 'Danh mục',
            searchButton: 'Tìm kiếm',
        },

        stats: {
            jobs: 'Việc làm',
            companies: 'Công ty',
            candidates: 'Ứng viên',
            newJobs: 'Việc mới hôm nay',
        },

        features: {
            title: 'Tại sao chọn chúng tôi',
            subtitle: 'Nền tảng tìm việc hàng đầu Việt Nam',

            feature1Title: 'Hàng nghìn việc làm',
            feature1Desc: 'Cập nhật liên tục từ các công ty uy tín',

            feature2Title: 'Ứng tuyển dễ dàng',
            feature2Desc: 'Chỉ với vài cú click chuột',

            feature3Title: 'Hỗ trợ 24/7',
            feature3Desc: 'Đội ngũ tư vấn luôn sẵn sàng hỗ trợ',

            feature4Title: 'Bảo mật thông tin',
            feature4Desc: 'Thông tin của bạn được bảo vệ tuyệt đối',
        },

        howItWorks: {
            title: 'Cách thức hoạt động',
            subtitle: 'Tìm việc làm chỉ với 3 bước đơn giản',

            step1Title: 'Tạo tài khoản',
            step1Desc: 'Đăng ký miễn phí và tạo hồ sơ của bạn',

            step2Title: 'Tìm kiếm việc làm',
            step2Desc: 'Duyệt qua hàng nghìn việc làm phù hợp',

            step3Title: 'Ứng tuyển',
            step3Desc: 'Gửi hồ sơ và chờ phản hồi từ nhà tuyển dụng',
        },

        testimonials: {
            title: 'Câu chuyện thành công',
            subtitle: 'Những gì ứng viên nói về chúng tôi',
        },

        cta: {
            title: 'Sẵn sàng bắt đầu hành trình sự nghiệp?',
            subtitle: 'Tham gia cùng hàng nghìn ứng viên đã tìm được việc làm mơ ước',
            button: 'Đăng ký ngay',
        },
    },

    // Dashboard - Bảng điều khiển
    dashboard: {
        title: 'Bảng điều khiển',
        overview: 'Tổng quan',
        profile: 'Hồ sơ',
        settings: 'Cài đặt',

        // Sections
        appliedJobs: 'Việc đã ứng tuyển',
        savedJobs: 'Việc đã lưu',
        jobAlerts: 'Thông báo việc làm',
        messages: 'Tin nhắn',

        // Stats
        totalApplications: 'Tổng số đơn',
        pending: 'Đang chờ',
        interviewed: 'Đã phỏng vấn',
        rejected: 'Bị từ chối',

        // Messages
        noApplications: 'Bạn chưa ứng tuyển việc làm nào',
        noSavedJobs: 'Bạn chưa lưu việc làm nào',
    },

    // Navigation - Điều hướng
    nav: {
        home: 'Trang chủ',
        jobs: 'Việc làm',
        companies: 'Công ty',
        candidates: 'Ứng viên',
        about: 'Giới thiệu',
        contact: 'Liên hệ',
        blog: 'Blog',
        dashboard: 'Bảng điều khiển',
        profile: 'Hồ sơ',
        settings: 'Cài đặt',
        signIn: 'Đăng nhập',
        signUp: 'Đăng ký',
        signOut: 'Đăng xuất',

        // Breadcrumb
        breadcrumb: {
            home: 'Trang chủ',
            jobs: 'Việc làm',
            jobDetail: 'Chi tiết công việc',
            companies: 'Công ty',
            companyDetail: 'Chi tiết công ty',
        },
    },

    // Footer
    footer: {
        description: 'Nền tảng tìm việc làm hàng đầu Việt Nam',
        quickLinks: 'Liên kết nhanh',
        forJobSeekers: 'Dành cho ứng viên',
        forEmployers: 'Dành cho nhà tuyển dụng',
        company: 'Công ty',
        support: 'Hỗ trợ',
        legal: 'Pháp lý',

        // Links
        browseJobs: 'Duyệt việc làm',
        browseCompanies: 'Duyệt công ty',
        careerAdvice: 'Tư vấn nghề nghiệp',
        postJob: 'Đăng tin tuyển dụng',
        aboutUs: 'Về chúng tôi',
        contactUs: 'Liên hệ',
        faq: 'Câu hỏi thường gặp',
        privacyPolicy: 'Chính sách bảo mật',
        termsOfService: 'Điều khoản dịch vụ',

        // Social
        followUs: 'Theo dõi chúng tôi',

        // Copyright
        copyright: '© 2024 Kết Nối Việc Làm. Cơ hội trong tầm tay.',
    },

    // Errors - Lỗi
    errors: {
        pageNotFound: 'Không tìm thấy trang',
        pageNotFoundDesc: 'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa',
        goHome: 'Về trang chủ',

        somethingWentWrong: 'Đã có lỗi xảy ra',
        tryAgain: 'Thử lại',

        networkError: 'Lỗi kết nối mạng',
        serverError: 'Lỗi máy chủ',

        // Form errors
        required: 'Trường này là bắt buộc',
        invalidEmail: 'Email không hợp lệ',
        invalidPhone: 'Số điện thoại không hợp lệ',
        invalidUrl: 'URL không hợp lệ',
        minLength: 'Tối thiểu {min} ký tự',
        maxLength: 'Tối đa {max} ký tự',
    },

    // Date & Time - Ngày giờ
    date: {
        today: 'Hôm nay',
        yesterday: 'Hôm qua',
        daysAgo: '{days} ngày trước',
        weeksAgo: '{weeks} tuần trước',
        monthsAgo: '{months} tháng trước',
        yearsAgo: '{years} năm trước',

        // Date posted filters
        last24Hours: '24 giờ qua',
        last7Days: '7 ngày qua',
        last30Days: '30 ngày qua',
        allTime: 'Tất cả',
    },

    // Notifications - Thông báo
    notifications: {
        title: 'Thông báo',
        markAsRead: 'Đánh dấu đã đọc',
        markAllAsRead: 'Đánh dấu tất cả đã đọc',
        noNotifications: 'Không có thông báo mới',

        // Types
        newJob: 'Việc làm mới',
        applicationUpdate: 'Cập nhật đơn ứng tuyển',
        message: 'Tin nhắn mới',
    },

    // Chat - Trò chuyện
    chat: {
        title: 'Trò chuyện',
        startChat: 'Bắt đầu trò chuyện',
        typeMessage: 'Nhập tin nhắn...',
        send: 'Gửi',
        online: 'Trực tuyến',
        offline: 'Ngoại tuyến',
        typing: 'Đang nhập...',
    },
} as const;

export type TranslationKeys = typeof vi;
