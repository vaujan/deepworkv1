import React from "react";
import { ColumnProps } from "./types";
import { Button } from "@/components/ui/button";
import {
	EllipsisVertical,
	Plus,
	SquareDashedMousePointer,
	Trash,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import RowContainer from "./RowContainer";
import { Row } from "./types";
import { Input } from "@/components/ui/input";

const ColumnContainer = React.memo(function ColumnContainer(
	columns: ColumnProps
) {
	const {
		rows,
		column,
		onDeleteColumn,
		onUpdateColumn,
		onAddRow,
		onDeleteRow,
		onUpdateRowTitle,
	} = columns;

	const [editMode, setEditMode] = React.useState(false);

	const rowsIds = React.useMemo(
		() => rows.filter((row) => row.columnId === column.id).map((row) => row.id),
		[rows, column.id]
	);

	const columnRows = React.useMemo(
		() => rows.filter((row: Row) => row.columnId === column.id),
		[rows, column.id]
	);

	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: column.id,
		data: {
			type: "Column",
			column,
		},
		disabled: editMode,
	});

	// Add droppable functionality for the column
	const { setNodeRef: setDroppableRef, isOver } = useDroppable({
		id: column.id,
		data: {
			type: "Column",
			column,
		},
	});

	const handleColumnUpdate = React.useCallback(
		(value: string) => {
			onUpdateColumn(column.id, value);
		},
		[onUpdateColumn, column.id]
	);

	const handleColumnDelete = React.useCallback(() => {
		onDeleteColumn(column.id);
	}, [onDeleteColumn, column.id]);

	const handleAddRowToColumn = React.useCallback(() => {
		onAddRow(column.id);
	}, [onAddRow, column.id]);

	if (isDragging) {
		return (
			<div
				ref={setNodeRef}
				className="flex flex-col gap-3 justify-center items-center px-4 pt-3 pb-4 w-full rounded-xl border-4 border-dashed animate-pulse opacity-15 min-h-64 min-w-64 group"
			>
				<SquareDashedMousePointer className="animate-pulse" />
			</div>
		);
	}
	const style = { transition, transform: CSS.Transform.toString(transform) };

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="flex flex-col min-w-[350px] justify-between w-[350px] h-fit rounded-xl border-0 border-border/50 bg-card/60 group"
		>
			{/* Header of the column */}
			<div
				{...attributes}
				{...listeners}
				className="flex justify-between items-center rounded-xl p-2 bg-card cursor-grab active:cursor-grabbing"
			>
				<span
					onClick={() => setEditMode(true)}
					className="inline-flex items-center w-full h-full font-medium text-secondary-foreground"
				>
					{editMode === true ? (
						<Input
							className="w-full text-base border-foreground/50 selection:bg-transparent focus:outline-0 text-foreground focus:border-b-1"
							onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
								handleColumnUpdate(event?.target.value)
							}
							value={column.title}
							autoFocus
							onBlur={() => {
								setEditMode(false);
							}}
							onKeyDown={(e) => {
								if (e.key !== "Enter") return;
								setEditMode(false);
							}}
						/>
					) : (
						<span className="cursor-text p-3">{column.title}</span>
					)}
				</span>
				<Popover>
					<PopoverTrigger>
						<Button
							size={"icon"}
							className="bg-transparent shadow-none hover:bg-foreground/10 size-8"
							variant={"secondary"}
						>
							<EllipsisVertical />
						</Button>
					</PopoverTrigger>

					<PopoverContent className="p-2 w-fit">
						<Button variant={"ghostDestructive"} onClick={handleColumnDelete}>
							<Trash /> Delete
						</Button>
					</PopoverContent>
				</Popover>
			</div>

			{/* Content */}
			{/* Task list for each column */}
			<ScrollArea
				ref={setDroppableRef}
				className={`h-full p-2 max-h-[350px] transition-all ease-out rounded-md [&[data-state=scrolling]]:shadow-inner ${
					isOver ? "bg-accent/20 border-2 border-dashed border-accent" : ""
				}`}
			>
				<SortableContext items={rowsIds}>
					{columnRows.map((row: Row) => (
						<RowContainer
							key={row.id}
							row={row}
							onDeleteRow={() => onDeleteRow(row.id)}
							onUpdateRowTitle={onUpdateRowTitle}
						/>
					))}
				</SortableContext>

				{/* Drop zone indicator when column is empty */}
				{columnRows.length === 0 && isOver && (
					<div className="flex items-center justify-center p-8 text-muted-foreground border-2 border-dashed border-accent rounded-lg m-2">
						<Plus className="mr-2 h-4 w-4" />
						Drop task here
					</div>
				)}
			</ScrollArea>

			{/* Footer */}
			<div className="p-2">
				<Button
					size={"sm"}
					className="w-full text-xs bg-transparent border-0 shadow-none opacity-0 border-foreground/15 hover:border-1 hover:bg-foreground/5 text-foreground hover:opacity-100 group-hover:opacity-50"
					variant={"default"}
					onClick={handleAddRowToColumn}
				>
					<Plus />
					Add Task
				</Button>
			</div>
		</div>
	);
});

export default ColumnContainer;
