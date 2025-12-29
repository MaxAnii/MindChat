import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import api from "@/utils/axios";
import { useToast } from "@/hooks/use-toast";
const SendFirstMessage = ({ userId }: { userId: string }) => {
	const { toast } = useToast();

	const sendFirstMessageMutation = useMutation({
		mutationFn: async () => {
			const res = await api.post("/chat/send-first-message", { userId });
			return res.data;
		},
		onSuccess: () => {
			toast({
				title: "Success",
				description: "User added successfully.",
			});
		},
		onError: () => {
			toast({
				title: "Error",
				description: "Failed to send first message. Please try again.",
				variant: "destructive",
			});
		},
	});

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={() => sendFirstMessageMutation.mutate()}
		>
			<Send className="w-4 h-4 " /> Send Hi
		</Button>
	);
};

export default SendFirstMessage;
