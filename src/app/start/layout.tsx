"use client";

// import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/_components/AppSidebar";
import React from "react";
import useUser from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { user, loading } = useUser();
	const { theme, setTheme } = useTheme();

	React.useEffect(() => {
		if (theme) setTheme("dark");
	}, []);

	if (!user || loading) {
		return (
			<div className="flex flex-col justify-center items-center w-full min-h-screen">
				<div className="flex flex-col gap-4 justify-center items-center px-8 w-full md:max-w-5xl">
					<div className="text-center">
						<h3 className="font-medium">
							{loading ? "Loading" : "Please sign in to continue"}
						</h3>
					</div>

					{!loading && !user && (
						<Link href="/auth">
							<Button type="button" className="w-full">
								Sign in
							</Button>
						</Link>
					)}
				</div>
			</div>
		);
	}

	return (
		<SidebarProvider>
			<div className="flex w-full md:py-2">
				<AppSidebar />
				<div
					className={`flex overflow-hidden w-full antialiased md:shadow-xs bg-background md:rounded-2xl`}
				>
					{children}
				</div>
			</div>
		</SidebarProvider>
	);
}
