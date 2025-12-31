const UserInfoHeader = ({ receiverData }) => {
	return (
		<header className="h-14 border-b border-border  flex items-center px-4 gap-3">
			<img
				src={receiverData?.imageURL}
				className="h-10 w-10 rounded-full border border-border object-cover"
			/>

			<div>
				<p className="font-medium leading-tight">{receiverData?.name}</p>
				<p className="text-xs text-muted-foreground">Online</p>
			</div>
		</header>
	);
};

export default UserInfoHeader;
