export const formatCurrency = (amount: number | undefined | null, currency: string = 'VND'): string => {
    if (amount === undefined || amount === null) return '0';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
    }).format(amount);
};
