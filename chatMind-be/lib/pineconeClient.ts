import pc from "./pinecone";
import { pipeline, env } from "@xenova/transformers";

// Allow downloading models on first run, then cache locally
env.allowRemoteModels = true;
env.allowLocalModels = true;
env.localModelPath = "./.transformers";

const INDEX_NAME = process.env.PINECONE_INDEX || "quickstart-js";

// Initialize embedding pipeline (lazy load on first use)
let embeddingPipeline: any = null;

/**
 * Get or initialize the embedding pipeline.
 * Uses Xenova's transformers library with a pre-trained model.
 */
const getEmbeddingPipeline = async () => {
	if (!embeddingPipeline) {
		try {
			// Load a small, efficient embedding model
			embeddingPipeline = await pipeline(
				"feature-extraction",
				"Xenova/all-MiniLM-L6-v2" // 384-dimensional embeddings, very fast
			);
			console.log("Embedding model loaded successfully");
		} catch (error) {
			console.error("Failed to load embedding model:", error);
			throw error;
		}
	}
	return embeddingPipeline;
};

/**
 * Generate semantic embeddings for text using a transformer model.
 * @param text - Text to embed
 * @returns 384-dimensional embedding vector
 */
const generateEmbedding = async (text: string): Promise<number[]> => {
	try {
		const pipeline = await getEmbeddingPipeline();
		const embedding = await pipeline(text, {
			pooling: "mean",
			normalize: true,
		});

		// Convert to plain array if needed
		return Array.from(embedding.data);
	} catch (error) {
		console.error("Failed to generate embedding:", error);
		throw error;
	}
};

/**
 * Upsert a message embedding into Pinecone.
 * @param messageId - Unique message ID
 * @param text - Message content to embed
 * @param metadata - Additional metadata (roomChatId, senderId, etc.)
 */
export const upsertMessageEmbedding = async (
	messageId: number,
	text: string,
	metadata: Record<string, any>
) => {
	try {
		const embedding = await generateEmbedding(text);
		const index = pc.index(INDEX_NAME);

		await index.upsert([
			{
				id: `message:${messageId}`,
				values: embedding,
				metadata: {
					messageId,
					text,
					...metadata,
				},
			},
		]);
		console.log(
			`Upserted semantic embedding for message ${messageId} (dim: ${embedding.length})`
		);
	} catch (error) {
		console.error(
			`Failed to upsert embedding for message ${messageId}:`,
			error
		);
		// Don't throw — allow message save to continue
	}
};

/**
 * Search for similar messages in a specific room.
 * @param roomChatId - Filter to this conversation
 * @param query - Search query string
 * @param topK - Number of results to return
 * @param minScore - Minimum similarity score (0-1), default 0.3
 * @returns Array of { messageId, score, metadata }
 */
export const searchMessages = async (
	roomChatId: number,
	query: string,
	topK: number = 10,
	minScore: number = 0.3
) => {
	try {
		const queryEmbedding = await generateEmbedding(query);
		const index = pc.index(INDEX_NAME);

		const response = await index.query({
			vector: queryEmbedding,
			topK: topK * 2, // Query more to filter by score threshold
			filter: {
				roomChatId: { $eq: roomChatId },
			},
			includeMetadata: true,
		});

		// Filter by minimum similarity score and limit to topK
		const filteredResults =
			response.matches
				?.filter((match) => (match.score || 0) >= minScore)
				.slice(0, topK)
				.map((match) => ({
					messageId: match.metadata?.messageId as number,
					score: match.score || 0,
					metadata: match.metadata,
				})) || [];

		console.log(
			`Found ${filteredResults.length} semantically similar messages (min score: ${minScore})`
		);
		return filteredResults;
	} catch (error) {
		console.error("Failed to search messages:", error);
		return [];
	}
};
