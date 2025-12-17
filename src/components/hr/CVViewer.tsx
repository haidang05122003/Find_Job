"use client";

import React, { useState, useEffect, useRef } from "react";
import mammoth from "mammoth";

interface CVViewerProps {
    cvUrl: string;
    candidateName: string;
    isOpen: boolean;
    onClose: () => void;
}

const CVViewer: React.FC<CVViewerProps> = ({ cvUrl, candidateName, isOpen, onClose }) => {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [docxHtml, setDocxHtml] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const blobRef = useRef<Blob | null>(null);

    // Build full URL for backend files
    const fullUrl = cvUrl.startsWith('http') ? cvUrl : `http://localhost:8080${cvUrl}`;

    // Determine file type from URL
    const fileExtension = cvUrl.split('.').pop()?.toLowerCase();
    const isPdf = fileExtension === 'pdf';
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '');
    const isDocx = fileExtension === 'docx';
    const isDoc = fileExtension === 'doc';

    useEffect(() => {
        if (!isOpen) return;

        const fetchFile = async () => {
            setIsLoading(true);
            setError(null);
            setDocxHtml(null);

            try {
                // Get token from localStorage
                const token = localStorage.getItem('accessToken');

                const response = await fetch(fullUrl, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                });

                if (!response.ok) {
                    throw new Error(`Failed to load file: ${response.status}`);
                }

                const blob = await response.blob();
                blobRef.current = blob;

                // Handle DOCX files with mammoth
                if (isDocx) {
                    const arrayBuffer = await blob.arrayBuffer();
                    const result = await mammoth.convertToHtml({ arrayBuffer });
                    setDocxHtml(result.value);
                } else {
                    // For other files, create blob URL
                    const url = URL.createObjectURL(blob);
                    setBlobUrl(url);
                }
            } catch (err) {
                console.error('Error fetching CV:', err);
                setError('Không thể tải file. Vui lòng thử lại.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFile();

        // Cleanup blob URL when component unmounts
        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [isOpen, fullUrl, isDocx]);

    // Cleanup on close
    useEffect(() => {
        if (!isOpen && blobUrl) {
            URL.revokeObjectURL(blobUrl);
            setBlobUrl(null);
            setDocxHtml(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleDownload = () => {
        const downloadBlob = blobRef.current;
        if (downloadBlob) {
            const url = URL.createObjectURL(downloadBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = cvUrl.split('/').pop() || 'cv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    const handleOpenNewTab = () => {
        const downloadBlob = blobRef.current;
        if (downloadBlob) {
            const url = URL.createObjectURL(downloadBlob);
            window.open(url, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-5xl h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden mx-4">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            CV - {candidateName}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {cvUrl.split('/').pop()}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Download button */}
                        <button
                            onClick={handleDownload}
                            disabled={!blobRef.current}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Tải về
                        </button>
                        {/* Open in new tab */}
                        <button
                            onClick={handleOpenNewTab}
                            disabled={!blobRef.current}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Mở tab mới
                        </button>
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="h-[calc(100%-80px)] bg-gray-100 dark:bg-gray-800 relative overflow-auto">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">Đang tải CV...</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
                            <div className="text-center p-8">
                                <svg className="mx-auto h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                    Lỗi tải file
                                </h3>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    {error}
                                </p>
                                <button
                                    onClick={onClose}
                                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <>
                            {/* DOCX - render HTML from mammoth */}
                            {isDocx && docxHtml && (
                                <div className="p-8 bg-white dark:bg-gray-900 min-h-full">
                                    <div
                                        className="prose prose-sm max-w-none dark:prose-invert mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
                                        style={{ maxWidth: '800px' }}
                                        dangerouslySetInnerHTML={{ __html: docxHtml }}
                                    />
                                </div>
                            )}

                            {/* DOC - show not supported */}
                            {isDoc && (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <svg className="mx-auto h-16 w-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                            File .doc
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            Định dạng .doc cũ không hỗ trợ xem trực tiếp. Vui lòng tải về để xem.
                                        </p>
                                        <button
                                            onClick={handleDownload}
                                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Tải về
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* PDF */}
                            {isPdf && blobUrl && (
                                <iframe
                                    src={blobUrl}
                                    className="w-full h-full"
                                    title="CV Viewer"
                                />
                            )}

                            {/* Images */}
                            {isImage && blobUrl && (
                                <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
                                    <img
                                        src={blobUrl}
                                        alt={`CV - ${candidateName}`}
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                    />
                                </div>
                            )}

                            {/* Other file types */}
                            {!isPdf && !isImage && !isDocx && !isDoc && blobUrl && (
                                <iframe
                                    src={blobUrl}
                                    className="w-full h-full"
                                    title="CV Viewer"
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CVViewer;
