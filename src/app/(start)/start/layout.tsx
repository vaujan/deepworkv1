import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar2 } from "@/app/_components/AppSidebar2";
import React from "react";

export const metadata: Metadata = {
	title: "Progtrack",
	description: "Where your planning ends and actions starts",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SidebarProvider>
			<div className="flex w-full ">
				{/* <AppSidebar /> */}
				<AppSidebar2 />
				<div className={`flex w-full antialiased`}>{children}</div>
			</div>
		</SidebarProvider>
	);
}
