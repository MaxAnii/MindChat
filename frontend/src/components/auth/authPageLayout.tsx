import { Link } from "react-router-dom";
// import logo from "@/assets/talentickaiwhite.webp";
// import logo2 from "@/assets/talentick.ai.webp";
// import authPhoto from "@/assets/auth.webp";
// import MetaData from "@/components/MetaData";
import { MoveLeft } from "lucide-react";
import bgPhoto from "../../../public/authBg.jpg";
import logo from "../../../public/logo.svg";

const AuthPageLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			{/* <MetaData /> */}
			<div className="mx-auto   flex flex-col md:flex-row items-center  gap-8   bg-primary/10">
				{/* Mobile Logo */}
				<div className="w-full block md:hidden mb-6">
					<Link to="/" className="flex gap-2 items-center fixed top-10">
						<svg
							width="20"
							height="18"
							viewBox="0 0 14 14"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M10.0154 0.733154L4.23065 6.51518C3.93728 6.79466 3.93728 7.23137 4.23065 7.51085L10.0155 13.2928"
								stroke="#7F7F7F"
								strokeMiterlimit="2.613"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						<img src={logo} className="h-6 w-6" alt="Logo" />
						Mind Chat
					</Link>
				</div>

				{/* Left Side - Image and Text */}
				<div className="relative w-[50%] h-screen hidden md:block">
					<img
						src={bgPhoto}
						alt="Background"
						className=" w-full h-screen  object-cover  shadow-md"
					/>
					<div className="absolute inset-0 opacity-40 h-screen  bg-gray-600"></div>

					{/* Logo */}

					<Link
						to="/"
						className="fixed top-8 left-8 text-xl font-display inline-flex items-center gap-2 text-white "
					>
						<MoveLeft className="h-6 w-6" />
						<span className="text-2xl font-display font-bold">Mind Chat</span>
					</Link>

					{/* Centered Text Box */}
					<div className="absolute inset-0 flex flex-col items-center justify-center px-8">
						<div className="bg-primary/30 backdrop-blur-[70px] rounded-lg p-8 md:p-10 w-full max-w-[650px] text-white">
							<h2 className="text-2xl lg:text-5xl font-bold mb-4">
								Welcome to Mind Chat
							</h2>
							<p className="text-sm md:text-lg font-light">
								Experience the future of communication with Mind Chat, the
								AI-powered semantic search chat platform. Connect, share, and
								discover conversations like never before.
							</p>
						</div>
					</div>

					{/* Bottom text */}
					<div className="absolute bottom-8 w-full text-center text-white text-sm lg:text-base font-light">
						&copy; {new Date().getFullYear()} Mind Chat. All rights reserved.
					</div>
				</div>

				{/* Right Side - Form */}
				<div className="w-full md:w-[40%] overflow-auto  ">
					<div className="flex flex-col items-center justify-center  ">
						{children}
					</div>
				</div>
			</div>
		</>
	);
};

export default AuthPageLayout;
