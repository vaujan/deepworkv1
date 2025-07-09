import React from "react";
import { RowProps } from "./types";
import { Check, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function RowContainer(rows: RowProps) {
	const { row, onDeleteRow, onUpdateRowDescription, onUpdateRowTitle } = rows;
	const [mouseIsOver, setMouseIsOver] = React.useState(false);
	const [editMode, setEditMode] = React.useState(false);

	const toggleEditMode = () => {
		setEditMode(!editMode);
	};

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

	const style = { transition, transform: CSS.Transform.toString(transform) };

	if (isDragging) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				className="flex gap-3 justify-between p-2 mb-2 rounded-lg border-2 bg-secondary/50 border-accent"
			>
				<div
					className="flex flex-col gap-2"
					onKeyDown={(e) => {
						if (e.key !== "Enter") return;
						setEditMode(false);
					}}
				>
					{editMode === true ? (
						<input
							type="text"
							className="w-full border-foreground/50 selection:bg-transparent focus:outline-0 text-foreground focus:border-b-1"
							onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
								onUpdateRowTitle(row.id, event.target.value)
							}
							onBlur={() => setEditMode(false)}
							value={row.title}
							onKeyDown={(e) => {
								if (e.key !== "Enter" && e.key !== "Escape") return;
								setEditMode(false);
							}}
							placeholder="Add title"
						/>
					) : (
						<span onClick={() => setEditMode(true)} className="font-medium">
							{row.title}
						</span>
					)}
					{editMode === true ? (
						<input
							type="text"
							className="w-full border-foreground/50 selection:bg-transparent focus:outline-0 text-foreground focus:border-b-1"
							onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
								onUpdateRowDescription(row.id, event.target.value)
							}
							value={row.description}
							onKeyDown={(e) => {
								if (e.key !== "Enter" && e.key !== "Escape") return;
								setEditMode(false);
							}}
							placeholder="Add description"
						/>
					) : (
						<p
							onClick={() => setEditMode(true)}
							className="text-muted-foreground"
						>
							{row.description}
						</p>
					)}
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
			className="flex gap-3 justify-between p-2 mb-2 rounded-lg border cursor-grab active:cursor-grabbing bg-secondary"
		>
			<div
				className="flex flex-col gap-2"
				onKeyDown={(e) => {
					if (e.key !== "Enter") return;
					setEditMode(false);
				}}
			>
				{editMode === true ? (
					<input
						type="text"
						className="w-full border-foreground/50 selection:bg-transparent focus:outline-0 text-foreground focus:border-b-1"
						onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
							onUpdateRowTitle(row.id, event.target.value)
						}
						onBlur={() => setEditMode(false)}
						value={row.title}
						onKeyDown={(e) => {
							if (e.key !== "Enter" && e.key !== "Escape") return;
							setEditMode(false);
						}}
						placeholder="Add title"
					/>
				) : (
					<span onClick={() => setEditMode(true)} className="font-medium">
						{row.title}
					</span>
				)}
				{editMode === true ? (
					<input
						type="text"
						className="w-full border-foreground/50 selection:bg-transparent focus:outline-0 text-foreground focus:border-b-1"
						onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
							onUpdateRowDescription(row.id, event.target.value)
						}
						value={row.description}
						onKeyDown={(e) => {
							if (e.key !== "Enter" && e.key !== "Escape") return;
							setEditMode(false);
						}}
						placeholder="Add description"
					/>
				) : (
					<p
						onClick={() => setEditMode(true)}
						className="text-muted-foreground"
					>
						{row.description}
					</p>
				)}
			</div>
			{mouseIsOver && (
				<div className="flex gap-1">
					{editMode === false ? (
						<Button
							onClick={() => toggleEditMode()}
							size="sm"
							className="shadow-none opacity-60 size-8 hover:opacity-100"
							variant={"ghost"}
						>
							<Pencil />
						</Button>
					) : (
						<Button
							onClick={() => toggleEditMode()}
							size="sm"
							className="shadow-none opacity-60 size-8 hover:opacity-100"
							variant={"default"}
						>
							<Check />
						</Button>
					)}
					<Button
						onClick={() => onDeleteRow(row.id)}
						size="sm"
						className="shadow-none opacity-60 size-8 hover:opacity-100"
						variant={"ghostDestructive"}
					>
						<Trash />
					</Button>
				</div>
			)}
		</div>
	);
}
