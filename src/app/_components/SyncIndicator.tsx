import React from "react";
import { useSyncStatus } from "@/hooks/use-sync-status";
import { CheckCircle, AlertCircle, Loader2, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

export function SyncIndicator({ className }: { className?: string }) {
	const { status, pendingOperations, clearError } = useSyncStatus();

	const getIndicator = () => {
		switch (status) {
			case "idle":
				return (
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<Wifi className="h-3.5 w-3.5" />
						<span className="text-xs font-medium">Saved</span>
					</div>
				);

			case "syncing":
				return (
					<div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
						<Loader2 className="h-3.5 w-3.5 animate-spin" />
						<span className="text-xs font-medium">
							Syncing
							{pendingOperations.size > 1 ? ` (${pendingOperations.size})` : ""}
							...
						</span>
					</div>
				);

			case "synced":
				return (
					<div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
						<CheckCircle className="h-3.5 w-3.5" />
						<span className="text-xs font-medium">Synced</span>
					</div>
				);

			case "error":
				return (
					<button
						onClick={clearError}
						className="flex items-center gap-1.5 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
						title="Click to dismiss error"
					>
						<AlertCircle className="h-3.5 w-3.5" />
						<span className="text-xs font-medium">Sync failed</span>
					</button>
				);

			default:
				return null;
		}
	};

	return (
		<div className={cn("transition-all duration-200 ease-in-out", className)}>
			{getIndicator()}
		</div>
	);
}

export default SyncIndicator;
