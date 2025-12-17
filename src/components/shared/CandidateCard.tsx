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
  bio?: string;
}

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const [imgSrc, setImgSrc] = React.useState<string>(candidate.avatarUrl || '');

  React.useEffect(() => {
    // If avatarUrl starts with http, use it.
    // If it's a relative path, prepend backend URL (assuming localhost:8080 for now or verify via env)
    // Actually, safest is to just try the URL, and if it fails, fallback.
    // But for relative path like "/uploads/...", we definitely need a base.
    let src = candidate.avatarUrl;
    if (src && !src.startsWith('http') && !src.startsWith('data:')) {
      src = `http://localhost:8080${src.startsWith('/') ? '' : '/'}${src}`;
    }
    setImgSrc(src || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.fullName)}&background=random`);
  }, [candidate.avatarUrl, candidate.fullName]);

  return (
    <Link href={`/candidates/${candidate.id}`} className="block h-full">
      <div className="group h-full flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-brand-500 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col items-center text-center flex-grow">
          <div className="relative mb-4 h-16 w-16 overflow-hidden rounded-full ring-2 ring-gray-100 dark:ring-gray-800">
            <img
              src={imgSrc || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.fullName)}&background=random`}
              alt={candidate.fullName}
              onError={() => setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.fullName)}&background=random`)}
              className="h-full w-full object-cover"
            />
          </div>

          <h3 className="line-clamp-1 text-base font-semibold text-gray-900 dark:text-white" title={candidate.fullName}>
            {candidate.fullName}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-gray-600 dark:text-gray-400" title={candidate.title}>
            {candidate.title}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {candidate.address || candidate.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {candidate.experience ? (
                <span dangerouslySetInnerHTML={{
                  __html: candidate.experience.replace(/<[^>]*>?/gm, '').substring(0, 20) + (candidate.experience.length > 20 ? '...' : '')
                }} />
              ) : 'Chưa cập nhật'}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-1.5 w-full">
            {candidate.skills?.slice(0, 3).map((skill) => (
              <span
                key={skill.id}
                className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/20 dark:text-brand-400"
              >
                {skill.skillName}
              </span>
            ))}
            {candidate.skills.length > 3 && (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                +{candidate.skills.length - 3}
              </span>
            )}
          </div>

          <p className="mt-4 text-xs text-gray-500 line-clamp-2 dark:text-gray-400">
            {candidate.bio}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CandidateCard;
