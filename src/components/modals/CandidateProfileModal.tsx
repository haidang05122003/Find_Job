"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { modalBackdropVariants, modalContentVariants } from "@/lib/animations";
import Button from "@/components/ui/button/Button";

interface CandidateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: {
    name: string;
    title: string;
    avatar: string;
    biography: string;
    coverLetter: string;
    dateOfBirth: string;
    nationality: string;
    maritalStatus: string;
    gender: string;
    experience: string;
    education: string;
    website?: string;
    location: string;
    phone: string;
    email: string;
    socialMedia?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
      youtube?: string;
    };
    resume: {
      name: string;
      url: string;
      format: string;
    };
  };
  onSendMail?: () => void;
}

export default function CandidateProfileModal({
  isOpen,
  onClose,
  candidate,
  onSendMail,
}: CandidateProfileModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[10000] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                variants={modalContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white dark:bg-gray-900 rounded-xl shadow-theme-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              >
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>

                {/* Content */}
                <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-start space-x-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        <Image
                          src={candidate.avatar}
                          alt={candidate.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      </motion.div>
                      <div className="flex-1">
                        <motion.h2
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-2xl font-bold text-gray-900 dark:text-white/90"
                        >
                          {candidate.name}
                        </motion.h2>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-gray-600 dark:text-gray-400"
                        >
                          {candidate.title}
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="mt-3"
                        >
                          <Button onClick={onSendMail} className="text-sm">
                            📧 Send Mail
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-6">
                    {/* Biography */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90 mb-2">
                        Biography
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {candidate.biography}
                      </p>
                    </motion.div>

                    {/* Cover Letter */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90 mb-2">
                        Cover Letter
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {candidate.coverLetter}
                      </p>
                    </motion.div>

                    {/* Personal Details */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">DATE OF BIRTH</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white/90">
                          {candidate.dateOfBirth}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">NATIONALITY</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white/90">
                          {candidate.nationality}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">MARITAL STATUS</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white/90">
                          {candidate.maritalStatus}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">GENDER</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white/90">
                          {candidate.gender}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">EXPERIENCE</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white/90">
                          {candidate.experience}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">EDUCATION</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white/90">
                          {candidate.education}
                        </p>
                      </div>
                    </motion.div>

                    {/* Resume Download */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white/90 mb-2">
                        Download My Resume
                      </h3>
                      <motion.a
                        href={candidate.resume.url}
                        download
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-brand-100 dark:bg-brand-500/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-brand-600 dark:text-brand-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white/90">
                              {candidate.resume.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {candidate.resume.format.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </motion.a>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 }}
                      className="space-y-3"
                    >
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white/90">
                        Contact Information
                      </h3>
                      {candidate.website && (
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-brand-100 dark:bg-brand-500/20 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-brand-600 dark:text-brand-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">WEBSITE</p>
                            <a href={candidate.website} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
                              {candidate.website}
                            </a>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-brand-100 dark:bg-brand-500/20 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-brand-600 dark:text-brand-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">EMAIL ADDRESS</p>
                          <p className="text-sm text-gray-900 dark:text-white/90">{candidate.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-brand-100 dark:bg-brand-500/20 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-brand-600 dark:text-brand-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">PHONE</p>
                          <p className="text-sm text-gray-900 dark:text-white/90">{candidate.phone}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Social Media */}
                    {candidate.socialMedia && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                      >
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white/90 mb-3">
                          Follow me on Social Media
                        </h3>
                        <div className="flex space-x-2">
                          {candidate.socialMedia.facebook && (
                            <motion.a
                              href={candidate.socialMedia.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                            </motion.a>
                          )}
                          {candidate.socialMedia.twitter && (
                            <motion.a
                              href={candidate.socialMedia.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white hover:bg-sky-600 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                              </svg>
                            </motion.a>
                          )}
                          {candidate.socialMedia.linkedin && (
                            <motion.a
                              href={candidate.socialMedia.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                            </motion.a>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
