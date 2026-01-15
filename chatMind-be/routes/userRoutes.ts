import e, { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import authMiddleware from "../middleware/authMiddleware";

import dotenv from "dotenv";

dotenv.config();
const router = Router();

interface AuthRequest extends Request {
	userId?: string;
	userEmail?: string;
}

// Update user profile
router.post(
	"/profile/update",
	authMiddleware,
	async (req: AuthRequest, res: Response) => {
		try {
			const { email, name, about, imageURL } = req.body;
			const userId = req?.userId ? parseInt(req.userId) : undefined;
			if (!userId) {
				return res.status(401).json({ error: "Unauthorized" });
			}

			const updatedUser = await prisma.user.update({
				where: { id: userId },
				data: {
					email,
					name,
					about,
					imageURL: imageURL
						? imageURL
						: "https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000",
				},
			});

			return res
				.status(200)
				.json({ message: "Profile updated successfully", user: updatedUser });
		} catch (error) {
			console.error("Error updating profile:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	}
);

router.get(
	"/search/new-contacts/:email",
	authMiddleware,
	async (req: AuthRequest, res: Response) => {
		try {
			const { email } = req.params;
			const currentUserId = req?.userId ? parseInt(req.userId) : undefined;
			const currentUserEmail = req?.userEmail;

			if (!currentUserId) {
				return res.status(401).json({ message: "Unauthorized" });
			}

			if (!email) {
				return res.status(400).json({ message: "Email parameter is required" });
			}

			if (email === currentUserEmail) {
				return res.status(400).json({ message: "You cannot search yourself" });
			}

			const users = await prisma.user.findMany({
				where: {
					email: {
						contains: email,
						mode: "insensitive", // LIKE %email% (case-insensitive)
					},
					NOT: [
						{
							contactsAsA: {
								some: {
									userBId: currentUserId,
								},
							},
						},
						{
							contactsAsB: {
								some: {
									userAId: currentUserId,
								},
							},
						},
					],
				},
				select: {
					id: true,
					email: true,
					name: true,
					imageURL: true,
				},
			});

			if (!users || users.length === 0) {
				return res.status(204).json({
					message: "No users found",
				});
			}

			return res.status(200).json({ users });
		} catch (err) {
			console.error("Search contact error:", err);
			return res.status(500).json({ message: "Internal server error" });
		}
	}
);

export default router;
