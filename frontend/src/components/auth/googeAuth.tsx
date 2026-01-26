import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import api from "@/utils/axios";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const GoogleAuth = () => {
	const { toast } = useToast();
	const navigate = useNavigate();

	const googleAuthMutation = useMutation({
		mutationFn: async (credential: string) => {
			const res = await api.post("/auth/google", { token: credential });
			return res.data;
		},
		onSuccess: () => {
			toast({
				title: "Google Sign In Successful",
				description: "Welcome back!",
			});
			// Redirect to chat page after successful login
			setTimeout(() => {
				navigate("/chat");
			}, 500);
		},
		onError: (error: any) => {
			console.error("Google auth error:", error);
			toast({
				title: "Google Sign In Failed",
				description:
					error?.response?.data?.message ||
					"Unable to sign in with Google. Please try again.",
				variant: "destructive",
			});
		},
	});

	const handleGoogleAuth = useGoogleLogin({
		onSuccess: (codeResponse) => {
			// Exchange authorization code on backend
			googleAuthMutation.mutate(codeResponse.code);
		},
		onError: () => {
			toast({
				title: "Google Sign In Failed",
				description: "Failed to sign in with Google.",
				variant: "destructive",
			});
			googleAuthMutation.isPending = false;
		},
		flow: "auth-code",
	});

	return (
		<div>
			{/* OR Divider */}

			<button
				type="button"
				onClick={() => handleGoogleAuth()}
				className="w-full flex items-center justify-center bg-[#F3F9FA]  font-semibold py-3 px-4 rounded-lg  hover:bg-gray-100 dark:hover:bg-zinc-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={googleAuthMutation.isPending}
			>
				<img
					src="https://www.svgrepo.com/show/355037/google.svg"
					alt="Google logo"
					className="h-5 w-5 mr-2"
				/>
				{googleAuthMutation.isPending
					? "Signing in with Google..."
					: "Continue with Google"}
			</button>
		</div>
	);
};

export default GoogleAuth;
