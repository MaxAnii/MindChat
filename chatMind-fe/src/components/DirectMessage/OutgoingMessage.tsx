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
			<div>
				<div className="flex items-center gap-2">
					<Card className="p-2 max-w-xl shadow-soft flex gap-1.5 items-end justify-end">
						<p className=" ">{message}</p>
						<div className="text-xs text-gray-500  ">{MessageTime}</div>
					</Card>
					<div className="h-3 w-3 rounded-full bg-primary" />
				</div>
			</div>
		</div>
	);
};

export default OutgoingMessage;
