import { ChevronsUpDown, Laptop, LogOut, Plus, Settings } from "lucide-react";
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
import { DatabaseService } from "@/lib/database";
import { Input } from "@/components/ui/input";
import useAvatar from "@/hooks/use-avatar";
import { Workspace } from "@/lib/types";
import { LucideIcon } from "lucide-react";

// Interface for transformed workspace data used in the UI
interface WorkspaceItem {
	id: string;
	title: string;
	url: string;
	icon: LucideIcon;
}

export function AppSidebar() {
	const route = useRouter();
	const { user } = useUser();
	const { getUserAvatar, getUserDisplayName, getUserInitials } = useAvatar();

	const [newWorkspace, setNewWorkspace] = React.useState("");
	const [workspaces, setWorkspaces] = React.useState<WorkspaceItem[]>([]);
	const [isLoading, setIsLoading] = React.useState(false);

	// Fetch workspaces on component mount
	React.useEffect(() => {
		fetchWorkspaces();
	}, []);

	const fetchWorkspaces = async () => {
		try {
			setIsLoading(true);
			const workspacesData = await DatabaseService.getWorkspaces();
			if (workspacesData && workspacesData.length > 0) {
				// Transform the data to match the expected format
				const transformedWorkspaces = workspacesData.map(
					(workspace: Workspace) => ({
						id: workspace.id,
						title: workspace.name,
						url: `/workspace/${workspace.id}`,
						icon: Laptop, // Default icon for now
					})
				);
				setWorkspaces(transformedWorkspaces);
			}
		} catch (error) {
			console.error("Error fetching workspaces:", error);
			// Fallback to default workspaces
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddWorkspace = async () => {
		if (!newWorkspace.trim()) return;

		try {
			setIsLoading(true);
			// Pass the workspace name as a string
			const workspace = await DatabaseService.createWorkspace(newWorkspace);
			console.log("New workspace created✅:", workspace);

			// Refresh the workspaces list
			await fetchWorkspaces();

			// Clear the input
			setNewWorkspace("");
		} catch (error) {
			console.error("Error creating workspace:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleWorkspaceOnChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setNewWorkspace(event.target.value);
	};

	const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleAddWorkspace();
		}
	};

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
								<SidebarMenuItem key={item.id || item.title}>
									<SidebarMenuButton asChild>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
							<SidebarMenuItem>
								<Input
									placeholder="e.g Learning HTML/CSS"
									value={newWorkspace}
									onChange={handleWorkspaceOnChange}
									onKeyPress={handleKeyPress}
									disabled={isLoading}
								/>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									onClick={handleAddWorkspace}
									className="flex justify-center items-center w-full border-1 hover:border-accent"
									disabled={isLoading || !newWorkspace.trim()}
								>
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
