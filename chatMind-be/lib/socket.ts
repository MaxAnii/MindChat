import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import { sendMessageToKafka } from "./kafka";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

interface OnlineUser {
	userId: number;
	socketId: string;
}

export const initializeSocketIO = async (httpServer: HTTPServer) => {
	const io = new Server(httpServer, {
		cors: {
			origin: process.env.FRONTEND_URL || "http://localhost:5173",
			methods: ["GET", "POST"],
			credentials: true,
		},
		transports: ["websocket", "polling"],
	});

	// Use Redis adapter for scaling (optional)
	const rawRedisHost = process.env.REDIS_HOST || "localhost";
	const rawRedisPort = process.env.REDIS_PORT || "6379";
	const redisPassword = process.env.REDIS_PASSWORD || undefined;
	// Trim possible surrounding quotes in .env values
	const redisHost = String(rawRedisHost).replace(/^['\"]|['\"]$/g, "");
	const redisPort = parseInt(
		String(rawRedisPort).replace(/^['\"]|['\"]$/g, ""),
		10,
	);

	// Create Redis clients
	const pubClient = createClient({
		url: `redis://${redisHost}:${redisPort}`,
		password: redisPassword,
	});

	const subClient = pubClient.duplicate();

	// Connect Redis
	await Promise.all([pubClient.connect(), subClient.connect()]);

	// Attach Redis adapter so Socket.IO can coordinate across nodes
	try {
		io.adapter(createAdapter(pubClient, subClient));
		console.log("Socket.IO Redis adapter attached");
	} catch (err) {
		console.error("Failed to attach Redis adapter:", err);
	}

	// Middleware to verify user token on connection
	io.use(async (socket: Socket, next) => {
		try {
			const token = socket.handshake.auth.token;
			if (!token) {
				return next(new Error("Authentication token required"));
			}

			const userId = socket.handshake.auth.userId;
			if (!userId) {
				return next(new Error("User ID required"));
			}

			socket.data.userId = userId;
			next();
		} catch (err) {
			next(new Error("Authentication failed"));
		}
	});

	io.on("connection", (socket: Socket) => {
		const userId = socket.data.userId;
		console.log(`User ${userId} connected with socket ${socket.id}`);

		// Join per-user room so emits reach this user's sockets across all nodes
		socket.join(`user:${userId}`);

		// Store socket id(s) in Redis so other processes / tools can query online state
		(async () => {
			try {
				// Add this socket id to the user's socket set
				await pubClient.sAdd(`userSockets:${userId}`, socket.id);
				// Track that this user is online (set of userIds)
				await pubClient.sAdd(`online_users`, String(userId));
				// Emit the full online users list so the CONNECTING client can initialize their state
				const members = await pubClient.sMembers(`online_users`);
				const numericMembers = members
					.map((m) => parseInt(m, 10))
					.filter((n) => !isNaN(n));
				// Send only to the connecting socket to avoid unnecessary global broadcasts
				socket.emit("onlineUsers", numericMembers);
			} catch (err) {
				console.error("Error storing socket id in Redis:", err);
			}
		})();

		// Notify others this user is online (client should handle adding to list)
		io.emit("userOnline", userId);

		// Handle sending a message
		socket.on("sendMessage", async (data: any) => {
			try {
				const { receiverId, content, roomChatId, id } = data;

				// Create message object for real-time emission
				const messageData = {
					roomChatId,
					senderId: userId,
					receiverId,
					content,
					createdAt: new Date(),
				};

				// Publish message to Kafka for async processing
				await sendMessageToKafka("messages", messageData);

				// Send message to receiver across cluster (room per user)
				io.to(`user:${receiverId}`).emit("receiveMessage", {
					...messageData,
					sender: { id: userId, name: "", email: "" }, // Will be populated by consumer
					receiver: { id: receiverId, name: "", email: "" },
				});

				// Send confirmation to sender
				socket.emit("messageSent", {
					success: true,
					message: messageData,
				});
			} catch (error) {
				console.error("Error sending message:", error);
				socket.emit("messageError", {
					success: false,
					error: "Failed to send message",
				});
			}
		});

		// Handle typing indicator
		// Handle typing indicator
		socket.on("userTyping", (data: any) => {
			const { receiverId, isTyping } = data;
			io.to(`user:${receiverId}`).emit("userTyping", {
				senderId: userId,
				isTyping,
			});
			console.log(`userTyping emitted to user:${receiverId}`);
		});

		// Handle message read receipt
		socket.on("messageRead", async (data: any) => {
			try {
				const { messageId, senderId } = data;
				io.to(`user:${senderId}`).emit("messageReadReceipt", {
					messageId,
					readBy: userId,
				});
			} catch (error) {
				console.error("Error marking message as read:", error);
			}
		});

		// Handle disconnect
		socket.on("disconnect", () => {
			console.log(`User ${userId} disconnected (socket ${socket.id})`);

			// Clean up Redis entries for this socket
			(async () => {
				try {
					await pubClient.sRem(`userSockets:${userId}`, socket.id);

					io.emit("userOffline", userId);

					// No more sockets for this user — consider them offline
					await pubClient.sRem(`online_users`, String(userId));
					await pubClient.del(`userSockets:${userId}`);
				} catch (err) {
					console.error("Error cleaning socket id from Redis:", err);
				}
			})();

			// Leave per-user room
			io.socketsLeave(`user:${userId}`);
		});

		// Handle error
		socket.on("error", (error) => {
			console.error("Socket error:", error);
		});
	});

	return io;
};
