export enum RoleEnum {
  CANDIDATE = "CANDIDATE",
  HR = "HR",
  ADMIN = "ADMIN",
}

export enum UserStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
}

export enum CompanyStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum JobStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  CLOSED = "CLOSED",
}

export enum ApplicationStatusEnum {
  APPLIED = "APPLIED",
  REVIEWING = "REVIEWING",
  INTERVIEW = "INTERVIEW",
  REJECTED = "REJECTED",
  HIRED = "HIRED",
}

export enum EmploymentType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  INTERNSHIP = "INTERNSHIP",
  CONTRACT = "CONTRACT",
}

export enum SalaryUnit {
  VND = "VND",
  USD = "USD",
}

export type Company = {
  id: number;
  companyName: string;
  status: CompanyStatusEnum;
  createdAt: string;
};

export type JobPost = {
  id: number;
  companyId: number;
  categoryId: number;
  title: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryUnit?: SalaryUnit;
  employmentType: EmploymentType;
  deadline: string;
  status: JobStatusEnum;
  createdAt: string;
};

export type CandidateProfile = {
  id: number;
  userId: number;
  fullName: string;
  title: string;
  updatedAt: string;
};

export type CandidateCV = {
  id: number;
  candidateId: number;
  name: string;
  fileUrl: string;
  isDefault: boolean;
  createdAt: string;
};

export type Application = {
  id: number;
  candidateId: number;
  jobId: number;
  candidateCvId: number;
  status: ApplicationStatusEnum;
  appliedAt: string;
  interviewAt?: string;
  coverLetter?: string;
};

export type Report = {
  id: number;
  reporterId: number;
  targetType: "JOB_POST" | "COMPANY" | "USER";
  targetId: number;
  status: "PENDING" | "INVESTIGATING" | "RESOLVED";
  createdAt: string;
};

export const companies: Company[] = [
  {
    id: 1,
    companyName: "HR Platform",
    status: CompanyStatusEnum.APPROVED,
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: 2,
    companyName: "AlphaTech",
    status: CompanyStatusEnum.APPROVED,
    createdAt: "2024-03-02T10:00:00Z",
  },
  {
    id: 3,
    companyName: "Global Finance",
    status: CompanyStatusEnum.PENDING,
    createdAt: "2024-10-18T06:00:00Z",
  },
];

export const jobPosts: JobPost[] = [
  {
    id: 101,
    companyId: 1,
    categoryId: 11,
    title: "Senior Backend Engineer",
    location: "Hà Nội",
    salaryMin: 35000000,
    salaryMax: 55000000,
    salaryUnit: SalaryUnit.VND,
    employmentType: EmploymentType.FULL_TIME,
    deadline: "2025-11-30T23:59:59Z",
    status: JobStatusEnum.APPROVED,
    createdAt: "2025-10-01T08:00:00Z",
  },
  {
    id: 102,
    companyId: 1,
    categoryId: 12,
    title: "UI/UX Designer",
    location: "Hồ Chí Minh",
    salaryMin: 25000000,
    salaryMax: 40000000,
    salaryUnit: SalaryUnit.VND,
    employmentType: EmploymentType.FULL_TIME,
    deadline: "2025-11-25T23:59:59Z",
    status: JobStatusEnum.PENDING,
    createdAt: "2025-10-26T08:00:00Z",
  },
  {
    id: 103,
    companyId: 1,
    categoryId: 11,
    title: "Data Engineer",
    location: "Hà Nội",
    salaryMin: 32000000,
    salaryMax: 48000000,
    salaryUnit: SalaryUnit.VND,
    employmentType: EmploymentType.FULL_TIME,
    deadline: "2025-12-02T23:59:59Z",
    status: JobStatusEnum.APPROVED,
    createdAt: "2025-09-20T08:00:00Z",
  },
  {
    id: 104,
    companyId: 1,
    categoryId: 15,
    title: "Talent Acquisition Specialist",
    location: "Hà Nội",
    salaryMin: 18000000,
    salaryMax: 26000000,
    salaryUnit: SalaryUnit.VND,
    employmentType: EmploymentType.FULL_TIME,
    deadline: "2025-12-15T23:59:59Z",
    status: JobStatusEnum.CLOSED,
    createdAt: "2025-07-05T08:00:00Z",
  },
];

