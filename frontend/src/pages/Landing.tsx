import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, MessageSquare, Search, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = () => (
	<div className="flex items-center gap-2">
		<img src="/logo.svg" className="h-10 w-10" alt="C4Chat Logo" />
		<span className="text-2xl font-bold tracking-tight">C4Chat</span>
	</div>
);

const Landing = () => {
	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Hero */}
			<section className="relative overflow-hidden gradient-hero pb-20">
				<div className="absolute inset-0 bg-grid-pattern opacity-5" />

				<div className="container mx-auto px-4 pt-24">
					<div className="max-w-4xl mx-auto text-center space-y-10">
						<div className="flex justify-center">
							<Logo />
						</div>

						<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
							<Sparkles className="h-4 w-4" />
							Semantic Intelligence Engine
						</span>

						<h1 className="text-5xl md:text-7xl font-display font-bold">
							Search Conversations{" "}
							<span className="text-primary">by Meaning</span>
						</h1>

						<p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
							C4Chat understands context, intent, and meaning—helping you find
							exactly what you're looking for inside any conversation.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button
								asChild
								size="lg"
								className="gradient-primary text-lg z-10  "
							>
								<Link to="/auth">
									Get Started Free
									<ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>

							<Button
								asChild
								variant="outline"
								size="lg"
								className="text-lg z-10"
							>
								<Link to="/chat">Try Live Demo</Link>
							</Button>
						</div>

						<p className="text-sm text-muted-foreground">
							Powered by the 4C Engine —{" "}
							<b>Context · Comprehend · Connect · Converse</b>
						</p>
					</div>
				</div>
			</section>

			{/* Semantic Search Section */}
			<section className="py-20 bg-muted/30">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-display font-bold">
							Meaning-First Search
						</h2>
						<p className="text-lg text-muted-foreground">
							C4Chat understands what you mean—not just what you type.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
						{/* Old Search */}
						<Card className="p-8 shadow-soft border transition-all hover:shadow-primary">
							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
										<Search className="h-5 w-5 text-destructive" />
									</div>
									<h3 className="text-xl font-semibold">
										Old: Keyword Matching
									</h3>
								</div>

								<div className="space-y-3">
									<div className="p-3 bg-muted rounded-lg">
										<p className="text-sm font-mono">
											Search: "pizza suggestions"
										</p>
									</div>
									<div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
										❌ No results found
										<p className="text-xs text-muted-foreground">
											Relies on exact words
										</p>
									</div>
								</div>
							</div>
						</Card>

						{/* New Search */}
						<Card className="p-8 shadow-soft border-primary/50 border transition-all hover:shadow-primary">
							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
										<Sparkles className="h-5 w-5 text-white" />
									</div>
									<h3 className="text-xl font-semibold">
										New: Semantic Meaning Search
									</h3>
								</div>

								<div className="space-y-3">
									<div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
										<p className="text-sm font-mono">
											Search: "pizza suggestions"
										</p>
									</div>

									<div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
										✅ "Where should we order Italian food?"
										<p className="text-xs text-muted-foreground">
											Understood your meaning
										</p>
									</div>

									<div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
										✅ "Any good restaurants nearby?"
										<p className="text-xs text-muted-foreground">
											Context detected
										</p>
									</div>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</section>

			{/* Features */}
			<section className="py-20">
				<div className="container mx-auto px-4 max-w-5xl">
					<h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
						Built for Conversations That Matter
					</h2>

					<div className="grid md:grid-cols-3 gap-8">
						<Card className="p-6 shadow-soft hover:shadow-primary transition-all">
							<div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
								<MessageSquare className="h-6 w-6 text-white" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Real-Time Chat</h3>
							<p className="text-muted-foreground">
								Smooth, instant messaging with typing indicators and delivery
								receipts.
							</p>
						</Card>

						<Card className="p-6 shadow-soft hover:shadow-primary transition-all">
							<div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
								<Sparkles className="h-6 w-6 text-white" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Meaning Search</h3>
							<p className="text-muted-foreground">
								Find messages based on intent, context, and semantic meaning.
							</p>
						</Card>

						<Card className="p-6 shadow-soft hover:shadow-primary transition-all">
							<div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
								<Zap className="h-6 w-6 text-white" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
							<p className="text-muted-foreground">
								Optimized for performance and lightning-fast responses.
							</p>
						</Card>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="py-20 gradient-hero">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto text-center space-y-8">
						<h2 className="text-3xl md:text-4xl font-display font-bold">
							Experience Conversations with Understanding
						</h2>

						<p className="text-xl text-muted-foreground">
							Join users discovering a smarter way to search and interact with
							chat.
						</p>

						<Button asChild size="lg" className="gradient-primary text-lg">
							<Link to="/auth">
								Get Started with C4Chat
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Landing;
