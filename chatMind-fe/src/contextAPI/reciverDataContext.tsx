import useDebounce from "@/hooks/use-debounce";
import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export type ReceiverData = {
	id: number;
	userId: number;
	email: string;
	name: string | null;
	about: string | null;
	imageURL: string | null;
	lastMessage: { content: string } | null;
};

type ReceiverDataContextType = {
	receiverData: ReceiverData | null;
	setReceiverData: React.Dispatch<React.SetStateAction<ReceiverData | null>>;
	queryKey: string;
	setQueryKey: React.Dispatch<React.SetStateAction<string>>;
	contactsList: { contacts: ReceiverData[] };
};

const ReciverDataContext = createContext<ReceiverDataContextType>({
	receiverData: null,
	setReceiverData: () => {},
	queryKey: "",
	setQueryKey: () => {},
	contactsList: { contacts: [] },
});

export const ReciverDataProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const location = useLocation();

	const [queryKey, setQueryKey] = useState("");
	const debouncedQuery = useDebounce(queryKey, 2000);
	const [receiverData, setReceiverData] = useState<ReceiverData | null>(null);
	const { data, isLoading, isError } = useQuery({
		queryKey: ["messages", debouncedQuery],
		queryFn: async () => {
			const res = await api.get(
				`/chat/contacts-list?userQuery=${debouncedQuery}`
			);
			return res.data;
		},
	});

	useEffect(() => {
		if (location.pathname.includes("/chat/") && data) {
			const reciverId = location.pathname.split("/chat/")[1].split("/")[0];
			const userId = Number(reciverId);
			const selectedUser = data?.contacts?.find(
				(user: ReceiverData) => user.userId === userId
			);
			if (selectedUser) {
				setReceiverData(selectedUser);
			}
		}
	}, [location.pathname, data]);

	return (
		<ReciverDataContext.Provider
			value={{
				receiverData,
				setReceiverData,
				queryKey,
				setQueryKey,
				contactsList: data || [],
			}}
		>
			{children}
		</ReciverDataContext.Provider>
	);
};

export default ReciverDataContext;
