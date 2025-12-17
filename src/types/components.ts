/**
 * Common component type definitions
 * Reusable types for React components across the application
 */

import { ReactNode } from 'react';

/**
 * Base props that all components can extend
 */
export interface BaseComponentProps {
    className?: string;
    children?: ReactNode;
    testId?: string;
}

/**
 * Props for components with loading state
 */
export interface WithLoadingState {
    isLoading?: boolean;
    loadingText?: string;
}

/**
 * Props for components with error state
 */
export interface WithErrorState {
    error?: string | null;
    onErrorDismiss?: () => void;
}

/**
 * Combined props for components with both loading and error states
 */
export interface ComponentWithState extends WithLoadingState, WithErrorState { }

/**
 * Props for components with disabled state
 */
export interface WithDisabledState {
    disabled?: boolean;
    disabledReason?: string;
}

/**
 * Props for form field components
 */
export interface FormFieldProps extends BaseComponentProps {
    label?: string;
    name: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    helperText?: string;
}

/**
 * Props for modal/dialog components
 */
export interface ModalProps extends BaseComponentProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * Props for card components
 */
export interface CardProps extends BaseComponentProps {
    title?: string;
    subtitle?: string;
    footer?: ReactNode;
    hoverable?: boolean;
}
