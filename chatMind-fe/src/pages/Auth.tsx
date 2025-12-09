import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import SignIn from "@/components/auth/signIn";
import SignUp from "@/components/auth/signUp";
import SocialAuth from "@/components/auth/socialAuth";

const Auth = () => {
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
								<SignIn />
							</TabsContent>

							<TabsContent value="signup">
								<SignUp />
							</TabsContent>

							<SocialAuth />
						</Tabs>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Auth;
