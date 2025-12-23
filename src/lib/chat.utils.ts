import { Conversation, User } from '@/types/chat';

/**
 * Helper to get the other participant in a conversation
 */
export function getRecipient(conversation: Conversation, currentUserId: string): User | undefined {
    if (!conversation) return undefined;

    let recipient: User | undefined;

    if (conversation.participants && conversation.participants.length > 0) {
        recipient = conversation.participants.find((p) => String(p.id) !== String(currentUserId));
    }

    if (!recipient) {
        // Fallback for when participants array might be incomplete or distinct structure
        if (conversation.name) {
            recipient = {
                id: conversation.otherUserId ? String(conversation.otherUserId) : conversation.id,
                name: conversation.name,
                avatar: conversation.avatar,
                email: '',
                role: 'CANDIDATE',
                status: 'offline'
            };
        }
    }

    return recipient;
}
