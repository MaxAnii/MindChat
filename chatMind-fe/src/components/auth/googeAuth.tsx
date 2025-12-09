const GoogleAuth = () => {
	return (
		<div>
			{/* OR Divider */}

			<button
				type="button"
				// onClick={handleGoogleAuth}
				className="w-full flex items-center justify-center bg-[#F3F9FA]  font-semibold py-3 px-4 rounded-lg  hover:bg-gray-100 dark:hover:bg-zinc-600 transition"
			>
				<img
					src="https://www.svgrepo.com/show/355037/google.svg"
					alt="Google logo"
					className="h-5 w-5 mr-2"
				/>
				Continue with Google
			</button>
		</div>
	);
};

export default GoogleAuth;
