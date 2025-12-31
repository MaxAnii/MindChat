import { createContext, useEffect, useState } from "react";

export type ReceiverData = {
	id: number;
	email: string;
	name: string | null;
	about: string | null;
	imageURL: string | null;
};

type ReceiverDataContextType = {
	receiverData: ReceiverData | null;
	setReceiverData: React.Dispatch<React.SetStateAction<ReceiverData | null>>;
};

const ReciverDataContext = createContext<ReceiverDataContextType>({
	receiverData: null,
	setReceiverData: () => {},
});

export const ReciverDataProvider = ({
	children,
}: {
	children: React.ReactNode;
	data: ReceiverData | null;
}) => {
	const [receiverData, setReceiverData] = useState<ReceiverData | null>(null);

	return (
		<ReciverDataContext.Provider value={{ receiverData, setReceiverData }}>
			{children}
		</ReciverDataContext.Provider>
	);
};

export default ReciverDataContext;
