'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import JobDetailHeader from '@/components/job/JobDetailHeader';
import JobDescription from '@/components/job/JobDescription';
import JobOverviewSidebar from '@/components/job/JobOverviewSidebar';
import CompanyInfoSidebar from '@/components/job/CompanyInfo';
import JobApplicationInfo from '@/components/job/JobApplicationInfo';
import RelatedJobs from '@/components/jobs/RelatedJobs';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import ReportModal from '@/components/jobs/ReportModal';
import { useToast } from '@/context/ToastContext';
import { jobService } from '@/services/job.service';
import { favoriteService } from '@/services/favorite.service';
import { ApplyJobModal } from '@/components/jobs/apply-job-modal';
import { t } from '@/lib/i18n';
import Breadcrumb, { getJobDetailBreadcrumbs } from '@/components/shared/Breadcrumb';
import type { Job } from '@/types/job';
import type { Company } from '@/types/company';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success } = useToast();
  const id = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await jobService.getJobDetail(id);
        if (response.success && response.data) {
          setJob(response.data);
          setIsBookmarked(response.data.isBookmarked);

          setCompany({
            id: response.data.company.id,
            name: response.data.company.name,
            logo: response.data.company.logo || '🏢',
            description: 'Thông tin công ty đang được cập nhật',
            industry: response.data.category || 'Technology',
            companySize: response.data.company.size || 'N/A',
            location: response.data.location,
            website: '#',
            openPositions: 1
          });

          // Fetch related jobs (simulated by fetching latest jobs for now)
          const relatedResponse = await jobService.searchJobs({});
          if (relatedResponse.success && relatedResponse.data) {
            setFeaturedJobs(relatedResponse.data.content.filter(j => j.id !== id).slice(0, 3));
          }
        }
      } catch (error) {
        console.error("Failed to fetch job", error);
        // Error handling (show toast or redirect)
      }
    };

    if (id) {
      fetchJobDetail();
    }
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await favoriteService.removeFavorite(id);
        success(t('jobs.jobUnsaved'));
        setIsBookmarked(false);
      } else {
        await favoriteService.addFavorite(id);
        success(t('jobs.jobSaved'));
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      // Maybe show error toast
    }
  };

  const handleApply = () => {
    setShowApplyModal(true);
  };

  if (!job || !company) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('jobs.loading')}...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={getJobDetailBreadcrumbs(job.title)} />
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('common.back')}
        </button>

        {/* Job Header */}
        <JobDetailHeader
          job={job}
          onApply={handleApply}
          onSave={handleBookmark}
          isSaved={isBookmarked}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column - Job Detail (approx 70%) */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 lg:p-8 shadow-sm">
              <JobDescription
                description={job.description}
                responsibilities={job.responsibilities}
                requirements={job.requirements}
                benefits={job.benefits}
              />
            </div>

            <div className="mt-6">
              <JobApplicationInfo
                job={job}
                onApply={handleApply}
                onSave={handleBookmark}
                isSaved={isBookmarked}
              />
            </div>
          </div>

          {/* Right Column - Sidebar (approx 30%) */}
          <aside className="space-y-6 lg:col-span-4">
            <CompanyInfoSidebar company={company} />
            <JobOverviewSidebar job={job} />
          </aside>
        </div>

        {/* Related Jobs */}
        <div className="mt-12">
          <RelatedJobs
            jobs={featuredJobs}
            currentJobId={id}
            onBookmark={handleBookmark}
            onApply={handleApply}
          />
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-4 shadow-theme-xl transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 ${isSticky ? 'translate-y-0' : 'translate-y-full'
          }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="hidden sm:block">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {job.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {job.company.name}
            </p>
          </div>

          <div className="flex flex-1 items-center gap-3 sm:flex-initial">
            <button
              onClick={() => setShowReportModal(true)}
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 transition hover:border-red-500 hover:bg-red-50 dark:border-gray-700 dark:hover:border-red-500 dark:hover:bg-red-500/10"
              aria-label="Báo cáo"
              title="Báo cáo tin tuyển dụng"
            >
              <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </button>
            <button
              onClick={handleBookmark}
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 transition hover:border-brand-500 hover:bg-brand-50 dark:border-gray-700 dark:hover:border-brand-500 dark:hover:bg-brand-500/10"
              aria-label="Bookmark"
            >
              <svg
                className={`h-6 w-6 ${isBookmarked ? 'fill-brand-500 text-brand-500' : 'text-gray-600 dark:text-gray-400'}`}
                fill={isBookmarked ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            <Button
              size="lg"
              onClick={handleApply}
              className="flex-1 sm:flex-initial"
            >
              {t('jobs.applyNow')}
            </Button>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyJobModal
          onClose={() => setShowApplyModal(false)}
          jobTitle={job.title}
          jobId={id}
        />
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetType="job_posting"
        targetId={id}
        targetName={job.title}
      />
    </div>
  );
}
