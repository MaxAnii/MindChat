import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY!);

const sendAuthEmail = async (to: string, link: string) => {
	try {
		await resend.emails.send({
			from: process.env.SENDER_EMAIL!,
			to: to,
			replyTo: process.env.SENDER_EMAIL!,
			subject: "Login to Mind Chat",
			html: `<p>Click the link below to sign in (valid for 5 minutes):</p><p><a href="${link}">${link}</a></p>`,
		});

		console.log("Authentication email sent successfully to", to);
	} catch (error) {
		console.error("Error sending email:", error);
	}
};

export default sendAuthEmail;
