import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";

const ChatSerachBar = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		// Vector search logic will be implemented later
		console.log("Searching:", searchQuery);
	};
	return (
		<form onSubmit={handleSearch} className="relative mx-auto w-full max-w-md">
			<Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground mx-auto" />
			<Input
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				placeholder="Search conversations Semantically..."
				className=" pr-9 bg-background"
			/>
		</form>
	);
};

export default ChatSerachBar;
