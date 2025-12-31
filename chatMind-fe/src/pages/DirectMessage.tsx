import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import ChatLayout from "@/components/ChatLayout";
import useReciverData from "@/hooks/use-reciver-data";
import UserInfoHeader from "@/components/DirectMessage/userInfoHeader";
import IncomingMessage from "@/components/DirectMessage/IncomingMessage";
import OutgoingMessage from "@/components/DirectMessage/OutGoingMessage";

const DirectMessage = () => {
	const { receiverData } = useReciverData();
	console.log("Receiver Data in DM Page:", receiverData);
	return (
		<ChatLayout>
			<>
				{/* Chat Header */}
				<UserInfoHeader receiverData={receiverData} />
				{/* Messages */}
				<div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
					{/* Incoming */}
					<IncomingMessage
						receiverData={receiverData}
						message={"this is a test message"}
						MessageTime={"10:30 AM"}
					/>

					{/* Outgoing */}
					<OutgoingMessage
						message={"this is a test message"}
						MessageTime={"10:31 AM"}
					/>
				</div>

				{/* Message Input */}
				<div className="border-t border-border bg-card px-4 py-3">
					<form
						// onSubmit={handleSendMessage}
						className="flex gap-2 items-center"
					>
						<Input
							// value={message}
							// onChange={(e) => setMessage(e.target.value)}
							placeholder="Message User 1"
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
			</>
		</ChatLayout>
	);
};

export default DirectMessage;
