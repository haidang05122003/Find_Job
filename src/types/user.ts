export type UserRole = 'CANDIDATE' | 'HR' | 'ADMIN' | 'ROLE_CANDIDATE' | 'ROLE_HR' | 'ROLE_ADMIN';

export interface UserProfile {
    id: string; // Backend sends Long, but axios/JS usually fine with number, though TS expects string based on this. Let's keep string for ID as it's safer for bigints
    email: string;
    name: string;
    fullName?: string; // Added to match backend UserResponse
    username?: string; // Added to match backend UserResponse
    status?: string;   // Added to match backend UserResponse
    isCompanyOwner?: boolean; // Added for HR role check
    companyId?: number; // Backend sends Long -> number
    avatarUrl?: string;
    role?: string; // Backend sends singular role
    roles: UserRole[];
    activeRole: UserRole;
    readonly phone?: string;
    bio?: string;
    location?: {
        city: string;
        country: string;
    };
    company?: {
        id: string;
        name: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthState {
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    token?: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface ResetPasswordData {
    email: string;
    otp: string;
    newPassword: string;
}

export interface ChangePasswordData {
    oldPassword: string;
    newPassword: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    companyName?: string;
    companyAddress?: string;
    companyWebsite?: string;
    companyPhone?: string;
    companyDescription?: string;
    companyLogoUrl?: string;
    companyCode?: string;
}
