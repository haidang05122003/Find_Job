import { twMerge } from "tailwind-merge";
import { SalaryRange } from '@/types/job';

// ============================================
// CLASS NAME UTILITIES
// ============================================
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(inputs.filter(Boolean).join(" "));
}

// ============================================
// FORMATTERS
// ============================================
export function formatSalary(salary: SalaryRange, options?: { short?: boolean, upTo?: boolean }): string {
  const { min, max, currency } = salary;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const currencySymbol = currency === 'VND' ? '₫' : currency === 'USD' ? '$' : currency;

  if (options?.upTo && max > 0) {
    return `Lên đến ${formatNumber(max)} ${currencySymbol}`;
  }

  if (min === max) return `${formatNumber(min)} ${currencySymbol}`;
  return `${formatNumber(min)} - ${formatNumber(max)} ${currencySymbol}`;
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Vừa xong';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} ngày trước`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} tuần trước`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} tháng trước`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} năm trước`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

export function formatTime(date: Date | string): string {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  } catch (error) {
    return '';
  }
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num);
}

export function getDaysUntilDeadline(deadline: Date): number {
  const now = new Date();
  const diffInMs = deadline.getTime() - now.getTime();
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
}

export function formatDeadline(deadline: Date): string {
  const days = getDaysUntilDeadline(deadline);
  if (days < 0) return 'Đã hết hạn';
  if (days === 0) return 'Hết hạn hôm nay';
  if (days === 1) return 'Hết hạn ngày mai';
  if (days <= 7) return `Còn ${days} ngày`;
  return formatDate(deadline);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ============================================
// VALIDATORS
// ============================================
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(0|\+84)[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Mật khẩu phải có ít nhất 8 ký tự');
  if (!/[A-Z]/.test(password)) errors.push('Mật khẩu phải có ít nhất 1 chữ hoa');
  if (!/[a-z]/.test(password)) errors.push('Mật khẩu phải có ít nhất 1 chữ thường');
  if (!/[0-9]/.test(password)) errors.push('Mật khẩu phải có ít nhất 1 số');
  return { isValid: errors.length === 0, errors };
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidFileSize(file: File, maxSizeMB: number): boolean {
  return file.size <= maxSizeMB * 1024 * 1024;
}

export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}


export function isValidSalaryRange(min: number, max: number): boolean {
  return min >= 0 && max >= min;
}

export function formatCurrency(amount: number | undefined | null, currency: string = 'VND'): string {
  if (amount === undefined || amount === null) return '0';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
