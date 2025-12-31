import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card } from "../ui/card";

const OutgoingMessage = ({
	message,
	MessageTime,
}: {
	message: string;
	MessageTime: string;
}) => {
	return (
		<div className="flex justify-end gap-3 items-center">
			<div className="text-right">
				<Card className="mt-1 p-3 max-w-xl">
					<p className="text-sm">{message}</p>
				</Card>
				<p className="text-xs text-muted-foreground mt-1">{MessageTime}</p>
			</div>

			<Avatar className="h-8 w-8">
				<AvatarFallback>ME</AvatarFallback>
			</Avatar>
		</div>
	);
};

export default OutgoingMessage;
