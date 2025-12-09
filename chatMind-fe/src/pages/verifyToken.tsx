// pages/verify.tsx
import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

const VerifyToken = () => {
	const navigate = useNavigate();
	const params = useParams();
	const { data, error, isPending } = useQuery({
		queryKey: ["verifyToken", params.token],
		enabled: !!params.token, // only run if token exists
		queryFn: async () => {
			const res = await api.post("/auth/verify", { token: params.token });
			return res.data;
		},
	});

	useEffect(() => {
		if (isPending) return;

		if (error) {
			navigate("/auth");
			return;
		}

		if (data) {
			navigate("/chat");
		}
	}, [data, error, isPending]);

	return <div></div>;
};

export default VerifyToken;
