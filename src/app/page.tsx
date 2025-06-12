"use client";

import React from "react";
import Link from "next/link";
import NavBar from "./_components/NavBar";
import { useTheme } from "next-themes";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
	const { resolvedTheme } = useTheme();
	const [color, setColor] = React.useState("#ffffff");

	React.useEffect(() => {
		setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	}, [resolvedTheme]);

	return (
		<div className="flex flex-col items-center justify-center w-full min-h-screen">
			<FlickeringGrid
				className="absolute inset-0 -z-50 size-full [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
				squareSize={9}
				gridGap={6}
				color={color}
				maxOpacity={0.1}
				flickerChance={0.1}
			/>

			<NavBar />
			<div className="flex flex-col items-center justify-center max-w-5xl gap-4">
				<h1 className={cn("mb-2 text-5xl font-medium text-center")}>
					In ever increasing distractions, <br /> <span>Go Deep</span>
				</h1>
				<p className="text-lg text-center text-secondary-foreground">
					It is time for you to join the focused few and leave the distraced
					masses.
				</p>
				<Link href="/start">
					<Button size={"lg"}>
						Get Started <ArrowRight />
					</Button>
				</Link>
			</div>
		</div>
	);
}
