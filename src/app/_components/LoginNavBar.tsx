import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import React from "react";

export default function LoginNavBar() {
	return (
		<nav className="fixed top-0 left-0 z-50 h-32 w-full bg-card backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex justify-between items-center px-4 mx-auto max-w-5xl h-16 sm:px-6 lg:px-8">
				{/* Logo and Brand */}
				<div className="flex items-center space-x-3">
					<Link href="/" className="flex items-center space-x-2">
						{/* <Image
							src="/logoframe-png.png"
							alt="Logo"
							width={32}
							height={32}
							className="size-10"
							priority
						/> */}
						<span className="text-base  font-medium">deepflow.click</span>
					</Link>
				</div>
				<div className="flex items-center space-x-4">
					<ThemeToggle />
				</div>
			</div>
		</nav>
	);
}
