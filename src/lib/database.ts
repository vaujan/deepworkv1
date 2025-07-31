import { supabase } from "./supabase";
import {
	DeepWorkSession,
	Workspace,
	DailyDeepWorkStats,
	CreateSessionData,
	UpdateSessionData,
	KanbanBoard,
	KanbanColumn,
	KanbanCard,
	KanbanBoardWithData,
	CreateKanbanBoardData,
	UpdateKanbanBoardData,
	CreateKanbanColumnData,
	UpdateKanbanColumnData,
	CreateKanbanCardData,
	UpdateKanbanCardData,
} from "./types";

// Simple in-memory cache for development performance
const boardCache = new Map<
	string,
	{ data: KanbanBoardWithData; timestamp: number }
>();
const CACHE_TTL = 30000; // 30 seconds cache

export class DatabaseService {
	// Session methods
	static async createSession(
		data: CreateSessionData
	): Promise<DeepWorkSession | null> {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			console.error("No authenticated user found");
			return null;
		}

		const { data: session, error } = await supabase
			.from("deep_work_sessions")
			.insert({ ...data, user_id: user.id })
			.select()
			.single();

		if (error) {
			console.error("Error creating session:", error);
			return null;
		}

		return session;
	}

	static async updateSession(
		sessionId: string,
		data: UpdateSessionData
	): Promise<DeepWorkSession | null> {
		const { data: session, error } = await supabase
			.from("deep_work_sessions")
			.update({ ...data, updated_at: new Date().toISOString() })
			.eq("id", sessionId)
			.select()
			.single();

		if (error) {
			console.error("Error updating session:", error);
			return null;
		}

		return session;
	}

	static async getSessionsByDateRange(
		startDate: string,
		endDate: string
	): Promise<DeepWorkSession[]> {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			console.error("No authenticated user found");
			return [];
		}

		const { data: sessions, error } = await supabase
			.from("deep_work_sessions")
			.select("*")
			.eq("user_id", user.id)
			.gte("start_time", startDate)
			.lte("start_time", endDate)
			.order("start_time", { ascending: false });

		if (error) {
			console.error("Error fetching sessions:", error);
			return [];
		}

		return sessions || [];
	}

	// Workspace methods
	static async createWorkspace(
		name: string,
		description?: string
	): Promise<Workspace | null> {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			console.error("No authenticated user found");
			return null;
		}

		const { data: workspace, error } = await supabase
			.from("workspaces")
			.insert([
				{
					name,
					description,
					user_id: user.id,
					is_active: true,
				},
			])
			.select()
			.single();

		if (error) {
			console.error("Error creating workspace:", error);
			return null;
		}

		return workspace;
	}

	static async getWorkspaces(): Promise<Workspace[]> {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			console.error("No authenticated user found");
			return [];
		}

		const { data: workspaces, error } = await supabase
			.from("workspaces")
			.select("*")
			.eq("user_id", user.id)
			.eq("is_active", true)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching workspaces:", error);
			return [];
		}

		return workspaces || [];
	}

	static async updateWorkspace(
		workspaceId: string,
		data: { name?: string; description?: string }
	): Promise<Workspace | null> {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			console.error("No authenticated user found");
			return null;
		}

		const { data: workspace, error } = await supabase
			.from("workspaces")
			.update({ ...data, updated_at: new Date().toISOString() })
			.eq("id", workspaceId)
			.eq("user_id", user.id) // Ensure user can only update their own workspaces
			.select()
			.single();

		if (error) {
			console.error("Error updating workspace:", error);
			return null;
		}

		return workspace;
	}

	static async deleteWorkspace(workspaceId: string): Promise<boolean> {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			console.error("No authenticated user found");
			return false;
		}

		// Soft delete by setting is_active to false
		const { error } = await supabase
			.from("workspaces")
			.update({ is_active: false, updated_at: new Date().toISOString() })
			.eq("id", workspaceId)
			.eq("user_id", user.id); // Ensure user can only delete their own workspaces

		if (error) {
			console.error("Error deleting workspace:", error);
			return false;
		}

		return true;
	}

	// Daily stats methods
	static async getDailyStats(
		startDate: string,
		endDate: string
	): Promise<DailyDeepWorkStats[]> {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			console.error("No authenticated user found");
			return [];
		}

		const { data: stats, error } = await supabase
			.from("daily_deep_work_stats")
			.select("*")
			.eq("user_id", user.id)
			.gte("date", startDate)
			.lte("date", endDate)
			.order("date", { ascending: true });

		if (error) {
			console.error("Error fetching daily stats:", error);
			return [];
		}

		return stats || [];
	}

	static async upsertDailyStats(
		stats: Partial<DailyDeepWorkStats>
	): Promise<DailyDeepWorkStats | null> {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			console.error("No authenticated user found");
			return null;
		}

		const { data: result, error } = await supabase
			.from("daily_deep_work_stats")
			.upsert([{ ...stats, user_id: user.id }], {
				onConflict: "user_id,workspace_id,date",
			})
			.select()
			.single();

		if (error) {
			console.error("Error upserting daily stats:", error);
			return null;
		}

		return result;
	}

	static async joinWaitList(email: string) {
		if (!email || !email.includes("@")) {
			throw new Error("Invalid email address");
		}

		const normalizedEmail = email.toLowerCase().trim();

		// First, check if the email already exists
		const { data: existingEmail, error: checkError } = await supabase
			.from("waitlist")
			.select("email")
			.eq("email", normalizedEmail)
			.single();

		if (checkError && checkError.code !== "PGRST116") {
			// PGRST116 is "not found" error
			console.error("Error checking existing email:", checkError);
			throw new Error("Failed to check email status");
		}

		// If email already exists, return the existing record
		if (existingEmail) {
			return { ...existingEmail, isExisting: true };
		}

		// If email doesn't exist, insert it
		const { data: newEmail, error: insertError } = await supabase
			.from("waitlist")
			.insert([
				{
					email: normalizedEmail,
				},
			])
			.select()
			.single();

		if (insertError) {
			console.error("Error adding to waitlist:", insertError);
			throw new Error("Failed to join waitlist");
		}

		return { ...newEmail, isExisting: false };
	}

	// Kanban Board methods
	static async createKanbanBoard(
		data: CreateKanbanBoardData
	): Promise<KanbanBoard | null> {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			console.error("No authenticated user found");
			return null;
		}

		const { data: board, error } = await supabase
			.from("kanban_boards")
			.insert({
				...data,
				user_id: user.id,
				is_active: true,
			})
			.select()
			.single();

		if (error) {
			console.error("Error creating kanban board:", error);
			return null;
		}

		return board;
	}

	static async getKanbanBoards(): Promise<KanbanBoard[]> {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			console.error("No authenticated user found");
			return [];
		}

		const { data: boards, error } = await supabase
			.from("kanban_boards")
			.select("*")
			.eq("user_id", user.id)
			.eq("is_active", true)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching kanban boards:", error);
			return [];
		}

		return boards || [];
	}

	// Optimized: Get workspace-specific board with single query + caching
	static async getOrCreateWorkspaceBoard(
		workspaceId: string
	): Promise<KanbanBoardWithData | null> {
		// Check cache first
		const cacheKey = `workspace-${workspaceId}`;
		const cached = boardCache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
			console.log("📦 Using cached board data for workspace:", workspaceId);
			return cached.data;
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			console.error("No authenticated user found");
			return null;
		}

		console.log("🔄 Loading fresh board data for workspace:", workspaceId);

		// Try to get workspace's existing board
		const { data: fetchedBoard, error } = await supabase
			.from("kanban_boards")
			.select("*")
			.eq("user_id", user.id)
			.eq("workspace_id", workspaceId)
			.eq("is_active", true)
			.order("created_at", { ascending: true })
			.limit(1)
			.single();

		let board = fetchedBoard;

		// If no board exists, create one
		if (error?.code === "PGRST116") {
			// No rows returned
			console.log(
				"📝 No board found, creating new board for workspace:",
				workspaceId
			);
			const newBoard = await this.createKanbanBoard({
				name: "Kanban Board",
				workspace_id: workspaceId,
			});
			if (!newBoard) {
				console.error("❌ Failed to create new board");
				return null;
			}
			console.log("✅ Created new board:", newBoard.id);
			board = newBoard;
		} else if (error) {
			console.error("❌ Error fetching kanban board:", error);
			return null;
		} else {
			console.log("✅ Found existing board:", board?.id);
		}

		const boardData = await this.getKanbanBoardWithDataOptimized(board!.id);

		// Cache the result
		if (boardData) {
			boardCache.set(cacheKey, { data: boardData, timestamp: Date.now() });
		}

		return boardData;
	}

	// NEW: Optimized single-query version that fetches everything at once
	static async getKanbanBoardWithDataOptimized(
		boardId: string
	): Promise<KanbanBoardWithData | null> {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			console.error("No authenticated user found");
			return null;
		}

		console.log("🔍 Loading board with optimized query:", boardId);

		// Try simple embedded query first - just boards and columns
		const { data: result, error } = await supabase
			.from("kanban_boards")
			.select(
				`
				*,
				kanban_columns (*)
			`
			)
			.eq("id", boardId)
			.eq("user_id", user.id)
			.order("position", { referencedTable: "kanban_columns", ascending: true })
			.single();

		if (error) {
			console.error("❌ Error with optimized query:", error);
			// Fall back to the original method
			return this.getKanbanBoardWithDataFallback(boardId);
		}

		if (!result) {
			console.log("❌ No board found with optimized query");
			return null;
		}

		// Now fetch cards separately since embedded query had issues
		const { data: cards, error: cardsError } = await supabase
			.from("kanban_cards")
			.select("*")
			.eq("board_id", boardId)
			.order("position", { ascending: true });

		if (cardsError) {
			console.error("❌ Error fetching cards:", cardsError);
			// Fall back to the original method if cards query fails
			return this.getKanbanBoardWithDataFallback(boardId);
		}

		// Transform the nested data to match our expected format
		const board = {
			id: result.id,
			user_id: result.user_id,
			workspace_id: result.workspace_id,
			name: result.name,
			description: result.description,
			is_active: result.is_active,
			created_at: result.created_at,
			updated_at: result.updated_at,
			columns: (result.kanban_columns || [])
				.sort(
					(a: { position: number }, b: { position: number }) =>
						a.position - b.position
				)
				.map((column: { id: string; [key: string]: unknown }) => ({
					...column,
					cards: (cards || []).filter(
						(card: { column_id: string }) => card.column_id === column.id
					),
				})),
		};

		console.log(
			"✅ Optimized query successful! Found",
			board.columns.length,
			"columns"
		);
		return board;
	}

	// Fallback method using original separate queries
	static async getKanbanBoardWithDataFallback(
		boardId: string
	): Promise<KanbanBoardWithData | null> {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			console.error("No authenticated user found");
			return null;
		}

		console.log("🔄 Using fallback queries for board:", boardId);

		// Fetch board
		const { data: board, error: boardError } = await supabase
			.from("kanban_boards")
			.select("*")
			.eq("id", boardId)
			.eq("user_id", user.id)
			.single();

		if (boardError) {
			console.error("Error fetching kanban board:", boardError);
			return null;
		}

		// Fetch columns
		const { data: columns, error: columnsError } = await supabase
			.from("kanban_columns")
			.select("*")
			.eq("board_id", boardId)
			.order("position", { ascending: true });

		if (columnsError) {
			console.error("Error fetching kanban columns:", columnsError);
			return null;
		}

		// Fetch cards
		const { data: cards, error: cardsError } = await supabase
			.from("kanban_cards")
			.select("*")
			.eq("board_id", boardId)
			.order("position", { ascending: true });

		if (cardsError) {
			console.error("Error fetching kanban cards:", cardsError);
			return null;
		}

		// Organize cards by column
		const columnsWithCards = columns.map((column) => ({
			...column,
			cards: cards.filter((card) => card.column_id === column.id),
		}));

		console.log(
			"✅ Fallback query successful! Found",
			columnsWithCards.length,
			"columns"
		);

		return {
			...board,
			columns: columnsWithCards,
		};
	}

	static async updateKanbanBoard(
		boardId: string,
		data: UpdateKanbanBoardData
	): Promise<KanbanBoard | null> {
		const { data: board, error } = await supabase
			.from("kanban_boards")
			.update({ ...data, updated_at: new Date().toISOString() })
			.eq("id", boardId)
			.select()
			.single();

		if (error) {
			console.error("Error updating kanban board:", error);
			return null;
		}

		return board;
	}

	static async deleteKanbanBoard(boardId: string): Promise<boolean> {
		// Soft delete by setting is_active to false
		const { error } = await supabase
			.from("kanban_boards")
			.update({ is_active: false, updated_at: new Date().toISOString() })
			.eq("id", boardId);

		if (error) {
			console.error("Error deleting kanban board:", error);
			return false;
		}

		return true;
	}

	// Kanban Column methods
	static async createKanbanColumn(
		data: CreateKanbanColumnData
	): Promise<KanbanColumn | null> {
		const { data: column, error } = await supabase
			.from("kanban_columns")
			.insert(data)
			.select()
			.single();

		if (error) {
			console.error("Error creating kanban column:", error);
			return null;
		}

		// Invalidate cache for the board's workspace
		const { data: board } = await supabase
			.from("kanban_boards")
			.select("workspace_id")
			.eq("id", data.board_id)
			.single();

		if (board?.workspace_id) {
			this.invalidateWorkspaceCache(board.workspace_id);
		}

		return column;
	}

	static async updateKanbanColumn(
		columnId: string,
		data: UpdateKanbanColumnData
	): Promise<KanbanColumn | null> {
		const { data: column, error } = await supabase
			.from("kanban_columns")
			.update({ ...data, updated_at: new Date().toISOString() })
			.eq("id", columnId)
			.select()
			.single();

		if (error) {
			console.error("Error updating kanban column:", error);
			return null;
		}

		// Invalidate cache
		const { data: board } = await supabase
			.from("kanban_boards")
			.select("workspace_id")
			.eq("id", column.board_id)
			.single();

		if (board?.workspace_id) {
			this.invalidateWorkspaceCache(board.workspace_id);
		}

		return column;
	}

	static async deleteKanbanColumn(columnId: string): Promise<boolean> {
		// First, delete all cards in this column
		const { error: cardsError } = await supabase
			.from("kanban_cards")
			.delete()
			.eq("column_id", columnId);

		if (cardsError) {
			console.error("Error deleting cards in column:", cardsError);
			return false;
		}

		// Then delete the column
		const { error: columnError } = await supabase
			.from("kanban_columns")
			.delete()
			.eq("id", columnId);

		if (columnError) {
			console.error("Error deleting kanban column:", columnError);
			return false;
		}

		return true;
	}

	static async reorderColumns(
		columns: { id: string; position: number }[]
	): Promise<boolean> {
		const updates = columns.map((col) => ({
			id: col.id,
			position: col.position,
			updated_at: new Date().toISOString(),
		}));

		const { error } = await supabase.from("kanban_columns").upsert(updates);

		if (error) {
			console.error("Error reordering columns:", error);
			return false;
		}

		return true;
	}

	// Kanban Card methods
	static async createKanbanCard(
		data: CreateKanbanCardData
	): Promise<KanbanCard | null> {
		const { data: card, error } = await supabase
			.from("kanban_cards")
			.insert(data)
			.select()
			.single();

		if (error) {
			console.error("Error creating kanban card:", error);
			return null;
		}

		// Invalidate cache
		const { data: board } = await supabase
			.from("kanban_boards")
			.select("workspace_id")
			.eq("id", data.board_id)
			.single();

		if (board?.workspace_id) {
			this.invalidateWorkspaceCache(board.workspace_id);
		}

		return card;
	}

	static async updateKanbanCard(
		cardId: string,
		data: UpdateKanbanCardData
	): Promise<KanbanCard | null> {
		const { data: card, error } = await supabase
			.from("kanban_cards")
			.update({ ...data, updated_at: new Date().toISOString() })
			.eq("id", cardId)
			.select()
			.single();

		if (error) {
			console.error("Error updating kanban card:", error);
			return null;
		}

		// Invalidate cache
		const { data: board } = await supabase
			.from("kanban_boards")
			.select("workspace_id")
			.eq("id", card.board_id)
			.single();

		if (board?.workspace_id) {
			this.invalidateWorkspaceCache(board.workspace_id);
		}

		return card;
	}

	static async deleteKanbanCard(cardId: string): Promise<boolean> {
		const { error } = await supabase
			.from("kanban_cards")
			.delete()
			.eq("id", cardId);

		if (error) {
			console.error("Error deleting kanban card:", error);
			return false;
		}

		return true;
	}

	static async reorderCards(
		cards: { id: string; column_id: string; position: number }[]
	): Promise<boolean> {
		const updates = cards.map((card) => ({
			id: card.id,
			column_id: card.column_id,
			position: card.position,
			updated_at: new Date().toISOString(),
		}));

		const { error } = await supabase.from("kanban_cards").upsert(updates);

		if (error) {
			console.error("Error reordering cards:", error);
			return false;
		}

		return true;
	}

	static async moveCard(
		cardId: string,
		newColumnId: string,
		newPosition: number
	): Promise<boolean> {
		const { error } = await supabase
			.from("kanban_cards")
			.update({
				column_id: newColumnId,
				position: newPosition,
				updated_at: new Date().toISOString(),
			})
			.eq("id", cardId);

		if (error) {
			console.error("Error moving card:", error);
			return false;
		}

		return true;
	}

	// Cache invalidation methods
	static invalidateWorkspaceCache(workspaceId: string) {
		const cacheKey = `workspace-${workspaceId}`;
		boardCache.delete(cacheKey);
		console.log("🗑️ Invalidated cache for workspace:", workspaceId);
	}

	// Clear all cache (useful for development)
	static clearAllCache() {
		boardCache.clear();
		console.log("🗑️ Cleared all board cache");
	}

	// Fallback method for backward compatibility
	static async getKanbanBoardWithData(
		boardId: string
	): Promise<KanbanBoardWithData | null> {
		return this.getKanbanBoardWithDataOptimized(boardId);
	}
}
