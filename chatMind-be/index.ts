import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import { initializeSocketIO } from "./lib/socket";
import { connectProducer } from "./lib/kafka";
import { initializePinecone } from "./lib/pinecone";

dotenv.config();
const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);

// Initialize Pinecone
initializePinecone()
	.then(() => {
		console.log("Pinecone initialized");
	})
	.catch((err) => {
		console.error("Failed to initialize Pinecone:", err);
	});

// Initialize Socket.IO
initializeSocketIO(httpServer);

// Connect Kafka producer
connectProducer()
	.then(() => {
		console.log("Kafka producer connected");
	})
	.catch((err) => {
		console.error("Failed to connect Kafka producer:", err);
	});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

httpServer.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
