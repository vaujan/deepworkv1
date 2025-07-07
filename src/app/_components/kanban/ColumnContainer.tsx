import React from "react";
import { ColumnProps } from "@/lib/types";
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
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ColumnContainer(columns: ColumnProps) {
	const { column, onDeleteColumn } = columns;

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
			className="flex flex-col gap-3 p-1 w-full rounded-xl border-0 border-pink-500/50 bg-pink-700/30 min-h-64 min-w-64 group"
		>
			{/* Header of the column */}
			<div className="flex justify-between items-center p-2 rounded-lg bg-pink-500/10">
				<span
					{...attributes}
					{...listeners}
					className="inline-flex items-center w-full h-full font-medium text-muted-foreground cursor-grab active:cursor-grabbing"
				>
					{column.title}
				</span>
				<Popover>
					<PopoverTrigger>
						{" "}
						<Button
							size={"icon"}
							className="bg-transparent size-8"
							variant={"secondary"}
						>
							<EllipsisVertical />
						</Button>
					</PopoverTrigger>

					<PopoverContent className="p-2 w-fit">
						<Button
							variant={"destructive"}
							onClick={() => onDeleteColumn(column.id)}
						>
							<Trash /> Delete
						</Button>
					</PopoverContent>
				</Popover>
			</div>

			{/* Task list for each column */}
			<ScrollArea className="h-fit max-h-[350px] rounded-md">
				<div className="flex flex-col p-2 mb-2 text-sm rounded-lg border bg-secondary border-pink-200/20 h-fit">
					<span>Task title</span>
					<p>Task description</p>
				</div>
				<div className="flex flex-col p-2 mb-2 text-sm rounded-lg border bg-secondary border-pink-200/20 h-fit">
					<span>Task title</span>
					<p>Task description</p>
				</div>
			</ScrollArea>
			<Button
				size={"sm"}
				className="text-xs bg-transparent border-0 opacity-0 hover:opacity-100 group-hover:opacity-50"
				variant={"outline"}
			>
				<Plus />
			</Button>
		</div>
	);
}
