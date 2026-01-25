import {
	useEffect,
	useState,
	useRef,
	forwardRef,
	useImperativeHandle,
	useCallback,
} from "react";
import useMessaging from "@/hooks/useMessaging";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axios";
import IncomingMessage from "../DirectMessage/IncomingMessage";
import OutgoingMessage from "../DirectMessage/OutgoingMessage";
import { Send } from "lucide-react";
import UserInfoHeader from "../DirectMessage/userInfoHeader";
import { Textarea } from "../ui/textarea";

interface ChatWindowProps {
	roomChatId: number;
	receiverId: number;
	receiverName: string;
}

interface ChatWindowHandle {
	scrollToMessage: (messageId: number) => Promise<void>;
}

const ChatWindow = forwardRef<ChatWindowHandle, ChatWindowProps>(
	({ roomChatId, receiverId, receiverName }, ref) => {
		const [messageInput, setMessageInput] = useState("");
		const [isTyping, setIsTyping] = useState(false);
		const [highlightedMessageId, setHighlightedMessageId] = useState<
			number | null
		>(null);
		const typingTimeoutRef = useRef<NodeJS.Timeout>();
		const messagesContainerRef = useRef<HTMLDivElement>(null);
		const messageRefsMap = useRef<Map<number, HTMLDivElement>>(new Map());
		const hasScrolledToBottomRef = useRef(false);

		// Get current user
		const { data: currentUser } = useQuery({
			queryKey: ["auth", "me"],
			queryFn: async () => {
				const res = await api.get("/auth/me");
				return res.data;
			},
			retry: false,
		});

		const { messages, loadMessages, sendMessage, handleTyping, setMessages } =
			useMessaging();

		// Scroll to bottom function
		const scrollToBottom = useCallback(() => {
			if (messagesContainerRef.current) {
				messagesContainerRef.current.scrollTop =
					messagesContainerRef.current.scrollHeight;
			}
		}, []);

		// Load messages on component mount or when room changes
		useEffect(() => {
			loadMessages(roomChatId);
			hasScrolledToBottomRef.current = false;
		}, [roomChatId, loadMessages]);

		// Auto-scroll to bottom when messages are loaded for the first time
		useEffect(() => {
			const roomMessages = messages.filter(
				(msg) => msg.roomChatId === roomChatId,
			);

			if (roomMessages.length > 0 && !hasScrolledToBottomRef.current) {
				// Use setTimeout to ensure DOM is updated

				scrollToBottom();
				hasScrolledToBottomRef.current = true;
			}
		}, [messages, roomChatId, scrollToBottom]);

		// Load messages around a specific message ID
		const loadMessagesAroundId = useCallback(
			async (messageId: number) => {
				try {
					const response = await api.get(
						`/chat/messages/${roomChatId}?around=${messageId}`,
					);
					// Merge new messages with existing ones, avoiding duplicates
					setMessages((prevMessages) => {
						const messageMap = new Map(prevMessages.map((m) => [m.id, m]));
						response.data.forEach((m: any) => messageMap.set(m.id, m));
						return Array.from(messageMap.values()).sort(
							(a, b) =>
								new Date(a.createdAt).getTime() -
								new Date(b.createdAt).getTime(),
						);
					});
				} catch (error) {
					console.error("Error loading messages around ID:", error);
				}
			},
			[roomChatId, setMessages],
		);

		// Expose scroll function via ref
		useImperativeHandle(
			ref,
			() => ({
				scrollToMessage: async (messageId: number) => {
					// Check if message is already loaded
					let messageElement = messageRefsMap.current.get(messageId);

					if (!messageElement) {
						// Message not loaded, fetch it
						await loadMessagesAroundId(messageId);
						// Wait a bit for re-render
						await new Promise((resolve) => setTimeout(resolve, 100));
						messageElement = messageRefsMap.current.get(messageId);
					}

					if (messageElement) {
						// Highlight the message
						setHighlightedMessageId(messageId);
						// Scroll to the message
						messageElement.scrollIntoView({
							behavior: "smooth",
							block: "center",
						});
						// Remove highlight after 2 seconds
						setTimeout(() => setHighlightedMessageId(null), 2000);
					}
				},
			}),
			[loadMessagesAroundId],
		);

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

			// Scroll to bottom after sending
			setTimeout(scrollToBottom, 100);
		};

		// Filter messages for this room
		const roomMessages = messages.filter(
			(msg) => msg.roomChatId === roomChatId,
		);

		return (
			<div className="flex flex-col h-full bg-white  shadow">
				<UserInfoHeader />
				{/* Messages Container */}
				<div
					ref={messagesContainerRef}
					className="flex-1 overflow-y-auto p-4 space-y-4"
				>
					{roomMessages.length === 0 ? (
						<div className="flex items-center justify-center h-full text-gray-400">
							<p>No messages yet. Start a conversation!</p>
						</div>
					) : (
						roomMessages.map((message) => (
							<div
								key={message.id}
								ref={(el) => {
									if (el) {
										messageRefsMap.current.set(message.id, el);
									}
								}}
								className={`transition-all duration-300 ${
									highlightedMessageId === message.id
										? "bg-yellow-100 px-2 py-1 rounded-lg"
										: ""
								}`}
							>
								{message.senderId !== currentUser?.id ? (
									<IncomingMessage
										message={message.content}
										MessageTime={new Date(
											message.createdAt,
										).toLocaleTimeString()}
									/>
								) : (
									<OutgoingMessage
										message={message.content}
										MessageTime={new Date(
											message.createdAt,
										).toLocaleTimeString()}
									/>
								)}
							</div>
						))
					)}
				</div>

				{/* Input Area */}
				<div
					onSubmit={handleSendMessage}
					className="p-4 border-t flex gap-2 mt-4 items-center"
				>
					<Textarea
						placeholder="Type a message..."
						value={messageInput}
						onChange={(e) => handleInputChange(e)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSendMessage(e);
							}
						}}
						className="flex-1"
						required
					/>
					<Button
						onClick={handleSendMessage}
						size="icon"
						className="gradient-primary shadow-primary"
					>
						<Send className="h-4 w-4" />
					</Button>
				</div>
			</div>
		);
	},
);

ChatWindow.displayName = "ChatWindow";
export default ChatWindow;
