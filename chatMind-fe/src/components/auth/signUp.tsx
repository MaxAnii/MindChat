import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useMutation } from "@tanstack/react-query";
import api from "@/utils/axios";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
	const { toast } = useToast();
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const signUpMutation = useMutation({
		mutationFn: async (payload: {
			email: string;
			firstName: string;
			lastName: string;
		}) => {
			const res = await api.post("/auth/sign-up", {
				email,
				firstName,
				lastName,
			});
			return res.data;
		},
		onError: () => {
			toast({
				title: "Sign In Failed",
				description: "Unable to sign in. Please try again.",
				variant: "destructive",
			});
		},
		onSuccess: () => {
			toast({
				title: "Account Created",
				description: "Your account has been created successfully.",
			});
		},
	});
	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		signUpMutation.mutate({ email, firstName, lastName });
	};
	return (
		<form onSubmit={handleSignUp} className="space-y-4">
			<div className="flex justify-center items-start gap-2">
				<div className="space-y-2">
					<Label htmlFor="signup-email">First Name</Label>
					<Input
						id="first-name"
						type="text"
						placeholder="John"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="signup-email">Last Name</Label>
					<Input
						id="last-name"
						type="text"
						placeholder="Doe"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						required
					/>
				</div>
			</div>
			<div className="space-y-2">
				<Label htmlFor="signup-email">Email</Label>
				<Input
					id="signup-email"
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
				disabled={signUpMutation.isPending}
			>
				{signUpMutation.isPending ? "Creating account..." : "Create Account"}
			</Button>
		</form>
	);
};

export default SignUp;
