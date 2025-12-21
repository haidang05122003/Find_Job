"use client";

import React from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatRightSidebar from "@/components/chat/ChatRightSidebar";

export default function HRChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-[calc(100vh-4.5rem)] flex-col overflow-hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-1 overflow-hidden">
                <ChatSidebar basePath="/hr/chat" />
                <div className="flex-1 w-full lg:w-auto h-full relative">
                    {children}
                </div>
                <ChatRightSidebar />
            </div>
        </div>
    );
}
