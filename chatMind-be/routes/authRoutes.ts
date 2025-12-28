import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { createRandomToken, hashToken } from "../utils/createToken";
import sendAuthEmail from "../lib/mailer";
import { createRateLimiter } from "../middleware/rateLimiter";
import authMiddleware from "../middleware/authMiddleware";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const router = Router();

// helpers
const MAGIC_TOKEN_TTL_MS = 5 * 60 * 1000; // 5 minutes
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

router.post(
	"/sign-up",
	createRateLimiter({ windowMs: 60 * 1000, max: 5 }),
	async (req: Request, res: Response) => {
		try {
			const { email, firstName, lastName } = req.body;
			if (!email) return res.status(400).json({ message: "Email required" });

			let user = await prisma.user.findUnique({ where: { email } });
			if (!user) {
				user = await prisma.user.create({
					data: { email, name: firstName + " " + lastName, about: " " },
				});
			}

			// create magic token entry
			const rawToken = createRandomToken();
			const tokenHash = hashToken(rawToken);

			await prisma.magicToken.create({
				data: {
					userId: user.id,
					tokenHash,
					expiresAt: new Date(Date.now() + MAGIC_TOKEN_TTL_MS),
				},
			});

			const link = `${process.env.FRONTEND_URL}/verify-token/${rawToken}`;
			console.log("Magic link:", link);
			// send mail (don't await in blocking way in production — you can queue)
			await sendAuthEmail(email, link);

			return res.status(200).json({ message: "Magic link sent" });
		} catch (err: any) {
			console.error(err);
			return res.status(500).json({ message: "Internal server error" });
		}
	}
);

router.post(
	"/sign-in",
	createRateLimiter({ windowMs: 60 * 1000, max: 5 }),
	async (req: Request, res: Response) => {
		try {
			const { email } = req.body;
			if (!email) return res.status(400).json({ message: "Email required" });

			const user = await prisma.user.findUnique({ where: { email } });
			if (!user)
				return res.status(400).json({ message: "Email not registered" });

			const rawToken = createRandomToken();
			const tokenHash = hashToken(rawToken);

			await prisma.magicToken.create({
				data: {
					userId: user.id,
					tokenHash,
					expiresAt: new Date(Date.now() + MAGIC_TOKEN_TTL_MS),
				},
			});

			const link = `${process.env.FRONTEND_URL}/verify-token/${rawToken}`;
			console.log("Magic link:", link);
			await sendAuthEmail(email, link);

			return res.status(200).json({ message: "Magic link sent" });
		} catch (err: any) {
			console.error(err);
			return res.status(500).json({ message: "Internal server error" });
		}
	}
);

// Verify endpoint: user clicks link from email -> frontend calls this endpoint
router.post("/verify", async (req: Request, res: Response) => {
	try {
		const { token } = req.body;
		if (!token) return res.status(400).json({ message: "Token required" });

		const tokenHash = hashToken(token);
		const dbToken = await prisma.magicToken.findUnique({
			where: { tokenHash },
		});

		if (!dbToken)
			return res.status(400).json({ message: "Invalid or used token" });
		if (dbToken.used)
			return res.status(400).json({ message: "Token already used" });
		if (dbToken.expiresAt < new Date())
			return res.status(400).json({ message: "Token expired" });

		// mark token used
		await prisma.magicToken.update({
			where: { id: dbToken.id },
			data: { used: true },
		});

		// mark user verified (if not yet)
		await prisma.user.update({
			where: { id: dbToken.userId },
			data: { isVerified: true },
		});

		// create refresh session and set cookie
		const refreshToken = createRandomToken(48);
		const refreshTokenHash = hashToken(refreshToken);

		const session = await prisma.session.create({
			data: {
				userId: dbToken.userId,
				refreshTokenHash,
				expiresAt: new Date(Date.now() + SESSION_TTL_MS),
			},
		});

		// create access JWT (short-lived) — here we make it 15 minutes
		const accessToken = jwt.sign(
			{ userId: dbToken.userId },
			process.env.JWT_SECRET || "secret",
			{ expiresIn: "15m" }
		);

		// send cookies: httpOnly access token (short) and refresh token (httpOnly) to renew
		res.cookie("access_token", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 15 * 60 * 1000,
		});

		res.cookie("refresh_token", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: SESSION_TTL_MS,
		});

		return res.status(200).json({ message: "Authenticated" });
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({ message: "Internal server error" });
	}
});

// refresh token endpoint
router.post("/refresh", async (req: Request, res: Response) => {
	try {
		const refreshToken = req.cookies["refresh_token"];
		if (!refreshToken)
			return res.status(401).json({ message: "No refresh token" });

		const refreshTokenHash = hashToken(refreshToken);
		const session = await prisma.session.findUnique({
			where: { refreshTokenHash },
		});
		if (!session || session.revoked)
			return res.status(401).json({ message: "Invalid session" });
		if (session.expiresAt < new Date())
			return res.status(401).json({ message: "Session expired" });

		// issue new access token
		const accessToken = jwt.sign(
			{ userId: session.userId },
			process.env.JWT_SECRET || "secret",
			{ expiresIn: "15m" }
		);
		res.cookie("access_token", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 15 * 60 * 1000,
		});

		return res.json({ message: "Access token refreshed" });
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({ message: "Internal server error" });
	}
});

// logout (revoke session)
router.post("/logout", async (req: Request, res: Response) => {
	try {
		const refreshToken = req.cookies["refresh_token"];
		if (refreshToken) {
			const refreshTokenHash = hashToken(refreshToken);
			await prisma.session.updateMany({
				where: { refreshTokenHash },
				data: { revoked: true },
			});
		}

		res.clearCookie("access_token");
		res.clearCookie("refresh_token");
		return res.json({ message: "Logged out" });
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({ message: "Internal server error" });
	}
});

// get current user
router.get("/me", authMiddleware, async (req: any, res: Response) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.userId },
			select: {
				id: true,
				email: true,
				name: true,
				about: true,
				isVerified: true,
			},
		});
		if (!user) return res.status(404).json({ message: "User not found" });
		return res.json(user);
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({ message: "Internal server error" });
	}
});

export default router;
