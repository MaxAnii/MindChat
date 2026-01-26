import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/utils/axios";
import { useEffect } from "react";

interface PrivateRouteProps {
	children: React.ReactNode;
}

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate();

	const { isLoading, isError } = useQuery({
		queryKey: ["auth", "me"],
		queryFn: () => api.get("/auth/me").then((res) => res.data),
		retry: false,
	});

	useEffect(() => {
		if (isError) navigate("/auth");
	}, [isError]);

	if (isLoading) return <div>Loading...</div>;

	return <>{children}</>;
};

export default PrivateRoute;
