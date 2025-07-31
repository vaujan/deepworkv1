import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Plus, Trash, GripVertical } from "lucide-react";
import { KanbanColumnProps } from "./types";
import KanbanCard from "./Card";
import {
	draggable,
	dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { toast } from "sonner";

const ColumnContainer = React.memo(function ColumnContainer({
	column,
	index,
	onUpdateColumn,
	onDeleteColumn,
	onCreateCard,
	onUpdateCard,
	onDeleteCard,
}: KanbanColumnProps) {
	const [editMode, setEditMode] = useState(false);
	const [editValue, setEditValue] = useState(column.name);
	const [newCardTitle, setNewCardTitle] = useState("");
	const [showAddCard, setShowAddCard] = useState(false);
	const [isDraggedOver, setIsDraggedOver] = useState(false);

	const columnRef = useRef<HTMLDivElement>(null);
	const dragHandleRef = useRef<HTMLDivElement>(null);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (editMode && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [editMode]);

	useEffect(() => {
		const element = columnRef.current;
		const dragHandle = dragHandleRef.current;

		if (!element || !dragHandle) return;

		return combine(
			draggable({
				element: dragHandle,
				getInitialData: () => ({
					type: "column",
					id: column.id,
					boardId: column.board_id,
					index,
				}),
				onGenerateDragPreview: ({ nativeSetDragImage }) => {
					setCustomNativeDragPreview({
						nativeSetDragImage,
						render: ({ container }) => {
							const preview = element.cloneNode(true) as HTMLElement;
							preview.style.width = `${element.offsetWidth}px`;
							preview.style.height = `${element.offsetHeight}px`;
							preview.style.opacity = "0.8";
							preview.style.transform = "rotate(5deg)";
							container.appendChild(preview);
						},
						getOffset: pointerOutsideOfPreview({ x: "16px", y: "8px" }),
					});
				},
			}),
			dropTargetForElements({
				element,
				getData: () => ({
					type: "column",
					id: column.id,
					index,
				}),
				onDragEnter: () => setIsDraggedOver(true),
				onDragLeave: () => setIsDraggedOver(false),
				onDrop: () => setIsDraggedOver(false),
			})
		);
	}, [column.id, column.board_id, index]);

	// Update local state when column name changes from external sources
	useEffect(() => {
		setEditValue(column.name);
	}, [column.name]);

	// Cleanup debounce timer on unmount
	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, []);

	const handleColumnNameChange = (newName: string) => {
		setEditValue(newName);

		// Clear existing timer
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		// Debounce database update by 500ms
		debounceTimerRef.current = setTimeout(() => {
			if (newName.trim() && newName.trim() !== column.name) {
				onUpdateColumn(column.id, { name: newName.trim() });
			}
		}, 500);
	};

	const handleColumnNameSave = () => {
		// Clear any pending debounced update
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
			debounceTimerRef.current = null;
		}

		// Save immediately if there are changes
		if (editValue.trim() && editValue.trim() !== column.name) {
			onUpdateColumn(column.id, { name: editValue.trim() });
		} else if (!editValue.trim()) {
			// Reset to original value if empty
			setEditValue(column.name);
		}

		setEditMode(false);
	};

	const handleColumnNameCancel = () => {
		// Clear any pending debounced update
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
			debounceTimerRef.current = null;
		}

		// Reset to original value
		setEditValue(column.name);
		setEditMode(false);
	};

	const handleColumnDelete = () => {
		onDeleteColumn(column.id);
	};

	const handleAddCard = async () => {
		const trimmedTitle = newCardTitle.trim();
		if (trimmedTitle) {
			setNewCardTitle("");
			try {
				await onCreateCard(column.id, trimmedTitle);
			} catch (error) {
				toast.error("Failed to create card. Please try again.");
				setNewCardTitle(trimmedTitle); // Restore the input on failure
				console.error("Failed to create card:", error);
			}
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleAddCard();
		} else if (e.key === "Escape") {
			setNewCardTitle("");
			setShowAddCard(false);
		}
	};

	return (
		<div
			ref={columnRef}
			className={`flex flex-col min-w-[300px] w-[300px] h-fit rounded-xl border ${
				isDraggedOver
					? "border-accent border-2 bg-accent/5"
					: "border-border/50"
			} bg-card/60 group transition-colors`}
		>
			{/* Column Header */}
			<div className="flex justify-between items-center p-3 hover:bg-card/80 transition-colors">
				<div className="flex items-center gap-2 flex-1">
					{/* Dedicated Drag Handle */}
					<div
						ref={dragHandleRef}
						className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted/50 rounded opacity-50 hover:opacity-100 transition-all"
						title="Drag to reorder column"
					>
						<GripVertical className="h-4 w-4" />
					</div>

					{/* Column Name */}
					{editMode ? (
						<Input
							ref={inputRef}
							value={editValue}
							onChange={(e) => handleColumnNameChange(e.target.value)}
							onBlur={handleColumnNameSave}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleColumnNameSave();
								}
								if (e.key === "Escape") {
									e.preventDefault();
									handleColumnNameCancel();
								}
							}}
							className="text-base font-medium flex-1"
						/>
					) : (
						<h3
							onClick={() => setEditMode(true)}
							className="flex-1 text-base font-medium p-1 cursor-pointer hover:bg-muted/30 rounded transition-colors"
							title="Click to edit column name"
						>
							{column.name}
						</h3>
					)}
				</div>

				<div className="flex items-center gap-1">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button variant={"ghost"} className="size-6">
								<EllipsisVertical />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-[250px]">
							<DropdownMenuLabel>Action list</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{/* <DropdownMenuItem
								onClick={() => {
									setEditMode(true);
								}}
							>
								<Pencil /> Rename
							</DropdownMenuItem> */}
							<DropdownMenuItem
								onClick={handleColumnDelete}
								variant="destructive"
							>
								<Trash />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Cards Area */}
			<ScrollArea className="w-full max-h-[480px]">
				<div className="p-2">
					{column.cards.map((card, cardIndex) => (
						<KanbanCard
							key={card.id}
							card={card}
							onUpdate={onUpdateCard}
							onDelete={onDeleteCard}
							index={cardIndex}
							columnId={column.id}
						/>
					))}
				</div>
			</ScrollArea>

			{/* Add Card Section */}
			<div className={`p-2 bg-card -mt-2`}>
				{showAddCard ? (
					<div className="space-y-2">
						<Input
							value={newCardTitle}
							onChange={(e) => setNewCardTitle(e.target.value)}
							onKeyDown={handleKeyPress}
							placeholder="Enter card title..."
							autoFocus
							className="text-sm mt-2"
							onBlur={() => {
								if (!newCardTitle.trim()) {
									setShowAddCard(false);
								}
							}}
						/>
						<div className="flex gap-2">
							<Button
								size="sm"
								onClick={handleAddCard}
								disabled={!newCardTitle.trim()}
							>
								Add Card
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => {
									setShowAddCard(false);
									setNewCardTitle("");
								}}
							>
								Cancel
							</Button>
						</div>
					</div>
				) : (
					<Button
						size="sm"
						variant="ghost"
						onClick={() => setShowAddCard(true)}
						className="w-full justify-start text-muted-foreground transition-opacity"
					>
						<Plus className="mr-2 h-4 w-4" />
						Add a card
					</Button>
				)}
			</div>
		</div>
	);
});

export default ColumnContainer;
