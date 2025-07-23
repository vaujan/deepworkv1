import {
	ChevronsUpDown,
	Laptop,
	LogOut,
	Plus,
	Settings,
	Edit2,
	Trash2,
	Check,
	X,
} from "lucide-react";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useWorkspaceBoard } from "@/hooks/use-workspace-board";

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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Interface for transformed workspace data used in the UI
interface WorkspaceItem {
	id: string;
	title: string;
	url: string;
}

export default function AppSidebar() {
	const route = useRouter();
	const pathname = usePathname();
	const { user } = useUser();
	const { getUserAvatar, getUserDisplayName, getUserInitials } = useAvatar();
	const { prefetch } = useWorkspaceBoard(null); // Just for prefetch function

	const [newWorkspace, setNewWorkspace] = React.useState("");
	const [workspaces, setWorkspaces] = React.useState<WorkspaceItem[]>([]);
	const [isLoading, setIsLoading] = React.useState(false);
	const [editingWorkspaceId, setEditingWorkspaceId] = React.useState<
		string | null
	>(null);
	const [editingName, setEditingName] = React.useState("");
	const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(
		null
	);

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
					})
				);
				setWorkspaces(transformedWorkspaces);
			}
		} catch (error) {
			console.error("Error fetching workspaces:", error);
			toast.error("Failed to load workspaces");
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddWorkspace = async () => {
		if (!newWorkspace.trim()) return;

		try {
			setIsLoading(true);
			const workspace = await DatabaseService.createWorkspace(
				newWorkspace.trim()
			);

			if (workspace) {
				console.log("New workspace created✅:", workspace);
				toast.success("Workspace created successfully");

				// Refresh the workspaces list
				await fetchWorkspaces();

				// Clear the input
				setNewWorkspace("");

				// Navigate to the new workspace
				route.push(`/workspace/${workspace.id}`);
			} else {
				toast.error("Failed to create workspace");
			}
		} catch (error) {
			console.error("Error creating workspace:", error);
			toast.error("Failed to create workspace");
		} finally {
			setIsLoading(false);
		}
	};

	const handleStartEdit = (workspaceId: string, currentName: string) => {
		setEditingWorkspaceId(workspaceId);
		setEditingName(currentName);
	};

	const handleSaveEdit = async () => {
		if (!editingWorkspaceId || !editingName.trim()) return;

		try {
			const result = await DatabaseService.updateWorkspace(editingWorkspaceId, {
				name: editingName.trim(),
			});

			if (result) {
				toast.success("Workspace renamed successfully");
				setEditingWorkspaceId(null);
				setEditingName("");
				await fetchWorkspaces(); // Refresh the list
			} else {
				toast.error("Failed to rename workspace");
			}
		} catch (error) {
			console.error("Error renaming workspace:", error);
			toast.error("Failed to rename workspace");
		}
	};

	const handleCancelEdit = () => {
		setEditingWorkspaceId(null);
		setEditingName("");
	};

	const handleDeleteWorkspace = async (workspaceId: string) => {
		try {
			const result = await DatabaseService.deleteWorkspace(workspaceId);

			if (result) {
				toast.success("Workspace deleted successfully");
				await fetchWorkspaces(); // Refresh the list
				setDeleteConfirmId(null);

				// If currently viewing the deleted workspace, redirect to home
				if (window.location.pathname.includes(workspaceId)) {
					route.push("/");
				}
			} else {
				toast.error("Failed to delete workspace");
			}
		} catch (error) {
			console.error("Error deleting workspace:", error);
			toast.error("Failed to delete workspace");
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

	const handleEditKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleSaveEdit();
		} else if (event.key === "Escape") {
			handleCancelEdit();
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
		<>
			<Sidebar collapsible="icon" variant="inset">
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Workspaces</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{workspaces.map((item) => (
									<SidebarMenuItem key={item.id || item.title}>
										{editingWorkspaceId === item.id ? (
											<div className="flex items-center gap-1 px-2 py-1">
												<Input
													value={editingName}
													onChange={(e) => setEditingName(e.target.value)}
													onKeyDown={handleEditKeyPress}
													className="h-7 text-sm"
													autoFocus
												/>
												<Button
													size="sm"
													variant="ghost"
													className="h-7 w-7 p-0"
													onClick={handleSaveEdit}
													disabled={!editingName.trim()}
												>
													<Check className="h-3 w-3" />
												</Button>
												<Button
													size="sm"
													variant="ghost"
													className="h-7 w-7 p-0"
													onClick={handleCancelEdit}
												>
													<X className="h-3 w-3" />
												</Button>
											</div>
										) : (
											<div
												className="group flex items-center w-full"
												onMouseEnter={() => prefetch(item.id)} // Prefetch on hover
											>
												<SidebarMenuButton
													asChild
													className={`flex-1 ${
														pathname === item.url
															? "bg-accent text-accent-foreground font-medium"
															: ""
													}`}
												>
													<Link href={item.url}>
														<div className="flex items-center gap-2">
															{pathname === item.url && (
																<div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
															)}
															{item.title}
														</div>
													</Link>
												</SidebarMenuButton>
												<div className="opacity-0 group-hover:opacity-100 flex items-center">
													<Button
														size="sm"
														variant="ghost"
														className="h-6 w-6 p-0"
														onClick={() => handleStartEdit(item.id, item.title)}
													>
														<Edit2 className="h-3 w-3" />
													</Button>
													<Button
														size="sm"
														variant="ghost"
														className="h-6 w-6 p-0 text-destructive hover:text-destructive"
														onClick={() => setDeleteConfirmId(item.id)}
													>
														<Trash2 className="h-3 w-3" />
													</Button>
												</div>
											</div>
										)}
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
								<SidebarMenuItem>
									<SidebarMenuButton
										size="lg"
										className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
									>
										<div className="flex justify-center items-center">
											<Avatar className="mr-2 size-8">
												<AvatarImage src={getUserAvatar()} alt="Avatar" />
												<AvatarFallback>{getUserInitials()}</AvatarFallback>
											</Avatar>
										</div>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-semibold">
												{getUserDisplayName()}
											</span>
											<span className="truncate text-xs">{user?.email}</span>
										</div>
										<ChevronsUpDown className="ml-auto size-4" />
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
							side="bottom"
							align="end"
							sideOffset={4}
						>
							<DropdownMenuItem>
								<Laptop />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings />
								Settings
							</DropdownMenuItem>
							<Separator />
							<DropdownMenuItem onClick={handleLogOut}>
								<LogOut />
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarFooter>
			</Sidebar>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={!!deleteConfirmId}
				onOpenChange={() => setDeleteConfirmId(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Workspace</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this workspace? This action cannot
							be undone and will permanently remove all associated data
							including tasks, sessions, and settings.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() =>
								deleteConfirmId && handleDeleteWorkspace(deleteConfirmId)
							}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete Workspace
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
