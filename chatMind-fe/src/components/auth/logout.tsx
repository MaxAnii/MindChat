import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import api from "@/utils/axios";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Logout = () => {
	const { toast } = useToast();
	const navigate = useNavigate();
	const logoutMutation = useMutation({
		mutationFn: async () => {
			await api.post("/auth/logout");
		},

		onSuccess: () => {
			navigate("/auth");
		},
		onError: () => {
			toast({
				title: "Logout Failed",
				description: "Unable to logout. Please try again.",
				variant: "destructive",
			});
		},
	});

	return (
		<Button
			variant="default"
			size="icon"
			onClick={() => logoutMutation.mutate()}
		>
			<LogOut className="h-4 w-4" />
		</Button>
	);
};

export default Logout;
