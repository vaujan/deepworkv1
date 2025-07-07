import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Column } from "@/lib/types";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
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

	const onDragStart = (event: DragStartEvent) => {
		if (event.active.data.current?.type === "Column") {
			setActiveColumn(event.active.data.current.column);
			return;
		}
	};

	return (
		<div className="flex flex-col gap-3 w-full rounded-lg h-fit">
			<div className="flex justify-between">
				<span className="p-1 text-sm font-medium text-cyan-900 bg-cyan-200 rounded-lg w-fit dark:bg-cyan-950 dark:text-cyan-200">
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
				<DndContext onDragStart={onDragStart}>
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
