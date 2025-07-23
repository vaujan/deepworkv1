"use client";

import React from "react";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { CheckCircle, Loader2 } from "lucide-react";
import { DatabaseService } from "@/lib/database";
import { Button } from "./ui/button";

export default function WaitingListForm() {
	const [email, setEmail] = React.useState("");
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const handleJoinWaitlist = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Basic email validation
		if (!email || !email.includes("@")) {
			toast.error("Invalid email", {
				description: "Please enter a valid email address.",
			});
			return;
		}

		setIsSubmitting(true);

		try {
			const result = await DatabaseService.joinWaitList(email);

			if (result) {
				if (result.isExisting) {
					toast.info("Already on the waitlist!", {
						description:
							"You're already signed up. We'll notify you when we launch!",
					});
				} else {
					toast.success("Successfully joined!", {
						description:
							"You're now on the waitlist. We'll notify you when we launch!",
					});
				}
				setEmail(""); // Clear the form
			} else {
				toast.error("Something went wrong", {
					description: "Please try again later.",
				});
			}
		} catch (error) {
			console.error("Error joining waitlist:", error);
			toast.error("Error", {
				description: "Failed to join waitlist. Please try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};
	return (
		<form
			className="flex flex-col gap-2 mt-8 w-full border-r-0 md:w-fit md:flex-row md:gap-0"
			onSubmit={handleJoinWaitlist}
		>
			<Input
				type="text"
				placeholder="johndoe@email.com"
				value={email}
				onChange={handleEmailChange}
				className="md:border-r-0 md:rounded-r-none"
				disabled={isSubmitting}
				required
			/>
			<Button
				className="md:rounded-l-none"
				disabled={isSubmitting}
				type="submit"
			>
				{isSubmitting ? (
					<>
						<Loader2 className="mr-2 w-4 h-4 animate-spin" />
						Joining...
					</>
				) : (
					<>
						<CheckCircle className="mr-2 w-4 h-4" />
						Join the waitlist
					</>
				)}
			</Button>
		</form>
	);
}
