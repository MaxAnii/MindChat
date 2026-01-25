import useReciverData from "@/hooks/use-reciver-data";
import ReceiverDataProfile from "../userProfile/ReceiverDataProfile";
import useMessaging from "@/hooks/useMessaging";

const UserInfoHeader = () => {
	const { receiverData } = useReciverData();
	const { isUserOnline, isUserTyping } = useMessaging();

	return (
		<header className="h-16 border-b border-border  flex items-center px-4 gap-3">
			<ReceiverDataProfile receiverData={receiverData} />
			<div>
				<p className="font-medium leading-tight">{receiverData?.name}</p>
				{isUserOnline(receiverData?.userId!) ? (
					<div className="flex items-center gap-1">
						<div className="h-2 w-2 rounded-full bg-primary" />
						{isUserTyping(receiverData?.userId!) ? (
							<p className="text-xs text-primary">Typing...</p>
						) : (
							<p className="text-xs text-primary">Online</p>
						)}
					</div>
				) : (
					<div className="flex items-center gap-1">
						<div className="h-2 w-2 rounded-full bg-gray-300" />
						<p className="text-xs text-gray-400">Offline</p>
					</div>
				)}
			</div>
		</header>
	);
};

export default UserInfoHeader;
