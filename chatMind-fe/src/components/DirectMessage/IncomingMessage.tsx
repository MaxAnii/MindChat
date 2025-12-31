import { Card } from "../ui/card";

const IncomingMessage = ({ receiverData, message, MessageTime }) => {
	return (
		<div className="flex gap-3 items-center">
			<img
				src={receiverData?.imageURL}
				className="h-8 w-8 rounded-full border border-border object-cover"
			/>

			<div>
				<Card className="p-3 max-w-xl gradient-primary shadow-soft">
					<p className="text-sm text-white">{message}</p>
				</Card>
				<p className="text-xs text-muted-foreground mt-1">{MessageTime}</p>
			</div>
		</div>
	);
};

export default IncomingMessage;
