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
import RowContainer from "./RowContainer";
import { Row } from "./types";

export default function ColumnContainer(columns: ColumnProps) {
	const {
		rows,
		column,
		onDeleteColumn,
		onUpdateColumn,
		onAddRow,
		onDeleteRow,
		onUpdateRowDescription,
		onUpdateRowTitle,
	} = columns;

	const [editMode, setEditMode] = React.useState(false);

	const rowsIds = React.useMemo(
		() => rows.filter((row) => row.columnId === column.id).map((row) => row.id),
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
			className="flex flex-col gap-3 justify-between p-1 w-full rounded-xl border-0 border-border/50 bg-card/60 min-h-64 min-w-64 group"
		>
			{/* Header of the column */}
			<div
				{...attributes}
				{...listeners}
				className="flex justify-between items-center p-2 rounded-lg bg-card cursor-grab active:cursor-grabbing"
			>
				<span
					onClick={() => setEditMode(true)}
					className="inline-flex items-center w-full h-full font-medium text-secondary-foreground"
				>
					{editMode === true ? (
						<input
							className="w-full border-foreground/50 selection:bg-transparent focus:outline-0 text-foreground focus:border-b-1"
							onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
								onUpdateColumn(column.id, event?.target.value)
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
						<span className="cursor-text">{column.title}</span>
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
						<Button
							variant={"ghostDestructive"}
							onClick={() => onDeleteColumn(column.id)}
						>
							<Trash /> Delete
						</Button>
					</PopoverContent>
				</Popover>
			</div>

			{/* Content */}
			{/* Task list for each column */}
			<ScrollArea className="h-full max-h-[350px] transition-all ease-out rounded-md [&[data-state=scrolling]]:shadow-inner">
				<SortableContext items={rowsIds}>
					{rows
						?.filter((row: Row) => row.columnId === column.id)
						.map((row: Row) => (
							<RowContainer
								key={row.id}
								row={row}
								onDeleteRow={() => onDeleteRow(row.id)}
								onUpdateRowDescription={onUpdateRowDescription}
								onUpdateRowTitle={onUpdateRowTitle}
							/>
						))}
				</SortableContext>
			</ScrollArea>

			{/* Footer */}
			<div className="p-2">
				<Button
					size={"sm"}
					className="w-full text-xs bg-transparent border-0 shadow-none opacity-0 border-foreground/15 hover:border-1 hover:bg-foreground/5 text-foreground hover:opacity-100 group-hover:opacity-50"
					variant={"default"}
					onClick={() => onAddRow(column.id)}
				>
					<Plus />
					Add Task
				</Button>
			</div>
		</div>
	);
}
