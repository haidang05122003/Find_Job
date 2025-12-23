export interface Skill {
    id?: number;
    skillName: string;
    skillLevel: string; // e.g., "Beginner", "Intermediate", "Advanced"
}

export interface Resume {
    id: number;
    fileName: string;
    fileUrl: string;
    isDefault: boolean;
}

export interface SocialLinkRequest {
    platform: string;
    url: string;
}

export interface SocialLinkResponse {
    id: number;
    platform: string;
    url: string;
}

export interface CandidateEducation {
    id?: number;
    schoolName: string;
    degree?: string;
    major?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}

export interface CandidateExperience {
    id?: number;
    companyName: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}

export interface CandidateProfile {
    id: number;
    fullName: string;
    email: string;
    avatarUrl: string;
    title?: string;
    aboutMe?: string;
    educations?: CandidateEducation[];
    experiences?: CandidateExperience[];
    address?: string;
    dateOfBirth?: string; // ISO Date string YYYY-MM-DD
    gender: string;
    phone: string;
    skills: Skill[];
    cvs: Resume[];
    socialLinks: SocialLinkResponse[];
}

export interface CandidateProfileRequest {
    title: string;
    aboutMe: string;
    educations?: CandidateEducation[];
    experiences?: CandidateExperience[];
    address: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    skills: Skill[]; // ID optional for new skills
}
