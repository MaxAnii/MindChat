import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Auth = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const navigate = useNavigate();
	const { toast } = useToast();

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
	};

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4 gradient-hero">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<Link
						to="/"
						className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-smooth"
					>
						<Sparkles className="h-6 w-6" />
						<span className="text-2xl font-display font-bold">ChatApp</span>
					</Link>
				</div>

				<Card className="shadow-primary">
					<CardHeader className="text-center">
						<CardTitle className="text-2xl font-display">Welcome</CardTitle>
						<CardDescription>
							Sign in or create an account to get started
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue="signin" className="w-full">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="signin">Sign In</TabsTrigger>
								<TabsTrigger value="signup">Sign Up</TabsTrigger>
							</TabsList>

							<TabsContent value="signin">
								<form onSubmit={handleSignIn} className="space-y-4">
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
										disabled={isLoading}
									>
										{isLoading ? "Signing in..." : "Sign In"}
									</Button>
								</form>
							</TabsContent>

							<TabsContent value="signup">
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
										disabled={isLoading}
									>
										{isLoading ? "Creating account..." : "Create Account"}
									</Button>
								</form>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Auth;
