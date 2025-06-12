import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function NavBar() {
	return (
		<div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full ">
			<div className="w-full max-w-5xl px-8 py-4 bg-cardc">
				<ThemeToggle />

				<Link href="#">
					<Button variant="link">Hello world</Button>
				</Link>
			</div>
		</div>
	);
}
