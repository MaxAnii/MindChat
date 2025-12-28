import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
	userId?: string;
}

const authMiddleware = (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	const token = req.cookies["access_token"];
	if (!token) {
		return res.status(401).json({ message: "No access token" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
			userId: string;
		};
		req.userId = decoded.userId;
		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid token" });
	}
};

export default authMiddleware;
