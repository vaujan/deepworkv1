import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Column } from "@/lib/types";
import ColumnContainer from "./ColumnContainer";
import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

export default function KanbanDnDKit() {
	const [columns, setColumns] = React.useState<Column[]>([]);
	const [activeColumn, setActiveColumn] = React.useState<Column | null>(null);

	const columnsId = React.useMemo(
		() => columns.map((col) => col.id),
		[columns]
	);

	const logColumns = () => {
		console.log("columns:", columns);
	};

	const handleAddColumn = () => {
		setColumns([
			...columns,
			{
				id: uuidv4(),
				title: `Column #${columns.length + 1}`,
			},
		]);

		logColumns();
	};

	const handleDeleteColumn = (id: string) => {
		const filteredColumns = columns.filter((col) => col.id !== id);
		setColumns(filteredColumns);
	};

	// Handles the start of a drag operation
	const onDragStart = (event: DragStartEvent) => {
		// Check if we're dragging a Column type element
		if (event.active.data.current?.type === "Column") {
			// Store the dragged column in state to show in drag overlay
			setActiveColumn(event.active.data.current.column);
			return;
		}
	};

	// Handles when a drag operation ends
	const onDragEnd = (event: DragEndEvent) => {
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
	};

	return (
		<div className="flex flex-col gap-3 w-full rounded-lg h-fit">
			<div className="flex justify-between">
				<span className="p-1 text-sm font-medium text-cyan-900 bg-cyan-200 rounded-lg h-fit w-fit dark:bg-cyan-950 dark:text-cyan-200">
					Kanban @dnd-kit
				</span>

				<Button
					onClick={() => setColumns([])}
					variant={"outline"}
					size={"icon"}
					className="size-8"
				>
					<Trash />
				</Button>
			</div>

			<div className="flex gap-3">
				<DndContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
					<SortableContext items={columnsId}>
						{columns.map((column) => (
							<ColumnContainer
								key={column.id}
								column={column}
								onDeleteColumn={handleDeleteColumn}
							/>
						))}
					</SortableContext>

					{createPortal(
						<DragOverlay>
							{activeColumn && (
								<ColumnContainer
									column={activeColumn}
									onDeleteColumn={handleDeleteColumn}
								/>
							)}
						</DragOverlay>,
						document.body
					)}
				</DndContext>
			</div>

			<Button className="w-fit" variant={"outline"} onClick={handleAddColumn}>
				<Plus />
				Add Column
			</Button>
		</div>
	);
}
