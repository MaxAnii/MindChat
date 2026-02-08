import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";
import {
	ArrowRight,
	MessageSquare,
	Search,
	Sparkles,
	Zap,
	Users,
	Globe,
	CheckCircle,
	Code,
	Server,
	Database,
	List,
} from "lucide-react";
import { Link } from "react-router-dom";

const Logo = () => (
	<div className="flex items-center gap-2">
		<img src="/logo.svg" className="h-10 w-10" alt="C4Chat Logo" />
		<span className="text-2xl font-bold tracking-tight">Mind Chat</span>
	</div>
);

const MockSearchCard = () => (
	<Card className="w-full max-w-md mx-auto shadow-lg overflow-hidden">
		<div className="p-4 bg-gradient-to-r from-primary/5 to-transparent">
			<div className="flex items-center gap-3 mb-3">
				<div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
					<MessageSquare className="h-5 w-5 text-white" />
				</div>
				<div className="flex-1">
					<p className="text-sm font-medium">Search Conversations</p>
					<p className="text-xs text-muted-foreground">
						Find the message you need — by meaning.
					</p>
				</div>
			</div>

			<div className="flex items-center gap-2 bg-background border border-border rounded-md p-2">
				<Search className="h-4 w-4 text-muted-foreground" />
				<input
					className="flex-1 bg-transparent outline-none text-sm"
					placeholder="e.g. pizza suggestions, design feedback"
					aria-label="Search"
				/>
				<button className="ml-2 rounded-md bg-primary px-3 py-1 text-sm text-white">
					Search
				</button>
			</div>

			<div className="mt-4 space-y-2">
				<div className="p-2 rounded-md bg-primary/5 border border-primary/20">
					<p className="text-sm">✅ "Where should we order Italian food?"</p>
					<p className="text-xs text-muted-foreground">
						Detected intent and context
					</p>
				</div>

				<div className="p-2 rounded-md bg-muted/10 text-sm">
					Any size teams • Real conversations
				</div>
			</div>
		</div>
	</Card>
);

