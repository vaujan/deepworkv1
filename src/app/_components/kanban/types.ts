import {
	KanbanBoard,
	KanbanColumn,
	KanbanCard,
	KanbanBoardWithData,
} from "@/lib/types";

// Re-export database types for component use
export type { KanbanBoard, KanbanColumn, KanbanCard, KanbanBoardWithData };

// Component-specific interfaces
export interface KanbanBoardProps {
	boardId?: string; // Optional - will use user's default board
	className?: string;
}

export interface KanbanColumnProps {
	column: KanbanBoardWithData["columns"][0]; // This includes cards
	index: number;
	onUpdateColumn: (
		columnId: string,
		data: { name?: string; color?: string }
	) => void;
	onDeleteColumn: (columnId: string) => void;
	onCreateCard: (columnId: string, title: string) => void;
	onUpdateCard: (cardId: string, data: { title?: string }) => void;
	onDeleteCard: (cardId: string) => void;
}

export interface KanbanCardProps {
	card: KanbanCard;
	onUpdate: (cardId: string, data: { title?: string }) => void;
	onDelete: (cardId: string) => void;
}

// Drag and Drop interfaces
export interface DragData {
	type: "column" | "card";
	id: string;
	boardId: string;
	columnId?: string; // Only for cards
}

export interface DropData {
	type: "column" | "card-list" | "card";
	id: string;
	boardId: string;
	columnId?: string; // Only for card drop zones
}

// Position tracking for drag operations
export interface DragPosition {
	columnId: string;
	index: number;
}
