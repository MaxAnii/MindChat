import { CircleX, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "@/hooks/use-debounce";

interface SearchResult {
	id: number;
	content: string;
	sender: {
		id: number;
		name: string;
		email: string;
	};
	createdAt: string;
	score: number;
}

interface ChatSearchBarProps {
	roomChatId: number;
	onResultClick?: (messageId: number) => Promise<void>;
}

const ChatSerachBar = ({ roomChatId, onResultClick }: ChatSearchBarProps) => {
	const [query, setQuery] = useState("");
	const [emptyResultsMessage, setEmptyResultsMessage] = useState("");
	const [isLoadingMessage, setIsLoadingMessage] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const debouncedQuery = useDebounce(query, 3000);

	const { data, isLoading, isError } = useQuery({
		queryKey: ["chat", "search", roomChatId, debouncedQuery.trim()],
		queryFn: async () => {
			setShowDropdown(true);
			setEmptyResultsMessage("");
			const response = await api.get(
				`/chat/search/${roomChatId}/${encodeURIComponent(
					debouncedQuery.trim(),
				)}`,
			);
			if (response?.data?.results?.length === 0) {
				setEmptyResultsMessage("No matching messages found");
			}
			return response?.data?.results || [];
		},
		enabled: Boolean(debouncedQuery),
		staleTime: 5 * 60 * 1000,
	});

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const today = new Date();
		const isToday = date.toDateString() === today.toDateString();

		if (isToday) {
			return date.toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
			});
		}
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});
	};

	// Handle result click - call parent callback and close search
	const handleResultClick = async (messageId: number) => {
		if (onResultClick) {
			setShowDropdown(false);
			setIsLoadingMessage(true);
			try {
				await onResultClick(messageId);
			} finally {
				setIsLoadingMessage(false);
			}
		}
		setQuery(""); // Clear search to close dropdown
	};

	return (
		<form className="relative mx-auto w-full max-w-md">
			<Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
			<Input
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search conversations Semantically..."
				className="pr-9 bg-background"
			/>

			{showDropdown && (data?.length > 0 || query) && (
				<div className="relative w-full">
					{/* Close button OUTSIDE dropdown */}
					<button
						className="absolute top-3 -right-5 z-20 hover:bg-gray-100  rounded-full transition"
						onClick={() => {
							setQuery("");
							setShowDropdown(false);
						}}
					>
						<CircleX size={16} />
					</button>

					{/* Dropdown */}
					<div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-80 overflow-y-auto z-10 shadow-lg">
						{isLoading && (
							<div className="p-4 text-center text-gray-500 text-sm">
								Searching...
							</div>
						)}

						{isLoadingMessage && (
							<div className="p-4 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
								<span>Loading message</span>
								<div className="flex space-x-1">
									<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
									<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
									<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
								</div>
							</div>
						)}

						{emptyResultsMessage && (
							<div className="p-4 text-center text-gray-500 text-sm">
								{emptyResultsMessage}
							</div>
						)}

						{data?.map((result: SearchResult) => (
							<div
								key={result.id}
								onClick={() => handleResultClick(result.id)}
								className={`p-3 border-b cursor-pointer transition-colors ${
									isLoadingMessage
										? "opacity-50 cursor-not-allowed"
										: "hover:bg-gray-50 active:bg-gray-100"
								}`}
								style={{
									pointerEvents: isLoadingMessage ? "none" : "auto",
								}}
							>
								<p className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
									{result.content}
								</p>

								<div className="flex items-center justify-between text-xs text-gray-600">
									<span className="font-medium">
										{result.sender?.name || "Unknown"}
									</span>
									<span>{formatDate(result.createdAt)}</span>
								</div>

								<div className="flex items-center mt-1">
									<div className="flex-1 bg-gray-200 rounded-full h-1.5 mr-2">
										<div
											className="bg-blue-500 h-1.5 rounded-full"
											style={{
												width: `${Math.min(result.score * 100, 100)}%`,
											}}
										/>
									</div>
									<span className="text-xs font-semibold text-blue-600">
										{(result.score * 100).toFixed(1)}%
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</form>
	);
};

export default ChatSerachBar;
