import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post(
	"/send-first-message",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			const { userId } = req.body;
			const senderId = req?.userId;
			if (!senderId) {
				return res.status(401).json({ error: "Unauthorized" });
			}
			if (!userId) {
				return res.status(400).json({ error: "User ID is required" });
			}
			const firstMessage = await prisma.contact.create({
				data: {
					userAId: senderId,
					userBId: userId,
				},
			});

			const messageContent = "Hi there! 👋";
			await prisma.message.create({
				data: {
					roomChatId: firstMessage.id,
					senderId: senderId,
					receiverId: userId,
					content: messageContent,
				},
			});
			return res
				.status(200)
				.json({ message: "First message sent successfully" });
		} catch (error) {
			console.error("Error sending first message:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	}
);

router.get(
	"/contacts-list",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			const userId = req?.userId;
			if (!userId) {
				return res.status(401).json({ error: "Unauthorized" });
			}
			const contacts = await prisma.contact.findMany({
				where: {
					OR: [{ userAId: userId }, { userBId: userId }],
				},
				include: {
					userA: {
						select: {
							id: true,
							name: true,
							imageURL: true,
							email: true,
							about: true,
						},
					},
					userB: {
						select: {
							id: true,
							name: true,
							imageURL: true,
							email: true,
							about: true,
						},
					},
					roomChatId: {
						orderBy: { createdAt: "desc" },
						take: 1, //  last message only
						select: {
							roomChatId: true,
							content: true,
							createdAt: true,
							senderId: true,
						},
					},
				},
			});

			// 🔄 Normalize response for UI
			const formattedContacts = contacts.map((contact) => {
				const isUserA = contact.userAId === userId;
				const otherUser = isUserA ? contact.userB : contact.userA;

				return {
					contactId: contact.id, // roomChatId
					userId: otherUser.id,
					name: otherUser.name,
					imageURL: otherUser.imageURL,
					lastMessage: contact.roomChatId[0] || null,
					email: otherUser.email,
					about: otherUser.about,
				};
			});

			return res.status(200).json({ contacts: formattedContacts });
		} catch (error) {
			console.error("Error fetching contacts list:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	}
);

export default router;
