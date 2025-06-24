import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function NavBar() {
	return (
		<nav className="fixed top-0 left-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo and Brand */}
				<div className="flex items-center space-x-3">
					<Link href="/" className="flex items-center space-x-2">
						<Image
							src="/logoframe-png.png"
							alt="Logo"
							width={32}
							height={32}
							className="h-8 w-8"
							priority
						/>
						<span className="text-base font-medium">deepflow.click</span>
					</Link>
				</div>

				{/* Navigation Links - Hidden on mobile */}
				<div className="hidden md:flex items-center space-x-6">
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
					<ThemeToggle />
					<Link href="/start">
						<Button size="sm" className="hidden sm:inline-flex">
							Get Started
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
							className="h-5 w-5"
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
