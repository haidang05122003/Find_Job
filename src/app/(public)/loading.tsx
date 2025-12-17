import React from 'react';
import Spinner from '@/components/loading/Spinner';
import { t } from '@/lib/i18n';

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
      </div>
    </div>
  );
}
