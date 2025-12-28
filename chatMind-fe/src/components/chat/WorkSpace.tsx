import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import UserProfileModal from "../userProfile/userProfileModal";

const Workspace = () => {
	return (
		<>
			<div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-sm">
				<UserProfileModal />
			</div>
			<div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-sm">
				<Button variant="default" size="icon">
					<LogOut className="h-4 w-4" />
				</Button>
			</div>
		</>
	);
};

export default Workspace;
