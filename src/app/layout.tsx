import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import React from "react";
import { sansSerif } from "@/lib/fonts";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
	title: "deepflow.click",
	description: "Focus on what matters",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${sansSerif.className} flex antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<SidebarProvider>{children}</SidebarProvider>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
