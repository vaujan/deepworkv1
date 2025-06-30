import useUser from "./use-user";

export default function useAvatar() {
	const { user } = useUser();

	const getUserDisplayName = () => {
		if (!user) return "User";

		// for Google based Auth, use email
		if (user.user_metadata?.full_name) return user.user_metadata.full_name;

		if (user.email) {
			return user.email.split("@")[0];
		}

		return "Use";
	};

	const getUserAvatar = () => {
		if (!user) return null;

		if (user.user_metadata?.avatar_url) {
			return user.user_metadata.avatar_url;
		}

		return null;
	};

	const getUserInitials = () => {
		const name = getUserDisplayName();
		return name
			.split(" ")
			.map((n: string) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return { getUserDisplayName, getUserAvatar, getUserInitials };
}
