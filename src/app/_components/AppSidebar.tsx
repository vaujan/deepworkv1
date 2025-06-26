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
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import useUser from "@/hooks/use-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
	const { user } = useUser();

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

	const getUserDisplayName = () => {
		if (!user) return "User";

		// for Google based Auth, use email
		if (user.user_metadata?.full_name) return user.user_metadata.full_name;

		if (user.email) {
			return user.email.split("@")[0];
		}

		return "Use";
	};

	const getUserAvatar = () => {
		if (!user) return null;

		if (user.user_metadata?.avatar_url) {
			return user.user_metadata.avatar_url;
		}

		return null;
	};

	const getUserInitials = () => {
		const name = getUserDisplayName();
		return name
			.split(" ")
			.map((n: string) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
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
							<SidebarMenu></SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton className="w-full border-1 hover:border-accent flex justify-center items-center">
									<Plus />
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<div className="flex items-center py-4 border-b gap-3">
						<Avatar className="size-8 border-1">
							<AvatarImage
								src={getUserAvatar() || undefined}
								alt={getUserDisplayName()}
							/>
							<AvatarFallback className="text-sm font-medium">
								{getUserInitials()}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col min-w-0">
							<p className="text-sm font-medium truncate">
								{getUserDisplayName()}
							</p>
							<p className="text-xs text-muted-foreground truncate">
								{user?.email}
							</p>
						</div>
					</div>
				</SidebarMenu>

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
