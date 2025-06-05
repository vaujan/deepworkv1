import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Supabase and NextJS Grind",
	description: "Ultralearning Supabase and NextJS",
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
				<body className="flex antialiased">
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<div className="flex gap-4 p-2 flex-col h-full">
							<SidebarTrigger />
							<ThemeToggle />
						</div>
						{children}
					</ThemeProvider>
				</body>
			</html>
		</SidebarProvider>
	);
}
