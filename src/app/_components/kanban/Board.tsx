/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
	Plus,
	Loader2,
	MoreVertical,
	Trash2,
	Columns3,
	AlertTriangle,
} from "lucide-react";
import { DatabaseService } from "@/lib/database";
import { KanbanBoardWithData, KanbanColumnWithCards } from "@/lib/types";
import KanbanColumn from "./Column";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { toast } from "sonner";
import { useSyncOperation } from "@/hooks/use-sync-status";
import { useWorkspaceBoard } from "@/hooks/use-workspace-board";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function InnerKanbanBoard({
	className,
	workspaceId,
}: {
	className?: string;
	workspaceId: string;
}) {
	const { board: hookBoard, loading, refetch } = useWorkspaceBoard(workspaceId);
	const [board, setBoard] = useState<KanbanBoardWithData | null>(null);
	const [, setDraggedColumnId] = useState<string | null>(null);
	const { withSync } = useSyncOperation();
	const [showAddColumn, setShowAddColumn] = useState(false);
	const [newColumnName, setNewColumnName] = useState("");
	const [isDraggingScroll, setIsDraggingScroll] = useState(false);
	const [scrollStartX, setScrollStartX] = useState(0);
	const [scrollStartScrollLeft, setScrollStartScrollLeft] = useState(0);
	const boardScrollRef = useRef<HTMLDivElement>(null);
	const scrollViewportRef = useRef<HTMLDivElement>(null);

	// Sync local state with hook state for optimistic updates
	useEffect(() => {
		if (hookBoard) {
			setBoard(hookBoard);
		}
	}, [hookBoard]);

	// Drag and drop handlers
	useEffect(() => {
		const cleanupMonitor = monitorForElements({
			onDrop({ source, location }) {
				if (!board) return;

				const destination = location.current.dropTargets[0];
				if (!destination) return;

				if (source.data.type === "column") {
					handleColumnMove(source.data, destination);
				} else if (source.data.type === "card") {
					handleCardMove(source.data, destination);
				}

				setDraggedColumnId(null);
			},
		});

		// Set up auto-scroll for horizontal scrolling
		let cleanupAutoScroll: (() => void) | undefined;

		const setupAutoScroll = () => {
			// Try multiple selectors to find the scrollable element
			const selectors = [
				'[data-testid="board-scroll-container"] [data-slot="scroll-area-viewport"]',
				'[data-testid="board-scroll-container"]',
			];

			for (const selector of selectors) {
				const element = document.querySelector(selector) as HTMLElement;
				if (element) {
					return autoScrollForElements({
						element,
						canScroll: ({ source }) => source.data.type === "column",
						getConfiguration: () => ({
							maxScrollSpeed: "fast",
							startScrollingThreshold: 200,
							maxScrollSpeedAt: 100,
						}),
					});
				}
			}
			return undefined;
		};

		// Setup with retry logic
		cleanupAutoScroll = setupAutoScroll();
		let retryCount = 0;
		const maxRetries = 3;

		const retrySetup = () => {
			if (!cleanupAutoScroll && retryCount < maxRetries) {
				retryCount++;
				setTimeout(() => {
					cleanupAutoScroll = setupAutoScroll();
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
			cleanupMonitor();
			cleanupAutoScroll?.();
		};
	}, [board]);

	const handleColumnMove = async (
		sourceData: Record<string, unknown>,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		destination: any
	) => {
		if (!board) return;

		const sourceIndex = sourceData.index as number;
		let destinationIndex = destination.data.index as number;

		// Handle closest edge for more precise positioning
		const closestEdge = extractClosestEdge(destination.data);
		if (closestEdge === "right") {
			destinationIndex = destinationIndex + 1;
		}

		if (sourceIndex === destinationIndex) return;

		// Optimistic update
		const newColumns = reorder({
			list: board.columns,
			startIndex: sourceIndex,
			finishIndex: destinationIndex,
		});

		setBoard({ ...board, columns: newColumns });

		// Background database operation
		try {
			await withSync(async () => {
				const updates = newColumns.map((column, index) => ({
					id: column.id,
					position: index,
				}));
				await DatabaseService.reorderColumns(updates, board.id);
			}, "reorder-columns");

			// Success - the optimistic update is now persisted
			// Cache has been invalidated, so future loads will get fresh data
		} catch (error) {
			console.error("❌ Column reorder failed, reverting:", error);
			// Revert on error
			setBoard(board);
			toast.error("Failed to reorder columns");
		}
	};

	const handleCardMove = async (
		sourceData: Record<string, unknown>,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		destination: any
	) => {
		if (!board) return;

		const cardId = sourceData.id as string;
		const sourceColumnId = sourceData.columnId as string;

		// Determine destination column and index
		let destinationColumnId: string = "";
		let destinationIndex: number = 0;

		if (destination.data.type === "card") {
			// Dropping on another card - get its column and position
			const targetCardId = destination.data.id as string;
			const closestEdge = extractClosestEdge(destination.data);

			let found = false;
			for (const col of board.columns) {
				const cardIdx = col.cards.findIndex((c) => c.id === targetCardId);
				if (cardIdx !== -1) {
					destinationColumnId = col.id;
					// Insert based on closest edge
					destinationIndex = closestEdge === "bottom" ? cardIdx + 1 : cardIdx;
					found = true;
					break;
				}
			}
			if (!found) return;
		} else if (destination.data.type === "column") {
			// Dropping on a column - add to the end
			destinationColumnId = destination.data.id as string;
			const destCol = board.columns.find(
				(col) => col.id === destinationColumnId
			);
			destinationIndex = destCol ? destCol.cards.length : 0;
		} else {
			return; // Invalid drop target
		}

		// Find source and destination columns
		const sourceColumn = board.columns.find((col) => col.id === sourceColumnId);
		const destColumn = board.columns.find(
			(col) => col.id === destinationColumnId
		);

		if (!sourceColumn || !destColumn) return;

		// Find the card
		const cardIndex = sourceColumn.cards.findIndex(
			(card) => card.id === cardId
		);
		if (cardIndex === -1) return;

		const card = sourceColumn.cards[cardIndex];

		// If dropping in same position, do nothing
		if (
			sourceColumnId === destinationColumnId &&
			cardIndex === destinationIndex
		)
			return;

		// Optimistic update using reorder utility for same column, manual handling for cross-column
		const updatedBoard = { ...board };

		if (sourceColumnId === destinationColumnId) {
			// Same column - use reorder utility for proper index handling
			const reorderedCards = reorder({
				list: sourceColumn.cards,
				startIndex: cardIndex,
				finishIndex: destinationIndex,
			});

			// Update positions for all cards
			const updatedCards = reorderedCards.map((c, idx) => ({
				...c,
				position: idx,
			}));

			const updatedColumn = {
				...sourceColumn,
				cards: updatedCards,
			};

			updatedBoard.columns = updatedBoard.columns.map((col) =>
				col.id === sourceColumnId ? updatedColumn : col
			);

			setBoard(updatedBoard);

			// Background database operation
			try {
				await withSync(async () => {
					// Update all card positions in the reordered column
					const cardUpdates = updatedCards.map((c, idx) => ({
						id: c.id,
						column_id: c.column_id,
						position: idx,
					}));
					await DatabaseService.reorderCards(cardUpdates);
				}, `reorder-cards-${sourceColumnId}`);
			} catch (error) {
				// Revert on error
				setBoard(board);
				toast.error("Failed to reorder cards");
			}
		} else {
			// Cross-column move
			// Remove card from source
			const updatedSourceColumn = {
				...sourceColumn,
				cards: sourceColumn.cards
					.filter((c) => c.id !== cardId)
					.map((c, idx) => ({
						...c,
						position: idx,
					})),
			};

			// Add card to destination
			const updatedDestColumn = {
				...destColumn,
				cards: [...destColumn.cards],
			};

			updatedDestColumn.cards.splice(destinationIndex, 0, {
				...card,
				column_id: destinationColumnId,
				position: destinationIndex,
			});

			// Update positions for all cards in destination column
			updatedDestColumn.cards = updatedDestColumn.cards.map((c, idx) => ({
				...c,
				position: idx,
			}));

			// Update the board state
			updatedBoard.columns = updatedBoard.columns.map((col) => {
				if (col.id === sourceColumnId) return updatedSourceColumn;
				if (col.id === destinationColumnId) return updatedDestColumn;
				return col;
			});

			setBoard(updatedBoard);

			// Background database operation
			try {
				await withSync(async () => {
					await DatabaseService.moveCard(
						cardId,
						destinationColumnId,
						destinationIndex
					);

					// Update all card positions in both columns
					const sourceCardUpdates = updatedSourceColumn.cards.map((c, idx) => ({
						id: c.id,
						column_id: c.column_id,
						position: idx,
					}));

					const destCardUpdates = updatedDestColumn.cards.map((c, idx) => ({
						id: c.id,
						column_id: c.column_id,
						position: idx,
					}));

					await DatabaseService.reorderCards([
						...sourceCardUpdates,
						...destCardUpdates,
					]);
				}, `move-card-${cardId}`);
			} catch (error) {
				// Revert on error
				setBoard(board);
				toast.error("Failed to move card");
			}
		}
	};

	const handleCreateColumn = async (name: string) => {
		if (!board) return;

		// Optimistic update - create temporary column immediately
		const tempColumn = {
			id: `temp-${Date.now()}`,
			board_id: board.id,
			name,
			position: board.columns.length,
			color: undefined,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		// Update UI immediately
		setBoard({
			...board,
			columns: [
				...board.columns,
				{ ...tempColumn, cards: [] } as KanbanColumnWithCards,
			],
		});

		// Background database operation
		try {
			await withSync(async () => {
				const newColumn = await DatabaseService.createKanbanColumn({
					board_id: board.id,
					name: tempColumn.name,
					position: tempColumn.position,
				});

				if (newColumn) {
					// Replace temp column with real one
					setBoard((prev) =>
						prev
							? {
									...prev,
									columns: prev.columns.map((col) =>
										col.id === tempColumn.id
											? ({ ...newColumn, cards: [] } as KanbanColumnWithCards)
											: col
									),
								}
							: null
					);
				} else {
					throw new Error("Failed to create column");
				}
			}, `create-column-${tempColumn.id}`);
		} catch (error) {
			// Revert on error
			setBoard((prev) =>
				prev
					? {
							...prev,
							columns: prev.columns.filter((col) => col.id !== tempColumn.id),
						}
					: null
			);
			toast.error("Failed to create column");
		}
	};

	const handleConfirmAddColumn = () => {
		const trimmedName = newColumnName.trim();
		if (trimmedName) {
			handleCreateColumn(trimmedName);
			setNewColumnName("");
			setShowAddColumn(false);
		}
	};

	const handleColumnInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Enter") {
			handleConfirmAddColumn();
		} else if (e.key === "Escape") {
			setNewColumnName("");
			setShowAddColumn(false);
		}
	};

	const handleScrollMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!scrollViewportRef.current) return;

		setIsDraggingScroll(true);
		setScrollStartX(e.clientX);
		setScrollStartScrollLeft(scrollViewportRef.current.scrollLeft);
	};

	const handleScrollMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!isDraggingScroll || !scrollViewportRef.current) return;

		e.preventDefault();
		const x = e.clientX;
		const walk = (x - scrollStartX) * 2; // Scroll speed multiplier
		scrollViewportRef.current.scrollLeft = scrollStartScrollLeft - walk;
	};

	const handleScrollMouseUp = () => {
		setIsDraggingScroll(false);
	};

	const handleScrollMouseLeave = () => {
		setIsDraggingScroll(false);
	};

	const handleClearBoard = async () => {
		if (!board) return;

		// Show confirmation using a simple approach
		const confirmed = confirm(
			"Are you sure you want to clear the entire board? This action cannot be undone."
		);
		if (!confirmed) return;

		// Clear the board with sonner toast
		toast.promise(
			withSync(async () => {
				// Delete all cards first
				for (const column of board.columns) {
					for (const card of column.cards) {
						await DatabaseService.deleteKanbanCard(card.id);
					}
				}

				// Delete all columns
				for (const column of board.columns) {
					await DatabaseService.deleteKanbanColumn(column.id);
				}

				// Clear local state
				setBoard({ ...board, columns: [] });
			}, "clear-board"),
			{
				loading: "Clearing board...",
				success: "Board cleared successfully",
				error: "Failed to clear board",
			}
		);
	};

	const handleUpdateColumn = async (
		columnId: string,
		data: { name?: string; color?: string }
	) => {
		if (!board) return;

		// Skip if no actual changes
		const column = board.columns.find((col) => col.id === columnId);
		if (!column || (data.name && data.name === column.name)) return;

		// Optimistic update - update UI immediately
		setBoard({
			...board,
			columns: board.columns.map((col) =>
				col.id === columnId ? { ...col, ...data } : col
			),
		});

		// Background database operation
		try {
			await withSync(async () => {
				await DatabaseService.updateKanbanColumn(columnId, data);
			}, `update-column-${columnId}`);
		} catch (error) {
			// Revert on error
			setBoard((prev) =>
				prev
					? {
							...prev,
							columns: prev.columns.map((col) =>
								col.id === columnId ? column : col
							),
						}
					: null
			);
			toast.error("Failed to update column");
		}
	};

	const handleDeleteColumn = async (columnId: string) => {
		if (!board) return;

		const columnToDelete = board.columns.find((col) => col.id === columnId);
		if (!columnToDelete) return;

		// Optimistic update - remove column immediately
		setBoard({
			...board,
			columns: board.columns.filter((col) => col.id !== columnId),
		});

		// Background database operation
		try {
			await withSync(async () => {
				await DatabaseService.deleteKanbanColumn(columnId);
			}, `delete-column-${columnId}`);
		} catch (error) {
			// Revert on error
			setBoard((prev) =>
				prev
					? {
							...prev,
							columns: [...prev.columns, columnToDelete].sort(
								(a, b) => a.position - b.position
							),
						}
					: null
			);
			toast.error("Failed to delete column");
		}
	};

	const handleCreateCard = async (columnId: string, title: string) => {
		if (!board) return;

		const column = board.columns.find((col) => col.id === columnId);
		if (!column) return;

		// Optimistic update - create temporary card immediately
		const tempCard = {
			id: `temp-${Date.now()}`,
			column_id: columnId,
			board_id: board.id,
			title,
			description: undefined,
			position: column.cards.length,
			tags: undefined,
			priority: undefined,
			due_date: undefined,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		// Update UI immediately
		setBoard({
			...board,
			columns: board.columns.map((col) =>
				col.id === columnId ? { ...col, cards: [...col.cards, tempCard] } : col
			),
		});

		// Background database operation
		try {
			await withSync(async () => {
				const newCard = await DatabaseService.createKanbanCard({
					column_id: columnId,
					board_id: board.id,
					title,
					position: column.cards.length,
				});

				if (newCard) {
					// Replace temp card with real one
					setBoard((prev) =>
						prev
							? {
									...prev,
									columns: prev.columns.map((col) =>
										col.id === columnId
											? {
													...col,
													cards: col.cards.map((card) =>
														card.id === tempCard.id ? newCard : card
													),
												}
											: col
									),
								}
							: null
					);
				} else {
					throw new Error("Failed to create card");
				}
			}, `create-card-${tempCard.id}`);
		} catch (error) {
			// Revert on error
			setBoard((prev) =>
				prev
					? {
							...prev,
							columns: prev.columns.map((col) =>
								col.id === columnId
									? {
											...col,
											cards: col.cards.filter(
												(card) => card.id !== tempCard.id
											),
										}
									: col
							),
						}
					: null
			);
			toast.error("Failed to create card");
		}
	};

	const handleUpdateCard = async (cardId: string, data: { title?: string }) => {
		if (!board) return;

		// Find the card to check for changes
		let originalCard = null;
		for (const col of board.columns) {
			const card = col.cards.find((c) => c.id === cardId);
			if (card) {
				originalCard = card;
				break;
			}
		}

		// Skip if no changes
		if (!originalCard || (data.title && data.title === originalCard.title))
			return;

		// Optimistic update - update UI immediately
		setBoard({
			...board,
			columns: board.columns.map((col) => ({
				...col,
				cards: col.cards.map((card) =>
					card.id === cardId ? { ...card, ...data } : card
				),
			})),
		});

		// Background database operation
		try {
			await withSync(async () => {
				await DatabaseService.updateKanbanCard(cardId, data);
			}, `update-card-${cardId}`);
		} catch (error) {
			// Revert on error
			setBoard((prev) =>
				prev
					? {
							...prev,
							columns: prev.columns.map((col) => ({
								...col,
								cards: col.cards.map((card) =>
									card.id === cardId ? originalCard : card
								),
							})),
						}
					: null
			);
			toast.error("Failed to update card");
		}
	};

	const handleDeleteCard = async (cardId: string) => {
		if (!board) return;

		// Find the card to delete
		let cardToDelete = null;
		let sourceColumnId = null;
		for (const col of board.columns) {
			const card = col.cards.find((c) => c.id === cardId);
			if (card) {
				cardToDelete = card;
				sourceColumnId = col.id;
				break;
			}
		}

		if (!cardToDelete) return;

		// Optimistic update - remove card immediately
		setBoard({
			...board,
			columns: board.columns.map((col) => ({
				...col,
				cards: col.cards.filter((card) => card.id !== cardId),
			})),
		});

		// Background database operation
		try {
			await withSync(async () => {
				await DatabaseService.deleteKanbanCard(cardId);
			}, `delete-card-${cardId}`);
		} catch (error) {
			// Revert on error
			setBoard((prev) =>
				prev
					? {
							...prev,
							columns: prev.columns.map((col) =>
								col.id === sourceColumnId
									? {
											...col,
											cards: [...col.cards, cardToDelete].sort(
												(a, b) => a.position - b.position
											),
										}
									: col
							),
						}
					: null
			);
			toast.error("Failed to delete card");
		}
	};

	const handleDuplicateCard = async (cardId: string) => {
		if (!board) return;

		// Find the card to duplicate
		let cardToDuplicate = null;
		let sourceColumnId = null;
		for (const col of board.columns) {
			const card = col.cards.find((c) => c.id === cardId);
			if (card) {
				cardToDuplicate = card;
				sourceColumnId = col.id;
				break;
			}
		}

		if (!cardToDuplicate || !sourceColumnId) return;

		const sourceColumn = board.columns.find((col) => col.id === sourceColumnId);
		if (!sourceColumn) return;

		// Create temporary duplicate card
		const tempCard = {
			id: `temp-${Date.now()}`,
			column_id: sourceColumnId,
			board_id: board.id,
			title: `${cardToDuplicate.title} (Copy)`,
			description: cardToDuplicate.description,
			position: sourceColumn.cards.length,
			tags: cardToDuplicate.tags,
			priority: cardToDuplicate.priority,
			due_date: cardToDuplicate.due_date,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		// Optimistic update - add duplicate immediately
		setBoard({
			...board,
			columns: board.columns.map((col) =>
				col.id === sourceColumnId
					? { ...col, cards: [...col.cards, tempCard] }
					: col
			),
		});

		// Background database operation
		try {
			await withSync(async () => {
				const newCard = await DatabaseService.createKanbanCard({
					column_id: sourceColumnId,
					board_id: board.id,
					title: tempCard.title,
					description: tempCard.description,
					position: tempCard.position,
				});

				if (newCard) {
					// Replace temp card with real one
					setBoard((prev) =>
						prev
							? {
									...prev,
									columns: prev.columns.map((col) =>
										col.id === sourceColumnId
											? {
													...col,
													cards: col.cards.map((card) =>
														card.id === tempCard.id ? newCard : card
													),
												}
											: col
									),
								}
							: null
					);
				} else {
					throw new Error("Failed to duplicate card");
				}
			}, `duplicate-card-${tempCard.id}`);
		} catch (error) {
			// Revert on error
			setBoard((prev) =>
				prev
					? {
							...prev,
							columns: prev.columns.map((col) =>
								col.id === sourceColumnId
									? {
											...col,
											cards: col.cards.filter(
												(card) => card.id !== tempCard.id
											),
										}
									: col
							),
						}
					: null
			);
			toast.error("Failed to duplicate card");
		}
	};

	const handleDuplicateColumn = async (columnId: string) => {
		if (!board) return;

		const columnToDuplicate = board.columns.find((col) => col.id === columnId);
		if (!columnToDuplicate) return;

		// Create temporary duplicate column
		const tempColumn = {
			id: `temp-${Date.now()}`,
			board_id: board.id,
			name: `${columnToDuplicate.name} (Copy)`,
			position: board.columns.length,
			color: columnToDuplicate.color,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		// Optimistic update - add duplicate column immediately
		setBoard({
			...board,
			columns: [...board.columns, { ...tempColumn, cards: [] }],
		});

		// Background database operation
		try {
			await withSync(async () => {
				// Create the new column
				const newColumn = await DatabaseService.createKanbanColumn({
					board_id: board.id,
					name: tempColumn.name,
					position: tempColumn.position,
				});

				if (newColumn) {
					// Duplicate all cards from the original column
					const cardPromises = columnToDuplicate.cards.map((card, index) =>
						DatabaseService.createKanbanCard({
							column_id: newColumn.id,
							board_id: board.id,
							title: card.title,
							description: card.description,
							position: index,
						})
					);

					const duplicatedCards = await Promise.all(cardPromises);
					const validCards = duplicatedCards.filter(
						(card): card is NonNullable<typeof card> => card !== null
					);

					// Replace temp column with real one and add cards
					setBoard((prev) =>
						prev
							? {
									...prev,
									columns: prev.columns.map((col) =>
										col.id === tempColumn.id
											? { ...newColumn, cards: validCards }
											: col
									),
								}
							: null
					);
				} else {
					throw new Error("Failed to duplicate column");
				}
			}, `duplicate-column-${tempColumn.id}`);
		} catch (error) {
			// Revert on error
			setBoard((prev) =>
				prev
					? {
							...prev,
							columns: prev.columns.filter((col) => col.id !== tempColumn.id),
						}
					: null
			);
			toast.error("Failed to duplicate column");
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="flex items-center gap-2 text-muted-foreground">
					<Loader2 className="h-4 w-4 animate-spin" />
					<span>Loading board...</span>
				</div>
			</div>
		);
	}

	if (!board) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<p className="text-muted-foreground mb-2">No board found</p>
					<Button onClick={refetch} variant="outline" size="sm">
						Retry
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className={className}>
			<div className="rounded-2xl border card">
				{/* Header */}
				<div className="flex items-center justify-between p-4">
					{/* Add Column Button */}
					<Button
						variant="outline"
						onClick={() => setShowAddColumn(true)}
						className="flex items-center gap-2 "
					>
						<Plus className="h-4 w-4" />
						<span className="text-sm font-medium">Add Column</span>
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuLabel>Board actions</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={handleClearBoard}
								className="text-destructive focus:text-destructive cursor-pointer"
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Clear board
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Board Content */}
				<div className="px-4 pb-4 min-h-[350px]">
					<ScrollArea
						ref={(element) => {
							boardScrollRef.current = element;
							if (element) {
								const viewport = element.querySelector(
									'[data-slot="scroll-area-viewport"]'
								) as HTMLDivElement;
								if (viewport) {
									scrollViewportRef.current = viewport;
								}
							}
						}}
						className="w-full overflow-x-auto"
						data-testid="board-scroll-container"
						onMouseDown={handleScrollMouseDown}
						onMouseMove={handleScrollMouseMove}
						onMouseUp={handleScrollMouseUp}
						onMouseLeave={handleScrollMouseLeave}
					>
						{board.columns.length === 0 && !showAddColumn ? (
							/* Empty State */
							<div className="flex flex-col items-center justify-center py-16 px-4">
								<div className="flex flex-col items-center gap-4 text-center">
									<div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/20">
										<Columns3 className="h-8 w-8 text-muted-foreground" />
									</div>
									<div className="space-y-2">
										<h3 className="text-lg font-semibold">No columns yet</h3>
										<p className="text-sm text-muted-foreground max-w-sm">
											Get started by creating your first column to organize your
											tasks and ideas.
										</p>
									</div>
									<Button
										onClick={() => setShowAddColumn(true)}
										className="flex items-center gap-2"
									>
										<Plus className="h-4 w-4" />
										Create your first column
									</Button>
								</div>
							</div>
						) : (
							<div className="flex gap-4 pb-6 items-start min-w-max">
								{board.columns.map((column, index) => (
									<KanbanColumn
										key={column.id}
										column={column}
										index={index}
										onUpdateColumn={handleUpdateColumn}
										onDeleteColumn={handleDeleteColumn}
										onDuplicateColumn={handleDuplicateColumn}
										onCreateCard={handleCreateCard}
										onUpdateCard={handleUpdateCard}
										onDeleteCard={handleDeleteCard}
										onDuplicateCard={handleDuplicateCard}
									/>
								))}

								{/* Add Column Input Form */}
								{showAddColumn && (
									<div className="flex-shrink-0 w-[280px]">
										<div className="p-2 bg-muted/20 rounded-lg border border-border">
											<Input
												autoFocus
												placeholder="Enter column name..."
												value={newColumnName}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													setNewColumnName(e.target.value)
												}
												onKeyDown={handleColumnInputKeyDown}
												onBlur={() => {
													if (!newColumnName.trim()) {
														setShowAddColumn(false);
													}
												}}
												className="mb-2"
											/>
											<div className="flex items-center gap-2">
												<Button
													onClick={handleConfirmAddColumn}
													disabled={!newColumnName.trim()}
													size="sm"
												>
													Add Column
												</Button>
												<Button
													variant="outline"
													onClick={() => {
														setShowAddColumn(false);
														setNewColumnName("");
													}}
													size="sm"
												>
													Cancel
												</Button>
											</div>
										</div>
									</div>
								)}
							</div>
						)}
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}

export default function KanbanBoard(props: {
	className?: string;
	workspaceId: string;
}) {
	return <InnerKanbanBoard {...props} />;
}
