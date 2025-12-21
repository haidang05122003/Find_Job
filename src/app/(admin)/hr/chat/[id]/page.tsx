"use client";
import React from "react";
import ChatInterface from "@/components/chat/ChatInterface";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";

export default function HRChatPage() {
    const { user } = useAuth();
    const params = useParams();
    const id = params?.id as string;

    if (!user) return null;

    return (
        <div className="h-full w-full">
            <ChatInterface
                conversationId={id}
                currentUserId={user.id}
            />
        </div>
    );
}
