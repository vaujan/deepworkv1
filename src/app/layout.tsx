import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { sansSerif } from "@/lib/fonts";

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
				<body className={`${sansSerif.className} flex antialiased`}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<div className="flex flex-col h-full gap-4 p-2">
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
