"use client";

import React from "react";
import NavBar from "./_components/NavBar";
import { useTheme } from "next-themes";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { serif } from "@/lib/fonts";
import { DatabaseService } from "@/lib/database";
import { toast } from "sonner";
import { CheckCircle, Loader2 } from "lucide-react";

export default function Home() {
	const { resolvedTheme } = useTheme();
	const [color, setColor] = React.useState("#ffffff");
	const [email, setEmail] = React.useState("");
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	React.useEffect(() => {
		setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	}, [resolvedTheme]);

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
		<div className="flex overflow-y-auto flex-col justify-center items-center w-full min-h-screen">
			<FlickeringGrid
				className="fixed inset-0 -z-50 size-full [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
				squareSize={9}
				gridGap={6}
				color={color}
				maxOpacity={0.1}
				flickerChance={0.1}
			/>

			<NavBar />
			<div className="flex flex-col gap-4 justify-center items-center px-8 max-w-5xl">
				<span
					className={`text-sm mb-4 bg-card rounded-full px-2 text-muted-foreground py-1 border-border/50 border ${serif.className} `}
				>
					Protecting your deep work time isn&apos;t expensive. Losing it is.
				</span>
				<h1
					className={`${serif.className} text-4xl font-medium italic text-center md:text-5xl`}
				>
					Stop Organizing Your Work. <br /> Start Doing It.
				</h1>
				<p
					className={`max-w-2xl text-base text-center text-secondary-foreground`}
				>
					The customizable workspace that helps you focus on what matters:
					making actual progress, not perfect productivity systems.
				</p>

				{/* Mockup Image Placeholder */}
				{/* <div className="mt-8 mb-8 w-full max-w-4xl">
					<div className="flex relative justify-center items-center w-full h-64 bg-gradient-to-br rounded-lg border md:h-96 from-muted/50 to-muted/30 border-border/50">
						<div className="text-center">
							<p className="text-sm text-muted-foreground">Product Mockup</p>
							<p className="mt-1 text-xs text-muted-foreground/70">
								Coming soon
							</p>
						</div>
					</div>
				</div> */}

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
				<span className="max-w-lg text-xs text-center text-muted-foreground">
					Get early access when we launch in Q3 2025 + 50% off your first 6
					months. <br /> No spam, unsubscribe anytime.
				</span>
			</div>
		</div>
	);
}
