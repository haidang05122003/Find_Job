'use client';

import React from 'react';
import Link from 'next/link';

interface Candidate {
  id: number;
  fullName: string;
  title: string;
  location?: string;
  address?: string;
  experience: string;
  skills: { id: number; skillName: string; skillLevel: string }[];
  avatarUrl: string;
  aboutMe?: string;
}

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const [imgSrc, setImgSrc] = React.useState<string>(candidate.avatarUrl || '');

  React.useEffect(() => {
    let src = candidate.avatarUrl;
    if (src && !src.startsWith('http') && !src.startsWith('data:')) {
      src = `http://localhost:8080${src.startsWith('/') ? '' : '/'}${src}`;
    }
    setImgSrc(src || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.fullName)}&background=random`);
  }, [candidate.avatarUrl, candidate.fullName]);

  return (
    <Link href={`/candidates/${candidate.id}`} className="block h-full group">
      <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-brand-500 dark:bg-gray-900 dark:border-gray-800">

        {/* Header: Avatar & Info */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="h-20 w-20 mb-3 rounded-full border border-gray-100 p-1 bg-white dark:bg-gray-800 dark:border-gray-700">
            <img
              src={imgSrc || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.fullName)}&background=random`}
              alt={candidate.fullName}
              onError={() => setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.fullName)}&background=random`)}
              className="h-full w-full object-cover rounded-full"
            />
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-brand-600 transition-colors line-clamp-1" title={candidate.fullName}>
            {candidate.fullName}
          </h3>
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400 line-clamp-1" title={candidate.title}>
            {candidate.title}
          </p>
        </div>

        {/* Details: Location & Exp */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
          {(candidate.address || candidate.location) && (
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate max-w-[120px]">{candidate.address || candidate.location}</span>
            </span>
          )}
          <span className="text-gray-300">•</span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {candidate.experience ? (
              <span dangerouslySetInnerHTML={{
                __html: candidate.experience.replace(/<[^>]*>?/gm, '').substring(0, 15) + (candidate.experience.length > 15 ? '...' : '')
              }} />
            ) : 'N/A'}
          </span>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 text-center mb-4 flex-grow">
          {candidate.aboutMe?.replace(/<[^>]*>?/gm, '') || "Chưa cập nhật giới thiệu bản thân."}
        </p>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-auto">
          <div className="flex flex-wrap justify-center gap-1.5">
            {candidate.skills?.slice(0, 3).map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
              >
                {skill.skillName}
              </span>
            ))}
            {candidate.skills && candidate.skills.length > 3 && (
              <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                +{candidate.skills.length - 3}
              </span>
            )}
            {(!candidate.skills || candidate.skills.length === 0) && (
              <span className="text-xs text-gray-400 italic">Chưa cập nhật kỹ năng</span>
            )}
          </div>

          <div className="mt-4 text-center">
            <span className="text-sm font-medium text-brand-600 group-hover:text-brand-700 transition-colors dark:text-brand-400">
              Xem hồ sơ →
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default CandidateCard;
