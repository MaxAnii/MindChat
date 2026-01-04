import useReciverData from "@/hooks/use-reciver-data";
import ReceiverDataProfile from "../userProfile/ReceiverDataProfile";
import useMessaging from "@/hooks/useMessaging";

const UserInfoHeader = () => {
	const { receiverData } = useReciverData();
	const { isUserOnline } = useMessaging();
	return (
		<header className="h-14 border-b border-border  flex items-center px-4 gap-3">
			<ReceiverDataProfile receiverData={receiverData} />
			<div>
				<p className="font-medium leading-tight">{receiverData?.name}</p>
				{isUserOnline(receiverData?.id!) ? (
					<div className="flex items-center gap-1">
						<div className="h-2 w-2 rounded-full bg-primary" />
						<p className="text-xs text-primary">Online</p>
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
