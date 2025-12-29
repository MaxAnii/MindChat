import { Sparkles } from "lucide-react";
import { Input } from "../ui/input";
import AddNewContact from "./AddNewContact";

const SearchUser = () => {
	return (
		<div className="p-4 sticky top-0 border-border h-28">
			<div className="flex justify-between gap-2">
				<div className="flex items-center gap-2">
					<Sparkles className="h-5 w-5 text-primary" />
					<span className="font-display font-bold text-lg">Mind Chat</span>
				</div>
				<AddNewContact />
			</div>
			<div>
				<Input
					type="text"
					placeholder="Search User..."
					className="w-full mt-2 pl-2 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
				/>
			</div>
		</div>
	);
};

export default SearchUser;
