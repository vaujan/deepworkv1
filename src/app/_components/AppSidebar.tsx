import { Book, CodeIcon, Laptop, LogOut, Plus, Settings } from "lucide-react";
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

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Workspaces</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{workspaces.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
							<Button
								variant={"ghost"}
								className="border-border border-1 hover:border-accent"
								size={"icon"}
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
						<SidebarMenuButton>
							<Settings />
							Settings
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-accent/50">
					<div className="flex flex-col">
						<span className="text-sm font-semibold text-foreground">
							Ahmad Fauzan
						</span>
						<p className="text-sm text-muted-foreground">ahmadojan@email.com</p>
					</div>
					<Button variant={"ghost"} size={"icon"}>
						<Link href="/">
							<LogOut />
						</Link>
					</Button>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
