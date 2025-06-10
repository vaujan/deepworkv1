import { LogOut, Plus, Settings } from "lucide-react";
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
import { Button } from "./ui/button";
import { Collapsible } from "./ui/collapsible";

// Menu workspaces.
const workspaces = [
	{
		title: "Learn Backend JavaScript",
		url: "#",
		emoji: "💻",
	},
	{
		title: "UTBK Prep",
		url: "#",
		emoji: "📔",
	},
	{
		title: "Boot.dev Course",
		url: "#",
		emoji: "🥾",
	},
];

export function AppSidebar() {
	return (
		<Sidebar variant="floating">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Workspaces</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{workspaces.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<span>{item.emoji}</span>
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
							<Button
								variant={"ghost"}
								className="border-border border-1 hover:border-accent"
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
						<LogOut />
					</Button>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
