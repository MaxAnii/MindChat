import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/utils/axios";
import { useEffect } from "react";

interface PrivateRouteProps {
	children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
	const navigate = useNavigate();
	const { data, isLoading, error } = useQuery({
		queryKey: ["auth", "me"],
		queryFn: async () => {
			const res = await api.get("/auth/me");
			return res.data;
		},
		retry: false,
	});

	useEffect(() => {
		if (error) {
			return navigate("/auth");
		}
		console.log(isLoading, error);
	}, [data, isLoading, error]);
	return <>{isLoading ? <div>Loading...</div> : children}</>;
};

export default PrivateRoute;
