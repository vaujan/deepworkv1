import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import { Column, Row } from "./types";
import ColumnContainer from "./ColumnContainer";
import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	KeyboardSensor,
	useSensor,
	useSensors,
	closestCenter,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function KanbanDnDKit() {
	const [columns, setColumns] = React.useState<Column[]>([]);
	const [activeColumn, setActiveColumn] = React.useState<Column | null>(null);

	const [rows, setRows] = React.useState<Row[]>([]);
	const [activeRow, setActiveRow] = React.useState<Row | null>(null);

	const handleAddRow = (columnId: string) => {
		// Validate column exists
		if (!columns.find((col) => col.id === columnId)) {
			console.error("Column not found:", columnId);
			return;
		}

		const columnRows = rows.filter((row) => row.columnId === columnId);

		const newRow: Row = {
			id: crypto.randomUUID(),
			columnId: columnId,
			title: `Task #${columnRows.length + 1}`,
			description: "Current task description",
		};

		setRows([...rows, newRow]);
	};

	const handleDeleteRow = (id: string) => {
		if (!rows) return;

		// Validate row exists
		if (!rows.find((row) => row.id === id)) {
			console.error("Row not found:", id);
			return;
		}

		const filteredRows = rows.filter((row) => row.id !== id);
		setRows(filteredRows);
	};

	const handleUpdateRowTitle = (id: string, title: string) => {
		const newRows = rows?.map((row) => {
			if (row.id !== id) return row;

			return { ...row, title: title };
		});

		setRows(newRows as Row[]);
	};

	const columnsIds = React.useMemo(
		() => columns.map((col) => col.id),
		[columns]
	);

	const handleAddColumn = () => {
		const newColumn = {
			id: crypto.randomUUID(),
			title: `Column #${columns.length + 1}`,
		};

		setColumns([...columns, newColumn]);
	};

	const handleDeleteColumn = (id: string) => {
		// Validate column exists
		if (!columns.find((col) => col.id === id)) {
			console.error("Column not found:", id);
			return;
		}

		// Delete all rows in this column
		const rowsToKeep = rows.filter((row) => row.columnId !== id);
		setRows(rowsToKeep);

		const filteredColumns = columns.filter((col) => col.id !== id);
		setColumns(filteredColumns);
	};

	const handleUpdateColumn = (id: string, title: string) => {
		// Validate column exists
		if (!columns.find((col) => col.id === id)) {
			console.error("Column not found:", id);
			return;
		}

		const newColumns = columns.map((col) => {
			if (col.id !== id) return col;

			return { ...col, title: title };
		});

		setColumns(newColumns);
	};

	// Handles when a drag operation starts
	const onDragStart = (event: DragStartEvent) => {
		const { active } = event;

		const draggedColumn = columns.find((col) => col.id === active.id);
		const draggedRow = rows.find((row) => row.id === active.id);

		setActiveColumn(draggedColumn || null);
		setActiveRow(draggedRow || null);
	};

	// Handles when a drag operation ends
	const onDragEnd = (event: DragEndEvent) => {
		setActiveColumn(null);
		setActiveRow(null);

		// Extract the dragged column and the drop target from the event
		const { active, over } = event;

		// If there's no drop target, exit early
		if (!over) return;

		// Get the IDs of the dragged column and where it was dropped
		const activeColumnId = active.id;
		const overColumnId = over.id;

		// If dropping on itself, no need to reorder
		if (activeColumnId === overColumnId) return;

		setColumns((columns) => {
			// Find the array index of the dragged column
			const activeColumnIndex = columns.findIndex(
				(col) => col.id === activeColumnId
			);

			// Find the array index of where we dropped
			const overColumnIndex = columns.findIndex(
				(col) => col.id === overColumnId
			);

			// Use arrayMove helper to reorder the columns array
			// It handles all the array manipulation for us
			return arrayMove(columns, activeColumnIndex, overColumnIndex);
		});

		setActiveColumn(null);
	};

	const onDragOver = (event: DragOverEvent) => {
		const { active, over } = event;

		if (!over) return;

		const activeRowId = active.id;
		const overId = over.id;

		if (activeRowId === overId) return;

		const isActiveARow = active.data.current?.type === "Row";
		const isOverARow = over.data.current?.type === "Row";
		const isOverColumn = over.data.current?.type === "Column";

		if (!isActiveARow) return;

		// Dropping a task over another task
		if (isActiveARow && isOverARow) {
			setRows((rows) => {
				const activeRowIndex = rows?.findIndex((row) => row.id === activeRowId);
				const overRowIndex = rows?.findIndex((row) => row.id === overId);

				if (activeRowIndex === -1 || overRowIndex === -1) return rows;

				// Update the column ID to match the target row's column
				rows[activeRowIndex].columnId = rows[overRowIndex].columnId;

				return arrayMove(rows, activeRowIndex, overRowIndex);
			});
		}

		// Dropping a task over a column
		if (isActiveARow && isOverColumn) {
			setRows((rows) => {
				const activeRowIndex = rows.findIndex((row) => row.id === activeRowId);

				if (activeRowIndex === -1) return rows;

				// Update the column ID to the target column
				rows[activeRowIndex].columnId = overId.toString();

				// Move the row to the end of the target column
				const updatedRows = [...rows];
				const movedRow = updatedRows.splice(activeRowIndex, 1)[0];

				// Find the last row in the target column
				const targetColumnRows = updatedRows.filter(
					(row) => row.columnId === overId.toString()
				);
				const insertIndex = updatedRows.findIndex(
					(row) => row.id === targetColumnRows[targetColumnRows.length - 1]?.id
				);

				if (insertIndex === -1) {
					// If no rows in target column, insert at beginning
					updatedRows.unshift(movedRow);
				} else {
					// Insert after the last row in target column
					updatedRows.splice(insertIndex + 1, 0, movedRow);
				}

				return updatedRows;
			});
		}
	};

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 3, // 3px
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	return (
		<div className="flex flex-col gap-4 w-full h-full">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={onDragEnd}
				onDragStart={onDragStart}
				onDragOver={onDragOver}
			>
				<SortableContext items={columnsIds}>
					<ScrollArea className="w-full">
						<div
							className="flex gap-4 overflow-x-auto h-[560px] p-3 bg-card/10 rounded-lg"
							role="region"
							aria-label="Kanban board columns"
						>
							{columns.map((column) => (
								<ColumnContainer
									key={column.id}
									column={column}
									rows={rows}
									onDeleteColumn={handleDeleteColumn}
									onUpdateColumn={handleUpdateColumn}
									onAddRow={handleAddRow}
									onDeleteRow={handleDeleteRow}
									onUpdateRowTitle={handleUpdateRowTitle}
								/>
							))}

							<Button
								className="w-[350px]"
								variant={"outline"}
								onClick={handleAddColumn}
							>
								<Plus />
								Add Column
							</Button>
						</div>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</SortableContext>

				{createPortal(
					<DragOverlay>
						{activeColumn && (
							<div className="flex flex-col gap-3 justify-center items-center px-4 pt-3 pb-4 w-[350px] h-full rounded-xl border-2 border-dashed border-accent/50 bg-card/20 opacity-90 shadow-2xl shadow-accent/20 transition-all duration-300 min-h-64 min-w-64">
								<div className="flex flex-col items-center gap-2">
									<div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20">
										<div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
									</div>
									<span className="text-sm text-muted-foreground font-medium">
										{activeColumn.title}
									</span>
									<span className="text-xs text-muted-foreground/70">
										Moving column...
									</span>
								</div>
							</div>
						)}
						{activeRow && (
							<div className="flex gap-3 justify-between p-2 mb-2 rounded-lg border-2 bg-card/80 border-accent/50 opacity-80 shadow-2xl shadow-accent/20 transition-all duration-200">
								<div className="flex flex-col gap-2">
									<span className="font-medium text-foreground">
										{activeRow.title}
									</span>
									<p className="text-muted-foreground text-sm">
										{activeRow.description}
									</p>
								</div>
								{/* Show a subtle drag indicator */}
								<div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20">
									<div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
								</div>
							</div>
						)}
					</DragOverlay>,
					document.body
				)}
			</DndContext>
		</div>
	);
}
