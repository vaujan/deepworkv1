"use client";

import Header from "@/app/_components/Header";
import PomodoroCard from "@/app/_components/PomodoroCard";
import Heatmap from "@/app/_components/Heatmap";
import useDynamicTitle from "@/hooks/use-dynamic-title";
import React from "react";
import KanbanBoard from "../../_components/kanban/Board";
import { DatabaseService } from "@/lib/database";
import { Workspace } from "@/lib/types";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function WorkspacePage() {
	const params = useParams();
	const workspaceId = params.id as string;

	const [workspace, setWorkspace] = React.useState<Workspace | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	// Change title based on workspace name
	useDynamicTitle(workspace?.name);

	React.useEffect(() => {
		const loadWorkspace = async () => {
			if (!workspaceId) return;

			try {
				setLoading(true);
				setError(null);

				// Get all workspaces and find the current one
				const workspaces = await DatabaseService.getWorkspaces();
				const currentWorkspace = workspaces.find((w) => w.id === workspaceId);

				if (!currentWorkspace) {
					setError("Workspace not found");
					return;
				}

				setWorkspace(currentWorkspace);
			} catch (err) {
				console.error("Failed to load workspace:", err);
				setError("Failed to load workspace");
			} finally {
				setLoading(false);
			}
		};

		loadWorkspace();
	}, [workspaceId]);

	if (loading) {
		return (
			<div className="flex flex-col gap-8 pb-12 w-full">
				<div className="flex justify-center items-center py-16">
					<div className="flex items-center gap-2">
						<Loader2 className="h-4 w-4 animate-spin" />
						<span className="text-muted-foreground">Loading workspace...</span>
					</div>
				</div>
			</div>
		);
	}

	if (error || !workspace) {
		return (
			<div className="flex flex-col gap-8 pb-12 w-full">
				<div className="flex justify-center items-center py-16">
					<div className="text-center">
						<h3 className="text-lg font-medium text-destructive mb-2">
							{error || "Workspace not found"}
						</h3>
						<p className="text-muted-foreground">
							The workspace you&apos;re looking for doesn&apos;t exist or you
							don&apos;t have access to it.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-8 pb-12 w-full">
			<div className="flex justify-between items-center">
				<Header>{workspace.name}</Header>
			</div>

			<section className="flex flex-col gap-8 px-8">
				<div className="flex flex-col md:flex-row gap-12">
					<PomodoroCard />
					<Heatmap />
				</div>

				<div className="w-full">
					<KanbanBoard workspaceId={workspaceId} />
				</div>
			</section>

			<section className="flex gap-8 items-end px-8 h-full">
				{/* Footer */}
				<div className="flex justify-between p-2 -mb-6 w-full text-xs text-muted-foreground/50">
					<span>Development Version (Beta) • Not for production use</span>
					<span>
						© {new Date().getFullYear()} deepflow.click | Built with ❤️ from
						Indonesia
					</span>
				</div>
			</section>
		</div>
	);
}
