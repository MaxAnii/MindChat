import useReciverData from "@/hooks/use-reciver-data";
import { Card } from "../ui/card";

const IncomingMessage = ({ message, MessageTime }) => {
	const receiverData = useReciverData();
	return (
		<>
			{/* <img
				src={receiverData?.imageURL}
				className="h-8 w-8 rounded-full border border-border object-cover"
			/> */}

			<div className="flex items-center gap-2">
				<div className="h-3 w-3 rounded-full bg-gray-200" />

				<Card className="p-2 max-w-xl gradient-primary shadow-soft flex gap-1.5 items-end justify-end">
					<p className=" text-white ">{message}</p>
					<div className="text-xs text-gray-100  ">{MessageTime}</div>
				</Card>
			</div>
		</>
	);
};

export default IncomingMessage;
