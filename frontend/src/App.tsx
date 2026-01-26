import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import VerifyToken from "./pages/verifyToken";
import Landing from "./pages/Landing";
import PrivateRoute from "./components/PrivateRoute";
import Chat from "./pages/Chat";
import DirectMessage from "./pages/DirectMessage";
import { ReciverDataProvider } from "./contextAPI/reciverDataContext";

const queryClient = new QueryClient();

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<ReciverDataProvider>
				<TooltipProvider>
					<Toaster />
					<Sonner />

					<Routes>
						<Route path="/" element={<Landing />} />
						<Route path="/auth" element={<Auth />} />
						<Route path="/verify-token/:token" element={<VerifyToken />} />

						<Route
							path="/chat"
							element={
								<PrivateRoute>
									<Chat />
								</PrivateRoute>
							}
						/>
						<Route
							path="/chat/:reciverId/:roomId"
							element={
								<PrivateRoute>
									<DirectMessage />
								</PrivateRoute>
							}
						/>

						<Route path="*" element={<NotFound />} />
					</Routes>
				</TooltipProvider>
			</ReciverDataProvider>
		</QueryClientProvider>
	);
};

export default App;
