"use client";

import React from "react";
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
} from "@hello-pangea/dnd";

const COLUMNS = [
	{ id: "TODO", title: "To do" },
	{ id: "IN_PROGRESS", title: "In progress" },
	{ id: "DONE", title: "Done" },
];

const INITIAL_TASKS = [
	{
		id: "1",
		title: "Learn drag and drop",
		description:
			"Get hands on using in React building stuff with drag and drop",
		status: "IN_PROGRESS",
	},
	{
		id: "2",
		title: "Build timer widget",
		description: "duplicate pomodoro-ish timer",
		status: "TODO",
	},
	{
		id: "3",
		title: "Build first UI for MVP",
		description: "Bring the app idea to visual, and try to build from there",
		status: "DONE",
	},
];
export default function Kanban() {
	const [tasks, setTasks] = React.useState(INITIAL_TASKS);

	// Handle drag end, based on: https://github.com/hello-pangea/dnd/blob/main/docs/guides/using-the-library.md#ondragend
	const onDragEnd = (result: DropResult) => {
		const { source, destination } = result;

		// Dropped outside the list
		if (!destination) {
			return;
		}

		// Reorder tasks
		const newTasks = Array.from(tasks);
		const [movedTask] = newTasks.splice(source.index, 1);

		if (source.droppableId !== destination.droppableId) {
			movedTask.status = destination.droppableId;
		}

		newTasks.splice(destination.index, 0, movedTask);
		setTasks(newTasks);

		console.log("Current tasks:", tasks);
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="w-full h-fit">
				<div className="flex flex-col gap-6 md:flex-row">
					{COLUMNS.map((column) => (
						<Droppable key={column.id} droppableId={column.id}>
							{(provided, snapshot) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className={`p-4 rounded-sm min-h-[300px] w-full sm:w-1/3 transition-all duration-300 ease-in-out ${
										snapshot.isDraggingOver
											? "bg-primary/10 ring-2 ring-primary"
											: "bg-secondary/10"
									}`}
								>
									<h2 className="mb-3 font-medium text-muted-foreground">
										{column.title}
									</h2>
									{tasks
										.filter((task) => task.status === column.id)
										.map((task, index) => (
											<Draggable
												key={task.id}
												draggableId={task.id}
												index={index}
											>
												{(provided) => (
													<div
														{...provided.dragHandleProps}
														{...provided.draggableProps}
														ref={provided.innerRef}
														className={`bg-card mb-3 p-3 rounded-sm `}
													>
														<h3 className="text-sm font-semibold">
															{task.title}
														</h3>
														<p className="text-sm text-muted-foreground">
															{task.description}
														</p>
													</div>
												)}
											</Draggable>
										))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					))}
				</div>
			</div>
		</DragDropContext>
	);
}
