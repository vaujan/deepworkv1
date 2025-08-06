import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
	MoreHorizontal,
	Edit3,
	Trash,
	Copy,
	Files,
} from "lucide-react";
import { KanbanCardProps } from "./types";
import {
	draggable,
	dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import {
	attachClosestEdge,
	extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

interface KanbanCardComponentProps extends KanbanCardProps {
	index: number;
	columnId: string;
}

export default function KanbanCard({
	card,
	onUpdate,
	onDelete,
	onDuplicate,
	index,
}: KanbanCardComponentProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState(card.title);
	const [isHovered, setIsHovered] = useState(false);
	const [isDraggedOver, setIsDraggedOver] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [, setClosestEdge] = useState<"top" | "bottom" | null>(null);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const cardRef = useRef<HTMLDivElement>(null);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const editingContainerRef = useRef<HTMLDivElement>(null);

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
				canDrop: ({ source }) => {
					// Only accept cards, not columns
					return source.data.type === "card";
				},
				getData: ({ input, element }) => {
					const data = {
						type: "card",
						id: card.id,
						columnId: card.column_id,
						index,
					};

					return attachClosestEdge(data, {
						input,
						element,
						allowedEdges: ["top", "bottom"],
					});
				},
				onDragEnter: ({ self, source }) => {
					// Only show visual feedback for cards
					if (source.data.type === "card") {
						setIsDraggedOver(true);
						const edge = extractClosestEdge(self.data);
						setClosestEdge(edge === "top" || edge === "bottom" ? edge : null);
					}
				},
				onDragLeave: () => {
					setIsDraggedOver(false);
					setClosestEdge(null);
				},
				onDrop: () => {
					setIsDraggedOver(false);
					setClosestEdge(null);
				},
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

	const handleEditClick = () => {
		setIsEditing(true);
		setDropdownOpen(false);
	};

	const handleCopyCard = () => {
		// Copy card content to clipboard
		navigator.clipboard.writeText(card.title);
		setDropdownOpen(false);
	};

	const handleDuplicateCard = () => {
		onDuplicate(card.id);
		setDropdownOpen(false);
	};

	const handleArchiveCard = () => {
		// TODO: Implement archive functionality (for now just delete)
		handleDelete();
		setDropdownOpen(false);
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && e.metaKey) {
			// Cmd/Ctrl + Enter to save
			e.preventDefault();
			handleSave();
		} else if (e.key === "Escape") {
			e.preventDefault();
			handleCancel();
		}
	};

	// Update local state when card props change
	useEffect(() => {
		setEditTitle(card.title);
	}, [card.title]);

	// Handle click outside to save when editing
	useEffect(() => {
		if (!isEditing) return;

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element;

			// Check if click is outside the editing container
			if (
				editingContainerRef.current &&
				!editingContainerRef.current.contains(target as Node)
			) {
				// Don't save if clicking on dropdown menu or other portaled content
				const isClickingOnPortal =
					target.closest("[data-radix-popper-content-wrapper]") ||
					target.closest('[role="menu"]') ||
					target.closest('[data-state="open"]');

				if (!isClickingOnPortal) {
					handleSave();
				}
			}
		};

		// Add event listener with a small delay to avoid immediate triggering
		const timeoutId = setTimeout(() => {
			document.addEventListener("mousedown", handleClickOutside);
		}, 100);

		return () => {
			clearTimeout(timeoutId);
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isEditing, handleSave]);

	if (isDragging) {
		return (
			<div className="h-16 mb-2 rounded-lg border-0 border-dashed border-accent/50 bg-accent/10" />
		);
	}

	return (
		<div
			ref={cardRef}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className={`relative p-2 w-full rounded-lg border cursor-grab active:cursor-grabbing transition-all duration-200 ${
				isDraggedOver
					? "border-accent/50 bg-accent/5 shadow-sm"
					: "border-border hover:border-accent/50 bg-card hover:bg-card/80 hover:shadow-sm"
			} ${isEditing ? "ring-2 ring-primary/50 cursor-default" : ""} group`}
			role="button"
			tabIndex={0}
			aria-label={`Card: ${card.title}`}
		>
			{isEditing ? (
				<div ref={editingContainerRef} className="space-y-3">
					<Textarea
						value={editTitle}
						onChange={(e) => handleTitleChange(e.target.value)}
						onKeyDown={handleKeyPress}
						placeholder="Enter card title..."
						className="min-h-[60px] resize-none border-0 bg-transparent p-0 font-medium text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
						style={{ backgroundColor: "transparent" }}
						autoFocus
					/>
					<div className="flex gap-2">
						<Button size="sm" onClick={handleSave} disabled={!editTitle.trim()}>
							Save
						</Button>
						<Button size="sm" variant="ghost" onClick={handleCancel}>
							Cancel
						</Button>
					</div>
				</div>
			) : (
				<>
					<div className="flex justify-between w-full">
						<div
							className="flex-1 cursor-text"
							onClick={(e) => {
								e.stopPropagation();
								setIsEditing(true);
							}}
						>
							<span className="font-medium text-sm text-foreground leading-snug break-words whitespace-pre-wrap">
								{card.title}
							</span>
						</div>

						{/* Single dropdown menu */}
						<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
							<DropdownMenuTrigger asChild>
								<Button
									size="sm"
									variant="ghost"
									className={`h-6 w-6 p-0 ml-2 transition-opacity hover:bg-accent/70 ${
										isHovered || dropdownOpen ? "opacity-100" : "opacity-0"
									}`}
									onClick={(e) => e.stopPropagation()}
									aria-label="Card options"
								>
									<MoreHorizontal className="h-3 w-3" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48" sideOffset={4}>
								<DropdownMenuItem
									onClick={handleEditClick}
									className="cursor-pointer"
								>
									<Edit3 className="mr-2 h-4 w-4" />
									Edit card
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={handleCopyCard}
									className="cursor-pointer"
								>
									<Copy className="mr-2 h-4 w-4" />
									Copy card content
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={handleDuplicateCard}
									className="cursor-pointer"
								>
									<Files className="mr-2 h-4 w-4" />
									Duplicate card
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={handleArchiveCard}
									className="text-destructive focus:text-destructive cursor-pointer"
								>
									<Trash className="mr-2 h-4 w-4" />
									Delete card
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</>
			)}
		</div>
	);
}
