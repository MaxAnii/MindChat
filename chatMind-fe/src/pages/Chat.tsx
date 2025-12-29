import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import ChatSerachBar from "@/components/chat/ChatSerachBar";
import Workspace from "@/components/chat/WorkSpace";
import SearchUser from "@/components/chat/SerachUser";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axios";

const Chat = () => {
	const [message, setMessage] = useState("");

	const { data, isLoading, isError } = useQuery({
		queryKey: ["messages"],
		queryFn: async () => {
			const res = await api.get("/chat/contacts-list");
			return res.data;
		},
	});

	console.log({ data, isLoading, isError });
	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!message.trim()) return;

		// Message sending logic will be imqplemented later
		console.log("Sending message:", message);
		setMessage("");
	};

	return (
		<>
			<div className=" bg-blue-200/50  py-1 flex items-center px-4 justify-between h-12">
				<ChatSerachBar />
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

									<div className="h-2 w-2 rounded-full bg-primary" />
								</div>
							))}
						</div>
					</div>
				</aside>

				{/* Main Chat Panel */}
				<main className="flex-1 flex flex-col">
					{/* Chat Header */}
					<header className="h-14 border-b border-border  flex items-center px-4 gap-3">
						<Avatar className="h-8 w-8">
							<AvatarFallback>U1</AvatarFallback>
						</Avatar>
						<div>
							<p className="font-medium leading-tight">User 1</p>
							<p className="text-xs text-muted-foreground">Online</p>
						</div>
					</header>

					{/* Messages */}
					<div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
						{/* Incoming */}
						<div className="flex gap-3 items-start">
							<Avatar className="h-8 w-8">
								<AvatarFallback>U1</AvatarFallback>
							</Avatar>

							<div>
								<p className="text-sm font-medium">User 1</p>
								<Card className="mt-1 p-3 max-w-xl">
									<p className="text-sm">
										Hey! This is a sample message to show the Slack-like layout.
									</p>
								</Card>
								<p className="text-xs text-muted-foreground mt-1">10:30 AM</p>
							</div>
						</div>

						{/* Outgoing */}
						<div className="flex justify-end gap-3 items-start">
							<div className="text-right">
								<Card className="p-3 max-w-xl gradient-primary shadow-soft">
									<p className="text-sm text-white">
										This keeps your original gradient & color scheme ✨
									</p>
								</Card>
								<p className="text-xs text-muted-foreground mt-1">10:31 AM</p>
							</div>

							<Avatar className="h-8 w-8">
								<AvatarFallback>ME</AvatarFallback>
							</Avatar>
						</div>
					</div>

					{/* Message Input */}
					<div className="border-t border-border bg-card px-4 py-3">
						<form
							onSubmit={handleSendMessage}
							className="flex gap-2 items-center"
						>
							<Input
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								placeholder="Message User 1"
								className="flex-1"
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
				</main>
			</div>
		</>
	);
};

export default Chat;
