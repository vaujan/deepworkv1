"use client";

import React from "react";
import Link from "next/link";
import NavBar from "./_components/NavBar";
import { useTheme } from "next-themes";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { serif } from "@/lib/fonts";

export default function Home() {
	const { resolvedTheme } = useTheme();
	const [color, setColor] = React.useState("#ffffff");

	React.useEffect(() => {
		setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	}, [resolvedTheme]);

	return (
		<div className="flex flex-col justify-center items-center w-full min-h-screen">
			<FlickeringGrid
				className="absolute inset-0 -z-50 size-full [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
				squareSize={9}
				gridGap={6}
				color={color}
				maxOpacity={0.1}
				flickerChance={0.1}
			/>

			<NavBar />
			<div className="flex flex-col gap-4 justify-center items-center px-8 max-w-5xl">
				<h1 className={`mb-2 text-3xl font-medium text-center md:text-5xl`}>
					Get off the algorhytm by <br />
					<span className="text-">going deep.</span>
				</h1>
				<p
					className={`text-base text-center md:text-lg text-secondary-foreground`}
				>
					It is time for you to join the focused few and leave the distraced
					masses.
				</p>
				<Link href="/start">
					<Button size={"lg"}>
						Get Started <ArrowRight className="" />
					</Button>
				</Link>
			</div>
		</div>
	);
}
