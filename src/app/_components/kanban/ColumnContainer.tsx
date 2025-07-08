import React from "react";
import { ColumnProps, Row } from "./types";
import { Button } from "@/components/ui/button";
import {
	ChartColumnDecreasingIcon,
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
import { v4 as uuidv4 } from "uuid";
import RowContainer from "./RowContainer";
import { rootTaskDispose } from "next/dist/build/swc/generated-native";

export default function ColumnContainer(columns: ColumnProps) {
	const { column, onDeleteColumn, onUpdateColumn, addRow } = columns;
	const [editMode, setEditMode] = React.useState(false);

	const [rows, setRows] = React.useState<Row[] | null>();
	const [activeRow, setActiveRow] = React.useState<Row | null>([]);

	const rowId = React.useMemo(() => rows?.map((row) => row.id), [rows]);

	const handleAddRow = (columnId: string) => {
		if (!rows) {
			const firstRow: Row = {
				id: uuidv4(),
				columnId: columnId,
				title: "Task #1",
				description: "Current task description",
			};

			setRows([firstRow]);
		}

		const newRow: Row = {
			id: uuidv4(),
			columnId: columnId,
			title: "Task #1",
			description: "Current task description",
		};

		setRows(rows ? [...rows, newRow] : [newRow]);
	};

	const handleDeleteRow = (id: string) => {
		const filteredRows = rows?.filter((row) => row.id !== id);
		setRows(filteredRows);
	};

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
			{...attributes}
			{...listeners}
			className="flex flex-col gap-3 justify-between p-1 w-full rounded-xl border-0 border-pink-500/50 bg-pink-700/30 min-h-64 min-w-64 group cursor-grab active:cursor-grabbing"
		>
			{/* Header of the column */}
			<div className="flex justify-between items-center p-2 rounded-lg bg-pink-500/10">
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

			{/* Content */}
			{/* Task list for each column */}
			<ScrollArea className="h-full max-h-[350px] rounded-md shadow-inner">
				{rows?.map((row) => (
					<RowContainer key={row.id} row={row} onDeleteRow={handleDeleteRow} />
				))}
			</ScrollArea>

			{/* Footer */}
			<div className="p-2">
				<Button
					size={"sm"}
					className="w-full text-xs bg-transparent border-0 opacity-0 border-foreground/15 hover:border-1 hover:bg-foreground/5 text-foreground hover:opacity-100 group-hover:opacity-50"
					variant={"default"}
					onClick={() => handleAddRow(column.id)}
				>
					<Plus />
					Add Task
				</Button>
			</div>
		</div>
	);
}
