import React from "react";
import { RowProps } from "./types";
import { Check, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";

export default function RowContainer(rows: RowProps) {
	const { row, onDeleteRow, onUpdateRowTitle } = rows;
	const [mouseIsOver, setMouseIsOver] = React.useState(false);
	const [editMode, setEditMode] = React.useState(false);
	const [editValue, setEditValue] = React.useState(row.title);

	const handleEditComplete = () => {
		setEditMode(false);
		// If the edit value is empty, delete the row
		if (!editValue || editValue === "") {
			onDeleteRow(row.id);
		} else {
			// Otherwise, update the title
			onUpdateRowTitle(row.id, editValue);
		}
	};

	// Update editValue when row.title changes (e.g., from external updates)
	React.useEffect(() => {
		setEditValue(row.title);
	}, [row.title]);

	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: row.id,
		data: {
			type: "Row",
			row,
		},
		disabled: editMode,
	});

	// Add droppable functionality for the row
	const { isOver } = useDroppable({
		id: row.id,
		data: {
			type: "Row",
			row,
		},
	});

	const style = { transition, transform: CSS.Transform.toString(transform) };

	if (isDragging) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				className="flex min-h-15 gap-3 justify-between opacity-50 p-2 mb-2 rounded-lg bg-accent/25 border-2 border-accent/80 border-dashed"
			>
				<div className="flex opacity-0 flex-col gap-2">
					<span className="font-medium text-foreground">{row.title}</span>
					{/* <p className="text-muted-foreground text-sm">{row.description}</p> */}
				</div>
			</div>
		);
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onMouseEnter={() => setMouseIsOver(true)}
			onMouseLeave={() => setMouseIsOver(false)}
			className={`flex gap-3 justify-between p-2 my-2 rounded-lg min-h-15 cursor-grab active:cursor-grabbing bg-secondary border transition-all duration-200${
				isOver
					? "border-accent border-2 bg-accent/10 shadow-lg scale-[1.02]"
					: "border-border hover:border-accent/50"
			}`}
			aria-label={`Task: ${row.title}. Drag to reorder or move to different column.`}
		>
			<div className="flex flex-col gap-2 flex-1">
				{editMode === true ? (
					<input
						type="text"
						className="w-full border-foreground/50 selection:bg-transparent focus:outline-0 text-foreground focus:border-b-1"
						onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
							setEditValue(event.target.value)
						}
						autoFocus
						// onBlur={handleEditComplete}
						value={editValue}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleEditComplete();
							} else if (e.key === "Escape") {
								setEditMode(false);
								setEditValue(row.title); // Reset to original value
							}
						}}
						placeholder="Add title"
						aria-label="Edit task title"
					/>
				) : (
					<span className="font-medium px-1 py-0.5 rounded transition-colors">
						{row.title}
					</span>
				)}
			</div>

			{/* Drop indicator when hovering over this row */}
			{isOver && (
				<div className="absolute inset-0 border-2 border-dashed border-accent bg-accent/5 rounded-lg pointer-events-none animate-pulse" />
			)}

			{mouseIsOver && (
				<div className="flex gap-1">
					{editMode === false ? (
						<Button
							onClick={() => setEditMode(true)}
							size="sm"
							className="shadow-none opacity-60 size-8 rounded-full hover:opacity-100"
							variant={"ghost"}
							aria-label="Edit task"
						>
							<Pencil />
						</Button>
					) : (
						<Button
							onClick={() => setEditMode(false)}
							size="sm"
							className="shadow-none opacity-60 size-8 rounded-full hover:opacity-100"
							variant={"default"}
							aria-label="Save changes"
						>
							<Check />
						</Button>
					)}
					<Button
						onClick={() => onDeleteRow(row.id)}
						size="sm"
						className="shadow-none opacity-60 rounded-full size-8 hover:opacity-100"
						variant={"ghostDestructive"}
						aria-label="Delete task"
					>
						<Trash />
					</Button>
				</div>
			)}
		</div>
	);
}
