/**
 * Central export point for all type definitions
 * Import types from here for better organization and maintainability
 */

// API Types
export type {
    BaseResponse,
    ApiError,
    PageResponse,
    ApiResult,
    PagedApiResult,
} from './api';

// Service Types
export type {
    RequestConfig,
    PaginationParams,
    FilterParams,
    QueryParams,
    SortConfig,
} from './service';

// Component Types
export type {
    BaseComponentProps,
    WithLoadingState,
    WithErrorState,
    ComponentWithState,
    WithDisabledState,
    FormFieldProps,
    ModalProps,
    CardProps,
} from './components';

// Domain Types
export type { Job, JobFilters, JobStatus, JobType } from './job';
export type { Company } from './company';
export type { UserRole, UserProfile, LoginCredentials, RegisterData } from './user';
export type { Message, Conversation, MessageStatus } from './chat';
export type { JobFilters as FilterConfig } from './filter';
