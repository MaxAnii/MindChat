import { Mail } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import api from "@/utils/axios";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

type UserProfile = {
	email: string;
	name: string;
	about: string;
	imageURL: string;
};

const UserProfileForm = () => {
	const { toast } = useToast();
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [about, setAbout] = useState("");
	const [imageURL, setImageURL] = useState("");
	const [showUpdateButton, setShowUpdateButton] = useState(false);

	const {
		data: user,
		isLoading,
		isError,
	} = useQuery<UserProfile>({
		queryKey: ["auth", "me"],
		queryFn: async () => {
			const { data } = await api.get("/auth/me");
			return data;
		},
		retry: false,
	});

	// Initialize state after data load
	useEffect(() => {
		if (!user) return;

		setEmail(user.email);
		setName(user.name);
		setAbout(user.about);
		setImageURL(user.imageURL);
	}, [user]);

	const profileMutation = useMutation({
		mutationFn: async (payload: UserProfile) => {
			const { data } = await api.post("/user/profile/update", payload);
			return data;
		},
		onSuccess: () => {
			toast({
				title: "Profile Updated",
				description: "Your profile has been updated successfully.",
			});
			setShowUpdateButton(false);
		},
		onError: () => {
			toast({
				title: "Update Failed",
				description: "Unable to update profile. Please try again.",
				variant: "destructive",
			});
		},
	});

	const handleProfileUpdate = (e: React.FormEvent) => {
		e.preventDefault();

		profileMutation.mutate({
			email,
			name,
			about,
			imageURL,
		});
	};

	// =======================
	// Detect Changes
	// =======================
	useEffect(() => {
		if (!user) return;

		const hasChanges =
			email !== user.email ||
			name !== user.name ||
			about !== user.about ||
			imageURL !== user.imageURL;

		setShowUpdateButton(hasChanges);
	}, [email, name, about, imageURL, user]);

	if (isLoading) {
		return <div className="h-36 text-center pt-20">Loading profile...</div>;
	}

	if (isError || !user) {
		toast({
			title: "Error",
			description: "Unable to load profile. Please try again.",
			variant: "destructive",
		});

		return (
			<div className="h-36 text-center pt-20 text-red-500">
				Error loading profile
			</div>
		);
	}

	return (
		<>
			{/* Profile Image */}
			<div className="pt-8 pb-4 flex justify-center items-center mx-auto">
				<div className="w-64 h-64 bg-gray-200 rounded-lg overflow-hidden">
					<img
						src={
							imageURL ||
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
						href={`mailto:${email}`}
						className="hover:text-gray-900 transition-colors"
					>
						{email}
					</a>
				</div>

				<Label className="text-gray-700 mb-4">Name</Label>
				<Input
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="text-2xl font-bold text-gray-900 mb-4"
				/>

				<Label className="text-gray-700  ">About</Label>
				<Textarea
					className="text-gray-500 mb-4"
					value={about}
					onChange={(e) => setAbout(e.target.value)}
				/>

				<Label className="text-gray-700 mb-4 ">Image URL</Label>

				<Input
					placeholder="https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000"
					className=" pr-9 bg-background mb-4"
					value={imageURL}
					onChange={(e) => setImageURL(e.target.value)}
				/>

				{showUpdateButton && (
					<Button onClick={handleProfileUpdate} className="w-full">
						{profileMutation.isPending ? "Updating..." : "Update Profile"}
					</Button>
				)}
			</div>
		</>
	);
};

export default UserProfileForm;
