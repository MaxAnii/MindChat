import { Kafka } from "kafkajs";
import prisma from "./prisma";
import { upsertMessageEmbedding } from "./pineconeClient";

const kafka = new Kafka({
	clientId: "chatmind-consumer",
	brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "message-group" });

export const connectConsumer = async () => {
	await consumer.connect();
	await consumer.subscribe({ topic: "messages", fromBeginning: false });

	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			try {
				const messageData = JSON.parse(message.value?.toString() || "{}");

				// Save message to database
				const savedMessage = await prisma.message.create({
					data: {
						roomChatId: messageData.roomChatId,
						senderId: messageData.senderId,
						receiverId: messageData.receiverId,
						content: messageData.content,
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

				console.log("Message saved to DB:", savedMessage.id);

				// Upsert embedding to Pinecone for semantic search
				await upsertMessageEmbedding(savedMessage.id, savedMessage.content, {
					roomChatId: savedMessage.roomChatId,
					senderId: savedMessage.senderId,
					receiverId: savedMessage.receiverId,
					createdAt: savedMessage.createdAt.toISOString(),
				});
			} catch (error) {
				console.error("Error processing message:", error);
			}
		},
	});
};

export const disconnectConsumer = async () => {
	await consumer.disconnect();
};
