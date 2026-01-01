import { useState } from "react";
import { Mail, User } from "lucide-react";
import Modal from "../ui/Modal";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type ReciverDataProfileProps = {
	email: string;
	name: string | null;
	about: string | null;
	imageURL: string | null;
};

const ReceiverDataProfile = ({
	receiverData,
}: {
	receiverData: ReciverDataProfileProps;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				variant="secondary"
				className="bg-white hover:bg-white"
				size="icon"
				onClick={() => setIsOpen(true)}
			>
				<img
					src={receiverData?.imageURL}
					className="h-10 w-10 rounded-full border border-border object-cover"
				/>
			</Button>

			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<>
					{/* Profile Image */}
					<div className="pt-8 pb-4 flex justify-center items-center mx-auto">
						<div className="w-64 h-64 bg-gray-200 rounded-lg overflow-hidden">
							<img
								src={
									receiverData?.imageURL ||
									"https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000"
								}
								alt="Profile"
								className="w-full h-full object-cover"
							/>
						</div>
					</div>

					{/* Profile Info */}
					<div className="px-6 pb-6">
						<div className="flex justify-center items-center gap-3 mb-6 text-gray-600">
							<Mail className="w-5 h-5 text-gray-400" />
							<a
								href={`mailto:${receiverData?.email}`}
								className="hover:text-gray-900 transition-colors"
							>
								{receiverData?.email}
							</a>
						</div>

						<Label className="text-gray-700 mb-4">Name</Label>
						<Input
							value={receiverData?.name || ""}
							className="text-2xl font-bold text-gray-900 mb-4 cursor-not-allowed"
							readOnly
						/>

						<Label className="text-gray-700  ">About</Label>
						<Textarea
							className="text-gray-500 mb-4 cursor-not-allowed"
							value={receiverData?.about || ""}
							readOnly
						/>

						<Label className="text-gray-700 mb-4 ">Image URL</Label>

						<Input
							placeholder="https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000"
							className=" pr-9 bg-background mb-4 cursor-not-allowed"
							value={receiverData?.imageURL || ""}
							readOnly
						/>
					</div>
				</>
			</Modal>
		</>
	);
};

export default ReceiverDataProfile;
