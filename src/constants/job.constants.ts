export const JOB_LEVELS = [
    { value: "INTERN", label: "Thực tập sinh" },
    { value: "FRESHER", label: "Fresher" },
    { value: "JUNIOR", label: "Junior" },
    { value: "MIDDLE", label: "Middle" },
    { value: "SENIOR", label: "Senior" },
    { value: "LEADER", label: "Trưởng nhóm" },
    { value: "MANAGER", label: "Trưởng phòng" },
    { value: "DIRECTOR", label: "Giám đốc" },
] as const;

export const EMPLOYMENT_TYPES = [
    { value: "FULL_TIME", label: "Toàn thời gian" },
    { value: "PART_TIME", label: "Bán thời gian" },
    { value: "CONTRACT", label: "Hợp đồng" },
    { value: "INTERNSHIP", label: "Thực tập" },
] as const;

export const WORK_METHODS = [
    { value: "OFFLINE", label: "Tại văn phòng" },
    { value: "ONLINE", label: "Remote" },
    { value: "HYBRID", label: "Hybrid" },
] as const;

export const GENDERS = [
    { value: "ANY", label: "Không yêu cầu" },
    { value: "MALE", label: "Nam" },
    { value: "FEMALE", label: "Nữ" },
] as const;

export const EXPERIENCES = [
    { value: "Không yêu cầu", label: "Không yêu cầu" },
    { value: "Dưới 1 năm", label: "Dưới 1 năm" },
    { value: "1 năm", label: "1 năm" },
    { value: "2 năm", label: "2 năm" },
    { value: "3 năm", label: "3 năm" },
    { value: "4 năm", label: "4 năm" },
    { value: "5 năm", label: "5 năm" },
    { value: "Trên 5 năm", label: "Trên 5 năm" },
] as const;

export const LOCATION_SUGGESTIONS = [
    "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "Bình Dương", "Đồng Nai"
];

export const CURRENCY = "VND";
