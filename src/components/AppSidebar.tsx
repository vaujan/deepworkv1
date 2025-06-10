import { LogOut, Plus } from "lucide-react";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardTitle,
} from "./ui/card";

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
				<div className="flex justify-between items-center rounded-lg hover:bg-accent/50 py-3 px-4">
					<div className="flex flex-col">
						<span className="text-sm text-foreground font-semibold">
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
