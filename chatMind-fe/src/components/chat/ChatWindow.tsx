import { useEffect, useState, useRef } from "react";
import useMessaging from "@/hooks/useMessaging";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axios";
import IncomingMessage from "../DirectMessage/IncomingMessage";
import OutgoingMessage from "../DirectMessage/OutGoingMessage";
import { Send } from "lucide-react";
import UserInfoHeader from "../DirectMessage/userInfoHeader";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

interface ChatWindowProps {
	roomChatId: number;
	receiverId: number;
	receiverName: string;
}

const ChatWindow = ({
	roomChatId,
	receiverId,
	receiverName,
}: ChatWindowProps) => {
	const [messageInput, setMessageInput] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const typingTimeoutRef = useRef<NodeJS.Timeout>();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Get current user
	const { data: currentUser } = useQuery({
		queryKey: ["auth", "me"],
		queryFn: async () => {
			const res = await api.get("/auth/me");
			return res.data;
		},
		retry: false,
	});

	const { messages, loadMessages, sendMessage, handleTyping, isUserTyping } =
		useMessaging();

	// Load messages on component mount or when room changes
	useEffect(() => {
		loadMessages(roomChatId);
	}, [roomChatId, loadMessages]);

	// Auto-scroll to latest message
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Handle message input with typing indicator
	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessageInput(e.target.value);

		// Send typing indicator
		if (!isTyping) {
			setIsTyping(true);
			handleTyping(receiverId, true);
		}

		// Clear previous timeout
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		// Set timeout to stop typing indicator after 1 second of inactivity
		typingTimeoutRef.current = setTimeout(() => {
			setIsTyping(false);
			handleTyping(receiverId, false);
		}, 1000);
	};

	// Send message
	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();

		if (!messageInput.trim()) return;

		sendMessage(receiverId, messageInput, roomChatId);
		setMessageInput("");

		// Stop typing indicator
		setIsTyping(false);
		handleTyping(receiverId, false);
	};

	// Filter messages for this room
	const roomMessages = messages.filter((msg) => msg.roomChatId === roomChatId);

	return (
		<div className="flex flex-col h-full  bg-white rounded-lg shadow">
			<UserInfoHeader />
			{/* Messages Container */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{roomMessages.length === 0 ? (
					<div className="flex items-center justify-center h-full text-gray-400">
						<p>No messages yet. Start a conversation!</p>
					</div>
				) : (
					roomMessages.map((message) => (
						<>
							{message.senderId !== currentUser?.id ? (
								<IncomingMessage
									message={message.content}
									MessageTime={new Date(message.createdAt).toLocaleTimeString()}
								/>
							) : (
								<OutgoingMessage
									message={message.content}
									MessageTime={new Date(message.createdAt).toLocaleTimeString()}
								/>
							)}
						</>
					))
				)}

				{/* Typing Indicator */}

				<div ref={messagesEndRef} className="" />
				{isUserTyping(receiverId) && (
					<div className="flex items-center space-x-2 text-gray-500 mt-2 h-10 rounded-full pb-3 px-2">
						<span className="text-sm">{receiverName} is typing</span>
						<div className="flex space-x-1">
							<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
							<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
							<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
						</div>
					</div>
				)}
			</div>

			{/* Input Area */}
			<form
				onSubmit={handleSendMessage}
				className="p-4 border-t flex gap-2 mt-4 items-center"
			>
				<Textarea
					placeholder="Type a message..."
					value={messageInput}
					onChange={(e) => handleInputChange(e)}
					className="flex-1"
					required
				/>
				<Button
					type="submit"
					size="icon"
					className="gradient-primary shadow-primary"
				>
					<Send className="h-4 w-4" />
				</Button>
			</form>
		</div>
	);
};

export default ChatWindow;
