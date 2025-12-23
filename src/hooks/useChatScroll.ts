import { useRef, useEffect, useCallback, useState } from 'react';

/**
 * Custom hook to handle chat scrolling behavior
 * Fixes the issue where loading old messages jumps to the bottom
 */
export const useChatScroll = (messagesLength: number, isLoadingMore: boolean) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const prevScrollHeightRef = useRef<number>(0);

    // Scroll to bottom when new messages arrive (if auto-scroll is enabled or it's the first load)
    useEffect(() => {
        // Only scroll if we are not loading old messages (prevent jumping when prepending)
        if (!isLoadingMore && shouldAutoScroll) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messagesLength, isLoadingMore, shouldAutoScroll]);

    // Handle scroll position preservation when loading older messages
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (isLoadingMore && container) {
            // Save the current scroll height before new messages are added
            prevScrollHeightRef.current = container.scrollHeight;
        } else if (!isLoadingMore && container && prevScrollHeightRef.current > 0) {
            // Restore scroll position after new messages are added
            // New scroll top = New height - Old height (this keeps the view stable)
            const heightDifference = container.scrollHeight - prevScrollHeightRef.current;
            container.scrollTop = heightDifference;
            prevScrollHeightRef.current = 0;
        }
    }, [isLoadingMore, messagesLength]);

    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        // If user scrolls up significantly, disable auto-scroll
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        setShouldAutoScroll(isNearBottom);
    }, []);

    return {
        messagesEndRef,
        messagesContainerRef,
        handleScroll,
        setShouldAutoScroll
    };
};
