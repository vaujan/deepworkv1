import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { EllipsisVertical, KanbanIcon, Plus, Trash } from "lucide-react";
import { KanbanColumnProps } from "./types";
import KanbanCard from "./Card";
import {
	draggable,
	dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";

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
		if (newCardTitle.trim()) {
			await onCreateCard(column.id, newCardTitle.trim());
			setNewCardTitle("");
			setShowAddCard(false);
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
			<div
				ref={dragHandleRef}
				className="flex justify-between items-center rounded-xl p-3 bg-card cursor-grab active:cursor-grabbing hover:bg-card/80 transition-colors"
			>
				{editMode ? (
					<Input
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
						autoFocus
						className="text-base font-medium"
					/>
				) : (
					<h3
						onClick={() => setEditMode(true)}
						className="flex-1 text-base w-fit cursor-grab font-medium p-1 rounded hover:bg-muted/20 transition-colors"
					>
						{column.name}
					</h3>
				)}

				<div className="flex items-center gap-1">
					<Popover>
						<PopoverTrigger asChild>
							<Button
								size="sm"
								variant="ghost"
								className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
							>
								<EllipsisVertical className="h-4 w-4" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-fit border-full p-2">
							<Button
								variant="ghostDestructive"
								size="sm"
								onClick={handleColumnDelete}
								className="w-full justify-start"
							>
								<Trash className="mr-2 h-4 w-4" />
								Delete Column
							</Button>
						</PopoverContent>
					</Popover>
				</div>
			</div>

			{/* Cards Area */}
			<ScrollArea className="flex-1 p-2 max-h-[480px]">
				<div className="space-y-2">
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

					{/* Drop zone when column is empty */}
					{column.cards.length === 0 && (
						<div className="flex items-center justify-center p-8 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
							<KanbanIcon className="mr-2 h-4 w-4" />
							No card available
						</div>
					)}
				</div>
			</ScrollArea>

			{/* Add Card Section */}
			<div className="p-2 border-t border-border/20">
				{showAddCard ? (
					<div className="space-y-2">
						<Input
							value={newCardTitle}
							onChange={(e) => setNewCardTitle(e.target.value)}
							onKeyDown={handleKeyPress}
							placeholder="Enter card title..."
							autoFocus
							className="text-sm"
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
						className="w-full justify-start text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
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
