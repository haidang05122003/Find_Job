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

export interface CandidateProfile {
    id: number;
    fullName: string;
    email: string;
    avatarUrl: string;
    title?: string;
    aboutMe?: string;
    education?: string;
    experience?: string;
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
    education: string;
    experience: string;
    address: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    skills: Skill[]; // ID optional for new skills
}
