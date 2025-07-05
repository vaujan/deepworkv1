import React from "react";

const COLUMNS: Column[] = [
	{ id: "TODO", title: "To Do" },
	{ id: "IN_PROGRESS", title: "In Progress" },
	{ id: "DONE", title: "Done" },
];

const INITIAL_TASKS: Task[] = [
	{
		id: "1",
		title: "Research Project",
		description: "Gather requirements and create initial documentation",
		status: "TODO",
	},
	{
		id: "2",
		title: "Design System",
		description: "Create component library and design tokens",
		status: "TODO",
	},
	{
		id: "3",
		title: "API Integration",
		description: "Implement REST API endpoints",
		status: "IN_PROGRESS",
	},
	{
		id: "4",
		title: "Testing",
		description: "Write unit tests for core functionality",
		status: "DONE",
	},
];

export default function KanbanKit() {
	const [tasks, setTasks] = React.useState(INITIAL_TASKS);

	return <div className="p-3 w-full rounded-lg bg-card">Kanban</div>;
}
type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

interface Task {
	id: string;
	status: TaskStatus;
	title: string;
	description: string;
}

interface Column {
	id: TaskStatus;
	title: string;
}
