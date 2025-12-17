"use client";

import React, { useState, useEffect } from "react";
import Portal from "./Portal";
import mammoth from "mammoth";

interface CVPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    cvUrl: string | null;
    candidateName: string;
    originalUrl?: string;
}

const CVPreviewModal: React.FC<CVPreviewModalProps> = ({
    isOpen,
    onClose,
    cvUrl,
    candidateName,
    originalUrl
}) => {
    const [docHtml, setDocHtml] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!isOpen || !cvUrl) {
            setDocHtml(null);
            setError(false);
            return;
        }

        // Detect if DOCX
        const isDocx = (originalUrl?.toLowerCase().endsWith(".docx")) || (cvUrl.toLowerCase().endsWith(".docx"));

        // If local blob and is DOCX, try to render with Mammoth
        if (cvUrl.startsWith("blob:") && isDocx) {
            setLoading(true);
            fetch(cvUrl)
                .then(res => res.arrayBuffer())
                .then(arrayBuffer => mammoth.convertToHtml({ arrayBuffer }))
                .then(result => {
                    setDocHtml(result.value);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Mammoth error:", err);
                    setError(true);
                    setLoading(false);
                });
        }
    }, [cvUrl, isOpen, originalUrl]);

    if (!isOpen || !cvUrl) return null;

    // Detect File Type for Display Logic
    const isDocx = (originalUrl?.endsWith(".docx")) || (cvUrl.endsWith(".docx"));
    const isPdf = (originalUrl?.endsWith(".pdf")) || (cvUrl.endsWith(".pdf"));
    const isExternal = !cvUrl.startsWith("blob:") && cvUrl.startsWith("http");

    return (
        <Portal>
            <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="flex w-full h-[90vh] max-w-5xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-gray-900 animate-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    CV: {candidateName}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {isExternal ? "Tài liệu trực tuyến" : "Tài liệu nội bộ"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <a
                                href={cvUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
                            >
                                Tải xuống
                            </a>
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-white/10 dark:hover:text-gray-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-800/50 relative p-4 overflow-y-auto">
                        {loading ? (
                            <div className="flex h-full items-center justify-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                                <span className="ml-3 text-sm text-gray-500">Đang xử lý tài liệu...</span>
                            </div>
                        ) : isDocx && docHtml ? (
                            <div className="prose max-w-none bg-white p-8 shadow-sm dark:bg-gray-900 dark:prose-invert min-h-full rounded-xl mx-auto w-[21cm]" dangerouslySetInnerHTML={{ __html: docHtml }} />
                        ) : error ? (
                            <div className="flex h-full flex-col items-center justify-center text-center">
                                <p className="text-gray-500">Không thể xem trước định dạng này.</p>
                                <a href={cvUrl} download className="mt-2 text-blue-600 hover:underline">Tải về để xem</a>
                            </div>
                        ) : (
                            <iframe
                                src={
                                    isExternal
                                        ? `https://docs.google.com/gview?url=${encodeURIComponent(cvUrl)}&embedded=true`
                                        : cvUrl
                                }
                                className="w-full h-full border-none rounded-xl bg-white"
                                title={`CV of ${candidateName}`}
                            />
                        )}
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default CVPreviewModal;
