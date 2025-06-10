import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { sansSerif } from "@/lib/fonts";

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
			<html lang="en" suppressHydrationWarning>
				<AppSidebar />
				<body className={`${sansSerif.className} flex antialiased`}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{/* Sidebar Toggle and Theme is off  */}
						{/* <ThemeToggle />
						<SidebarTrigger /> */}
						{children}
					</ThemeProvider>
				</body>
			</html>
		</SidebarProvider>
	);
}
