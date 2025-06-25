"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import React from "react";
import LoginNavBar from "../_components/LoginNavBar";

type AuthState = "sign in" | "sign up";

export default function Login() {
	const [authMethod, setAuthMethod] = React.useState<AuthState>("sign in");
	const [userEmail, setUserEmail] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(false);

	const handleMethodSwitch = () => {
		setAuthMethod(authMethod === "sign in" ? "sign up" : "sign in");
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!userEmail) {
			alert("Please enter your email address");
			return;
		}

		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			if (authMethod === "sign in") {
				console.log("Auth sign in!", userEmail);
				// TODO: Implement actual sign in logic
				alert("Magic link sent to your email!");
			} else {
				console.log("Auth sign up", userEmail);
				// TODO: Implement actual sign up logic
				alert("Account created! Please check your email for verification.");
			}
			setIsLoading(false);
		}, 1000);
	};

	const hadnleAuthSubmit = () => {
		setIsLoading(true);
		// TODO: Implement Google OAuth
		console.log("Google auth initiated");
		setTimeout(() => {
			alert("Google auth would be implemented here");
			setIsLoading(false);
		}, 1000);
	};

	return (
		<div className="flex flex-col justify-center items-center w-full min-h-screen">
			<LoginNavBar />

			<div className="flex flex-col gap-4 w-full justify-center items-center px-8 md:max-w-5xl">
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
						onClick={hadnleAuthSubmit}
						disabled={isLoading}
					>
						{isLoading ? "Connecting..." : "Sign in with Google"}
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
