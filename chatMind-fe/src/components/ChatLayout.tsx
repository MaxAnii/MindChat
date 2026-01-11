import ChatSerachBar from "@/components/chat/ChatSerachBar";
import Workspace from "@/components/chat/WorkSpace";
import SearchUser from "@/components/chat/SerachUser";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axios";
import { useNavigate } from "react-router-dom";
import useReciverData from "@/hooks/use-reciver-data";

interface ChatLayoutProps {
	children: React.ReactNode;
	roomChatId?: number;
	onSearchResultClick?: (messageId: number) => void;
}

const ChatLayout = ({
	children,
	roomChatId,
	onSearchResultClick,
}: ChatLayoutProps) => {
	const navigate = useNavigate();
	const { setReceiverData } = useReciverData();
	const { data, isLoading, isError } = useQuery({
		queryKey: ["messages"],
		queryFn: async () => {
			const res = await api.get("/chat/contacts-list");
			return res.data;
		},
	});

	const handleDMNavigation = (userData) => {
		setReceiverData({
			id: userData.userId,
			email: userData.email,
			name: userData.name,
			about: userData.about,
			imageURL: userData.imageURL,
		});
		navigate(`/chat/${userData.userId}/${userData.contactId}`);
	};

	return (
		<>
			<div className=" bg-blue-200/50  py-1 flex items-center px-4 justify-between h-12">
				{roomChatId && onSearchResultClick ? (
					<ChatSerachBar
						roomChatId={roomChatId}
						onResultClick={onSearchResultClick}
					/>
				) : (
					<ChatSerachBar roomChatId={1} />
				)}
			</div>
			<div className="h-[calc(100vh-3rem)] flex overflow-hidden bg-background">
				{/* Workspace Bar (Slack-style left rail) */}
				<div className="w-12 bg-blue-200/50  flex flex-col items-center justify-end py-4 gap-4  border-border  ">
					<Workspace />
				</div>

				{/* Channels / DM Sidebar */}
				<aside className="w-72 border-l border-t rounded-l-md  border-border bg-muted/30 flex flex-col">
					{/* Sidebar Header */}
					<SearchUser />

					{/* Channels / DMs */}
					<div className="flex-1 overflow-y-auto px-2">
						<p className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase">
							Direct Messages
						</p>

						<div className="space-y-1">
							{data?.contacts?.map((i) => (
								<div
									key={i}
									className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition"
									onClick={() => handleDMNavigation(i)}
								>
									<img
										src={i.imageURL}
										className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10"
									/>

									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium truncate">{i.name}</p>
										<p className="text-xs text-muted-foreground truncate">
											{i.lastMessage.content}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</aside>

				{/* Main Chat Panel */}
				<main className="flex-1 flex flex-col">{children}</main>
			</div>
		</>
	);
};

export default ChatLayout;
