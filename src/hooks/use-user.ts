import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import React from "react";
import { useRouter } from "next/navigation";

export default function useUser() {
	const [user, setUser] = React.useState<User | null>(null);
	const [loading, setLoading] = React.useState(true);
	const router = useRouter();

	React.useEffect(() => {
		const getInitialSession = async () => {
			try {
				const {
					data: { session },
				} = await supabase.auth.getSession();
				setUser(session?.user ?? null);

				// console.log("Initial session:", session);
			} catch (error) {
				console.error("Error getting initial session", error);
			} finally {
				setLoading(false);
			}
		};

		getInitialSession();

		const { data: authListener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				// console.log("Auth state changed:", event, session);
				setUser(session?.user ?? null);

				if (event === "SIGNED_OUT") {
					router.push("/auth");
				}
			}
		);

		return () => {
			authListener.subscription.unsubscribe();
		};
	}, []);

	return { user, loading };
}
