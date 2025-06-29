import { supabase } from "./supabase";
import {
	DeepWorkSession,
	Workspace,
	DailyDeepWorkStats,
	CreateSessionData,
	UpdateSessionData,
} from "./types";

export class DatabaseService {
	// Session methods
	static async createSession(
		data: CreateSessionData
	): Promise<DeepWorkSession | null> {
		const { data: session, error } = await supabase
			.from("deep_work_sessions")
			.insert({ ...data, user_id: "test-user-id" })
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
		const { data: sessions, error } = await supabase
			.from("deep_work_sessions")
			.select("*")
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
		const { data: workspace, error } = await supabase
			.from("workspaces")
			.insert([{ name, description }])
			.select()
			.single();

		if (error) {
			console.error("Error creating workspace:", error);
			return null;
		}

		return workspace;
	}

	static async getWorkspaces(): Promise<Workspace[]> {
		const { data: workspaces, error } = await supabase
			.from("workspaces")
			.select("*")
			.eq("is_active", true)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching workspaces:", error);
			return [];
		}

		return workspaces || [];
	}

	// Daily stats methods
	static async getDailyStats(
		startDate: string,
		endDate: string
	): Promise<DailyDeepWorkStats[]> {
		const { data: stats, error } = await supabase
			.from("daily_deep_work_stats")
			.select("*")
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
		const { data: result, error } = await supabase
			.from("daily_deep_work_stats")
			.upsert([stats], { onConflict: "user_id,workspace_id,date" })
			.select()
			.single();

		if (error) {
			console.error("Error upserting daily stats:", error);
			return null;
		}

		return result;
	}
}
