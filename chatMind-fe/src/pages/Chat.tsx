import ChatLayout from "@/components/ChatLayout";
import { MessageCircleOff } from "lucide-react";

const Chat = () => {
	return (
		<ChatLayout>
			<div className="flex w-full h-full flex-wrap justify-center items-center gap-2">
				<MessageCircleOff className="w-12 h-12 text-gray-400 " />
				<h2 className="text-2xl text-gray-600 font-light">
					Select a conversation to start chatting
				</h2>
			</div>
		</ChatLayout>
	);
};

export default Chat;
