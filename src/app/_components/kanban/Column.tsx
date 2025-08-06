import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Plus, Trash, Files } from "lucide-react";
import { KanbanColumnProps } from "./types";
import KanbanCard from "./Card";
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
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { toast } from "sonner";

const ColumnContainer = React.memo(function ColumnContainer({
	column,
	index,
	onUpdateColumn,
	onDeleteColumn,
	onDuplicateColumn,
	onCreateCard,
	onUpdateCard,
	onDeleteCard,
	onDuplicateCard,
}: KanbanColumnProps) {
	const [editMode, setEditMode] = useState(false);
	const [editValue, setEditValue] = useState(column.name);
	const [newCardTitle, setNewCardTitle] = useState("");
	const [showAddCard, setShowAddCard] = useState(false);
	const [isDraggedOver, setIsDraggedOver] = useState(false);
	const [closestEdge, setClosestEdge] = useState<"left" | "right" | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	const columnRef = useRef<HTMLDivElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);
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
		const header = headerRef.current;

		if (!element || !header) return;

		const cleanupDragDrop = combine(
			draggable({
				element: header,
				getInitialData: () => ({
					type: "column",
					id: column.id,
					boardId: column.board_id,
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
				getData: ({ input, element }) => {
					const data = {
						type: "column",
						id: column.id,
						index,
					};

					return attachClosestEdge(data, {
						input,
						element,
						allowedEdges: ["left", "right"],
					});
				},
				onDragEnter: ({ self }) => {
					setIsDraggedOver(true);
					const edge = extractClosestEdge(self.data);
					setClosestEdge(edge === "left" || edge === "right" ? edge : null);
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

		// Set up auto-scroll for vertical scrolling within column
		let cleanupAutoScroll: (() => void) | undefined;

		const setupColumnAutoScroll = () => {
			// Find the scrollable element within this column
			const scrollElement = element.querySelector(
				'[data-testid="column-scroll-area"]'
			) as HTMLElement;
			if (scrollElement) {
				return autoScrollForElements({
					element: scrollElement,
					canScroll: ({ source }) => source.data.type === "card",
					getConfiguration: () => ({
						maxScrollSpeed: "fast",
						startScrollingThreshold: 200,
						maxScrollSpeedAt: 100,
					}),
				});
			}
			return undefined;
		};

		// Setup with retry logic
		cleanupAutoScroll = setupColumnAutoScroll();
		let retryCount = 0;
		const maxRetries = 3;

		const retrySetup = () => {
			if (!cleanupAutoScroll && retryCount < maxRetries) {
				retryCount++;
				setTimeout(() => {
					cleanupAutoScroll = setupColumnAutoScroll();
					if (!cleanupAutoScroll) {
						retrySetup();
					}
				}, 100 * retryCount);
			}
		};

		if (!cleanupAutoScroll) {
			retrySetup();
		}

		return () => {
			cleanupDragDrop();
			cleanupAutoScroll?.();
		};
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

	const handleColumnDuplicate = () => {
		onDuplicateColumn(column.id);
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

	// Show placeholder when dragging
	if (isDragging) {
		return (
			<div className="flex flex-col min-w-[300px] w-[300px] h-[400px] rounded-xl border-2 border-dashed border-accent/50 bg-accent/10 opacity-50">
				<div className="p-3">
					<div className="h-6 bg-accent/20 rounded animate-pulse" />
				</div>
			</div>
		);
	}

	return (
		<div
			ref={columnRef}
			className={`relative overflow-hidden flex  flex-col min-w-[300px] w-[300px] max-h-[80vh] rounded-xl ${
				isDraggedOver
					? "border-accent/50 bg-accent/5 shadow-sm"
					: "border-border/50"
			} bg-card/60 group transition-colors`}
		>
			{/* Column Header */}
			<div
				ref={headerRef}
				className="flex justify-between items-center p-3 hover:bg-card/80 transition-colors cursor-grab active:cursor-grabbing flex-shrink-0"
			>
				<div className="flex items-center gap-2 flex-1">
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
							className="text-base font-medium flex-1 border-0 bg-transparent p-1 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none cursor-text"
							style={{ backgroundColor: "transparent" }}
						/>
					) : (
						<h3
							onClick={(e) => {
								e.stopPropagation();
								setEditMode(true);
							}}
							className="flex-1 text-base font-medium p-1 cursor-pointer hover:bg-muted/20 rounded transition-colors min-h-[1.5rem]"
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
							<DropdownMenuLabel>Column actions</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={handleColumnDuplicate}
								className="cursor-pointer"
							>
								<Files className="mr-2 h-4 w-4" />
								Duplicate column
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={handleColumnDelete}
								variant="destructive"
								className="cursor-pointer"
							>
								<Trash className="mr-2 h-4 w-4" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div className="min-h-0 overflow-hidden">
				<div
					className="h-fit max-h-[750px] overflow-y-auto kanban-scrollbar"
					data-testid="column-scroll-area"
				>
					<div className="p-2 space-y-2">
						{column.cards.map((card, cardIndex) => (
							<KanbanCard
								key={card.id}
								card={card}
								onUpdate={onUpdateCard}
								onDelete={onDeleteCard}
								onDuplicate={onDuplicateCard}
								index={cardIndex}
								columnId={column.id}
							/>
						))}
					</div>
				</div>
			</div>

			{/* Add Card Section */}
			<div className="flex-shrink-0 p-2 ">
				{showAddCard ? (
					<div className="space-y-2">
						<Input
							value={newCardTitle}
							onChange={(e) => setNewCardTitle(e.target.value)}
							onKeyDown={handleKeyPress}
							placeholder="Enter card title..."
							autoFocus
							className="text-sm"
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

			{/* Drop indicators for column reordering */}
			{closestEdge === "left" && (
				<div className="absolute -left-[2px] top-0 bottom-0 w-[2px] bg-accent pointer-events-none z-10">
					<div className="absolute -left-1 -top-1 w-2 h-2 bg-accent rounded-full" />
					<div className="absolute -left-1 -bottom-1 w-2 h-2 bg-accent rounded-full" />
				</div>
			)}
			{closestEdge === "right" && (
				<div className="absolute -right-[2px] top-0 bottom-0 w-[2px] bg-accent pointer-events-none z-10">
					<div className="absolute -right-1 -top-1 w-2 h-2 bg-accent rounded-full" />
					<div className="absolute -right-1 -bottom-1 w-2 h-2 bg-accent rounded-full" />
				</div>
			)}
		</div>
	);
});

export default ColumnContainer;
