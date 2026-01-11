import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import authMiddleware from "../middleware/authMiddleware";
import { searchMessages } from "../lib/pineconeClient";

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

			//  Normalize response for UI
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

// Get message history for a room
router.get(
	"/messages/:roomChatId",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			const { roomChatId } = req.params;
			const { around } = req.query;
			const userId = req?.userId;

			if (!userId) {
				return res.status(401).json({ error: "Unauthorized" });
			}

			// Verify user has access to this room
			const room = await prisma.contact.findUnique({
				where: { id: parseInt(roomChatId) },
			});

			if (!room || (room.userAId !== userId && room.userBId !== userId)) {
				return res
					.status(403)
					.json({ error: "Forbidden: No access to this room" });
			}

			let messages;

			// If `around` parameter is provided, load messages around that ID
			if (around) {
				const messageId = parseInt(around as string);

				// Get the target message to find its timestamp
				const targetMessage = await prisma.message.findUnique({
					where: { id: messageId },
				});

				if (!targetMessage) {
					return res.status(404).json({ error: "Message not found" });
				}

				// Load 50 messages before and 50 after the target message
				messages = await prisma.message.findMany({
					where: { roomChatId: parseInt(roomChatId) },
					include: {
						sender: {
							select: {
								id: true,
								name: true,
								email: true,
							},
						},
						receiver: {
							select: {
								id: true,
								name: true,
								email: true,
							},
						},
					},
					orderBy: { createdAt: "asc" },
					skip: 0,
					take: 101, // 50 before, target message, 50 after
				});

				// Filter to get messages around the target
				const targetIndex = messages.findIndex((m) => m.id === messageId);

				if (targetIndex !== -1) {
					const start = Math.max(0, targetIndex - 50);
					const end = Math.min(messages.length, targetIndex + 51);
					messages = messages.slice(start, end);
				}
			} else {
				// Default behavior: load last 100 messages
				messages = await prisma.message.findMany({
					where: { roomChatId: parseInt(roomChatId) },
					include: {
						sender: {
							select: {
								id: true,
								name: true,
								email: true,
							},
						},
						receiver: {
							select: {
								id: true,
								name: true,
								email: true,
							},
						},
					},
					orderBy: { createdAt: "asc" },
					take: 100, // Limit messages to last 100
				});
			}

			return res.status(200).json(messages);
		} catch (error) {
			console.error("Error fetching messages:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	}
);

// Semantic search for messages in a room
router.get(
	"/search/:roomChatId/:query",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			const { roomChatId, query } = req.params;
			const topK = "10";
			const userId = req?.userId;

			if (!userId) {
				return res.status(401).json({ error: "Unauthorized" });
			}

			if (!roomChatId || !query) {
				return res
					.status(400)
					.json({ error: "roomChatId and q (query) are required" });
			}

			const roomId = parseInt(roomChatId as string);
			const topKNum = parseInt(topK as string, 10);

			// Verify user has access to this room
			const room = await prisma.contact.findUnique({
				where: { id: roomId },
			});

			if (!room || (room.userAId !== userId && room.userBId !== userId)) {
				return res
					.status(403)
					.json({ error: "Forbidden: No access to this room" });
			}

			// Search Pinecone for similar messages
			const searchResults = await searchMessages(
				roomId,
				query as string,
				topKNum
			);
			console.log("Search query:", query);
			console.log("Search results:", searchResults);

			// Fetch full message details from DB
			const messageIds = searchResults.map((r) => r.messageId);
			const messages = await prisma.message.findMany({
				where: {
					id: { in: messageIds },
					roomChatId: roomId,
				},
				include: {
					sender: {
						select: { id: true, name: true, email: true },
					},
					receiver: {
						select: { id: true, name: true, email: true },
					},
				},
			});

			// Combine with scores
			const results = searchResults
				.map((result) => {
					const message = messages.find((m) => m.id === result.messageId);
					return {
						...message,
						score: result.score,
					};
				})
				.filter(Boolean); // Remove any nulls

			return res.status(200).json({ results });
		} catch (error) {
			console.error("Error searching messages:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	}
);

export default router;
