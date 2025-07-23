"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAvatar from "@/hooks/use-avatar";
import useUser from "@/hooks/use-user";

export default function NavBar() {
	const { user } = useUser();
	const { getUserAvatar, getUserDisplayName, getUserInitials } = useAvatar();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// const toggleMobileMenu = () => {
	// 	setIsMobileMenuOpen(!isMobileMenuOpen);
	// };

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	return (
		<nav className="fixed top-0 left-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex justify-between items-center px-4 mx-auto h-16 sm:px-6 lg:px-8">
				{/* Logo and Brand */}
				<div className="flex items-center space-x-3">
					<Link
						href="/"
						className="flex items-center space-x-2"
						onClick={closeMobileMenu}
					>
						<Image
							src="/logo-frame-transparent.png"
							alt="deepflow.click logo"
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
					{/* <Link href="/features">
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
					</Link> */}
				</div>

				{/* Right side - Theme toggle and CTA */}
				<div className="flex items-center space-x-4">
					{/* <ThemeToggle /> */}
					{user ? (
						<Link href={"/workspace"}>
							<Button
								className="inline-flex py-5 px-2 pl-0 "
								variant={"ghost"}
								size={"sm"}
							>
								<Avatar className="rounded-lg">
									<AvatarImage src={getUserAvatar()} />
									<AvatarFallback>{getUserInitials()}</AvatarFallback>
								</Avatar>
								<div className="flex flex-col justify-start text-left">
									<span className="text-sm">{getUserDisplayName()}</span>
									<p className="text-xs text-muted-foreground">
										{user && user?.email}
									</p>
								</div>
							</Button>
						</Link>
					) : (
						<Button
							size="sm"
							variant={"secondary"}
							className="hidden sm:inline-flex"
							disabled
						>
							Sign In
						</Button>
					)}

					{/* Mobile menu button */}
					{/* 					<Button
						variant="ghost"
						size="sm"
						className="md:hidden"
						aria-label="Toggle menu"
						onClick={toggleMobileMenu}
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
					</Button> */}
				</div>
			</div>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
					<div className="container px-4 py-4 space-y-3">
						{/* <Link href="/features" onClick={closeMobileMenu}>
							<Button variant="ghost" className="w-full justify-start text-sm">
								Features
							</Button>
						</Link>
						<Link href="/pricing" onClick={closeMobileMenu}>
							<Button variant="ghost" className="w-full justify-start text-sm">
								Pricing
							</Button>
						</Link>
						<Link href="/about" onClick={closeMobileMenu}>
							<Button variant="ghost" className="w-full justify-start text-sm">
								About
							</Button>
						</Link> */}{" "}
						{/* {!user && (
							<Link href="/auth" onClick={closeMobileMenu}>
								<Button
									variant="secondary"
									className="w-full justify-start text-sm"
								>
									Sign In
								</Button>
							</Link>
						)} */}
					</div>
				</div>
			)}
		</nav>
	);
}
