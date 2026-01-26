import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axios";

interface UseSocketIOProps {
	onlineUsers?: (users: number[]) => void;
	onReceiveMessage?: (message: any) => void;
	onUserTyping?: (data: { senderId: number; isTyping: boolean }) => void;
	onMessageRead?: (data: { messageId: number; readBy: number }) => void;
}

let sharedSocket: Socket | null = null;

export const useSocketIO = ({
	onlineUsers,
	onReceiveMessage,
	onUserTyping,
	onMessageRead,
}: UseSocketIOProps = {}) => {
	const socketRef = useRef<Socket | null>(null);
	const [onlineList, setOnlineList] = useState<number[]>([]);

	// Get current user
	const { data: currentUser } = useQuery({
		queryKey: ["auth", "me"],
		queryFn: async () => {
			const res = await api.get("/auth/me");
			return res.data;
		},
		retry: false,
	});

	useEffect(() => {
		if (!currentUser?.id) return;

		// create or reuse a shared socket across hook instances
		if (!sharedSocket) {
			sharedSocket = io(import.meta.env.VITE_BACKEND_URL, {
				auth: {
					userId: currentUser.id,
					token: "placeholder",
				},
				reconnection: true,
				reconnectionDelay: 1000,
				reconnectionDelayMax: 5000,
				reconnectionAttempts: 5,
				transports: ["websocket", "polling"],
			});
			// global error logging
			sharedSocket.on("connect_error", (error: any) => {
				console.error("Socket connection error:", error);
			});
			sharedSocket.on("error", (error: any) => {
				console.error("Socket error:", error);
			});
		}
		// assign to local ref
		socketRef.current = sharedSocket;

		// per-hook handlers (so each component using the hook gets callbacks)
		const handleOnlineUsers = (users: number[]) => {
			setOnlineList(users);
			onlineUsers?.(users);
		};

		const handleUserOnline = (userId: number) => {
			console.log("User online received:", userId);
			setOnlineList((prev) => {
				if (prev.includes(userId)) return prev;
				const next = [...prev, userId];
				return next;
			});
		};

		const handleUserOffline = (userId: number) => {
			console.log("User offline received:", userId);
			setOnlineList((prev) => {
				const next = prev.filter((id) => id !== userId);
				return next;
			});
		};

		const handleMessageSent = (data: any) => {
			if (data.success) onReceiveMessage?.(data.message);
		};

		const handleReceiveMessage = (message: any) => onReceiveMessage?.(message);
		const handleUserTyping = (data: any) => onUserTyping?.(data);
		const handleMessageRead = (data: any) => onMessageRead?.(data);

		// register handlers
		socketRef.current.on("onlineUsers", handleOnlineUsers);
		socketRef.current.on("userOnline", handleUserOnline);
		socketRef.current.on("userOffline", handleUserOffline);
		socketRef.current.on("messageSent", handleMessageSent);
		socketRef.current.on("receiveMessage", handleReceiveMessage);
		socketRef.current.on("userTyping", handleUserTyping);
		socketRef.current.on("messageReadReceipt", handleMessageRead);

		// cleanup: remove only this hook's handlers
		return () => {
			socketRef.current?.off("onlineUsers", handleOnlineUsers);
			socketRef.current?.off("userOnline", handleUserOnline);
			socketRef.current?.off("userOffline", handleUserOffline);
			socketRef.current?.off("messageSent", handleMessageSent);
			socketRef.current?.off("receiveMessage", handleReceiveMessage);
			socketRef.current?.off("userTyping", handleUserTyping);
			socketRef.current?.off("messageReadReceipt", handleMessageRead);
		};

		return () => {
			// Don't disconnect on unmount to keep connection alive
			// socketRef.current?.disconnect();
		};
	}, [
		currentUser?.id,
		onlineUsers,
		onReceiveMessage,
		onUserTyping,
		onMessageRead,
	]);

	// Send message
	const sendMessage = useCallback(
		(receiverId: number, content: string, roomChatId: number) => {
			if (socketRef.current) {
				socketRef.current.emit("sendMessage", {
					receiverId,
					content,
					roomChatId,
				});
			}
		},
		[],
	);

	// Send typing indicator
	const sendTyping = useCallback((receiverId: number, isTyping: boolean) => {
		if (socketRef.current) {
			socketRef.current.emit("userTyping", {
				receiverId,
				isTyping,
			});
		}
	}, []);

	// Mark message as read
	const markMessageAsRead = useCallback(
		(messageId: number, senderId: number) => {
			if (socketRef.current) {
				socketRef.current.emit("messageRead", {
					messageId,
					senderId,
				});
			}
		},
		[],
	);

	// Get socket instance
	const getSocket = useCallback(() => socketRef.current, []);

	return {
		socket: socketRef.current,
		sendMessage,
		sendTyping,
		markMessageAsRead,
		getSocket,
		onlineList,
	};
};

export default useSocketIO;
