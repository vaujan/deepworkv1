import React from "react";

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
	return (
		<div className="w-full p-4 rounded-sm bg-card border-border">
			<h1 className="text-xl font-semibold">Kanban works</h1>
			<div className="p-4 rounded-sm text-accent-foreground bg-accent">
				{COLUMNS.map((column) => {
					return <></>;
				})}
			</div>
		</div>
	);
}
