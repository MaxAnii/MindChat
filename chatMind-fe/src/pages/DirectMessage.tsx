import ChatLayout from "@/components/ChatLayout";
import useReciverData from "@/hooks/use-reciver-data";
import ChatWindow from "@/components/chat/ChatWindow";
import { useParams } from "react-router-dom";

const DirectMessage = () => {
	const { receiverData } = useReciverData();
	const params = useParams();
	return (
		<ChatLayout>
			<>
				<ChatWindow
					receiverId={receiverData?.id!}
					receiverName={receiverData?.name!}
					roomChatId={parseInt(params?.roomId!)}
				/>
			</>
		</ChatLayout>
	);
};

export default DirectMessage;
