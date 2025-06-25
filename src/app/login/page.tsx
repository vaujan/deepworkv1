"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import React from "react";

export default function Login() {
	return (
		<div className="flex flex-col justify-center items-center w-full min-h-screen">
			<div className="flex flex-col gap-4 px-8 max-w-5xl">
				<div className="text-center">
					<h3 className="font-medium">Sign in</h3>
					<p className="text-sm text-muted-foreground/50">
						Enter your credentials
					</p>
				</div>

				<form className="flex flex-col gap-3" action="">
					<Input placeholder="Email" type="email" />
					<Button onClick={() => alert("Hello world!")}>Send Magic Link</Button>
					<Separator className="bg-border/50" />
					<Button variant={"secondary"}>Sign in with Google</Button>
				</form>
			</div>
		</div>
	);
}
