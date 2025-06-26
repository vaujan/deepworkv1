import { Book, CodeIcon, Laptop, LogOut, Plus } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Menu workspaces.
const workspaces = [
	{
		title: "Learn Backend JavaScript",
		url: "#",
		icon: Laptop,
	},
	{
		title: "UTBK Prep",
		url: "#",
		icon: Book,
	},
	{
		title: "Boot.dev Course",
		url: "#",
		icon: CodeIcon,
	},
];

export function AppSidebar() {
	const route = useRouter();

	const handleLogOut = async () => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error("An error has occur during sign out:", error.message);
			return;
		} else {
			console.log("logging out");
			route.push("/");
		}
	};

	return (
		<Sidebar collapsible="icon" variant="inset">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Workspaces</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{workspaces.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
							<Button
								variant={"ghost"}
								className="w-full size-8 border-border border-1 hover:border-accent"
							>
								<Plus />
							</Button>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton onClick={handleLogOut}>
							<LogOut /> Log Out
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
