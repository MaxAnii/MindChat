import ReceiverDataProfile from "../userProfile/ReceiverDataProfile";

const UserInfoHeader = ({ receiverData }) => {
	return (
		<header className="h-14 border-b border-border  flex items-center px-4 gap-3">
			<ReceiverDataProfile receiverData={receiverData} />
			<div>
				<p className="font-medium leading-tight">{receiverData?.name}</p>
				<p className="text-xs text-muted-foreground">Online</p>
			</div>
		</header>
	);
};

export default UserInfoHeader;
