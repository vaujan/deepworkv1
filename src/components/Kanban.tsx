"use client";

import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Grab } from "lucide-react";
import { Button } from "./ui/button";

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
	const onDragEnd = (result: any) => {
		const { source, destination } = result;

		// Dropped outside the list
		if (!destination) {
			return;
		}

		// Reorder tasks
		const newTasks = Array.from(tasks);
		const [reorderedTask] = newTasks.splice(source.index, 1);
		newTasks.splice(destination.index, 0, reorderedTask);

		setTasks(newTasks);
		console.log("Current tasks:", tasks);
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="tasks">
				{(provided, snapshot) => (
					// The div to contains all the tasks
					<div
						{...provided.droppableProps}
						ref={provided.innerRef}
						className={`p-4 rounded-sm min-h-[200px] bg-card transition-all ease-out ${snapshot.isDraggingOver ? "" : ""}`}
					>
						<span className="font-semibold text-card-foreground">Kanban</span>
						{tasks.map((task, index) => (
							// Per-item
							<Draggable draggableId={task.id} index={index} key={task.id}>
								{(provided, snapshot) => (
									<div
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										ref={provided.innerRef}
										className={`flex p-4 transition-all ease-out mb-2 rounded-sm shadow-ms ${snapshot.isDragging ? "bg-accent shadow-lg" : "bg-accent"}`}
									>
										<div>
											<p className="font-semibold text-card-foreground ">
												{task.title}
											</p>
											<p className="text-sm text-accent-foreground">
												{task.description}
											</p>
										</div>
									</div>
								)}
							</Draggable>
						))}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}
