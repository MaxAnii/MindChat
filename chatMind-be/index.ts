import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import prisma from "./lib/prisma";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);

app.post("/sign-up", async (req: Request, res: Response) => {
	const { email, firstName, lastName } = req.body;
	// check if email is already registered

	const userExists = await prisma.user.findUnique({
		where: { email },
	});

	if (userExists) {
		return res.status(400).json({ message: "Email already registered" });
	}

	const newUser = await prisma.user.create({
		data: {
			email,
			firstName,
			lastName,
		},
	});
	return res
		.status(201)
		.json({ message: "User created successfully", user: newUser });
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
