import {
	Book,
	ChevronsUpDown,
	CodeIcon,
	Laptop,
	LogOut,
	Plus,
	Settings,
} from "lucide-react";
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
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

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
				{/* User profile & avatar */}

				<DropdownMenu>
					<DropdownMenuTrigger>
						<SidebarMenu>
							<Separator className="mb-1" />
							<SidebarMenuItem>
								<SidebarMenuButton
									className={`relative hover:bg-card active:bg-card active: hover:text-card-foreground`}
									size={"lg"}
								>
									<Avatar className="rounded-lg">
										<AvatarImage src={getUserAvatar()} />
										<AvatarFallback>{getUserInitials()}</AvatarFallback>
									</Avatar>
									<div className="flex flex-col">
										<span className="text-sm">{getUserDisplayName()}</span>
										<p className="text-xs text-muted-foreground">
											{user && user?.email}
										</p>
									</div>
									<ChevronsUpDown className="absolute right-3" />
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-56"
						side="right"
						align="end"
						sideOffset={24}
					>
						<DropdownMenuItem>
							<Settings />
							Settings
						</DropdownMenuItem>
						<Separator className="my-1" />
						<DropdownMenuItem variant="destructive" onClick={handleLogOut}>
							<LogOut />
							Log Out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
