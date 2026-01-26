import ChatLayout from "@/components/ChatLayout";
import useReciverData from "@/hooks/use-reciver-data";
import ChatWindow from "@/components/chat/ChatWindow";
import { useParams } from "react-router-dom";
import { useRef } from "react";

const DirectMessage = () => {
	const { receiverData } = useReciverData();
	const params = useParams();
	const chatWindowRef = useRef<any>(null);

	const handleSearchResultClick = async (messageId: number) => {
		if (chatWindowRef.current) {
			await chatWindowRef.current.scrollToMessage(messageId);
		}
	};

	return (
		<ChatLayout
			roomChatId={parseInt(params?.roomId!)}
			onSearchResultClick={handleSearchResultClick}
		>
			<>
				<ChatWindow
					ref={chatWindowRef}
					receiverId={receiverData?.userId!}
					receiverName={receiverData?.name!}
					roomChatId={parseInt(params?.roomId!)}
				/>
			</>
		</ChatLayout>
	);
};

export default DirectMessage;
