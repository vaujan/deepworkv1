import React from "react";
import NavBar from "./_components/NavBar";
import { serif } from "@/lib/fonts";
import LandingPageBackground from "@/components/LandingPageBackground";
import WaitingListForm from "@/components/WaitingListForm";
import { Badge } from "@/components/ui/badge";

export default function Home() {
	return (
		<div className="flex overflow-y-auto flex-col justify-center items-center w-full min-h-screen">
			<LandingPageBackground />
			<NavBar />
			<div className="flex flex-col gap-4 justify-center items-center px-8 max-w-5xl">
				<Badge variant={"secondary"} className="border border-border">
					Protecting your deep work time isn&apos;t expensive. Losing it is.
				</Badge>
				<h1
					className={`${serif.className} italic text-6xl tracking-tight font-medium text-center md:text-7xl`}
				>
					Stop Organizing Your Work. <br /> Start Doing It.
				</h1>
				<p
					className={`max-w-2xl text-lg text-center text-secondary-foreground`}
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

				<WaitingListForm />
				<span className="max-w-lg text-xs text-center md:text-sm text-muted-foreground">
					Get early access when we launch in Q3 2025 + 50% off your first 6
					months. <br /> No spam, unsubscribe anytime.
				</span>
			</div>
		</div>
	);
}
