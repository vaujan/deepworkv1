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

// Task interface for Kanban board items
export interface Task {
	id: string;
	title: string;
	description?: string;
	status: "todo" | "inprogress" | "done";
}

// Widget interface for workspace components
export interface Widget {
	id: string;
	type:
		| "timer"
		| "sticky-notes"
		| "resources"
		| "kanban"
		| "markdown"
		| "media-player"
		| "heat-grid"
		| "stats";
	position: { x: number; y: number };
	size: { width: number; height: number };
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data?: any; // Flexible data field for widget-specific data
}

// Workspace interface for project-specific environments
export interface Workspace {
	id: string;
	name: string;
	widgets: Widget[];
}

// Timer state for the Deep Work timer
export interface TimerState {
	isRunning: boolean;
	timeLeft: number;
	sessionType: "focus" | "break";
	totalTime: number;
}

// App context type for global state management
export interface AppContextType {
	workspaces: Workspace[];
	currentWorkspaceId: string;
	darkMode: boolean;
	editMode: boolean;
	timerState: TimerState;
	setWorkspaces: (workspaces: Workspace[]) => void;
	setCurrentWorkspaceId: (id: string) => void;
	toggleDarkMode: () => void;
	toggleEditMode: () => void;
	updateTimerState: (state: TimerState) => void;
}

// Resource interface for the Resources widget
export interface Resource {
	id: string;
	title: string;
	url: string;
	icon: string;
}

// Heatmap data point for activity visualization
export interface HeatmapDataPoint {
	date: string;
	value: number;
}

export interface Column {
	id: string;
	title: string;
}

export interface ColumnProps {
	column: Column;
	onDeleteColumn: (id: string) => void;
}
