import { Resend } from "resend";
import { magicLinkEmailTemplate } from "../utils/magicLinkEmailTemplate";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY!);

const sendAuthEmail = async (to: string, link: string) => {
	try {
		const { data, error } = await resend.emails.send({
			from: "onboarding@resend.dev",
			to: [to],

			subject: "Login to Mind Chat",
			html: magicLinkEmailTemplate(link),
		});
		if (error) {
			console.error("Error sending email:", error);
			return;
		}
		console.log("Authentication email sent successfully to", to, data);
	} catch (error) {
		console.error("Error sending email:", error);
	}
};

export default sendAuthEmail;
