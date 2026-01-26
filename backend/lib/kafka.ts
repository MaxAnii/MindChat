import { Kafka } from "kafkajs";

const kafka = new Kafka({
	clientId: "chatmind-producer",
	brokers: ["localhost:9092"], // Adjust if needed
});

export const producer = kafka.producer();

export const connectProducer = async () => {
	await producer.connect();
};

export const disconnectProducer = async () => {
	await producer.disconnect();
};

export const sendMessageToKafka = async (topic: string, message: any) => {
	await producer.send({
		topic,
		messages: [{ value: JSON.stringify(message) }],
	});
};
