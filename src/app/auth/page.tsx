"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { supabase } from "@/lib/supabase";
import LoginNavBar from "../_components/LoginNavBar";
import Image from "next/image";

type AuthState = "sign in" | "sign up";

export default function Login() {
	const [authMethod, setAuthMethod] = React.useState<AuthState>("sign in");
	const [userEmail, setUserEmail] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(false);

	const handleMethodSwitch = () => {
		setAuthMethod(authMethod === "sign in" ? "sign up" : "sign in");
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!userEmail) {
			alert("Please enter your email address");
			return;
		}

		setIsLoading(true);

		try {
			const { error } = await supabase.auth.signInWithOtp({
				email: userEmail,
				options: {
					// redirect user to dedicated on boarding page
					emailRedirectTo: `${window.location.origin}/start`,
				},
			});

			if (error)
				console.error(
					"An error has occur during authentication",
					error.message
				);
			else {
				alert("Check the email for the magic link!");
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleOAuthSubmit = async () => {
		setIsLoading(true);
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/start`,
			},
		});

		if (error) {
			console.error("An error has occur:", error);
			setIsLoading(false);
			return;
		}
	};

	return (
		<div className="flex flex-col pb-32 justify-center items-center w-full min-h-screen">
			<LoginNavBar />

			<div className="flex flex-col gap-4 w-full justify-center items-center px-8 md:max-w-5xl">
				<Image
					src="/logo-frame-transparent.png"
					alt="Logo"
					width={1080}
					height={1080}
					className="size-32"
					priority
				/>
				<div className="text-center">
					<h3 className="font-medium">
						{authMethod === "sign in" ? "Sign in" : "Sign up"}
					</h3>
					<p className="text-sm text-secondary-foreground/50">
						{authMethod === "sign in"
							? "Enter your credentials to sign in"
							: "Create your account to get started"}
					</p>
				</div>

				<form
					className="flex flex-col gap-3 w-full max-w-sm"
					onSubmit={handleSubmit}
				>
					<Input
						onChange={(e) => setUserEmail(e.target.value)}
						placeholder="Email"
						type="email"
						value={userEmail}
						required
						disabled={isLoading}
					/>
					<Button type="submit" disabled={isLoading}>
						{isLoading
							? "Sending..."
							: authMethod === "sign in"
								? "Send Magic Link"
								: "Create Account"}
					</Button>
					<Separator className="bg-border/50" />
					<Button
						type="button"
						variant={"secondary"}
						onClick={handleGoogleOAuthSubmit}
						disabled={isLoading}
					>
						{isLoading ? "Connecting..." : "Continue with Google"}
					</Button>
				</form>

				<span className="text-secondary-foreground text-sm">
					{authMethod === "sign in" ? (
						<>
							New to our platform?{" "}
							<Button
								size={"sm"}
								variant={"link"}
								onClick={handleMethodSwitch}
								disabled={isLoading}
							>
								Create a new account
							</Button>
						</>
					) : (
						<>
							Already have an account?{" "}
							<Button
								size={"sm"}
								variant={"link"}
								onClick={handleMethodSwitch}
								disabled={isLoading}
							>
								Sign in instead
							</Button>
						</>
					)}
				</span>
			</div>
		</div>
	);
}
