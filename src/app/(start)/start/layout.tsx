import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/_components/AppSidebar";
import React from "react";

export const metadata: Metadata = {
	title: "Progtrack",
	description: "Where your planning ends and actions starts",
};

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SidebarProvider>
			<div className="flex w-full md:py-2 ">
				<AppSidebar />
				<div
					className={`flex w-full md:shadow-xs shadow-red-500 antialiased md:border-1 overflow-hidden bg-background md:rounded-2xl`}
				>
					{children}
				</div>
			</div>
		</SidebarProvider>
	);
}
