import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

// Create or get index with correct embedding dimensions
const indexName = process.env.PINECONE_INDEX || "quickstart-js";
const EMBEDDING_DIMENSION = 384; // Xenova/all-MiniLM-L6-v2 outputs 384-dim vectors

export const initializePinecone = async () => {
	try {
		// Check if index exists
		const indexes = await pc.listIndexes();
		const indexExists = indexes.indexes?.some((idx) => idx.name === indexName);

		if (!indexExists) {
			console.log(
				`Index '${indexName}' not found. Creating with dimension ${EMBEDDING_DIMENSION}...`
			);
			await pc.createIndex({
				name: indexName,
				dimension: EMBEDDING_DIMENSION,
				spec: {
					serverless: {
						cloud: "aws",
						region: "us-east-1",
					},
				},
				metric: "cosine",
			});
			console.log(
				`Index '${indexName}' created successfully with ${EMBEDDING_DIMENSION} dimensions`
			);
		} else {
			// Check if existing index has correct dimension
			const indexDesc = await pc.describeIndex(indexName);
			if (indexDesc.dimension !== EMBEDDING_DIMENSION) {
				console.warn(
					`Index '${indexName}' has dimension ${indexDesc.dimension}, but expected ${EMBEDDING_DIMENSION}.`
				);
				console.warn(
					`Deleting and recreating index with correct dimensions...`
				);
				await pc.deleteIndex(indexName);
				await pc.createIndex({
					name: indexName,
					dimension: EMBEDDING_DIMENSION,
					spec: {
						serverless: {
							cloud: "aws",
							region: "us-east-1",
						},
					},
					metric: "cosine",
				});
				console.log(
					`Index '${indexName}' recreated with ${EMBEDDING_DIMENSION} dimensions`
				);
			} else {
				console.log(
					`Index '${indexName}' exists with correct dimension (${EMBEDDING_DIMENSION})`
				);
			}
		}
	} catch (error) {
		console.error("Failed to initialize Pinecone index:", error);
		throw error;
	}
};

export default pc;
