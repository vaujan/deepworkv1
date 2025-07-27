"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FolderKanban, ListChecks, Plus, Users } from "lucide-react";
import React from "react";
import { DatabaseService } from "@/lib/database";
import { type Workspace } from "@/lib/types";
import { toast } from "sonner";
import Link from "next/link";

export default function WorkspacePage() {
	const [workspaces, setWorkspaces] = React.useState<Workspace[] | null>();
	const [isLoading, setIsLoading] = React.useState(false);

	React.useEffect(() => {
		fetchWorkspaces();
		console.log("workspaces:", workspaces);
	}, [workspaces]);

	const fetchWorkspaces = async () => {
		try {
			setIsLoading(true);
			const workspaceData = await DatabaseService.getWorkspaces();
			if (workspaceData && workspaceData.length > 0) {
				setWorkspaces(workspaceData);
			}
		} catch (error) {
			console.error("Error fetching workspaces", error);
			toast.error("Failed to load workspaces");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col w-full items-center justify-center min-h-screen gap-8 p-4 text-center">
			<div className="max-w-3xl">
				<h1 className="text-4xl font-bold  tracking-tight text-foreground sm:text-5xl">
					Welcome to Your Workspace
				</h1>
				<p className="mt-4 text-lg  text-muted-foreground">
					A workspace is your dedicated area to manage projects, track tasks,
					and collaborate with your team. Get started by creating your first
					workspace.
				</p>
			</div>

			<div className="grid gap-8 md:grid-cols-3 max-w-6xl">
				<Card className="bg-card/50 border-0 gap-3">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<div className="flex flex-col gap-8">
								<FolderKanban className="w-6 h-6 text-muted-foreground" />
								Organize Your Work
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription className="text-left">
							Create separate workspaces for different projects or teams. Keep
							everything organized and easy to find.
						</CardDescription>
					</CardContent>
				</Card>
				<Card className="bg-card/50 border-0 gap-3">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<div className="flex flex-col gap-8">
								<ListChecks className="w-6 h-6 text-muted-foreground" />
								Track Your Progress
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription className="text-left">
							Use our Kanban boards, to-do lists, and other tools to keep track
							of your tasks and stay on top of your deadlines.
						</CardDescription>
					</CardContent>
				</Card>
				<Card className="bg-card/50 border-0 gap-3">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<div className="flex flex-col gap-8">
								<Users className="w-6 h-6 text-muted-foreground" />
								Collaborate with Your Team
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription className="text-left">
							Invite your team members to your workspace and collaborate in
							real-time. Share files, leave comments, and work together
							seamlessly.
						</CardDescription>
					</CardContent>
				</Card>
			</div>

			<div className="flex flex-col gap-2 w-full max-w-6xl">
				<span className="text-left text-secondary-foreground">
					Recent workspaces
				</span>
				<div className="flex flex-col">
					{workspaces?.map((workspace) => (
						<Link href={`workspace/${workspace.id}`} key={workspace.id}>
							<Button variant={"ghost"}>{workspace.name}</Button>
						</Link>
					))}
				</div>
			</div>

			<div className="mt-8">
				<Button size="lg">
					<Plus className="w-5 h-5 mr-2" />
					Create Your First Workspace
				</Button>
			</div>
		</div>
	);
}
