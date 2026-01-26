import { useContext } from "react";
import ReciverDataContext from "@/contextAPI/reciverDataContext";

const useReciverData = () => {
	const context = useContext(ReciverDataContext);

	if (!context) {
		throw new Error("useReciverData must be used within ReciverDataProvider");
	}

	return context;
};

export default useReciverData;
