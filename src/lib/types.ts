export interface DeepWorkSession {
	id: string;
	user_id: string;
	workspace_id?: string;
	session_type: "focus" | "rest";
	start_time: string;
	end_time?: string;
	duration_seconds?: number;
	is_completed: boolean;
	notes?: string;
	created_at: string;
	updated_at: string;
}

export interface Workspace {
	id: string;
	user_id: string;
	name: string;
	description?: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface DailyDeepWorkStats {
	id: string;
	user_id: string;
	workspace_id?: string;
	date: string;
	total_focus_minutes: number;
	total_rest_minutes: number;
	sessions_count: number;
	created_at: string;
	updated_at: string;
}

export interface CreateSessionData {
	workspace_id?: string;
	session_type: "focus" | "rest";
	start_time: string;
	notes?: string;
}

export interface UpdateSessionData {
	end_time?: string;
	duration_seconds?: number;
	is_completed?: boolean;
	notes?: string;
}
