import GoogleAuth from "./googeAuth";

const SocialAuth = () => {
	return (
		<>
			<div className="flex items-center my-4">
				<div className="flex-grow border-t border-zinc-300 dark:border-zinc-600"></div>
				<span className="px-3 text-zinc-700 dark:text-zinc-300 text-sm font-medium">
					OR
				</span>
				<div className="flex-grow border-t border-zinc-300 dark:border-zinc-600"></div>
			</div>
			<GoogleAuth />
		</>
	);
};

export default SocialAuth;
