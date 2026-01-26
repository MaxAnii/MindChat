import { useState, useCallback } from "react";
import { useSocketIO } from "./useSocketIO";
import api from "@/utils/axios";

interface Message {
	id: number;
	roomChatId: number;
	senderId: number;
	receiverId: number;
	content: string;
	createdAt: string;
	sender: {
		id: number;
		name: string;
		email: string;
	};
	receiver: {
		id: number;
		name: string;
		email: string;
	};
}

export const useMessaging = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
	const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());

	const {
		sendMessage: socketSendMessage,
		sendTyping,
		markMessageAsRead,
		onlineList,
	} = useSocketIO({
		onlineUsers: setOnlineUsers,
		onReceiveMessage: (message: Message) => {
			setMessages((prev) => [...prev, message]);
		},
		onUserTyping: ({ senderId, isTyping }) => {
			setTypingUsers((prev) => {
				const newSet = new Set(prev);
				if (isTyping) {
					newSet.add(senderId);
				} else {
					newSet.delete(senderId);
				}
				return newSet;
			});
		},
	});

	// Load message history
	const loadMessages = useCallback(async (roomChatId: number) => {
		try {
			const response = await api.get(`/chat/messages/${roomChatId}`);
			setMessages(response.data);
		} catch (error) {
			console.error("Error loading messages:", error);
		}
	}, []);

	// Send a message
	const sendMessage = useCallback(
		(receiverId: number, content: string, roomChatId: number) => {
			socketSendMessage(receiverId, content, roomChatId);
		},
		[socketSendMessage]
	);

	// Send typing indicator
	const handleTyping = useCallback(
		(receiverId: number, isTyping: boolean) => {
			sendTyping(receiverId, isTyping);
		},
		[sendTyping]
	);

	// Check if user is online
	const isUserOnline = useCallback(
		(userId: number) => onlineList.includes(userId),
		[onlineList]
	);

	// Check if user is typing
	const isUserTyping = useCallback(
		(userId: number) => typingUsers.has(userId),
		[typingUsers]
	);

	return {
		messages,
		setMessages,
		onlineUsers,
		typingUsers,
		loadMessages,
		sendMessage,
		handleTyping,
		isUserOnline,
		isUserTyping,
		markMessageAsRead,
	};
};

export default useMessaging;
