import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
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
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import RowContainer from "./RowContainer";

export default function KanbanDnDKit() {
	const [columns, setColumns] = React.useState<Column[]>([]);
	const [activeColumn, setActiveColumn] = React.useState<Column | null>(null);

	const [rows, setRows] = React.useState<Row[]>([]);
	const [activeRow, setActiveRow] = React.useState<Row | null>(null);

	const handleAddRow = (columnId: string) => {
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
		const filteredRows = rows.filter((row) => row.id !== id);
		setRows(filteredRows);
	};

	const handleUpdateRowTitle = (id: string, title: string) => {
		const newRows = rows?.map((row) => {
			if (row.id !== id) return row;

			return { ...row, title };
		});

		setRows(newRows as Row[]);
	};

	const handleUpdateRowDescription = (id: string, description: string) => {
		const newRows = rows?.map((row) => {
			if (row.id !== id) return row;

			return { ...row, description };
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
		const filteredColumns = columns.filter((col) => col.id !== id);
		setColumns(filteredColumns);
	};

	const handleUpdateColumn = (id: string, title: string) => {
		const newColumns = columns.map((col) => {
			if (col.id !== id) return col;

			return { ...col, title };
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
		const overRowId = over.id;

		if (activeRowId === overRowId) return;

		const isActiveARow = active.data.current?.type === "Row";
		const isOverARow = over.data.current?.type === "Row";

		if (!isActiveARow) return;

		// Dropping a task over another task
		if (isActiveARow && isOverARow) {
			setRows((rows) => {
				const activeRowIndex = rows?.findIndex((row) => row.id === activeRowId);
				const overRowIndex = rows?.findIndex((row) => row.id === overRowId);

				rows[activeRowIndex].columnId = rows[overRowIndex].columnId;

				return arrayMove(rows, activeRowIndex, overRowIndex);
			});
		}

		// Dropping a task over another column
		const isOverColumn = over.data.current?.type === "Column";

		if (isActiveARow && isOverColumn) {
			setRows((rows) => {
				const activeRowIndex = rows.findIndex((row) => row.id === activeRowId);

				rows[activeRowIndex].columnId = overRowId.toString();

				return arrayMove(rows, activeRowIndex, activeRowIndex);
			});
		}
		setActiveRow(null);
	};

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 3, // 3px
			},
		})
	);

	return (
		<div className="flex flex-col gap-4 w-full h-full">
			<div className="flex justify-between">
				<span className="p-1 text-sm font-medium text-cyan-900 bg-cyan-200 rounded-lg h-fit w-fit dark:bg-cyan-950 dark:text-cyan-200">
					Kanban @dnd-kit
				</span>

				<Button variant={"outline"} size={"icon"}>
					<Trash />
				</Button>
			</div>

			<DndContext
				sensors={sensors}
				onDragEnd={onDragEnd}
				onDragStart={onDragStart}
				onDragOver={onDragOver}
			>
				<SortableContext items={columnsIds}>
					<div className="flex gap-4">
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
								onUpdateRowDescription={handleUpdateRowDescription}
							/>
						))}
					</div>
				</SortableContext>

				{createPortal(
					<DragOverlay>
						{activeColumn && (
							<ColumnContainer
								column={activeColumn}
								rows={rows || []}
								onDeleteColumn={handleDeleteColumn}
								onUpdateColumn={handleUpdateColumn}
								onAddRow={handleAddRow}
								onDeleteRow={handleDeleteRow}
								onUpdateRowTitle={handleUpdateRowTitle}
								onUpdateRowDescription={handleUpdateRowDescription}
							/>
						)}
						{activeRow && (
							<RowContainer
								row={activeRow}
								onDeleteRow={handleDeleteRow}
								onUpdateRowTitle={handleUpdateRowTitle}
								onUpdateRowDescription={handleUpdateRowDescription}
							/>
						)}
					</DragOverlay>,
					document.body
				)}
			</DndContext>

			<Button className="w-fit" variant={"outline"} onClick={handleAddColumn}>
				<Plus />
				Add Column
			</Button>
		</div>
	);
}
