import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
    title: 'Trang chủ',
    description: 'Tìm kiếm công việc mơ ước của bạn. Hàng nghìn cơ hội việc làm từ các công ty hàng đầu.',
});
