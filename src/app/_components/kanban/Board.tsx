/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DatabaseService } from "@/lib/database";
import { KanbanBoardWithData } from "@/lib/types";
import KanbanColumn from "./Column";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { toast } from "sonner";
import { useSyncOperation } from "@/hooks/use-sync-status";
import { useWorkspaceBoard } from "@/hooks/use-workspace-board";

export default function KanbanBoard({
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

	// Sync local state with hook state for optimistic updates
	useEffect(() => {
		if (hookBoard) {
			setBoard(hookBoard);
		}
	}, [hookBoard]);

	// Drag and drop handlers
	useEffect(() => {
		const cleanup = monitorForElements({
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

		return cleanup;
	}, [board]);

	const handleColumnMove = async (
		sourceData: Record<string, unknown>,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		destination: any
	) => {
		if (!board) return;

		const sourceIndex = sourceData.index as number;
		const destinationIndex = destination.data.index as number;

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
			let found = false;
			for (const col of board.columns) {
				const cardIdx = col.cards.findIndex((c) => c.id === targetCardId);
				if (cardIdx !== -1) {
					destinationColumnId = col.id;
					destinationIndex = cardIdx; // Insert before target card
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

	const handleCreateColumn = async () => {
		if (!board) return;

		// Optimistic update - create temporary column immediately
		const tempColumn = {
			id: `temp-${Date.now()}`,
			board_id: board.id,
			name: `Column ${board.columns.length + 1}`,
			position: board.columns.length,
			color: undefined,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		// Update UI immediately
		setBoard({
			...board,
			columns: [...board.columns, { ...tempColumn, cards: [] }],
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
										col.id === tempColumn.id ? { ...newColumn, cards: [] } : col
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
			<ScrollArea className="w-full">
				<div className="flex gap-4 p-4 pb-6">
					{board.columns.map((column, index) => (
						<KanbanColumn
							key={column.id}
							column={column}
							index={index}
							onUpdateColumn={handleUpdateColumn}
							onDeleteColumn={handleDeleteColumn}
							onCreateCard={handleCreateCard}
							onUpdateCard={handleUpdateCard}
							onDeleteCard={handleDeleteCard}
						/>
					))}

					{/* Add Column Button */}
					<div className="flex-shrink-0">
						<Button
							variant="ghost"
							onClick={handleCreateColumn}
							className="h-auto min-h-[200px] w-[280px] border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 flex-col gap-2 text-muted-foreground hover:text-foreground bg-muted/5 hover:bg-muted/10"
						>
							<Plus className="h-5 w-5" />
							<span className="text-sm font-medium">Add Column</span>
						</Button>
					</div>
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
}
