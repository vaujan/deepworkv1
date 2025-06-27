// import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function NavBar() {
	return (
		<nav className="fixed top-0 left-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex justify-between items-center px-4 mx-auto h-16 sm:px-6 lg:px-8">
				{/* Logo and Brand */}
				<div className="flex items-center space-x-3">
					<Link href="/" className="flex items-center space-x-2">
						<Image
							src="/logoframe-png.png"
							alt="Logo"
							width={1080}
							height={1080}
							className="size-12"
							priority
						/>
						<span className="text-base font-medium">deepflow.click</span>
					</Link>
				</div>

				{/* Navigation Links - Hidden on mobile */}
				<div className="hidden items-center space-x-6 md:flex">
					<Link href="/features">
						<Button variant="ghost" className="text-sm">
							Features
						</Button>
					</Link>
					<Link href="/pricing">
						<Button variant="ghost" className="text-sm">
							Pricing
						</Button>
					</Link>
					<Link href="/about">
						<Button variant="ghost" className="text-sm">
							About
						</Button>
					</Link>
				</div>

				{/* Right side - Theme toggle and CTA */}
				<div className="flex items-center space-x-4">
					{/* <ThemeToggle /> */}
					<Link href="/auth">
						<Button
							size="sm"
							variant={"secondary"}
							className="hidden sm:inline-flex"
						>
							Sign In
						</Button>
					</Link>

					{/* Mobile menu button - you can expand this later */}
					<Button
						variant="ghost"
						size="sm"
						className="md:hidden"
						aria-label="Toggle menu"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</Button>
				</div>
			</div>
		</nav>
	);
}
