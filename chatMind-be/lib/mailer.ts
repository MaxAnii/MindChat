import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: Number(process.env.MAIL_PORT || 587),
	secure: false,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

export async function sendMagicLinkEmail(to: string, link: string) {
	const info = await transporter.sendMail({
		from: `"No Reply" <${process.env.MAIL_USER}>`,
		to,
		subject: "Your sign-in link",
		html: `<p>Click the link below to sign in (valid for 5 minutes):</p><p><a href="${link}">${link}</a></p>`,
	});
	return info;
}
