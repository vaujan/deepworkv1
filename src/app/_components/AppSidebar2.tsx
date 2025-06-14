import { Book, CodeIcon, Laptop, LogOut, Plus } from "lucide-react";
import React from "react";

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

export function AppSidebar2() {
	return (
		<Sidebar collapsible="icon">
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
								className="size-8 w-full border-border border-1 hover:border-accent"
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
						<Link href={"/"}>
							<SidebarMenuButton>
								<LogOut /> Log Out
							</SidebarMenuButton>
						</Link>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
