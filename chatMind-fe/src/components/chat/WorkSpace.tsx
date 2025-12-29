import UserProfileModal from "../userProfile/userProfileModal";
import Logout from "../auth/logout";

const Workspace = () => {
	return (
		<>
			<div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-sm">
				<UserProfileModal />
			</div>
			<div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-sm">
				<Logout />
			</div>
		</>
	);
};

export default Workspace;
