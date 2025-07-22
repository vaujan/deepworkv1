import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash, Check, X } from "lucide-react";
import { KanbanCardProps } from "./types";
import {
	draggable,
	dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";

interface KanbanCardComponentProps extends KanbanCardProps {
	index: number;
	columnId: string;
}

export default function KanbanCard({
	card,
	onUpdate,
	onDelete,
	index,
}: KanbanCardComponentProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState(card.title);
	const [isHovered, setIsHovered] = useState(false);
	const [isDraggedOver, setIsDraggedOver] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const cardRef = useRef<HTMLDivElement>(null);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const element = cardRef.current;
		if (!element) return;

		return combine(
			draggable({
				element,
				getInitialData: () => ({
					type: "card",
					id: card.id,
					columnId: card.column_id,
					boardId: card.board_id,
					index,
				}),
				onDragStart: () => setIsDragging(true),
				onDrop: () => setIsDragging(false),
				onGenerateDragPreview: ({ nativeSetDragImage }) => {
					setCustomNativeDragPreview({
						nativeSetDragImage,
						render: ({ container }) => {
							const preview = element.cloneNode(true) as HTMLElement;
							preview.style.width = `${element.offsetWidth}px`;
							preview.style.opacity = "0.8";
							preview.style.transform = "rotate(3deg)";
							container.appendChild(preview);
						},
						getOffset: pointerOutsideOfPreview({ x: "8px", y: "8px" }),
					});
				},
			}),
			dropTargetForElements({
				element,
				getData: () => ({
					type: "card",
					id: card.id,
					columnId: card.column_id,
					index,
				}),
				onDragEnter: () => setIsDraggedOver(true),
				onDragLeave: () => setIsDraggedOver(false),
				onDrop: () => setIsDraggedOver(false),
			})
		);
	}, [card.id, card.column_id, card.board_id, index]);

	// Cleanup debounce timer on unmount
	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, []);

	// Debounced update function
	const handleTitleChange = (value: string) => {
		setEditTitle(value);

		// Clear existing timer
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		// Debounce database update by 1 second for cards
		debounceTimerRef.current = setTimeout(() => {
			if (value.trim() && value.trim() !== card.title) {
				onUpdate(card.id, { title: value.trim() });
			}
		}, 1000);
	};

	const handleSave = () => {
		// Clear any pending debounced update
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
			debounceTimerRef.current = null;
		}

		// Save immediately if there are changes
		if (editTitle.trim() && editTitle.trim() !== card.title) {
			onUpdate(card.id, { title: editTitle.trim() });
		}

		if (!editTitle.trim()) {
			// Reset to original if title is empty
			setEditTitle(card.title);
		}

		setIsEditing(false);
	};

	const handleCancel = () => {
		// Clear any pending debounced update
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
			debounceTimerRef.current = null;
		}

		// Reset to original value
		setEditTitle(card.title);
		setIsEditing(false);
	};

	const handleDelete = () => {
		onDelete(card.id);
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSave();
		} else if (e.key === "Escape") {
			handleCancel();
		}
	};

	// Update local state when card props change
	useEffect(() => {
		setEditTitle(card.title);
	}, [card.title]);

	if (isDragging) {
		return (
			<div className="h-16 mb-2 rounded-lg border-2 border-dashed border-accent/50 bg-accent/10" />
		);
	}

	return (
		<div
			ref={cardRef}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className={`p-3 mb-2 rounded-lg border cursor-grab active:cursor-grabbing transition-all duration-200 ${
				isDraggedOver
					? "border-accent border-2 bg-accent/10 shadow-lg scale-[1.02]"
					: "border-border hover:border-accent/50 bg-card hover:bg-card/80"
			} ${isEditing ? "ring-2 ring-primary/50" : ""} group`}
			role="button"
			tabIndex={0}
			aria-label={`Card: ${card.title}`}
		>
			{isEditing ? (
				<div className="space-y-2">
					<Input
						value={editTitle}
						onChange={(e) => handleTitleChange(e.target.value)}
						onKeyDown={handleKeyPress}
						placeholder="Card title..."
						className="font-medium"
						autoFocus
					/>
					<div className="flex gap-2">
						<Button size="sm" onClick={handleSave} disabled={!editTitle.trim()}>
							<Check className="mr-1 h-3 w-3" />
							Save
						</Button>
						<Button size="sm" variant="outline" onClick={handleCancel}>
							<X className="mr-1 h-3 w-3" />
							Cancel
						</Button>
					</div>
				</div>
			) : (
				<>
					<div className="flex justify-between items-center gap-2">
						<h4 className="flex-1 font-medium text-sm text-foreground leading-snug break-words">
							{card.title}
						</h4>

						{/* Action buttons */}
						{(isHovered || isEditing) && (
							<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
								<Button
									size="sm"
									variant="ghost"
									onClick={(e) => {
										e.stopPropagation();
										setIsEditing(true);
									}}
									className="h-6 w-6 p-0 hover:bg-accent"
									aria-label="Edit card"
								>
									<Pencil className="h-3 w-3" />
								</Button>
								<Button
									size="sm"
									variant="ghost"
									onClick={(e) => {
										e.stopPropagation();
										handleDelete();
									}}
									className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
									aria-label="Delete card"
								>
									<Trash className="h-3 w-3" />
								</Button>
							</div>
						)}
					</div>
				</>
			)}

			{/* Drop indicator */}
			{isDraggedOver && (
				<div className="absolute inset-0 border-2 border-dashed border-accent bg-accent/5 rounded-lg pointer-events-none animate-pulse" />
			)}
		</div>
	);
}