const Landing = () => {
	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Hero */}
			<section className="relative overflow-hidden py-24 bg-hero flex pt-28 h-[75vh] ">
				<div className="absolute -left-32 -top-32 w-72 h-72 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl opacity-20 transform rotate-45" />
				<div className="absolute right-[-120px] top-20 w-56 h-56 bg-gradient-to-br from-secondary/30 to-transparent rounded-full blur-2xl opacity-15" />

				<div className="container mx-auto px-6">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div className="space-y-6">
							<header className="flex items-center gap-4">
								<Logo />
								<span className="ml-auto inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
									<Sparkles className="h-4 w-4" />
									AI-Powered • Meaning-First
								</span>
							</header>

							<h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
								Conversations that Understand You
							</h1>

							<p className="text-lg text-muted-foreground max-w-2xl">
								Search chat history by meaning, not keywords. Fast, private, and
								insightful.
							</p>

							<div className="flex flex-wrap gap-3 items-center">
								<Button
									asChild
									className="gradient-primary px-5 py-3"
									size="lg"
								>
									<Link to="/auth">
										Get started — it's free
										<ArrowRight className="ml-2 h-4 w-4 inline-block" />
									</Link>
								</Button>
							</div>

							<div className="mt-6 grid grid-cols-3 gap-4 max-w-sm">
								<div className="flex flex-col items-start gap-1">
									<Users className="h-5 w-5 text-primary" />
									<span className="text-sm font-semibold">Real-time</span>
									<span className="text-xs text-muted-foreground">
										Messaging
									</span>
								</div>
								<div className="flex flex-col items-start gap-1">
									<Globe className="h-5 w-5 text-primary" />
									<span className="text-sm font-semibold">Global</span>
									<span className="text-xs text-muted-foreground">
										Conversations
									</span>
								</div>
								<div className="flex flex-col items-start gap-1">
									<Zap className="h-5 w-5 text-primary" />
									<span className="text-sm font-semibold">Fast</span>
									<span className="text-xs text-muted-foreground">
										Responses
									</span>
								</div>
							</div>
						</div>

						{/* Right: Visual */}
						<div className="flex flex-col items-center animate-fade-in">
							<MockSearchCard />
							<div className="mt-6 text-sm text-muted-foreground">
								Powered by semantic search and AI understanding
							</div>
						</div>
					</div>
				</div>
			</section>
			{/* Features */}
			<section className="py-20">
				<div className="container mx-auto px-6 max-w-6xl">
					<h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-10">
						Built for Conversations That Matter
					</h2>

					<div className="grid md:grid-cols-3 gap-6">
						<Card className="p-6 hover:shadow-lg transition">
							<div className="flex items-center gap-4 mb-4">
								<div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center">
									<MessageSquare className="h-6 w-6 text-white" />
								</div>
								<div>
									<h3 className="text-lg font-semibold">Real-time chat</h3>
									<p className="text-sm text-muted-foreground">
										Typing indicators, delivery receipts, and presence.
									</p>
								</div>
							</div>
						</Card>

						<Card className="p-6 hover:shadow-lg transition">
							<div className="flex items-center gap-4 mb-4">
								<div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center">
									<Sparkles className="h-6 w-6 text-white" />
								</div>
								<div>
									<h3 className="text-lg font-semibold">Meaning Search</h3>
									<p className="text-sm text-muted-foreground">
										Find messages by intent, not keywords.
									</p>
								</div>
							</div>
						</Card>

						<Card className="p-6 hover:shadow-lg transition">
							<div className="flex items-center gap-4 mb-4">
								<div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center">
									<Zap className="h-6 w-6 text-white" />
								</div>
								<div>
									<h3 className="text-lg font-semibold">Fast & Reliable</h3>
									<p className="text-sm text-muted-foreground">
										Optimized for performance and lightning-fast results.
									</p>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</section>
			{/* How it works */}
			<section className="py-16 bg-muted/5">
				<div className="container mx-auto px-6 max-w-6xl">
					<h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-8">
						How it works
					</h2>
					<div className="grid md:grid-cols-3 gap-6">
						<div className="p-6 bg-background/50 rounded-lg text-center">
							<div className="h-12 w-12 mx-auto rounded-lg gradient-primary flex items-center justify-center mb-4">
								<List className="h-6 w-6 text-white" />
							</div>
							<h3 className="font-semibold">Index</h3>
							<p className="text-sm text-muted-foreground">
								Securely index your team conversations.
							</p>
						</div>
						<div className="p-6 bg-background/50 rounded-lg text-center">
							<div className="h-12 w-12 mx-auto rounded-lg gradient-primary flex items-center justify-center mb-4">
								<Sparkles className="h-6 w-6 text-white" />
							</div>
							<h3 className="font-semibold">Understand</h3>
							<p className="text-sm text-muted-foreground">
								Semantic embeddings capture meaning and intent.
							</p>
						</div>
						<div className="p-6 bg-background/50 rounded-lg text-center">
							<div className="h-12 w-12 mx-auto rounded-lg gradient-primary flex items-center justify-center mb-4">
								<Search className="h-6 w-6 text-white" />
							</div>
							<h3 className="font-semibold">Find</h3>
							<p className="text-sm text-muted-foreground">
								Get the right messages in seconds.
							</p>
						</div>
					</div>
				</div>
			</section>
			{/* Tech Stack */}
			<section className="py-12 bg-muted/5">
				<div className="container mx-auto px-6 max-w-6xl">
					<h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-8">
						Tech Stack
					</h2>

					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div className="p-4 bg-card rounded-md">
							<Code className="h-6 w-6 mx-auto text-primary mb-2" />
							<p className="text-sm font-medium">React + TypeScript</p>
							<p className="text-xs text-muted-foreground">
								Vite, React Router
							</p>
						</div>
						<div className="p-4 bg-card rounded-md">
							<Server className="h-6 w-6 mx-auto text-primary mb-2" />
							<p className="text-sm font-medium">Node.js + Express</p>
							<p className="text-xs text-muted-foreground">
								Socket.IO, REST APIs
							</p>
						</div>
						<div className="p-4 bg-card rounded-md">
							<Database className="h-6 w-6 mx-auto text-primary mb-2" />
							<p className="text-sm font-medium">PostgreSQL + Prisma</p>
							<p className="text-xs text-muted-foreground">
								Reliable persistence
							</p>
						</div>
						<div className="p-4 bg-card rounded-md">
							<Zap className="h-6 w-6 mx-auto text-primary mb-2" />
							<p className="text-sm font-medium">Pinecone & Kafka</p>
							<p className="text-xs text-muted-foreground">
								Embeddings & Async jobs
							</p>
						</div>
					</div>
				</div>
			</section>{" "}
			{/* FAQ */}
			<section className="py-12">
				<div className="container mx-auto px-6 max-w-4xl">
					<h2 className="text-2xl font-display font-bold text-center mb-6">
						Frequently asked
					</h2>
					<Accordion type="single" collapsible defaultValue="r1">
						<AccordionItem value="r1">
							<AccordionTrigger>Is my data private?</AccordionTrigger>
							<AccordionContent>
								Yes — we prioritize privacy and provide options for self-hosting
								and encryption.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="r2">
							<AccordionTrigger>How quick is indexing?</AccordionTrigger>
							<AccordionContent>
								Small teams index in minutes; larger archives may take longer
								depending on volume.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="r3">
							<AccordionTrigger>
								Which platforms are supported?
							</AccordionTrigger>
							<AccordionContent>
								We support Slack, Microsoft Teams, and importers for other
								platforms.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</section>
			{/* CTA */}
			<section className="py-16 bg-gradient-to-b from-primary/5 to-transparent">
				<div className="container mx-auto px-6">
					<div className="max-w-3xl mx-auto text-center space-y-6">
						<h2 className="text-2xl md:text-3xl font-display font-bold">
							Get started with a smarter chat search
						</h2>
						<p className="text-muted-foreground">
							Sign up free and unlock meaning-first search across all your
							conversations.
						</p>

						<div className="flex gap-4 justify-center">
							<Button asChild className="gradient-primary px-6 py-3" size="lg">
								<Link to="/auth">Create account</Link>
							</Button>
							<Button asChild variant="outline" className="px-5 py-3" size="lg">
								<Link to="/chat">Try demo</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Landing;
