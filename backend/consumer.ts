import dotenv from "dotenv";
import { connectConsumer } from "./lib/kafkaConsumer";

dotenv.config();

const startConsumer = async () => {
	try {
		await connectConsumer();
		console.log("Kafka consumer started");
	} catch (error) {
		console.error("Failed to start consumer:", error);
		process.exit(1);
	}
};

startConsumer();

// Graceful shutdown
process.on("SIGINT", async () => {
	console.log("Shutting down consumer...");
	process.exit(0);
});

process.on("SIGTERM", async () => {
	console.log("Shutting down consumer...");
	process.exit(0);
});
