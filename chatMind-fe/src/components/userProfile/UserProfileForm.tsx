import { Image, Mail } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

const UserProfileForm = () => {
	return (
		<>
			{/* Profile Image */}
			<div className="pt-8 pb-4 flex justify-center items-center mx-auto">
				<div className="w-64 h-64 bg-gray-200 rounded-lg overflow-hidden">
					<img
						src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
						alt="Profile"
						className="w-full h-full object-cover"
					/>
				</div>
				{/* <input type="file" /> */}
			</div>

			{/* Contact Details */}

			{/* Profile Info */}
			<div className="px-6 pb-6">
				<div className="flex justify-center items-center gap-3 mb-6 text-gray-600">
					<Mail className="w-5 h-5 text-gray-400" />
					<a
						href="mailto:rrichards@virtuslab.com"
						className="hover:text-gray-900 transition-colors"
					>
						rrichards@virtuslab.com
					</a>
				</div>

				<Label className="text-gray-700 mb-4">Name</Label>
				<Input
					value={"Barrett Richards"}
					className="text-2xl font-bold text-gray-900 mb-4"
				/>

				<Label className="text-gray-700  ">About</Label>
				<Textarea
					className="text-gray-500 mb-4"
					value="Senior Product Designer"
				/>

				<Label className="text-gray-700 mb-4 ">Image URL</Label>

				<Input placeholder="Image URL" className=" pr-9 bg-background mb-4" />

				{/* <input type="file" /> */}
			</div>
		</>
	);
};

export default UserProfileForm;
