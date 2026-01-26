import { Plus, Search } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Modal from "../ui/Modal";
import api from "@/utils/axios";
import useDebounce from "@/hooks/use-debounce";
import SendFirstMessage from "./SendFirstMessage";

const AddNewContact = () => {
	const { toast } = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const [email, setEmail] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const debouncedEmail = useDebounce(email, 2000);
	const {
		data: newContacts,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["new-contacts", debouncedEmail],
		queryFn: async () => {
			setErrorMessage("");
			const response = await api.get(
				`/user/search/new-contacts/${debouncedEmail}`,
			);
			if (response.status === 204 || response.data.users.length === 0) {
				setErrorMessage("No users found with this email.");

				return { users: [] };
			}
			return response.data;
		},
		enabled: Boolean(debouncedEmail),
		staleTime: 5 * 60 * 1000,
	});

	useEffect(() => {
		if (isError) {
			toast({
				title: "Error",
				description: "Something went wrong while fetching users",
				variant: "destructive",
			});
		}
	}, [isError, debouncedEmail, newContacts]);

	useEffect(() => {
		if (email === "") {
			setErrorMessage("");
		}
	}, [email]);

	return (
		<>
			<Button variant="outline" size="icon" onClick={() => setIsOpen(true)}>
				<Plus className="w-5 h-5" />
			</Button>

			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<div className=" mx-auto">
					<h3 className="mx-4 mb-1 mt-4 text-xl font-light">Add New Chat</h3>
					<p className="text-sm mx-4 text-gray-500 mb-4">
						Connect with a new friend
					</p>

					<div className="relative w-[95%] mx-auto my-5">
						<Input
							placeholder="Enter email"
							className="pr-9"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					</div>

					<div className="p-4 border-t border-border h-96 overflow-auto">
						{errorMessage && (
							<p className="text-center text-red-500 mt-10">{errorMessage}</p>
						)}

						{newContacts?.users?.map((contact: any) => {
							return (
								<div
									key={contact.id}
									className="flex items-center justify-between"
								>
									<div className="flex items-center space-x-2">
										<img
											src={contact.imageURL}
											className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16"
										/>
										<div>
											<h4 className="font-medium">{contact.name}</h4>
											<p className="text-sm text-gray-500">{contact.email}</p>
										</div>
									</div>
									<SendFirstMessage userId={contact.id} />
								</div>
							);
						})}

						{newContacts?.user?.length === 0 && (
							<p className="text-center text-gray-500 mt-10">No users found.</p>
						)}

						{isError && (
							<p className="text-center text-red-500 mt-10">
								Error fetching users.
							</p>
						)}

						{isLoading && (
							<p className="text-center text-gray-500 mt-10">Seraching...</p>
						)}

						{!debouncedEmail && (
							<p className="text-center text-gray-500 mt-10">
								Connect with new people by searching their email.
							</p>
						)}
					</div>
				</div>
			</Modal>
		</>
	);
};

export default AddNewContact;
