import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/_components/AppSidebar";
import { AppSidebar2 } from "@/app/_components/AppSidebar2";
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
				{/* <AppSidebar /> */}
				<AppSidebar2 />
				<body className={`${sansSerif.className} flex antialiased`}>
					{children}
				</body>
			</html>
		</SidebarProvider>
	);
}