export const candidateProfiles: CandidateProfile[] = [
  {
    id: 1,
    userId: 301,
    fullName: "Nguyễn Thu Hằng",
    title: "Product Manager",
    updatedAt: "2025-11-10T09:00:00Z",
  },
  {
    id: 2,
    userId: 302,
    fullName: "Trần Thanh Hải",
    title: "Backend Engineer",
    updatedAt: "2025-11-09T11:20:00Z",
  },
  {
    id: 3,
    userId: 303,
    fullName: "Phạm Minh Anh",
    title: "UI/UX Designer",
    updatedAt: "2025-11-08T15:45:00Z",
  },
  {
    id: 4,
    userId: 304,
    fullName: "Đỗ Quang",
    title: "Data Analyst",
    updatedAt: "2025-11-06T13:30:00Z",
  },
];

export const candidateCVs: CandidateCV[] = [
  {
    id: 1,
    candidateId: 301,
    name: "CV Product Manager 2025",
    fileUrl: "/mock/cv/product-manager.pdf",
    isDefault: true,
    createdAt: "2025-09-15T08:00:00Z",
  },
  {
    id: 2,
    candidateId: 302,
    name: "CV Backend Engineer",
    fileUrl: "/mock/cv/backend-engineer.pdf",
    isDefault: true,
    createdAt: "2025-10-01T08:00:00Z",
  },
  {
    id: 3,
    candidateId: 303,
    name: "Portfolio UIUX",
    fileUrl: "/mock/cv/uiux.pdf",
    isDefault: true,
    createdAt: "2025-09-21T08:00:00Z",
  },
  {
    id: 4,
    candidateId: 304,
    name: "CV Data Analyst",
    fileUrl: "/mock/cv/data-analyst.pdf",
    isDefault: true,
    createdAt: "2025-09-10T08:00:00Z",
  },
];

export const applications: Application[] = [
  {
    id: 1001,
    candidateId: 301,
    jobId: 101,
    candidateCvId: 1,
    status: ApplicationStatusEnum.INTERVIEW,
    appliedAt: "2025-10-28T08:00:00Z",
    interviewAt: "2025-11-13T02:00:00Z",
  },
  {
    id: 1002,
    candidateId: 302,
    jobId: 101,
    candidateCvId: 2,
    status: ApplicationStatusEnum.REVIEWING,
    appliedAt: "2025-11-07T08:00:00Z",
  },
  {
    id: 1003,
    candidateId: 303,
    jobId: 102,
    candidateCvId: 3,
    status: ApplicationStatusEnum.APPLIED,
    appliedAt: "2025-11-10T08:00:00Z",
  },
  {
    id: 1004,
    candidateId: 304,
    jobId: 103,
    candidateCvId: 4,
    status: ApplicationStatusEnum.REJECTED,
    appliedAt: "2025-09-25T08:00:00Z",
  },
  {
    id: 1005,
    candidateId: 305,
    jobId: 103,
    candidateCvId: 4,
    status: ApplicationStatusEnum.HIRED,
    appliedAt: "2025-08-12T08:00:00Z",
    interviewAt: "2025-08-20T02:00:00Z",
  },
  {
    id: 1006,
    candidateId: 306,
    jobId: 101,
    candidateCvId: 2,
    status: ApplicationStatusEnum.INTERVIEW,
    appliedAt: "2025-11-05T08:00:00Z",
    interviewAt: "2025-11-13T09:00:00Z",
  },
];

export const reports: Report[] = [
  {
    id: 1,
    reporterId: 401,
    targetType: "JOB_POST",
    targetId: 102,
    status: "PENDING",
    createdAt: "2025-11-11T08:00:00Z",
  },
  {
    id: 2,
    reporterId: 402,
    targetType: "USER",
    targetId: 501,
    status: "INVESTIGATING",
    createdAt: "2025-11-10T10:00:00Z",
  },
  {
    id: 3,
    reporterId: 403,
    targetType: "COMPANY",
    targetId: 2,
    status: "RESOLVED",
    createdAt: "2025-11-02T09:30:00Z",
  },
];

export const hrTeamMembers = [
  {
    id: 201,
    companyId: 1,
    fullName: "Trần Hải Long",
    email: "long.tran@hr-platform.vn",
    role: RoleEnum.HR,
    lastLogin: "2025-11-12T04:10:00Z",
  },
  {
    id: 202,
    companyId: 1,
    fullName: "Phạm Thảo My",
    email: "my.pham@hr-platform.vn",
    role: RoleEnum.HR,
    lastLogin: "2025-11-11T13:25:00Z",
  },
];



