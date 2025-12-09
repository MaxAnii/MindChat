import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useMutation } from "@tanstack/react-query";
import api from "@/utils/axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const SignIn = () => {
	const navigate = useNavigate();
	const { toast } = useToast();

	const [email, setEmail] = useState("");
	const loginMutation = useMutation({
		mutationFn: async (payload: { email: string }) => {
			const res = await api.post("/auth/sign-in", { email });
			return res.data;
		},

		onSuccess: () => {
			navigate("/chat");
		},

		onError: () => {
			toast({
				title: "Sign In Failed",
				description: "Unable to sign in. Please try again.",
				variant: "destructive",
			});
		},
	});
	const handleSignIn = (e: React.FormEvent) => {
		e.preventDefault();
		const data = loginMutation.mutate({ email });
		console.log(data);
	};
	return (
		<form className="space-y-4" onSubmit={handleSignIn}>
			<div className="space-y-2">
				<Label htmlFor="signin-email">Email</Label>
				<Input
					id="signin-email"
					type="email"
					placeholder="you@example.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>
			<Button
				type="submit"
				className="w-full gradient-primary"
				disabled={loginMutation.isPending}
			>
				{loginMutation.isPending ? "Signing in..." : "Sign In"}
			</Button>
		</form>
	);
};

export default SignIn;
