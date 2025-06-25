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

	const handleMethodSwitch = () => {
		setAuthMethod(authMethod === "sign in" ? "sign up" : "sign in");
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (authMethod === "sign in") {
			console.log("Auth sign in!", userEmail);
		} else {
			console.log("Auth sign up", userEmail);
		}
	};

	return (
		<div className="flex flex-col justify-center items-center w-full min-h-screen">
			<LoginNavBar />

			<div className="flex flex-col gap-4 justify-center items-center px-8 max-w-5xl">
				<div className="text-center">
					<h3 className="font-medium">Sign in</h3>
					<p className="text-sm text-secondary-foreground/50">
						Enter your credentials
					</p>
				</div>
				<form className="flex flex-col gap-3" action="">
					<Input
						onChange={(e) => setUserEmail(e.target.value)}
						placeholder="Email"
						type="email"
					/>
					<Button onSubmit={(e) => handleSubmit(e)}>Send Magic Link</Button>
					<Separator className="bg-border/50" />
					<Button variant={"secondary"}>Sign in with Google</Button>
				</form>

				<span className="text-secondary-foreground text-sm">
					{authMethod === "sign in" ? (
						<>
							New to our platform?{" "}
							<Button size={"sm"} variant={"link"}>
								Create a new account
							</Button>
						</>
					) : (
						<>
							New to our platform?{" "}
							<Button size={"sm"} variant={"link"}>
								Create a new account
							</Button>
						</>
					)}
				</span>
			</div>
		</div>
	);
}
