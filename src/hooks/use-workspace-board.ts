import { useState, useEffect, useCallback } from "react";
import { DatabaseService } from "@/lib/database";
import { KanbanBoardWithData } from "@/lib/types";
import { toast } from "sonner";
import { startTimer, endTimer } from "@/lib/performance-monitor";

interface UseWorkspaceBoardReturn {
	board: KanbanBoardWithData | null;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
	prefetch: (workspaceId: string) => void;
}

// Global prefetch cache
const prefetchCache = new Map<string, Promise<KanbanBoardWithData | null>>();

export function useWorkspaceBoard(
	workspaceId: string | null
): UseWorkspaceBoardReturn {
	const [board, setBoard] = useState<KanbanBoardWithData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchBoard = useCallback(async (id: string) => {
		if (!id) {
			console.log("❌ No workspace ID provided to fetchBoard");
			return null;
		}

		console.log("🔄 Starting fetchBoard for workspace:", id);
		const timerId = `fetch-board-${id}`;
		startTimer(timerId, `Loading board for workspace ${id}`);

		try {
			const boardData = await DatabaseService.getOrCreateWorkspaceBoard(id);
			if (boardData) {
				console.log(
					"✅ Successfully loaded board:",
					boardData.id,
					"with",
					boardData.columns.length,
					"columns"
				);
			} else {
				console.log("❌ fetchBoard returned null for workspace:", id);
			}
			return boardData;
		} catch (err) {
			console.error("❌ Failed to load board for workspace:", id, err);
			throw err;
		} finally {
			endTimer(timerId);
		}
	}, []);

	const refetch = useCallback(async () => {
		if (!workspaceId) return;

		setLoading(true);
		setError(null);

		try {
			// Clear cache for fresh data
			DatabaseService.invalidateWorkspaceCache(workspaceId);
			const boardData = await fetchBoard(workspaceId);
			setBoard(boardData);
		} catch (err) {
			const errorMessage = "Failed to load board";
			setError(errorMessage);
			toast.error(errorMessage);
			console.error("Board fetch error:", err);
		} finally {
			setLoading(false);
		}
	}, [workspaceId, fetchBoard]);

	// Prefetch function for performance
	const prefetch = useCallback(
		(id: string) => {
			if (!id || prefetchCache.has(id)) return;

			console.log("🚀 Prefetching board for workspace:", id);
			const prefetchPromise = fetchBoard(id);
			prefetchCache.set(id, prefetchPromise);

			// Clean up prefetch cache after 5 minutes
			setTimeout(
				() => {
					prefetchCache.delete(id);
				},
				5 * 60 * 1000
			);
		},
		[fetchBoard]
	);

	// Main effect for loading board when workspace changes
	useEffect(() => {
		if (!workspaceId) {
			console.log("🚫 No workspaceId provided, clearing board");
			setBoard(null);
			setLoading(false);
			return;
		}

		const loadBoard = async () => {
			console.log(
				"🔄 useWorkspaceBoard effect triggered for workspace:",
				workspaceId
			);
			setLoading(true);
			setError(null);

			try {
				// Check if we have prefetched data
				const prefetched = prefetchCache.get(workspaceId);
				let boardData: KanbanBoardWithData | null;

				if (prefetched) {
					console.log(
						"⚡ Using prefetched board data for workspace:",
						workspaceId
					);
					boardData = await prefetched;
					prefetchCache.delete(workspaceId); // Clean up used prefetch
				} else {
					boardData = await fetchBoard(workspaceId);
				}

				if (boardData) {
					console.log("✅ Setting board data in hook:", boardData.id);
					setBoard(boardData);
				} else {
					console.log("❌ No board data returned, setting null");
					setBoard(null);
				}
			} catch (err) {
				const errorMessage = "Failed to load board";
				setError(errorMessage);
				toast.error(errorMessage);
				console.error("❌ Board load error:", err);
			} finally {
				setLoading(false);
			}
		};

		loadBoard();
	}, [workspaceId, fetchBoard]);

	return {
		board,
		loading,
		error,
		refetch,
		prefetch,
	};
}
