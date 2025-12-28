import { useState } from "react";
import { User } from "lucide-react";
import Modal from "../ui/Modal";
import { Button } from "../ui/button";
import UserProfileForm from "./UserProfileForm";

const UserProfileModal = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
				<User className="h-4 w-4" />
			</Button>

			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<UserProfileForm />
			</Modal>
		</>
	);
};

export default UserProfileModal;
